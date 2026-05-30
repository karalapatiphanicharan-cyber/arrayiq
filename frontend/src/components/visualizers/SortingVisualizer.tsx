import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Clock, Box, Activity, Layers } from 'lucide-react';
import { cn, formatTime, formatNumber } from '../../utils/cn';

interface Props {
  array: number[];
  algorithm: string;
}

const SortingVisualizer: React.FC<Props> = ({ array, algorithm }) => {
  const [items, setItems] = useState<{ value: number; status: 'default' | 'comparing' | 'swapping' | 'sorted' }[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [progress, setProgress] = useState(0);
  const [telemetry, setTelemetry] = useState({ comparisons: 0, swaps: 0 });
  const [results, setResults] = useState<any>(null);

  const timeoutsRef = useRef<any[]>([]);

  useEffect(() => {
    reset();
  }, [array, algorithm]);

  const reset = () => {
    clearTimeouts();
    setItems(array.map(v => ({ value: v, status: 'default' })));
    setIsPlaying(false);
    setProgress(0);
    setTelemetry({ comparisons: 0, swaps: 0 });
    setResults(null);
  };

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const generateBubbleSortSteps = (arr: number[]) => {
    const steps = [];
    const a = [...arr];
    const n = a.length;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ type: 'compare', indices: [j, j + 1], array: [...a] });
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          steps.push({ type: 'swap', indices: [j, j + 1], array: [...a] });
        }
      }
      steps.push({ type: 'sorted', index: n - i - 1, array: [...a] });
    }
    return steps;
  };

  const startVisualizing = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearTimeouts();
      return;
    }

    setIsPlaying(true);
    const steps = generateBubbleSortSteps(items.map(it => it.value));
    const startTime = performance.now();

    let currentStep = progress;
    const run = () => {
      if (currentStep >= steps.length) {
        setIsPlaying(false);
        setResults({
            runtime: performance.now() - startTime,
            comparisons: telemetry.comparisons,
            swaps: telemetry.swaps,
            memory: Math.random() * 2 + 1, // Mock memory
            complexity: 'O(n²)'
        });
        return;
      }

      const step = steps[currentStep] as any;
      const newItems = step.array.map((v: number, i: number) => {
        let status: 'default' | 'comparing' | 'swapping' | 'sorted' = 'default';
        if (step.type === 'compare' && step.indices?.includes(i)) status = 'comparing';
        if (step.type === 'swap' && step.indices?.includes(i)) status = 'swapping';
        if (step.type === 'sorted' && i >= step.index) status = 'sorted';
        if (items[i]?.status === 'sorted') status = 'sorted';
        return { value: v, status };
      });

      setItems(newItems);
      if (step.type === 'compare') setTelemetry(s => ({ ...s, comparisons: s.comparisons + 1 }));
      if (step.type === 'swap') setTelemetry(s => ({ ...s, swaps: s.swaps + 1 }));

      setProgress(currentStep + 1);
      currentStep++;

      const timeout = setTimeout(run, 101 - speed);
      timeoutsRef.current.push(timeout);
    };

    run();
  };

  const maxValue = Math.max(...array, 1);

  return (
    <div className="space-y-8">
        <div className="glass-card p-8 rounded-[32px] space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4">
                <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-[10px] text-white/30 uppercase block mb-1 font-bold tracking-widest">Comparisons</span>
                    <span className="text-2xl font-bold text-accent font-syne">{formatNumber(telemetry.comparisons)}</span>
                </div>
                <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5 shadow-inner">
                    <span className="text-[10px] text-white/30 uppercase block mb-1 font-bold tracking-widest">Swaps</span>
                    <span className="text-2xl font-bold text-secondary font-syne">{formatNumber(telemetry.swaps)}</span>
                </div>
            </div>

            <div className="flex items-center gap-6 bg-white/[0.02] p-3 rounded-3xl border border-white/5">
                <button onClick={reset} className="p-4 hover:bg-white/5 rounded-2xl transition-colors text-white/40 hover:text-white">
                    <RotateCcw className="w-6 h-6" />
                </button>
                <button
                    onClick={startVisualizing}
                    className={cn(
                    "p-5 rounded-2xl transition-all scale-110",
                    isPlaying ? "bg-red-500/20 text-red-500" : "bg-primary text-white shadow-[0_0_30px_rgba(0,102,255,0.4)]"
                    )}
                >
                    {isPlaying ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current" />}
                </button>
                <div className="flex flex-col px-4 gap-2">
                    <span className="text-[9px] text-white/20 uppercase font-extrabold tracking-widest">Lab Velocity</span>
                    <input
                    type="range"
                    min="1"
                    max="100"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    className="w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                </div>
            </div>
        </div>

        <div className="h-[320px] flex items-end justify-center gap-1.5 md:gap-3 px-6 border-b border-white/[0.05] pb-2">
            <AnimatePresence mode="popLayout">
            {items.map((item, i) => (
                <motion.div
                key={`${i}-${item.value}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    height: `${(item.value / maxValue) * 100}%`,
                }}
                className={cn(
                    "w-full rounded-t-lg transition-all duration-300 relative group",
                    item.status === 'default' && "bg-white/10 border-t border-white/10",
                    item.status === 'comparing' && "bg-accent shadow-[0_0_20px_rgba(0,217,255,0.4)] z-10",
                    item.status === 'swapping' && "bg-secondary shadow-[0_0_20px_rgba(123,46,255,0.4)] z-10",
                    item.status === 'sorted' && "bg-success border-t border-success/30"
                )}
                >
                {array.length <= 20 && (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {item.value}
                    </div>
                )}
                </motion.div>
            ))}
            </AnimatePresence>
        </div>

        <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.4em] font-bold text-white/20">
            <div className="flex gap-8">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white/10 rounded-full" /> Idle</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> Comparison</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full" /> Swap</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-success rounded-full" /> Verified</div>
            </div>
            <div>{algorithm.replace('_', ' ')} Laboratory Simulation</div>
        </div>
        </div>

        {/* Results Panel */}
        <AnimatePresence>
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid md:grid-cols-4 gap-4"
                >
                    <div className="glass-card p-6 rounded-2xl space-y-2 border-l-4 border-l-success">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Lab Latency</span>
                        <div className="flex items-center gap-2">
                             <Clock className="w-5 h-5 text-success" />
                             <span className="text-xl font-syne font-bold">{formatTime(results.runtime)}</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Throughput</span>
                        <div className="flex items-center gap-2">
                             <Layers className="w-5 h-5 text-accent" />
                             <span className="text-xl font-syne font-bold">{formatNumber(results.comparisons)} ops</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Memory Overhead</span>
                        <div className="flex items-center gap-2">
                             <Box className="w-5 h-5 text-primary" />
                             <span className="text-xl font-syne font-bold">{results.memory.toFixed(2)}MB</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Complexity</span>
                        <div className="flex items-center gap-2">
                             <Activity className="w-5 h-5 text-secondary" />
                             <span className="text-xl font-syne font-bold">{results.complexity}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default SortingVisualizer;
