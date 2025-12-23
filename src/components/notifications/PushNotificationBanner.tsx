import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/contexts/AppContext';
import { subscribeToPush } from '@/lib/api';
import { toast } from 'sonner';

export function PushNotificationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useApp();

  useEffect(() => {
    // Check if push notifications are supported and if user has already subscribed
    if ('Notification' in window && 'serviceWorker' in navigator && isAuthenticated) {
      const hasShown = localStorage.getItem('push-banner-shown');
      const permission = Notification.permission;
      
      if (permission === 'granted') {
        setIsSubscribed(true);
      } else if (permission === 'default' && !hasShown) {
        // Show banner after a delay
        const timer = setTimeout(() => setIsVisible(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated]);

  const handleSubscribe = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Register service worker if not already registered
        const registration = await navigator.serviceWorker.ready;
        
        // Subscribe to push
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BLBz4Qx_placeholder_key_for_demo' // This would be your VAPID public key
        });
        
        const subscriptionJson = subscription.toJSON();
        
        if (subscriptionJson.endpoint && subscriptionJson.keys) {
          await subscribeToPush(user.id, {
            endpoint: subscriptionJson.endpoint,
            keys: subscriptionJson.keys as { p256dh: string; auth: string }
          });
        }
        
        setIsSubscribed(true);
        toast.success('Notifications enabled! You\'ll get alerts for new drops and rewards.');
      } else {
        toast.error('Notification permission was denied.');
      }
    } catch (error) {
      console.error('Error subscribing to push:', error);
      toast.error('Could not enable notifications. Please try again.');
    } finally {
      setIsLoading(false);
      setIsVisible(false);
      localStorage.setItem('push-banner-shown', 'true');
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('push-banner-shown', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-20 left-4 right-4 z-50 md:left-auto md:right-6 md:max-w-sm"
        >
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-chai-dark to-chai-charcoal border border-chai-brown/30 shadow-glow-lg">
            {/* Animated background */}
            <div className="absolute inset-0 opacity-30">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-accent/20 via-transparent to-accent/20"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
            </div>

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full text-chai-cream/60 hover:text-chai-cream hover:bg-chai-cream/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative p-5">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0"
                >
                  <Bell className="w-6 h-6 text-accent" />
                </motion.div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg text-chai-cream flex items-center gap-2">
                    NEVER MISS A DROP
                    <Sparkles className="w-4 h-4 text-accent" />
                  </h3>
                  <p className="text-chai-cream/70 text-sm mt-1">
                    Get instant alerts for exclusive drops, rewards, and nearby check-in bonuses!
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-1 text-chai-cream/60 hover:text-chai-cream hover:bg-chai-cream/10"
                >
                  <BellOff className="w-4 h-4 mr-2" />
                  Not Now
                </Button>
                <Button
                  variant="orange"
                  size="sm"
                  onClick={handleSubscribe}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {isLoading ? 'Enabling...' : 'Enable'}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
