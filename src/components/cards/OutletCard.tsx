import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Outlet } from '@/lib/api';
import { cn } from '@/lib/utils';

interface OutletCardProps {
  outlet: Outlet;
  onClick?: () => void;
}

export function OutletCard({ outlet, onClick }: OutletCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="card-chai cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-display text-xl text-foreground group-hover:text-accent transition-colors">
            {outlet.name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
            <MapPin className="w-3 h-3" />
            <span>{outlet.address}, {outlet.city}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            outlet.is_open 
              ? 'bg-green-500/10 text-green-600' 
              : 'bg-red-500/10 text-red-600'
          )}>
            {outlet.is_open ? 'Open' : 'Closed'}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
