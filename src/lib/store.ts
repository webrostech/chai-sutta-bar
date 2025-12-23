// Simple state management for the app
import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  tier: 'newcomer' | 'regular' | 'insider' | 'legend';
  totalVisits: number;
  currentStreak: number;
  credits: number;
  badges: string[];
  joinedAt: Date;
}

export interface Visit {
  id: string;
  userId: string;
  outletId: string;
  outletName: string;
  timestamp: Date;
  creditsEarned: number;
}

export interface Outlet {
  id: string;
  name: string;
  address: string;
  city: string;
  distance?: number;
  isOpen: boolean;
  todayScans: number;
}

export interface Drop {
  id: string;
  title: string;
  description: string;
  emoji: string;
  creditsRequired: number;
  expiresAt: Date;
  isActive: boolean;
  color: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  outletName: string;
  content: string;
  imageUrl?: string;
  likes: number;
  timestamp: Date;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  visits: Visit[];
  outlets: Outlet[];
  drops: Drop[];
  communityPosts: CommunityPost[];
  isScanning: boolean;
  lastScanTime: Date | null;
  
  // Actions
  setUser: (user: User | null) => void;
  login: (phone: string) => void;
  logout: () => void;
  addVisit: (visit: Visit) => void;
  setScanning: (isScanning: boolean) => void;
  setLastScanTime: (time: Date) => void;
}

// Mock data
const mockOutlets: Outlet[] = [
  { id: '1', name: 'CSB Connaught Place', address: 'Block A, CP', city: 'Delhi', distance: 0.5, isOpen: true, todayScans: 234 },
  { id: '2', name: 'CSB Hauz Khas', address: 'Near Deer Park', city: 'Delhi', distance: 2.3, isOpen: true, todayScans: 156 },
  { id: '3', name: 'CSB Koramangala', address: '5th Block', city: 'Bangalore', distance: 1.2, isOpen: true, todayScans: 189 },
  { id: '4', name: 'CSB Bandra', address: 'Linking Road', city: 'Mumbai', distance: 3.1, isOpen: false, todayScans: 98 },
];

const mockDrops: Drop[] = [
  { id: '1', title: 'Rainy Day Chai', description: 'Free cutting chai when it rains!', emoji: '🌧️', creditsRequired: 0, expiresAt: new Date(Date.now() + 86400000), isActive: true, color: 'from-blue-500 to-cyan-500' },
  { id: '2', title: 'Exam Week Boost', description: '2x credits on all visits', emoji: '📚', creditsRequired: 50, expiresAt: new Date(Date.now() + 172800000), isActive: true, color: 'from-purple-500 to-pink-500' },
  { id: '3', title: 'Late Night Sutta', description: 'Midnight special - free snack', emoji: '🌙', creditsRequired: 100, expiresAt: new Date(Date.now() + 259200000), isActive: true, color: 'from-indigo-500 to-violet-500' },
  { id: '4', title: 'Chai Lover Bundle', description: 'Get chai + bun maska at ₹49', emoji: '❤️', creditsRequired: 75, expiresAt: new Date(Date.now() + 345600000), isActive: true, color: 'from-rose-500 to-orange-500' },
];

const mockCommunityPosts: CommunityPost[] = [
  { id: '1', userId: '1', userName: 'Rahul M.', outletName: 'CSB Connaught Place', content: 'Best cutting chai in town! ☕', likes: 24, timestamp: new Date(Date.now() - 3600000) },
  { id: '2', userId: '2', userName: 'Priya S.', outletName: 'CSB Hauz Khas', content: 'Vibes are unmatched here 🔥', likes: 18, timestamp: new Date(Date.now() - 7200000) },
  { id: '3', userId: '3', userName: 'Amit K.', outletName: 'CSB Koramangala', content: 'Late night chai sessions hit different', likes: 32, timestamp: new Date(Date.now() - 10800000) },
];

// Since we don't have zustand installed, let's use a simple React context approach
// We'll create the store logic here and use it via context

export const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  visits: [],
  outlets: mockOutlets,
  drops: mockDrops,
  communityPosts: mockCommunityPosts,
  isScanning: false,
  lastScanTime: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
  addVisit: () => {},
  setScanning: () => {},
  setLastScanTime: () => {},
};

export const mockUser: User = {
  id: '1',
  name: 'Arjun Sharma',
  phone: '+91 98765 43210',
  email: 'arjun@example.com',
  tier: 'regular',
  totalVisits: 7,
  currentStreak: 3,
  credits: 85,
  badges: ['First Sip', 'Week Warrior'],
  joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
};

export const getTierInfo = (tier: string) => {
  switch (tier) {
    case 'newcomer':
      return { label: 'Newcomer', visits: 0, nextTier: 'Regular', nextAt: 5, color: 'bg-muted' };
    case 'regular':
      return { label: 'Regular', visits: 5, nextTier: 'Insider', nextAt: 15, color: 'bg-chai-warm' };
    case 'insider':
      return { label: 'Chai Insider', visits: 15, nextTier: 'Legend', nextAt: 50, color: 'bg-chai-orange' };
    case 'legend':
      return { label: 'CSB Legend', visits: 50, nextTier: null, nextAt: null, color: 'bg-chai-gold' };
    default:
      return { label: 'Newcomer', visits: 0, nextTier: 'Regular', nextAt: 5, color: 'bg-muted' };
  }
};

export const getProgressToNextTier = (user: User) => {
  const tierInfo = getTierInfo(user.tier);
  if (!tierInfo.nextAt) return 100;
  
  const progress = ((user.totalVisits - tierInfo.visits) / (tierInfo.nextAt - tierInfo.visits)) * 100;
  return Math.min(100, Math.max(0, progress));
};
