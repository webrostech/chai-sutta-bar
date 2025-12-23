import { motion } from 'framer-motion';

interface SteamProps {
  className?: string;
}

export function Steam({ className = '' }: SteamProps) {
  return (
    <div className={`steam-container ${className}`}>
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="steam"
          style={{
            left: `${i * 8}px`,
          }}
          initial={{ height: 0, opacity: 0, y: 0, scaleX: 1 }}
          animate={{
            height: [0, 40, 60],
            opacity: [0, 0.6, 0],
            y: [0, -30, -60],
            scaleX: [1, 1.5, 2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
