import { motion } from 'framer-motion';
import { Drop } from '@/lib/api';
import { Clock } from 'lucide-react';

interface DropCardProps {
  drop: Drop;
  onClick?: () => void;
}

export function DropCard({ drop, onClick }: DropCardProps) {
  const expiresAt = new Date(drop.expires_at);
  const timeLeft = expiresAt.getTime() - Date.now();
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer min-w-[240px] bg-gradient-to-br shadow-card ${drop.color}`}
    >
      {/* Texture overlay */}
      <div className="texture-overlay" />
      
      {/* Content */}
      <div className="relative z-10">
        <span className="text-4xl">{drop.emoji}</span>
        <h3 className="font-display text-2xl text-white mt-2">
          {drop.title}
        </h3>
        <p className="text-white/80 text-sm mt-1">
          {drop.description}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-1 text-white/70 text-xs">
            <Clock className="w-3 h-3" />
            <span>{hoursLeft}h {minutesLeft}m left</span>
          </div>
          {drop.credits_required > 0 && (
            <span className="bg-white/20 px-2 py-1 rounded-full text-xs text-white">
              {drop.credits_required} credits
            </span>
          )}
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
    </motion.div>
  );
}
