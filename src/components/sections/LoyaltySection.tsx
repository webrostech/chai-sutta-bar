import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Profile } from '@/lib/api';
import { LoyaltyProgress } from '@/components/loyalty/LoyaltyProgress';
import { Button } from '@/components/ui/button';
import { QrCode, Trophy, Gift, TrendingUp } from 'lucide-react';

interface LoyaltySectionProps {
  profile: Profile | null;
  isAuthenticated: boolean;
}

export function LoyaltySection({ profile, isAuthenticated }: LoyaltySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const benefits = [
    { icon: QrCode, title: 'Scan & Earn', description: 'Check-in at any outlet to earn credits' },
    { icon: Gift, title: 'Exclusive Drops', description: 'Redeem credits for limited-time rewards' },
    { icon: TrendingUp, title: 'Level Up', description: 'Unlock tiers for bigger benefits' },
    { icon: Trophy, title: 'Badges', description: 'Collect achievements and show off' },
  ];

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.05, 0.15, 0.05]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -bottom-20 left-1/4 w-80 h-80 bg-chai-orange rounded-full blur-[100px]"
      />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-chai-orange font-medium text-sm uppercase tracking-widest">Rewards Program</span>
          <h2 className="font-display text-4xl sm:text-6xl text-foreground mt-4">
            YOUR CHAI JOURNEY
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Every visit counts. Earn credits, unlock tiers, and enjoy exclusive perks 
            that make your chai experience even better.
          </p>
        </motion.div>

        {/* Authenticated: Show Progress */}
        {isAuthenticated && profile ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <LoyaltyProgress profile={profile} />
          </motion.div>
        ) : (
          /* Not Authenticated: Show Benefits */
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-chai text-center"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.1 }}
                  className="inline-flex w-14 h-14 rounded-xl bg-gradient-orange items-center justify-center mb-4 shadow-glow"
                >
                  <benefit.icon className="w-6 h-6 text-chai-cream" />
                </motion.div>
                <h3 className="font-display text-lg text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm mt-1">{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          {isAuthenticated ? (
            <Link to="/scan">
              <Button variant="hero" size="xl" className="group shadow-glow">
                <QrCode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                SCAN NOW
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="hero" size="xl" className="group">
                Start Earning
              </Button>
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
