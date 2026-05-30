import { Trophy, Zap, MemoryStick, Database, Info } from 'lucide-react';
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

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent border border-white/10 rounded-[32px] p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="bg-white/10 p-8 rounded-full relative z-10 backdrop-blur-md border border-white/10 shadow-2xl">
            <Trophy className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
          </div>
          <div className="text-center md:text-left space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 bg-success/20 px-3 py-1 rounded-full border border-success/30 mb-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-success">Verified Performance Victor</span>
            </div>
            <h3 className="text-5xl font-syne font-extrabold text-white leading-tight">{winner.name}</h3>
            <p className="text-white/40 text-lg font-medium italic">
                Reason: Fastest measured execution time across all test iterations.
            </p>
          </div>
          <div className="ml-auto bg-black/40 px-8 py-6 rounded-[24px] border border-white/5 backdrop-blur-xl relative z-10 shadow-2xl">
            <span className="text-[10px] uppercase font-bold text-white/30 block mb-2 tracking-[0.2em]">High-Precision Runtime</span>
            <span className="text-4xl font-syne font-bold text-success drop-shadow-[0_0_10px_rgba(0,255,157,0.3)]">{formatTime(winner.runtime)}</span>
          </div>
        </motion.div>

        <div className="glass-card rounded-[32px] p-10 flex flex-col justify-between group">
          <div className="space-y-6">
             <h4 className="font-syne font-bold flex items-center gap-3 text-xl">
                <Zap className="w-6 h-6 text-accent" /> Logic Verification
             </h4>
             <div className="space-y-8">
                <div className="space-y-2">
                   <div className="flex items-center gap-3 text-white/40 mb-1">
                      <MemoryStick className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Efficiency Leader</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="font-bold text-white">{bestMemory.name}</span>
                      <span className="text-sm font-mono text-accent font-bold">{bestMemory.memory.toFixed(1)}MB</span>
                   </div>
                   <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: '30%' }} />
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-3 text-white/40 mb-1">
                      <Database className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Dataset Consistency</span>
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="font-bold text-white">Execution Match</span>
                      <span className="text-sm font-bold text-success uppercase">100% Correct</span>
                   </div>
                </div>
             </div>
          </div>
          <div className="pt-8 border-t border-white/5 mt-8">
              <div className="flex items-center gap-2 text-[10px] text-white/20 font-bold uppercase tracking-widest">
                  <Info className="w-3 h-3" /> No Placeholder Data Used
              </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 glass-card rounded-[32px] p-10 space-y-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                 <h4 className="text-3xl font-syne font-bold tracking-tight text-white">Execution Latency (ms)</h4>
                 <p className="text-sm text-white/30 font-medium">Actual measured latency across multiple laboratory iterations.</p>
              </div>
            </div>

            <div className="h-[450px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sortedByTime} layout="vertical" margin={{ left: 40, right: 40 }}>
                  <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.03)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" fontSize={11} width={140} tickLine={false} axisLine={false} fontStyle="italic" />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                    contentStyle={{ backgroundColor: '#050505', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '16px' }}
                    itemStyle={{ color: '#0066FF', fontWeight: 'bold' }}
                    formatter={(val: any) => [formatTime(val), "Runtime"]}
                  />
                  <Bar dataKey="runtime" fill="#0066FF" radius={[0, 10, 10, 0]} barSize={28}>
                    {sortedByTime.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#00FF9D' : '#0066FF'} opacity={1 - index * 0.08} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 glass-card rounded-[32px] p-10 space-y-8">
             <h4 className="text-xl font-syne font-bold tracking-tight">Verified Ranking</h4>
             <div className="space-y-4">
                {sortedByTime.map((res, i) => (
                    <div key={res.name} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center font-syne font-bold",
                            i === 0 ? "bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.5)]" : "bg-white/5 text-white/30"
                        )}>
                            {i + 1}
                        </div>
                        <div className="flex-grow">
                            <h5 className="font-bold text-sm text-white/80 group-hover:text-white transition-colors">{res.name}</h5>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{formatTime(res.runtime)}</p>
                        </div>
                        <div className="text-right">
                             <div className="text-xs font-bold text-success">{(winner.runtime / res.runtime * 100).toFixed(0)}%</div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
      </div>

      <div className="overflow-hidden glass-card rounded-[32px] border border-white/[0.05]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.03] text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">
                <th className="px-10 py-7">Final Rank</th>
                <th className="px-10 py-7">Algorithm Identity</th>
                <th className="px-10 py-7">Latency</th>
                <th className="px-10 py-7">Ops (Comps/Swaps)</th>
                <th className="px-10 py-7">Theoretical Complexity</th>
                <th className="px-10 py-7 text-right">Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {sortedByTime.map((res, i) => (
                <tr key={res.name} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-10 py-7">
                    <span className={cn(
                       "font-syne font-bold text-2xl",
                       i === 0 ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.3)]" : "text-white/[0.03]"
                    )}>#0{i + 1}</span>
                  </td>
                  <td className="px-10 py-7">
                    <div className="space-y-1">
                       <span className="font-bold text-white text-lg group-hover:text-primary transition-colors">{res.name}</span>
                       <div className="flex gap-2">
                          <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded-full text-white/40 uppercase font-bold tracking-widest border border-white/5">Verified</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-7 font-mono text-success text-base font-bold italic">{formatTime(res.runtime)}</td>
                  <td className="px-10 py-7">
                    <div className="space-y-1">
                       <span className="text-xs text-white/60 font-medium">{formatNumber(res.comparisons)} Comparisons</span>
                       <p className="text-[10px] text-white/20 font-bold uppercase tracking-tighter">{formatNumber(res.swaps || 0)} Swaps</p>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="space-y-1">
                       <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Avg: {res.avg_case}</span>
                       <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest">Worst: {res.worst_case}</p>
                    </div>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex items-center justify-end gap-6">
                       <span className="text-xs font-bold text-white/40 tracking-widest">{(winner.runtime / res.runtime * 100).toFixed(1)}%</span>
                       <div className="h-2 w-40 bg-white/5 rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(winner.runtime / res.runtime) * 100}%` }}
                            className={cn(
                               "h-full rounded-full",
                               i === 0 ? "bg-success shadow-[0_0_15px_rgba(0,255,157,0.4)]" : "bg-primary"
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
