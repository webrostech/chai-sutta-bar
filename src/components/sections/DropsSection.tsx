import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Drop } from '@/lib/api';
import { DropCard } from '@/components/cards/DropCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Gift, Timer } from 'lucide-react';

interface DropsSectionProps {
  drops: Drop[];
}

export function DropsSection({ drops }: DropsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (drops.length === 0) return null;

  return (
    <section ref={ref} className="py-20 bg-background relative overflow-hidden">
      {/* Background accent */}
      <motion.div
        animate={{ 
          x: [0, 50, 0],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-chai-orange rounded-full blur-[120px]"
      />

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-3"
            >
              <Gift className="w-5 h-5 text-chai-orange" />
              <span className="text-chai-orange font-medium text-sm uppercase tracking-widest">Exclusive Rewards</span>
            </motion.div>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground">
              LIMITED TIME DROPS
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Special rewards that expire soon. Don't miss out on exclusive discounts and freebies.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="mt-4 md:mt-0 flex items-center gap-2 text-muted-foreground text-sm"
          >
            <Timer className="w-4 h-4 animate-pulse text-chai-orange" />
            <span>Drops refresh daily</span>
          </motion.div>
        </motion.div>

        {/* Drops Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex gap-5 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
        >
          {drops.map((drop, index) => (
            <motion.div
              key={drop.id}
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="snap-start flex-shrink-0"
            >
              <DropCard drop={drop} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Link to="/rewards">
            <Button variant="outline" size="lg" className="group">
              View All Rewards
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
