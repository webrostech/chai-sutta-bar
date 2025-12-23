import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { LoyaltyProgress } from '@/components/loyalty/LoyaltyProgress';
import { LogOut, Settings, HelpCircle, Gift, History, ChevronRight, Crown, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { getTierInfo } from '@/lib/api';

export default function ProfilePage() {
  const { profile, isAuthenticated, visits, logout } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!profile) return null;

  const tierInfo = getTierInfo(profile.tier);

  const menuItems = [
    { icon: History, label: 'Visit History', badge: `${visits.length} visits` },
    { icon: Gift, label: 'My Rewards', badge: `${profile.credits} credits` },
    { icon: Crown, label: 'Tier Benefits', badge: tierInfo.label },
    { icon: Settings, label: 'Settings' },
    { icon: HelpCircle, label: 'Help & Support' },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-lg mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-orange text-chai-cream font-display text-4xl mb-4 shadow-glow"
          >
            {profile.name.charAt(0)}
          </motion.div>
          <h1 className="font-display text-3xl text-foreground">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.phone || 'No phone'}</p>
          
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className={cn(
              'badge-chai',
              profile.tier === 'legend' && 'animate-glow-pulse'
            )}>
              <Zap className="w-4 h-4" />
              {tierInfo.label}
            </span>
          </div>
        </motion.div>

        {/* Loyalty Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <LoyaltyProgress profile={profile} />
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="card-chai text-center">
            <p className="font-display text-2xl text-accent">{profile.total_visits}</p>
            <p className="text-xs text-muted-foreground">Visits</p>
          </div>
          <div className="card-chai text-center">
            <p className="font-display text-2xl text-accent">{profile.credits}</p>
            <p className="text-xs text-muted-foreground">Credits</p>
          </div>
          <div className="card-chai text-center">
            <p className="font-display text-2xl text-accent">{profile.badges?.length || 0}</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-2 mb-8"
        >
          {menuItems.map((item, index) => (
            <motion.button
              key={item.label}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="w-full flex items-center justify-between p-4 bg-card rounded-xl hover:bg-secondary transition-colors"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="text-sm text-muted-foreground">{item.badge}</span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Badges Section */}
        {profile.badges && profile.badges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="font-display text-xl text-foreground mb-4">MY BADGES</h2>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge) => (
                <motion.span
                  key={badge}
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-gradient-orange text-chai-cream rounded-full text-sm font-medium shadow-soft"
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
            Logout
          </Button>
        </motion.div>

        {/* Member since */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Member since {new Date(profile.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
        </motion.p>
      </div>
    </div>
  );
}
