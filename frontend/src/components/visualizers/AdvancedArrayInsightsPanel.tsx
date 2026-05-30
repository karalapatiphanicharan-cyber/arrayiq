import {
  Activity,
  Database,
  BarChart3,
  TrendingUp,
  LayoutGrid,
  Hash,
  Zap,
  Cpu,
  BrainCircuit,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props {
  array: any[];
}

const AdvancedArrayInsightsPanel: React.FC<Props> = ({ array }) => {
  const n = array.length;
  const isNumeric = array.every(x => typeof x === 'number');

  const getStats = () => {
    const uniques = new Set(array).size;
    const isSortedFlag = n > 1 ? array.every((v, i) => i === 0 || v >= array[i-1]) : true;
    const revSorted = n > 1 ? array.every((v, i) => i === 0 || v <= array[i-1]) : true;

    // Heuristic Entropy (simplified)
    const duplicateRatio = n > 0 ? (n - uniques) / n : 0;
    const entropyScore = n > 1 ? Math.min(100, Math.round((uniques / n) * 100)) : 0;

    // Search/Sort Difficulty
    let sortDiff = 0;
    if (isSortedFlag) sortDiff = 5;
    else if (revSorted) sortDiff = 85;
    else sortDiff = Math.min(100, 50 + (duplicateRatio * 50));

    let datasetClass = "Random";
    if (n === 0) datasetClass = "Empty";
    else if (n > 5000) datasetClass = "Large Dataset";
    else if (isSortedFlag) datasetClass = "Sorted";
    else if (revSorted) datasetClass = "Reverse Sorted";
    else if (duplicateRatio > 0.5) datasetClass = "Duplicate Heavy";
    else if (uniques === n) datasetClass = "Unique Only";

    return { uniques, isSortedFlag, revSorted, duplicateRatio, entropyScore, sortDiff, datasetClass };
  };

  const { uniques, duplicateRatio, entropyScore, sortDiff, datasetClass } = getStats();

  const getNumericalMetrics = () => {
    if (!isNumeric || n === 0) return null;
    const sortedArr = [...array].sort((a, b) => a - b);
    const min = sortedArr[0];
    const max = sortedArr[n - 1];
    const sum = array.reduce((a, b) => a + b, 0);
    const avg = sum / n;
    const median = n % 2 === 0 ? (sortedArr[n/2 - 1] + sortedArr[n/2]) / 2 : sortedArr[Math.floor(n/2)];

    // Variance and Std Dev
    const variance = array.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    return { min, max, avg, sum, median, stdDev, range: max - min };
  };

  const num = getNumericalMetrics();

  const primaryStats = [
    { label: 'Dataset Class', value: datasetClass, icon: Cpu, color: 'text-primary' },
    { label: 'Complexity Index', value: `${sortDiff}%`, icon: Zap, color: 'text-accent' },
    { label: 'Uniques', value: uniques, icon: Database, color: 'text-secondary' },
    { label: 'Entropy', value: `${entropyScore}%`, icon: BrainCircuit, color: 'text-success' },
  ];

  return (
    <div className="glass-card p-6 md:p-8 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] -mr-40 -mt-40 rounded-full" />

      <div className="space-y-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-bold font-syne flex items-center gap-3 tracking-tight">
              <Activity className="w-5 h-5 text-primary" /> Array Intelligence Center
            </h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">Advanced Dataset Analytics</p>
          </div>
          <div className="bg-white/5 p-2 rounded-xl border border-white/5">
             <BarChart3 className="w-4 h-4 text-white/40" />
          </div>
        </div>

        {/* Primary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {primaryStats.map((stat, i) => (
            <div key={i} className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl space-y-3 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center justify-between">
                <stat.icon className={cn("w-4 h-4", stat.color)} />
                <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest">Live</span>
              </div>
              <div>
                <div className="text-[9px] uppercase font-bold text-white/30 tracking-tighter mb-1">{stat.label}</div>
                <div className="text-lg font-bold font-syne truncate text-white/90">{stat.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
            {/* Structural Metrics */}
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Structural Heuristics</h4>
                <div className="space-y-3">
                    <MetricRow label="Array Length" value={n} icon={Hash} />
                    <MetricRow label="Duplicate Ratio" value={`${(duplicateRatio * 100).toFixed(1)}%`} icon={LayoutGrid} />
                    <MetricRow label="Memory Footprint" value={`${(n * 8 / 1024).toFixed(2)} KB`} icon={Database} />
                </div>
            </div>

            {/* Numerical Metrics */}
            {num && (
                <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Mathematical DNA</h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
                            <span className="text-[8px] text-white/20 uppercase block mb-1">Median</span>
                            <span className="text-sm font-bold font-syne text-success">{num.median}</span>
                        </div>
                        <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
                            <span className="text-[8px] text-white/20 uppercase block mb-1">Std Deviation</span>
                            <span className="text-sm font-bold font-syne text-accent">{num.stdDev.toFixed(2)}</span>
                        </div>
                        <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
                            <span className="text-[8px] text-white/20 uppercase block mb-1">Summation</span>
                            <span className="text-sm font-bold font-syne text-secondary">{formatNumber(num.sum)}</span>
                        </div>
                        <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
                            <span className="text-[8px] text-white/20 uppercase block mb-1">Range</span>
                            <span className="text-sm font-bold font-syne text-primary">{num.range}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Numerical Summary Bars */}
        {num && (
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-white/20 tracking-widest">
                        <Minimize2 className="w-2.5 h-2.5 text-accent" /> Min
                    </div>
                    <div className="text-xl font-bold font-syne text-accent/80">{num.min}</div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-white/20 tracking-widest">
                        <Maximize2 className="w-2.5 h-2.5 text-secondary" /> Max
                    </div>
                    <div className="text-xl font-bold font-syne text-secondary/80">{num.max}</div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[9px] uppercase font-bold text-white/20 tracking-widest">
                    <TrendingUp className="w-2.5 h-2.5 text-success" /> Avg
                    </div>
                    <div className="text-xl font-bold font-syne text-success/80">{num.avg.toFixed(1)}</div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

const MetricRow = ({ label, value, icon: Icon }: any) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.01] border border-white/5 group-hover:bg-white/[0.02] transition-all">
        <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-white/5">
                <Icon className="w-3 h-3 text-white/30" />
            </div>
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{label}</span>
        </div>
        <span className="text-xs font-bold text-white/80 font-syne">{value}</span>
    </div>
);

const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
};

export default AdvancedArrayInsightsPanel;
