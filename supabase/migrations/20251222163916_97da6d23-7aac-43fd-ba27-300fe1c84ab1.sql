-- Create storage bucket for community post images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('community-images', 'community-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

-- Create storage policies for community images
CREATE POLICY "Anyone can view community images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'community-images');

CREATE POLICY "Authenticated users can upload community images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'community-images' AND auth.uid() IS NOT NULL);

CREATE POLICY "Users can update their own community images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'community-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own community images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'community-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create analytics table for tracking real-time stats
CREATE TABLE public.analytics_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  user_id UUID,
  outlet_id UUID REFERENCES public.outlets(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analytics
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow inserts for authenticated users
CREATE POLICY "Authenticated users can insert analytics events"
ON public.analytics_events
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow admins to read all analytics (for now, allow all authenticated users)
CREATE POLICY "Authenticated users can view analytics"
ON public.analytics_events
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Create push notification subscriptions table
CREATE TABLE public.push_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

-- Enable RLS on push subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can manage their own subscriptions
CREATE POLICY "Users can view their own push subscriptions"
ON public.push_subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own push subscriptions"
ON public.push_subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own push subscriptions"
ON public.push_subscriptions
FOR DELETE
USING (auth.uid() = user_id);

-- Enable realtime for analytics
ALTER PUBLICATION supabase_realtime ADD TABLE public.analytics_events;