import { motion } from 'framer-motion';

interface ChartData {
  hour: string;
  scans: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
  title: string;
  subtitle?: string;
}

export function AnalyticsChart({ data, title, subtitle }: AnalyticsChartProps) {
  const maxScans = Math.max(...data.map(h => h.scans), 1);

  return (
    <div className="bg-chai-dark rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-xl text-chai-cream">{title}</h2>
          {subtitle && <p className="text-chai-cream/60 text-sm">{subtitle}</p>}
        </div>
      </div>
      
      <div className="flex items-end gap-2 h-48">
        {data.map((item, index) => (
          <motion.div
            key={item.hour}
            initial={{ height: 0 }}
            animate={{ height: `${(item.scans / maxScans) * 100}%` }}
            transition={{ delay: 0.3 + index * 0.05, duration: 0.5, ease: 'easeOut' }}
            className="flex-1 bg-gradient-to-t from-chai-orange to-chai-rust rounded-t-lg relative group cursor-pointer min-h-[4px]"
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute -top-10 left-1/2 -translate-x-1/2 bg-chai-charcoal px-2 py-1 rounded text-xs text-chai-cream whitespace-nowrap z-10"
            >
              {item.scans} scans
            </motion.div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex justify-between mt-3 text-xs text-chai-cream/40 overflow-hidden">
        {data.filter((_, i) => i % 2 === 0).map(item => (
          <span key={item.hour}>{item.hour}</span>
        ))}
      </div>
    </div>
  );
}
