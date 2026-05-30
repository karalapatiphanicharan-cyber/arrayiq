import {
  Activity,
  Database,
  BarChart3,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  LayoutGrid,
  Hash,
  Binary
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props {
  array: any[];
}

const AdvancedArrayInsightsPanel: React.FC<Props> = ({ array }) => {
  const n = array.length;
  const isNumeric = array.every(x => typeof x === 'number');

  const stats = [
    { label: 'Length', value: n, icon: Hash, color: 'text-primary' },
    { label: 'Uniques', value: new Set(array).size, icon: Database, color: 'text-accent' },
    { label: 'Type', value: typeof array[0] === 'number' ? 'Int/Float' : 'Mixed', icon: Binary, color: 'text-secondary' },
    { label: 'Status', value: n === 0 ? 'Empty' : (array.every((v, i) => i === 0 || v >= array[i-1]) ? 'Sorted' : 'Unsorted'), icon: LayoutGrid, color: 'text-success' },
  ];

  const getNumericalInsight = () => {
    if (!isNumeric || n === 0) return null;
    const sorted = [...array].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[n - 1];
    const avg = array.reduce((a, b) => a + b, 0) / n;
    return { min, max, avg };
  };

  const numerical = getNumericalInsight();

  return (
    <div className="glass-card p-6 md:p-8 rounded-[32px] h-full flex flex-col justify-between border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 rounded-full" />

      <div className="space-y-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-syne flex items-center gap-3 tracking-tight">
              <Activity className="w-5 h-5 text-primary" /> Advanced DNA Analysis
            </h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">Real-time array heuristics</p>
          </div>
          <BarChart3 className="w-5 h-5 text-white/10 group-hover:text-primary/40 transition-colors" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl space-y-2 group/stat hover:bg-white/[0.05] transition-all">
              <div className="flex items-center justify-between">
                <stat.icon className={cn("w-3.5 h-3.5", stat.color)} />
                <div className="w-1 h-1 bg-white/10 rounded-full group-hover/stat:bg-white/40 transition-colors" />
              </div>
              <div>
                <div className="text-[8px] uppercase font-bold text-white/20 tracking-widest">{stat.label}</div>
                <div className="text-base font-bold font-syne truncate">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {numerical && (
        <div className="mt-8 pt-6 border-t border-white/5 grid grid-cols-3 gap-6 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-white/20 tracking-widest">
              <TrendingDown className="w-2.5 h-2.5 text-accent" /> Minimum
            </div>
            <div className="text-lg font-bold font-syne text-accent/80">{numerical.min}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-white/20 tracking-widest">
              <TrendingUp className="w-2.5 h-2.5 text-secondary" /> Maximum
            </div>
            <div className="text-lg font-bold font-syne text-secondary/80">{numerical.max}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-white/20 tracking-widest">
               <ArrowUpRight className="w-2.5 h-2.5 text-success" /> Mean Avg
            </div>
            <div className="text-lg font-bold font-syne text-success/80">{numerical.avg.toFixed(1)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedArrayInsightsPanel;
