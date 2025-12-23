import { motion } from 'framer-motion';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  delay?: number;
}

export function StatCard({ label, value, change, icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className="relative bg-chai-dark rounded-2xl p-5 overflow-hidden group"
    >
      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      
      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-xl bg-chai-orange/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-chai-orange" />
          </div>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              change >= 0 ? 'text-green-400' : 'text-red-400'
            )}>
              {change >= 0 ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        
        <motion.p
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.2 }}
          className="font-display text-3xl text-chai-cream mt-4"
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </motion.p>
        <p className="text-chai-cream/60 text-sm">{label}</p>
      </div>
    </motion.div>
  );
}
