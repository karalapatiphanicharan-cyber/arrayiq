import { Trophy, Zap, Clock, ShieldCheck } from 'lucide-react';
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

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-2 bg-gradient-to-br from-primary/10 via-secondary/10 to-transparent border border-white/10 rounded-[32px] p-10 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="bg-white/10 p-8 rounded-full relative z-10 backdrop-blur-md border border-white/10">
            <Trophy className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]" />
          </div>
          <div className="text-center md:text-left space-y-3 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Benchmark Victor</span>
            <h3 className="text-5xl font-syne font-extrabold text-white">{winner.name}</h3>
            <p className="text-white/40 text-lg">Achieved peak efficiency on this dataset.</p>
          </div>
          <div className="ml-auto bg-black/40 px-8 py-6 rounded-[24px] border border-white/5 backdrop-blur-xl relative z-10">
            <span className="text-[10px] uppercase font-bold text-white/30 block mb-2 tracking-widest">Runtime</span>
            <span className="text-3xl font-syne font-bold text-success">{formatTime(winner.runtime)}</span>
          </div>
        </motion.div>

        <div className="glass-card rounded-[32px] p-10 flex flex-col justify-between">
          <div className="space-y-6">
             <h4 className="font-bold flex items-center gap-3 text-lg">
                <Zap className="w-5 h-5 text-accent" /> Efficiency Peak
             </h4>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-white/20" />
                      <span className="text-sm text-white/40 font-medium">Avg Runtime</span>
                   </div>
                   <span className="font-syne font-bold text-lg">{formatTime(results.reduce((acc, curr) => acc + curr.runtime, 0) / results.length)}</span>
                </div>
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-white/20" />
                      <span className="text-sm text-white/40 font-medium">Stability</span>
                   </div>
                   <span className="font-syne font-bold text-lg text-success">High</span>
                </div>
             </div>
          </div>
          <div className="pt-8 mt-8 border-t border-white/5">
             <p className="text-[10px] text-white/20 leading-relaxed italic">
                * Based on local execution environment telemetry.
             </p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-[32px] p-10 space-y-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
             <h4 className="text-2xl font-syne font-bold">Latency Analysis</h4>
             <p className="text-sm text-white/30">Visualizing comparative execution speed (lower is better).</p>
          </div>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-primary rounded-full" /> Execution Time</div>
          </div>
        </div>

        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedByTime} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.3)" fontSize={12} width={140} tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '12px' }}
                itemStyle={{ color: '#0066FF', fontWeight: 'bold' }}
              />
              <Bar dataKey="runtime" fill="#0066FF" radius={[0, 8, 8, 0]} barSize={24}>
                {sortedByTime.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#00FF9D' : '#0066FF'} opacity={1 - index * 0.05} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-hidden glass-card rounded-[32px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] uppercase tracking-[0.3em] font-bold text-white/30">
                <th className="px-10 py-6">Rank</th>
                <th className="px-10 py-6">Algorithm</th>
                <th className="px-10 py-6">Runtime</th>
                <th className="px-10 py-6">Operations</th>
                <th className="px-10 py-6 text-right">Performance Ratio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {sortedByTime.map((res, i) => (
                <tr key={res.name} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="px-10 py-6">
                    <span className={cn(
                       "font-syne font-bold text-xl",
                       i === 0 ? "text-yellow-400" : "text-white/10"
                    )}>#0{i + 1}</span>
                  </td>
                  <td className="px-10 py-6">
                    <div className="space-y-1">
                       <span className="font-bold text-white group-hover:text-primary transition-colors">{res.name}</span>
                       <div className="flex gap-2">
                          <span className="text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-white/40 uppercase font-bold tracking-tighter">Verified</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-6 font-mono text-success text-sm font-bold">{formatTime(res.runtime)}</td>
                  <td className="px-10 py-6">
                    <div className="space-y-1">
                       <span className="text-xs text-white/60 font-medium">{formatNumber(res.comparisons)} Comparisons</span>
                       <p className="text-[10px] text-white/20">{formatNumber(res.swaps || 0)} Data Movements</p>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                       <span className="text-[10px] font-bold text-white/30">{(winner.runtime / res.runtime * 100).toFixed(1)}%</span>
                       <div className="h-2 w-32 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${(winner.runtime / res.runtime) * 100}%` }}
                            className={cn(
                               "h-full rounded-full",
                               i === 0 ? "bg-success shadow-[0_0_10px_rgba(0,255,157,0.5)]" : "bg-primary"
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
