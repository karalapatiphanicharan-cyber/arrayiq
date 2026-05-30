import { useMemo } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Activity, PieChart } from 'lucide-react';

interface Props {
  array: any[];
}

const AdvancedArrayInsightsPanel: React.FC<Props> = ({ array }) => {
  const stats = useMemo(() => {
    if (!array || array.length === 0) return null;
    const numeric = array.filter(x => typeof x === 'number') as number[];
    const n = array.length;

    const frequencies = array.reduce((acc: any, val) => {
      const key = String(val);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(frequencies).map(([name, value]) => ({
      name,
      value: value as number
    })).sort((a, b) => Number(a.name) - Number(b.name));

    if (numeric.length === 0) return { n, frequencies, chartData };

    const sum = numeric.reduce((a, b) => a + b, 0);
    const sorted = [...numeric].sort((a, b) => a - b);

    return {
      n,
      min: Math.min(...numeric),
      max: Math.max(...numeric),
      sum,
      avg: (sum / numeric.length).toFixed(2),
      median: n % 2 === 0 ? (sorted[n/2 - 1] + sorted[n/2]) / 2 : sorted[Math.floor(n/2)],
      duplicates: n - new Set(array).size,
      chartData
    };
  }, [array]);

  if (!stats) return null;

  return (
    <div className="glass-card p-8 rounded-3xl h-full space-y-8">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold font-syne flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" /> Array Insights
        </h3>
        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-md uppercase font-bold tracking-wider">Live</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Size', value: stats.n },
          { label: 'Min', value: stats.min ?? 'N/A' },
          { label: 'Max', value: stats.max ?? 'N/A' },
          { label: 'Avg', value: stats.avg ?? 'N/A' },
          { label: 'Median', value: (stats as any).median ?? 'N/A' },
          { label: 'Sum', value: (stats as any).sum ?? 'N/A' },
          { label: 'Duplicates', value: (stats as any).duplicates },
          { label: 'Distinct', value: stats.n - ((stats as any).duplicates || 0) },
        ].map((item, i) => (
          <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
            <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mb-1">{item.label}</p>
            <p className="text-xl font-syne font-bold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
          <PieChart className="w-4 h-4" /> Frequency Distribution
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.chartData}>
              <XAxis dataKey="name" hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#00D9FF' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {stats.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`rgba(0, 217, 255, ${Math.max(0.2, (entry.value as number) / Math.max(...stats.chartData.map(d => d.value as number)))})`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdvancedArrayInsightsPanel;
