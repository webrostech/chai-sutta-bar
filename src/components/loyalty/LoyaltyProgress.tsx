import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getTierInfo, getProgressToNextTier, Profile } from '@/lib/api';
import { ChaiGlass } from '@/components/effects/ChaiGlass';
import { Award, Flame, Star } from 'lucide-react';

interface LoyaltyProgressProps {
  profile: Profile;
  className?: string;
}

export function LoyaltyProgress({ profile, className }: LoyaltyProgressProps) {
  const tierInfo = getTierInfo(profile.tier);
  const progress = getProgressToNextTier(profile.total_visits, profile.tier);

  return (
    <div className={cn('card-chai', className)}>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Chai Glass Visual */}
        <div className="relative">
          <ChaiGlass progress={progress} size="lg" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
            <span className={cn(
              'badge-chai',
              profile.tier === 'legend' && 'animate-glow-pulse'
            )}>
              <Award className="w-4 h-4" />
              {tierInfo.label}
            </span>
          </div>
          
          <h2 className="font-display text-3xl text-foreground">
            YOUR CHAI JOURNEY
          </h2>
          
          <p className="text-muted-foreground mt-1">
            {tierInfo.nextTier ? (
              <>
                <span className="text-accent font-semibold">{tierInfo.nextAt! - profile.total_visits}</span> more visits to become a <span className="font-semibold">{tierInfo.nextTier}</span>
              </>
            ) : (
              "You've reached the highest tier! 🎉"
            )}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{profile.total_visits}</p>
                <p className="text-xs text-muted-foreground">Total Visits</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Flame className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-display text-foreground">{profile.current_streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          {profile.badges && profile.badges.length > 0 && (
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mt-4">
              {profile.badges.map((badge) => (
                <motion.span
                  key={badge}
                  whileHover={{ scale: 1.05 }}
                  className="px-3 py-1 bg-secondary rounded-full text-sm text-secondary-foreground"
                >
                  {badge}
                </motion.span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
