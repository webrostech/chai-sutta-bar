import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Steam } from './Steam';

interface ChaiGlassProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showSteam?: boolean;
  className?: string;
}

export function ChaiGlass({ progress, size = 'md', showSteam = true, className }: ChaiGlassProps) {
  const sizeClasses = {
    sm: 'w-16 h-24',
    md: 'w-24 h-36',
    lg: 'w-32 h-48',
  };

  return (
    <div className={cn('relative', className)}>
      {showSteam && progress > 20 && (
        <Steam className="-top-6" />
      )}
      
      {/* Glass container */}
      <div className={cn(
        'chai-glass relative',
        sizeClasses[size],
      )}>
        {/* Chai fill */}
        <motion.div
          className="chai-fill rounded-b-xl"
          initial={{ height: '0%' }}
          animate={{ height: `${progress}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          {/* Surface bubbles */}
          <div className="absolute top-0 left-0 right-0 h-2">
            <motion.div
              className="absolute w-1 h-1 bg-chai-warm/40 rounded-full"
              style={{ left: '20%' }}
              animate={{ y: [-2, 0, -2] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-1.5 h-1.5 bg-chai-warm/30 rounded-full"
              style={{ left: '60%' }}
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute w-1 h-1 bg-chai-warm/50 rounded-full"
              style={{ left: '80%' }}
              animate={{ y: [-1, 1, -1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        
        {/* Glass rim */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-chai-warm/20 rounded-t-xl" />
      </div>

      {/* Progress text */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-display text-chai-cream text-lg">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
