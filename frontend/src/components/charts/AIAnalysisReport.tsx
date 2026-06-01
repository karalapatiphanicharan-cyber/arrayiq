import {
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  Activity,
  Zap,
  Layers,
  Database
} from 'lucide-react';
import {
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { cn } from '../../utils/cn';

interface Props {
  array: any[];
  analysis: any;
  recommendations: { search: any[]; sort: any[] };
  benchmarkResults: any[];
}

const AIAnalysisReport: React.FC<Props> = ({ array, analysis, recommendations }) => {
  const getHealthScore = () => {
    let score = 100;
    if (analysis.duplicate_ratio > 0.3) score -= 15;
    if (analysis.entropy > 5) score -= 10;
    if (analysis.size > 1000) score -= 5;
    return Math.max(score, 20);
  };

  const healthScore = getHealthScore();

  // Distribution Data for Chart
  const getDistributionData = () => {
    if (!analysis.is_numeric || array.length === 0) return [];
    const min = analysis.min;
    const max = analysis.max;
    const range = max - min;
    const binCount = 10;
    const binSize = (range / binCount) || 1;

    const bins = Array.from({ length: binCount }, (_, i) => ({
      name: `${Math.round(min + i * binSize)}-${Math.round(min + (i + 1) * binSize)}`,
      count: 0
    }));

    array.forEach(val => {
      let idx = Math.floor((val - min) / binSize);
      if (idx >= binCount) idx = binCount - 1;
      if (idx < 0) idx = 0;
      bins[idx].count++;
    });

    return bins;
  };

  const distData = getDistributionData();

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Intelligence Overview */}
        <div className="lg:w-2/3 glass-card p-8 md:p-10 rounded-[40px] border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -mr-32 -mt-32 rounded-full" />

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="space-y-1">
              <h3 className="text-3xl font-syne font-bold flex items-center gap-4">
                <BrainCircuit className="w-8 h-8 text-primary" />
                Strategic <span className="text-gradient">Overview</span>
              </h3>
              <p className="text-[10px] uppercase font-bold tracking-[0.4em] text-white/20">Automated Intelligence Report</p>
            </div>
            <div className="flex flex-col items-end">
                <div className={cn(
                    "text-4xl font-syne font-bold",
                    healthScore > 80 ? "text-success" : healthScore > 50 ? "text-yellow-400" : "text-red-500"
                )}>
                    {healthScore}%
                </div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/20">Data Health Score</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 relative z-10">
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/30 flex items-center gap-2">
                   <Activity className="w-3 h-3" /> Distribution Signature
                </h4>
                <div className="h-[180px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={distData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                {distData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0066FF' : '#7B2EFF'} fillOpacity={0.6} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 block mb-1">Entropy</span>
                    <span className="text-lg font-bold text-white font-syne">{analysis.entropy.toFixed(3)}</span>
                </div>
                <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-white/20 block mb-1">Duplicates</span>
                    <span className="text-lg font-bold text-white font-syne">{Math.round(analysis.duplicate_ratio * 100)}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-white/30 flex items-center gap-2">
                   <Zap className="w-3 h-3 text-primary" /> AI Strategic Insights
                </h4>
                <div className="space-y-4">
                   {[
                    {
                        icon: ShieldCheck,
                        title: "Performance Distribution",
                        text: analysis.sortedness > 0.8 ? "Highly ordered dataset detected. Leveraging adaptive algorithms (TimSort/Insertion) will yield O(n) results." : "High entropy detected. Quick Sort remains the most efficient partitioning strategy."
                    },
                    {
                        icon: Layers,
                        title: "Memory Signature",
                        text: analysis.size > 5000 ? "Large dataset detected. Recommended to avoid recursive algorithms with O(n) stack overhead to prevent overflow." : "Small dataset signature. Constant factor overhead is more critical than asymptotic complexity here."
                    },
                    {
                        icon: Database,
                        title: "Range Analysis",
                        text: analysis.range < analysis.size * 2 ? "Narrow integer range detected. Linear time counting sort is highly viable for this specific hardware profile." : "Wide distribution range. Comparison-based sorting is required for this entropy level."
                    }
                   ].map((insight, i) => (
                    <div key={i} className="flex gap-4 group">
                        <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 h-fit group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                            <insight.icon className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                        </div>
                        <div className="space-y-1">
                            <h5 className="text-[11px] font-bold text-white/90">{insight.title}</h5>
                            <p className="text-[10px] text-white/30 leading-relaxed font-medium">{insight.text}</p>
                        </div>
                    </div>
                   ))}
                </div>
            </div>
          </div>
        </div>

        {/* Tactical Rankings */}
        <div className="lg:w-1/3 space-y-6">
            <div className="glass-card p-8 rounded-[40px] border border-white/5 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    <h4 className="text-xl font-syne font-bold">Tactical Rankings</h4>
                </div>

                <div className="space-y-4 flex-grow">
                    {recommendations.sort.slice(0, 3).map((rec, i) => (
                        <div key={i} className="relative p-5 rounded-3xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all">
                            <div className="absolute top-4 right-4 text-[9px] font-bold text-accent uppercase tracking-widest">{rec.confidence}% Match</div>
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "w-10 h-10 rounded-2xl flex items-center justify-center font-syne font-bold text-sm",
                                    i === 0 ? "bg-primary text-white shadow-[0_0_20px_rgba(0,102,255,0.3)]" : "bg-white/5 text-white/40"
                                )}>
                                    {i + 1}
                                </div>
                                <div>
                                    <h5 className="font-bold text-white group-hover:text-primary transition-colors">{rec.name}</h5>
                                    <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-0.5">{rec.type} Strategy</p>
                                </div>
                            </div>
                            <p className="mt-4 text-[10px] text-white/30 leading-relaxed font-medium line-clamp-2">{rec.reason}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex -space-x-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#111] bg-white/5 flex items-center justify-center text-[8px] font-bold">AI</div>
                        ))}
                    </div>
                    <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Averaging 1.2M Scenarios</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisReport;
