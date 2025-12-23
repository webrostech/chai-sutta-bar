import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  phone: string | null;
  tier: 'newcomer' | 'regular' | 'insider' | 'legend';
  total_visits: number;
  current_streak: number;
  credits: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  is_open: boolean;
  qr_code: string | null;
  created_at: string;
}

export interface Visit {
  id: string;
  user_id: string;
  outlet_id: string;
  credits_earned: number;
  verified_location: boolean;
  user_latitude: number | null;
  user_longitude: number | null;
  created_at: string;
}

export interface Drop {
  id: string;
  title: string;
  description: string | null;
  emoji: string;
  credits_required: number;
  expires_at: string;
  is_active: boolean;
  color: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  outlet_id: string | null;
  content: string;
  image_url: string | null;
  likes: number;
  created_at: string;
  profiles?: Profile;
  outlets?: Outlet;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  outlet_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface PushSubscription {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  created_at: string;
}

// Profile operations
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data as Profile | null;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  return data as Profile;
}

// Outlet operations
export async function getOutlets(): Promise<Outlet[]> {
  const { data, error } = await supabase
    .from('outlets')
    .select('*')
    .eq('is_open', true)
    .order('name');

  if (error) {
    console.error('Error fetching outlets:', error);
    return [];
  }
  return data as Outlet[];
}

export async function getOutletByQRCode(qrCode: string): Promise<Outlet | null> {
  const { data, error } = await supabase
    .from('outlets')
    .select('*')
    .eq('qr_code', qrCode)
    .maybeSingle();

  if (error) {
    console.error('Error fetching outlet:', error);
    return null;
  }
  return data as Outlet | null;
}

// Visit operations
export async function getUserVisits(userId: string): Promise<Visit[]> {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching visits:', error);
    return [];
  }
  return data as Visit[];
}

export async function getLastVisit(userId: string): Promise<Visit | null> {
  const { data, error } = await supabase
    .from('visits')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('Error fetching last visit:', error);
    return null;
  }
  return data as Visit | null;
}

export async function verifyQRCode(
  qrCode: string, 
  userLatitude?: number, 
  userLongitude?: number
): Promise<{ success: boolean; data?: any; error?: string }> {
  const { data, error } = await supabase.functions.invoke('verify-qr', {
    body: {
      qr_code: qrCode,
      user_latitude: userLatitude,
      user_longitude: userLongitude
    }
  });

  if (error) {
    console.error('Error verifying QR:', error);
    return { success: false, error: error.message };
  }
  
  return data;
}

// Drop operations
export async function getActiveDrops(): Promise<Drop[]> {
  const { data, error } = await supabase
    .from('drops')
    .select('*')
    .eq('is_active', true)
    .gte('expires_at', new Date().toISOString())
    .order('expires_at');

  if (error) {
    console.error('Error fetching drops:', error);
    return [];
  }
  return data as Drop[];
}

// Community operations
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  const { data, error } = await supabase
    .from('community_posts')
    .select(`
      *,
      profiles:user_id (name),
      outlets:outlet_id (name)
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching community posts:', error);
    return [];
  }
  return data as unknown as CommunityPost[];
}

export async function createCommunityPost(
  userId: string,
  content: string,
  outletId?: string,
  imageUrl?: string
): Promise<CommunityPost | null> {
  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      user_id: userId,
      content,
      outlet_id: outletId,
      image_url: imageUrl
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating post:', error);
    return null;
  }
  return data as CommunityPost;
}

// Image upload
export async function uploadCommunityImage(userId: string, file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { error } = await supabase.storage
    .from('community-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('community-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

// Analytics operations
export async function trackEvent(
  eventType: string, 
  outletId?: string, 
  metadata?: Record<string, any>
): Promise<void> {
  const { error } = await supabase
    .from('analytics_events')
    .insert({
      event_type: eventType,
      outlet_id: outletId,
      metadata: metadata || {}
    });

  if (error) {
    console.error('Error tracking event:', error);
  }
}

export async function getAnalyticsSummary(period: 'today' | 'week' | 'month' = 'today') {
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
  }

  // Get visits count
  const { count: visitsCount } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', startDate.toISOString());

  // Get unique users
  const { data: uniqueUsers } = await supabase
    .from('visits')
    .select('user_id')
    .gte('created_at', startDate.toISOString());

  const uniqueUserIds = new Set(uniqueUsers?.map(v => v.user_id) || []);

  // Get drop redemptions
  const { count: redemptionsCount } = await supabase
    .from('drop_redemptions')
    .select('*', { count: 'exact', head: true })
    .gte('redeemed_at', startDate.toISOString());

  // Get total profiles for repeat rate calculation
  const { count: totalProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .gt('total_visits', 1);

  const { count: allProfiles } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  const repeatRate = allProfiles ? Math.round(((totalProfiles || 0) / allProfiles) * 100) : 0;

  return {
    totalScans: visitsCount || 0,
    activeUsers: uniqueUserIds.size,
    redemptions: redemptionsCount || 0,
    repeatRate
  };
}

export async function getHourlyScans(date: Date = new Date()) {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

  const { data } = await supabase
    .from('visits')
    .select('created_at')
    .gte('created_at', startOfDay.toISOString())
    .lt('created_at', endOfDay.toISOString());

  const hourlyData: { hour: string; scans: number }[] = [];
  for (let i = 9; i <= 22; i++) {
    const hour = i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i - 12} PM`;
    const scans = data?.filter(v => {
      const visitHour = new Date(v.created_at).getHours();
      return visitHour === i;
    }).length || 0;
    hourlyData.push({ hour, scans });
  }

  return hourlyData;
}

