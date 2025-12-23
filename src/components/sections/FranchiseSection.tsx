import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { MapPin, TrendingUp, Users, Star, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  duration?: number;
}

function AnimatedCounter({ target, suffix = '', duration = 2 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setCount(Math.floor(target * Math.min(progress, 1)));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const stats = [
  { icon: MapPin, value: 200, suffix: '+', label: 'Outlets', color: 'from-chai-orange to-chai-rust' },
  { icon: Users, value: 50, suffix: 'L+', label: 'Monthly Visitors', color: 'from-chai-gold to-chai-orange' },
  { icon: TrendingUp, value: 95, suffix: '%', label: 'Success Rate', color: 'from-green-500 to-emerald-600' },
  { icon: Star, value: 4.8, suffix: '', label: 'Average Rating', color: 'from-yellow-500 to-amber-600' },
];

const cities = [
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Jaipur', 'Lucknow', 'Indore', 'Bhopal', 'Ahmedabad'
];

export function FranchiseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 right-0 w-96 h-96 bg-chai-orange rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-80 h-80 bg-chai-gold rounded-full blur-[100px]"
      />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-chai-orange font-medium text-sm uppercase tracking-widest">Expansion</span>
          <h2 className="font-display text-5xl sm:text-7xl text-chai-cream mt-4">
            GROWING NATIONWIDE
          </h2>
          <p className="text-chai-cream/70 mt-4 max-w-2xl mx-auto">
            From college corners to city centers, Chai Sutta Bar is everywhere the youth is.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="glass-dark rounded-2xl p-6 text-center"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className={`inline-flex w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} items-center justify-center mb-3 shadow-glow`}
              >
                <stat.icon className="w-6 h-6 text-chai-cream" />
              </motion.div>
              <p className="font-display text-4xl text-chai-cream">
                {stat.value === 4.8 ? '4.8' : <AnimatedCounter target={stat.value} suffix={stat.suffix} />}
              </p>
              <p className="text-chai-cream/60 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Map-like visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="glass-dark rounded-3xl p-8 mb-16"
        >
          <h3 className="font-display text-2xl text-chai-cream mb-6 text-center">
            PRESENT IN {cities.length}+ CITIES
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {cities.map((city, index) => (
              <motion.span
                key={city}
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="px-4 py-2 bg-chai-cream/10 rounded-full text-chai-cream text-sm border border-chai-cream/20 hover:bg-chai-orange/20 hover:border-chai-orange/40 transition-all cursor-pointer"
              >
                <MapPin className="w-3 h-3 inline mr-1" />
                {city}
              </motion.span>
            ))}
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1 }}
              className="px-4 py-2 bg-chai-orange/20 rounded-full text-chai-orange text-sm border border-chai-orange/40"
            >
              + many more...
            </motion.span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <h3 className="font-display text-3xl text-chai-cream mb-4">
            BECOME A FRANCHISE PARTNER
          </h3>
          <p className="text-chai-cream/70 mb-6 max-w-lg mx-auto">
            Join India's fastest-growing chai chain. Low investment, high returns, 
            and the backing of a beloved brand.
          </p>
          <Button variant="hero" size="xl" className="group">
            <span>Enquire Now</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
