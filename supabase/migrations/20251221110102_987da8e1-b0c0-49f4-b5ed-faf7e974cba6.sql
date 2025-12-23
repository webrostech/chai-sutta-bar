-- Create enum for user tiers
CREATE TYPE public.user_tier AS ENUM ('newcomer', 'regular', 'insider', 'legend');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  tier user_tier DEFAULT 'newcomer',
  total_visits INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  credits INTEGER DEFAULT 0,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create outlets table
CREATE TABLE public.outlets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_open BOOLEAN DEFAULT true,
  qr_code TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create visits table (check-ins)
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  outlet_id UUID REFERENCES public.outlets(id) ON DELETE CASCADE NOT NULL,
  credits_earned INTEGER DEFAULT 10,
  verified_location BOOLEAN DEFAULT false,
  user_latitude DOUBLE PRECISION,
  user_longitude DOUBLE PRECISION,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create drops table (limited-time offers)
CREATE TABLE public.drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  emoji TEXT DEFAULT '🎁',
  credits_required INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  color TEXT DEFAULT 'from-orange-500 to-red-500',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create community posts table
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  outlet_id UUID REFERENCES public.outlets(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create drop redemptions table
CREATE TABLE public.drop_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  drop_id UUID REFERENCES public.drops(id) ON DELETE CASCADE NOT NULL,
  outlet_id UUID REFERENCES public.outlets(id) ON DELETE SET NULL,
  redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, drop_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outlets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drop_redemptions ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Outlets policies (public read)
CREATE POLICY "Anyone can view outlets"
  ON public.outlets FOR SELECT
  TO authenticated
  USING (true);

-- Visits policies
CREATE POLICY "Users can view their own visits"
  ON public.visits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own visits"
  ON public.visits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Drops policies (public read for active drops)
CREATE POLICY "Anyone can view active drops"
  ON public.drops FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Community posts policies
CREATE POLICY "Anyone can view community posts"
  ON public.community_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Drop redemptions policies
CREATE POLICY "Users can view their own redemptions"
  ON public.drop_redemptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own redemptions"
  ON public.drop_redemptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'name', 'Chai Lover'),
    NEW.phone
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update user tier based on visits
CREATE OR REPLACE FUNCTION public.update_user_tier()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  new_tier user_tier;
  visit_count INTEGER;
BEGIN
  -- Get current visit count
  SELECT total_visits INTO visit_count FROM profiles WHERE user_id = NEW.user_id;
  visit_count := COALESCE(visit_count, 0) + 1;
  
  -- Determine tier
  IF visit_count >= 50 THEN
    new_tier := 'legend';
  ELSIF visit_count >= 15 THEN
    new_tier := 'insider';
  ELSIF visit_count >= 5 THEN
    new_tier := 'regular';
  ELSE
    new_tier := 'newcomer';
  END IF;
  
  -- Update profile
  UPDATE profiles SET
    total_visits = visit_count,
    credits = credits + NEW.credits_earned,
    tier = new_tier,
    current_streak = current_streak + 1,
    updated_at = now()
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

-- Create trigger for visit tracking
CREATE TRIGGER on_visit_created
  AFTER INSERT ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.update_user_tier();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profile updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for visits and community_posts
ALTER PUBLICATION supabase_realtime ADD TABLE public.visits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_posts;