export async function getOutletPerformance() {
  const { data: outlets } = await supabase
    .from('outlets')
    .select('id, name, city');

  const { data: visits } = await supabase
    .from('visits')
    .select('outlet_id')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const outletScans = outlets?.map(outlet => ({
    ...outlet,
    scans: visits?.filter(v => v.outlet_id === outlet.id).length || 0
  })).sort((a, b) => b.scans - a.scans) || [];

  return outletScans;
}

// Push notification operations
export async function subscribeToPush(
  userId: string,
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } }
): Promise<boolean> {
  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    }, {
      onConflict: 'user_id,endpoint'
    });

  if (error) {
    console.error('Error saving push subscription:', error);
    return false;
  }
  return true;
}

export async function unsubscribeFromPush(userId: string, endpoint: string): Promise<boolean> {
  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', userId)
    .eq('endpoint', endpoint);

  if (error) {
    console.error('Error removing push subscription:', error);
    return false;
  }
  return true;
}

// Calculate distance between user and outlet
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get user's current location
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    });
  });
}

// Watch user's location in real-time
export function watchLocation(
  onSuccess: (position: GeolocationPosition) => void,
  onError: (error: GeolocationPositionError) => void
): number {
  if (!navigator.geolocation) {
    onError({ code: 2, message: 'Geolocation is not supported', PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3 } as GeolocationPositionError);
    return -1;
  }
  
  return navigator.geolocation.watchPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000
  });
}

export function clearLocationWatch(watchId: number): void {
  if (watchId !== -1) {
    navigator.geolocation.clearWatch(watchId);
  }
}

// Tier utilities
export function getTierInfo(tier: string) {
  switch (tier) {
    case 'newcomer':
      return { label: 'Newcomer', visits: 0, nextTier: 'Regular', nextAt: 5, color: 'bg-muted', emoji: '🌱' };
    case 'regular':
      return { label: 'Regular', visits: 5, nextTier: 'Insider', nextAt: 15, color: 'bg-chai-warm', emoji: '☕' };
    case 'insider':
      return { label: 'Chai Insider', visits: 15, nextTier: 'Legend', nextAt: 50, color: 'bg-chai-orange', emoji: '🔥' };
    case 'legend':
      return { label: 'CSB Legend', visits: 50, nextTier: null, nextAt: null, color: 'bg-chai-gold', emoji: '👑' };
    default:
      return { label: 'Newcomer', visits: 0, nextTier: 'Regular', nextAt: 5, color: 'bg-muted', emoji: '🌱' };
  }
}

export function getProgressToNextTier(totalVisits: number, tier: string): number {
  const tierInfo = getTierInfo(tier);
  if (!tierInfo.nextAt) return 100;
  
  const progress = ((totalVisits - tierInfo.visits) / (tierInfo.nextAt - tierInfo.visits)) * 100;
  return Math.min(100, Math.max(0, progress));
}
