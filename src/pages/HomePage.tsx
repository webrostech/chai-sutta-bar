import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { HeroSection } from '@/components/sections/HeroSection';
import { LoyaltySection } from '@/components/sections/LoyaltySection';
import { DropsSection } from '@/components/sections/DropsSection';
import { OutletsSection } from '@/components/sections/OutletsSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { FranchiseSection } from '@/components/sections/FranchiseSection';
import { FooterSection } from '@/components/sections/FooterSection';
import { PushNotificationBanner } from '@/components/notifications/PushNotificationBanner';

export default function HomePage() {
  const { profile, isAuthenticated, outlets, drops } = useApp();

  return (
    <div className="min-h-screen">
      {/* Push Notification Banner */}
      {isAuthenticated && <PushNotificationBanner />}

      {/* Hero */}
      <HeroSection isAuthenticated={isAuthenticated} />

      {/* Loyalty Progress */}
      <LoyaltySection profile={profile} isAuthenticated={isAuthenticated} />

      {/* Limited Drops */}
      <DropsSection drops={drops} />

      {/* Outlets */}
      <OutletsSection outlets={outlets} />

      {/* About */}
      <AboutSection />

      {/* Franchise */}
      <FranchiseSection />

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
