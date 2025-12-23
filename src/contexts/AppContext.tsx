import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { 
  Profile, Outlet, Visit, Drop, CommunityPost,
  getProfile, getOutlets, getActiveDrops, getUserVisits, getCommunityPosts
} from '@/lib/api';

interface AppContextType {
  // Auth state
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Profile state
  profile: Profile | null;
  
  // Data state
  outlets: Outlet[];
  drops: Drop[];
  visits: Visit[];
  communityPosts: CommunityPost[];
  
  // Actions
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [drops, setDrops] = useState<Drop[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);

  // Initialize auth state
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setVisits([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setIsLoading(false);
    });

    // Load public data
    loadPublicData();

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    const [profileData, visitsData] = await Promise.all([
      getProfile(userId),
      getUserVisits(userId)
    ]);
    setProfile(profileData);
    setVisits(visitsData);
  };

  const loadPublicData = async () => {
    const [outletsData, dropsData, postsData] = await Promise.all([
      getOutlets(),
      getActiveDrops(),
      getCommunityPosts()
    ]);
    setOutlets(outletsData);
    setDrops(dropsData);
    setCommunityPosts(postsData);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { name }
      }
    });
    
    if (error) {
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setVisits([]);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await getProfile(user.id);
      setProfile(profileData);
    }
  }, [user]);

  const refreshData = useCallback(async () => {
    await loadPublicData();
    if (user) {
      await fetchUserData(user.id);
    }
  }, [user]);

  return (
    <AppContext.Provider value={{
      user,
      session,
      isAuthenticated: !!user,
      isLoading,
      profile,
      outlets,
      drops,
      visits,
      communityPosts,
      login,
      signUp,
      logout,
      refreshProfile,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
