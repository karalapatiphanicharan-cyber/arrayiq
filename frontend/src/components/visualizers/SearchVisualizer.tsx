import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Target, Box, Clock, ShieldCheck, Activity } from 'lucide-react';
import { cn, formatTime } from '../../utils/cn';

interface Props {
  array: any[];
  target: any;
  algorithm: string;
}

const SearchVisualizer: React.FC<Props> = ({ array, target, algorithm }) => {
  const [items, setItems] = useState<{ value: any; status: 'default' | 'checking' | 'found' | 'discarded' }[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [speed, setSpeed] = useState(50);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);

  const timeoutsRef = useRef<any[]>([]);

  useEffect(() => {
    reset();
  }, [array, target, algorithm]);

  const reset = () => {
    clearTimeouts();
    setItems(array.map(v => ({ value: v, status: 'default' })));
    setIsPlaying(false);
    setCurrentIndex(-1);
    setProgress(0);
    setResults(null);
  };

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const generateSteps = (arr: any[], target: any, algo: string) => {
    const steps: any[] = [];
    if (algo === 'linear_search') {
      for (let i = 0; i < arr.length; i++) {
        steps.push({ type: 'check', index: i, discarded: Array.from({length: i}, (_, k) => k) });
        if (arr[i] === target) {
          steps.push({ type: 'found', index: i });
          return steps;
        }
      }
      steps.push({ type: 'not_found' });
    } else if (algo === 'binary_search') {
      let left = 0;
      let right = arr.length - 1;
      const discarded: number[] = [];
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        steps.push({ type: 'check', index: mid, discarded: [...discarded] });
        if (arr[mid] === target) {
          steps.push({ type: 'found', index: mid });
          return steps;
        }
        if (arr[mid] < target) {
          for (let i = left; i <= mid; i++) if (!discarded.includes(i)) discarded.push(i);
          left = mid + 1;
        } else {
          for (let i = mid; i <= right; i++) if (!discarded.includes(i)) discarded.push(i);
          right = mid - 1;
        }
      }
      steps.push({ type: 'not_found' });
    } else {
        return generateSteps(arr, target, 'linear_search');
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
    const steps = generateSteps(array, target, algorithm);
    const startTime = performance.now();

    let currentStep = progress;
    const run = () => {
      if (currentStep >= steps.length) {
        setIsPlaying(false);
        return;
      }

      const step = steps[currentStep];

      if (step.type === 'not_found') {
          setIsPlaying(false);
          setResults({
              found: false,
              runtime: performance.now() - startTime,
              comparisons: currentStep,
              complexity: 'O(log n)'
          });
          return;
      }

      if (step.type === 'found') {
          setItems(prev => prev.map((it, i) => i === step.index ? { ...it, status: 'found' } : it));
          setIsPlaying(false);
          setResults({
              found: true,
              index: step.index,
              value: array[step.index],
              runtime: performance.now() - startTime,
              comparisons: currentStep,
              complexity: algorithm === 'binary_search' ? 'O(log n)' : 'O(n)'
          });
          return;
      }

      const newItems = array.map((v, i) => {
        let status: 'default' | 'checking' | 'found' | 'discarded' = 'default';
        if (i === step.index) status = 'checking';
        if (step.discarded?.includes(i)) status = 'discarded';
        return { value: v, status };
      });

      setItems(newItems as any);
      setCurrentIndex(step.index);

      setProgress(currentStep + 1);
      currentStep++;

      const timeout = setTimeout(run, 101 - speed);
      timeoutsRef.current.push(timeout);
    };

    run();
  };

  return (
    <div className="space-y-8">
        <div className="glass-card p-8 rounded-[32px] space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
            <div className="bg-white/5 px-6 py-3 rounded-2xl flex items-center gap-4 border border-white/5">
                <Target className="w-5 h-5 text-accent" />
                <div>
                <span className="text-[10px] text-white/30 uppercase block font-bold tracking-widest">Active Target</span>
                <span className="text-2xl font-bold text-accent font-syne">{target}</span>
                </div>
            </div>
            <div className="bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                <span className="text-[10px] text-white/30 uppercase block font-bold tracking-widest">Scanning Index</span>
                <span className="text-2xl font-bold text-white font-syne">{currentIndex === -1 ? '—' : currentIndex}</span>
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
                isPlaying ? "bg-red-500/20 text-red-500" : "bg-accent text-black font-bold shadow-[0_0_30px_rgba(0,217,255,0.4)]"
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
                className="w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
                />
            </div>
            </div>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-12 gap-3 overflow-y-auto max-h-[360px] p-6 bg-black/40 rounded-[24px] border border-white/5">
            <AnimatePresence>
            {items.map((item, i) => (
                <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={cn(
                    "aspect-square flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-500",
                    item.status === 'default' && "bg-white/[0.03] border-white/5 text-white/40",
                    item.status === 'checking' && "bg-accent border-accent text-black scale-110 z-10 shadow-[0_0_20px_rgba(0,217,255,0.3)]",
                    item.status === 'found' && "bg-success border-success text-black scale-125 shadow-[0_0_30px_rgba(0,255,157,0.5)] z-20",
                    item.status === 'discarded' && "bg-white/[0.01] border-transparent text-white/5"
                )}
                >
                {item.value}
                </motion.div>
            ))}
            </AnimatePresence>
        </div>

        <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.3em] font-bold text-white/20">
            <div className="flex gap-6">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-white/10 rounded-full" /> Pending</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /> Scanning</div>
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-success rounded-full" /> Match</div>
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
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Status</span>
                        <div className="flex items-center gap-2">
                             <ShieldCheck className={cn("w-5 h-5", results.found ? "text-success" : "text-red-500")} />
                             <span className="text-xl font-syne font-bold">{results.found ? 'Found' : 'Not Found'}</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Index / Value</span>
                        <div className="flex items-center gap-2">
                             <Activity className="w-5 h-5 text-accent" />
                             <span className="text-xl font-syne font-bold">{results.found ? `${results.index} / ${results.value}` : '—'}</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Lab Latency</span>
                        <div className="flex items-center gap-2">
                             <Clock className="w-5 h-5 text-primary" />
                             <span className="text-xl font-syne font-bold">{formatTime(results.runtime)}</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl space-y-2">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Complexity</span>
                        <div className="flex items-center gap-2">
                             <Box className="w-5 h-5 text-secondary" />
                             <span className="text-xl font-syne font-bold">{results.complexity}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default SearchVisualizer;
