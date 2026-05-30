import { useState } from 'react';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import BenchmarkDashboard from '../../components/charts/BenchmarkDashboard';
import { Play, Download, Settings2 } from 'lucide-react';

const Benchmark = () => {
  const [arraySize, setArraySize] = useState(100);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const runBenchmark = async () => {
    setLoading(true);
    try {
      const array = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 1000));
      const res = await axios.post('http://localhost:8000/api/benchmark/sorting', { array });
      setResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    const data = format === 'json'
      ? JSON.stringify(results, null, 2)
      : 'Name,Runtime,Comparisons,Swaps\n' + results.map(r => `${r.name},${r.runtime},${r.comparisons},${r.swaps}`).join('\n');

    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arrayiq-benchmark.${format}`;
    a.click();
  };

  return (
    <PageWrapper>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-syne font-bold">Algorithm Benchmark</h2>
            <p className="text-white/50 max-w-xl">Stress test multiple algorithms on the same dataset to compare real-world execution times and efficiency.</p>
          </div>

          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10">
            <div className="space-y-1 px-4">
              <span className="text-[10px] uppercase font-bold text-white/30">Array Size</span>
              <input
                type="number"
                value={arraySize}
                onChange={(e) => setArraySize(Number(e.target.value))}
                className="bg-transparent font-syne font-bold text-xl w-20 focus:outline-none"
              />
            </div>
            <button
              onClick={runBenchmark}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? 'Running...' : <><Play className="w-4 h-4 fill-current" /> Run Benchmark</>}
            </button>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="space-y-8">
            <div className="flex justify-end gap-4">
              <button onClick={() => exportData('csv')} className="text-xs font-bold flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                <Download className="w-4 h-4" /> Export CSV
              </button>
              <button onClick={() => exportData('json')} className="text-xs font-bold flex items-center gap-2 text-white/40 hover:text-white transition-colors">
                <Download className="w-4 h-4" /> Export JSON
              </button>
            </div>
            <BenchmarkDashboard results={results} />
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 glass-card rounded-[40px]">
            <div className="bg-white/5 p-8 rounded-full">
              <Settings2 className="w-12 h-12 text-white/20" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-syne font-bold">Ready to Compare?</h3>
              <p className="text-white/40 max-w-sm">Select a dataset size and click run to start the benchmarking process across all supported algorithms.</p>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default Benchmark;
