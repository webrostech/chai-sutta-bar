import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export function Header() {
  const location = useLocation();
  const { profile, isAuthenticated } = useApp();
  
  const isHome = location.pathname === '/';

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isHome ? 'bg-transparent' : 'bg-card/95 backdrop-blur-lg border-b border-border'
    )}>
      <div className="flex items-center justify-between h-16 px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 5 }}
            className="font-display text-2xl tracking-tight"
          >
            <span className={cn(isHome ? 'text-chai-cream' : 'text-foreground')}>CHAI</span>
            <span className="text-accent"> SUTTA</span>
            <span className={cn(isHome ? 'text-chai-cream' : 'text-foreground')}> BAR</span>
          </motion.div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {isAuthenticated && profile ? (
            <div className="flex items-center gap-3">
              <div className={cn(
                'text-right hidden sm:block',
                isHome ? 'text-chai-cream' : 'text-foreground'
              )}>
                <p className="text-sm font-medium">{profile.name}</p>
                <p className="text-xs opacity-70">{profile.credits} credits</p>
              </div>
              <Link to="/profile">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-gradient-orange flex items-center justify-center text-chai-cream font-display text-lg"
                >
                  {profile.name.charAt(0)}
                </motion.div>
              </Link>
            </div>
          ) : (
            <Link
              to="/auth"
              className={cn(
                'font-medium px-4 py-2 rounded-lg transition-all',
                isHome 
                  ? 'bg-chai-cream/10 text-chai-cream hover:bg-chai-cream/20 backdrop-blur-sm' 
                  : 'bg-accent text-accent-foreground hover:bg-accent/90'
              )}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
