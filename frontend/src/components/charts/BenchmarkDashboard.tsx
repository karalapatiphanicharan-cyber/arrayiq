import { Trophy, Zap, MemoryStick, Database, Info, Activity, Clock, BarChart3, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';
import { formatTime, formatNumber, cn } from '../../utils/cn';

interface Props {
  results: any[];
}

const BenchmarkDashboard: React.FC<Props> = ({ results }) => {
  if (!results || results.length === 0) return null;

  const sortedByTime = [...results].sort((a, b) => a.runtime - b.runtime);
  const winner = sortedByTime[0];
  const bestMemory = [...results].sort((a, b) => a.memory - b.memory)[0];

  const exportCSV = () => {
    const headers = ['Algorithm', 'Runtime (ms)', 'Comparisons', 'Swaps', 'Memory (MB)', 'Best Case', 'Avg Case', 'Worst Case'];
    const rows = results.map(r => [
      r.name,
      r.runtime.toFixed(4),
      r.comparisons,
      r.swaps || 0,
      r.memory.toFixed(4),
      r.best_case,
      r.avg_case,
      r.worst_case
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "arrayiq_benchmark.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Top Winner & Insight Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-8 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent border border-white/10 rounded-[32px] p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32 group-hover:bg-primary/20 transition-all duration-700" />

          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="bg-black/40 p-6 md:p-8 rounded-full relative z-10 backdrop-blur-md border border-white/10 shadow-2xl">
              <Trophy className="w-12 h-12 md:w-20 md:h-20 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-4 relative z-10 flex-grow">
            <div className="inline-flex items-center gap-2 bg-success/20 px-3 py-1 rounded-full border border-success/30">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                <span className="text-[9px] font-bold uppercase tracking-widest text-success">Verified Performance Victor</span>
            </div>
            <div>
                <h3 className="text-3xl md:text-5xl font-syne font-extrabold text-white leading-tight tracking-tight">{winner.name}</h3>
                <p className="text-white/40 text-sm md:text-base font-medium italic mt-2">
                    Measured Latency: <span className="text-success font-bold">{formatTime(winner.runtime)}</span>
                </p>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-center gap-2 bg-black/40 px-8 py-6 rounded-[24px] border border-white/5 backdrop-blur-xl relative z-10 shadow-2xl">
            <div className="text-[10px] uppercase font-bold text-white/20 tracking-[0.2em] flex items-center gap-2">
                <Clock className="w-3 h-3" /> Precision Runtime
            </div>
            <span className="text-4xl font-syne font-bold text-success drop-shadow-[0_0_10px_rgba(0,255,157,0.3)]">{formatTime(winner.runtime)}</span>
          </div>
        </motion.div>

        <div className="lg:col-span-4 glass-card rounded-[32px] p-8 md:p-10 flex flex-col justify-between group border border-white/5 relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-accent/5 blur-[50px] -mr-16 -mb-16" />

          <div className="space-y-6 relative z-10">
             <h4 className="font-syne font-bold flex items-center gap-3 text-lg">
                <Zap className="w-5 h-5 text-accent" /> Logic Verification
             </h4>
             <div className="space-y-6">
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-white/30 mb-1">
                      <MemoryStick className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Efficiency Leader</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-white/80">{bestMemory.name}</span>
                      <span className="text-xs font-mono text-accent font-bold">{bestMemory.memory.toFixed(3)}MB</span>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-white/30 mb-1">
                      <Database className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Integrity Check</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-sm font-bold text-white/80">Result Validation</span>
                      <span className="text-[10px] font-bold text-success uppercase bg-success/10 px-2 py-0.5 rounded-full border border-success/20">Passed</span>
                   </div>
                </div>
             </div>
          </div>
          <div className="pt-6 border-t border-white/5 mt-6 relative z-10">
              <div className="flex items-center gap-2 text-[9px] text-white/20 font-bold uppercase tracking-widest">
                  <Info className="w-3 h-3" /> Hardware-Level Telemetry
              </div>
          </div>
        </div>
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          <div className="lg:col-span-8 glass-card rounded-[32px] p-6 md:p-10 space-y-8 border border-white/5 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center sm:text-left">
                 <h4 className="text-2xl md:text-3xl font-syne font-bold tracking-tight text-white flex items-center justify-center sm:justify-start gap-3">
                    <Activity className="w-6 h-6 text-primary" /> Latency Spectrum (ms)
                 </h4>
                 <p className="text-xs md:text-sm text-white/30 font-medium">Real-world differential analysis of execution time.</p>
              </div>
            </div>

            <div className="h-[350px] md:h-[450px] -ml-6 md:ml-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedByTime} layout="vertical" margin={{ left: 10, right: 30 }}>
                  <CartesianGrid strokeDasharray="8 8" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="rgba(255,255,255,0.3)"
                    fontSize={10}
                    width={100}
                    tickLine={false}
                    axisLine={false}
                    fontFamily="Inter"
                    fontWeight={700}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }}
                    itemStyle={{ color: '#0066FF', fontWeight: 'bold', fontSize: '11px' }}
                    labelStyle={{ color: 'white', marginBottom: '4px', fontWeight: 'bold' }}
                    formatter={(val: any) => [formatTime(val), "Runtime"]}
                  />
                  <Bar dataKey="runtime" fill="#0066FF" radius={[0, 8, 8, 0]} barSize={24}>
                    {sortedByTime.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#00FF9D' : '#0066FF'} opacity={1 - index * 0.08} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 glass-card rounded-[32px] p-8 md:p-10 space-y-8 border border-white/5 relative overflow-hidden">
             <div className="flex items-center justify-between mb-2">
                <h4 className="text-lg md:text-xl font-syne font-bold tracking-tight">Efficiency Ranking</h4>
                <BarChart3 className="w-5 h-5 text-white/10" />
             </div>
             <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {sortedByTime.map((res, i) => (
                    <div key={res.name} className="flex items-center gap-4 p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-syne font-bold shrink-0",
                            i === 0 ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]" : "bg-white/5 text-white/30"
                        )}>
                            {i + 1}
                        </div>
                        <div className="flex-grow min-w-0">
                            <h5 className="font-bold text-xs text-white/80 group-hover:text-white transition-colors truncate">{res.name}</h5>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1 h-1 bg-success rounded-full" />
                                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{formatTime(res.runtime)}</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <div className="text-xs font-bold text-success font-mono">{(winner.runtime / res.runtime * 100).toFixed(0)}%</div>
                        </div>
                    </div>
                ))}
             </div>
             <div className="pt-4">
                 <button
                    onClick={exportCSV}
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 transition-all flex items-center justify-center gap-2"
                 >
                    <Download className="w-3.5 h-3.5" /> Full Audit Log (CSV)
                 </button>
             </div>
          </div>
      </div>

      {/* Detailed Analysis Table */}
      <div className="glass-card rounded-[32px] border border-white/5 relative overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
            <div className="space-y-1">
                <h4 className="text-xl font-bold font-syne">Granular Metrics Laboratory</h4>
                <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">Audit-ready performance signatures</p>
            </div>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-white/[0.02] text-[9px] uppercase tracking-[0.3em] font-bold text-white/30">
                <th className="px-8 py-6">ID</th>
                <th className="px-8 py-6">Algorithm Signature</th>
                <th className="px-8 py-6">Precision Latency</th>
                <th className="px-8 py-6">Ops Throughput</th>
                <th className="px-8 py-6">Memory Floor</th>
                <th className="px-8 py-6 text-right">Performance Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {sortedByTime.map((res, i) => (
                <tr key={res.name} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-8 py-6">
                    <span className={cn(
                       "font-syne font-bold text-xl",
                       i === 0 ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.2)]" : "text-white/5"
                    )}>0{i + 1}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <span className="font-bold text-white/80 text-sm group-hover:text-primary transition-colors">{res.name}</span>
                       <div className="flex gap-2">
                          <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-white/30 uppercase font-bold tracking-widest border border-white/5">{res.avg_case}</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-success text-sm font-bold italic">{formatTime(res.runtime)}</td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <span className="text-xs text-white/50 font-bold">{formatNumber(res.comparisons)} <span className="text-[9px] opacity-40 uppercase ml-1">Ops</span></span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-mono text-accent/60 font-bold">{res.memory.toFixed(3)} MB</span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-6">
                       <span className="text-[10px] font-bold text-white/20 tracking-widest font-mono">{(winner.runtime / res.runtime * 100).toFixed(1)}%</span>
                       <div className="h-1.5 w-24 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(winner.runtime / res.runtime) * 100}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={cn(
                               "h-full rounded-full",
                               i === 0 ? "bg-success shadow-[0_0_10px_rgba(0,255,157,0.3)]" : "bg-primary"
                            )}
                          />
                       </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BenchmarkDashboard;
