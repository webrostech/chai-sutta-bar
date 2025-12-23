import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Users, Store, TrendingUp, Gift, Clock, ChevronRight, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/analytics/StatCard';
import { AnalyticsChart } from '@/components/analytics/AnalyticsChart';
import { getAnalyticsSummary, getHourlyScans, getOutletPerformance } from '@/lib/api';

export default function AdminPage() {
  const { outlets } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [stats, setStats] = useState({ totalScans: 0, activeUsers: 0, redemptions: 0, repeatRate: 0 });
  const [hourlyData, setHourlyData] = useState<{ hour: string; scans: number }[]>([]);
  const [outletPerformance, setOutletPerformance] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setIsLoading(true);
    const [summary, hourly, performance] = await Promise.all([
      getAnalyticsSummary(selectedPeriod),
      getHourlyScans(),
      getOutletPerformance()
    ]);
    setStats(summary);
    setHourlyData(hourly);
    setOutletPerformance(performance);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-chai-charcoal text-chai-cream">
      <header className="sticky top-0 z-50 bg-chai-charcoal/95 backdrop-blur-lg border-b border-chai-dark">
        <div className="flex items-center justify-between h-16 px-6">
          <Link to="/" className="font-display text-xl">
            <span className="text-chai-cream">CSB</span>
            <span className="text-chai-orange"> ADMIN</span>
          </Link>
          <div className="flex items-center gap-2 bg-chai-dark rounded-lg p-1">
            {(['today', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  'px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize',
                  selectedPeriod === period ? 'bg-chai-orange text-chai-cream' : 'text-chai-cream/60 hover:text-chai-cream'
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-display text-4xl">DASHBOARD</h1>
          <p className="text-chai-cream/60 mt-1">Real-time analytics for your outlets</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Scans" value={stats.totalScans} icon={BarChart3} delay={0} />
          <StatCard label="Active Users" value={stats.activeUsers} icon={Users} delay={0.1} />
          <StatCard label="Redemptions" value={stats.redemptions} icon={Gift} delay={0.2} />
          <StatCard label="Repeat Rate" value={`${stats.repeatRate}%`} icon={TrendingUp} delay={0.3} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart data={hourlyData} title="PEAK HOURS" subtitle="Scans throughout the day" />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-chai-dark rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-xl text-chai-cream">TOP OUTLETS</h2>
                <p className="text-chai-cream/60 text-sm">By scans this week</p>
              </div>
              <Store className="w-5 h-5 text-chai-cream/60" />
            </div>
            <div className="space-y-3">
              {outletPerformance.slice(0, 4).map((outlet, index) => (
                <motion.div 
                  key={outlet.id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 bg-chai-charcoal rounded-xl cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-chai-cream truncate">{outlet.name}</h3>
                    <p className="text-xs text-chai-cream/60">{outlet.city}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-chai-orange font-medium">{outlet.scans}</span>
                    <ChevronRight className="w-4 h-4 text-chai-cream/40" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
