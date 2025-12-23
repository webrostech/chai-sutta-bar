import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from '@/lib/api';
import { OutletCard } from '@/components/cards/OutletCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, Navigation } from 'lucide-react';

interface OutletsSectionProps {
  outlets: Outlet[];
}

export function OutletsSection({ outlets }: OutletsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  if (outlets.length === 0) return null;

  return (
    <section ref={ref} className="py-20 bg-secondary/30 relative">
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
              <MapPin className="w-5 h-5 text-chai-orange" />
              <span className="text-chai-orange font-medium text-sm uppercase tracking-widest">Locations</span>
            </motion.div>
            <h2 className="font-display text-4xl sm:text-5xl text-foreground">
              FIND YOUR SPOT
            </h2>
            <p className="text-muted-foreground mt-2 max-w-md">
              Visit any of our outlets across India. Each one is a unique experience.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
          >
            <Button variant="outline" size="lg" className="group">
              <Navigation className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              Enable Location
            </Button>
          </motion.div>
        </motion.div>

        {/* Outlets Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {outlets.slice(0, 6).map((outlet, index) => (
            <motion.div
              key={outlet.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <OutletCard outlet={outlet} />
            </motion.div>
          ))}
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-10 text-center"
        >
          <Link to="/outlets">
            <Button variant="chai" size="lg" className="group">
              View All {outlets.length}+ Outlets
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
