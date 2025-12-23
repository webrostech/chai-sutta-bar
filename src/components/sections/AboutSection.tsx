import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Coffee, Users, MapPin, Zap, Heart, Star } from 'lucide-react';

const milestones = [
  {
    year: '2016',
    title: 'The First Kullad',
    description: 'Started with a dream and a small outlet in Indore.',
    icon: Coffee,
  },
  {
    year: '2018',
    title: 'College Culture',
    description: 'Became the go-to hangout spot for students across India.',
    icon: Users,
  },
  {
    year: '2020',
    title: '100 Outlets',
    description: 'Expanded to 100+ locations, even during challenging times.',
    icon: MapPin,
  },
  {
    year: '2023',
    title: '200+ Strong',
    description: 'Now serving chai lovers across 200+ outlets nationwide.',
    icon: Star,
  },
];

const values = [
  {
    icon: Heart,
    title: 'Community First',
    description: 'Every outlet is a meeting point for friends, ideas, and conversations.',
  },
  {
    icon: Zap,
    title: 'Youth Energy',
    description: 'Designed by young minds, for young minds. Always fresh, always vibrant.',
  },
  {
    icon: Coffee,
    title: 'Authentic Taste',
    description: 'Traditional recipes with modern vibes. Every cup is a masterpiece.',
  },
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-card relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="text-chai-orange font-medium text-sm uppercase tracking-widest">Our Story</span>
          <h2 className="font-display text-5xl sm:text-6xl text-foreground mt-4">
            MORE THAN JUST CHAI
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            From a single outlet to a nationwide movement. We're not just serving chai, 
            we're brewing a revolution.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative mb-24">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border hidden md:block" />
          
          <div className="space-y-12 md:space-y-0">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                className={`md:flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                  <div className={`card-chai inline-block ${index % 2 === 0 ? 'md:ml-auto' : ''}`}>
                    <span className="text-chai-orange font-display text-2xl">{milestone.year}</span>
                    <h3 className="font-display text-xl text-foreground mt-1">{milestone.title}</h3>
                    <p className="text-muted-foreground text-sm mt-2">{milestone.description}</p>
                  </div>
                </div>
                
                {/* Center icon */}
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="hidden md:flex w-14 h-14 rounded-full bg-chai-orange items-center justify-center z-10 shadow-glow"
                >
                  <milestone.icon className="w-6 h-6 text-chai-cream" />
                </motion.div>
                
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="grid md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="card-chai text-center group"
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex w-16 h-16 rounded-2xl bg-gradient-orange items-center justify-center mb-4 shadow-glow"
              >
                <value.icon className="w-7 h-7 text-chai-cream" />
              </motion.div>
              <h3 className="font-display text-xl text-foreground">{value.title}</h3>
              <p className="text-muted-foreground text-sm mt-2">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
