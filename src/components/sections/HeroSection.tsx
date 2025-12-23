import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QrCode, Sparkles, ChevronDown, Users, MapPin, Coffee } from 'lucide-react';
import heroImage from '@/assets/hero-chai.jpg';

interface HeroSectionProps {
  isAuthenticated: boolean;
}

export function HeroSection({ isAuthenticated }: HeroSectionProps) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const stats = [
    { icon: MapPin, value: '200+', label: 'Outlets' },
    { icon: Users, value: '5M+', label: 'Chai Lovers' },
    { icon: Coffee, value: '50M+', label: 'Cups Served' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0"
      >
        <img 
          src={heroImage} 
          alt="Chai Sutta Bar atmosphere" 
          className="w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-chai-charcoal/70 via-chai-dark/80 to-background" />
      </motion.div>

      {/* Animated texture */}
      <div className="absolute inset-0 texture-overlay opacity-[0.02]" />

      {/* Floating elements */}
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-10 w-20 h-20 bg-chai-orange/10 rounded-full blur-xl"
      />
      <motion.div
        animate={{ 
          y: [0, 20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/3 right-10 w-32 h-32 bg-chai-gold/10 rounded-full blur-xl"
      />

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 bg-chai-orange/20 backdrop-blur-sm px-5 py-2.5 rounded-full text-chai-cream/90 text-sm mb-8 border border-chai-orange/30"
        >
          <Sparkles className="w-4 h-4 text-chai-orange" />
          <span>Not just chai. A culture.</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-6xl sm:text-8xl lg:text-[10rem] text-chai-cream leading-none tracking-tight"
        >
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            CHAI
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="block text-chai-orange"
          >
            SUTTA
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            BAR
          </motion.span>
        </motion.h1>
        
        {/* Tagline */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-chai-cream/70 text-lg sm:text-xl mt-8 max-w-2xl mx-auto leading-relaxed"
        >
          Where every cup tells a story. Earn rewards, unlock exclusive drops, 
          and become part of India's biggest chai revolution.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          {isAuthenticated ? (
            <Link to="/scan">
              <Button variant="hero" size="xl" className="group">
                <QrCode className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                SCAN & EARN
              </Button>
            </Link>
          ) : (
            <Link to="/auth">
              <Button variant="hero" size="xl" className="group">
                <span className="group-hover:tracking-wider transition-all">JOIN THE JOURNEY</span>
              </Button>
            </Link>
          )}
          <Link to="/community">
            <Button variant="glass" size="lg" className="backdrop-blur-md">
              Explore Community
            </Button>
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex items-center justify-center gap-8 sm:gap-16 mt-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
              className="text-center"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-chai-orange/20 backdrop-blur-sm mb-2"
              >
                <stat.icon className="w-5 h-5 text-chai-orange" />
              </motion.div>
              <motion.p 
                className="font-display text-3xl sm:text-4xl text-chai-cream"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 + index * 0.1 }}
              >
                {stat.value}
              </motion.p>
              <p className="text-chai-cream/50 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-2 text-chai-cream/40"
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
}
