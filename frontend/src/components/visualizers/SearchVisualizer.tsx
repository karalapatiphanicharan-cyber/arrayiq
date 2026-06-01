import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Target, Box, Clock, ShieldCheck, Activity, Search } from 'lucide-react';
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
      let left = 0, right = arr.length - 1;
      const discarded: number[] = [];
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        steps.push({ type: 'check', index: mid, discarded: [...discarded] });
        if (arr[mid] === target) { steps.push({ type: 'found', index: mid }); return steps; }
        if (arr[mid] < target) {
          for (let i = left; i <= mid; i++) if (!discarded.includes(i)) discarded.push(i);
          left = mid + 1;
        } else {
          for (let i = mid; i <= right; i++) if (!discarded.includes(i)) discarded.push(i);
          right = mid - 1;
        }
      }
      steps.push({ type: 'not_found' });
    } else if (algo === 'jump_search') {
        let n = arr.length, step = Math.floor(Math.sqrt(n)), prev = 0;
        const discarded: number[] = [];
        while (arr[Math.min(step, n) - 1] < target) {
            steps.push({ type: 'check', index: Math.min(step, n) - 1, discarded: [...discarded] });
            for(let i=prev; i<Math.min(step, n); i++) discarded.push(i);
            prev = step; step += Math.floor(Math.sqrt(n));
            if (prev >= n) { steps.push({ type: 'not_found' }); return steps; }
        }
        while (arr[prev] < target) {
            steps.push({ type: 'check', index: prev, discarded: [...discarded] });
            discarded.push(prev); prev++;
            if (prev === Math.min(step, n)) { steps.push({ type: 'not_found' }); return steps; }
        }
        if (arr[prev] === target) steps.push({ type: 'found', index: prev });
        else steps.push({ type: 'not_found' });
    } else if (algo === 'interpolation_search') {
        let low = 0, high = arr.length - 1;
        while (low <= high && target >= arr[low] && target <= arr[high]) {
            let pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]));
            steps.push({ type: 'check', index: pos });
            if (arr[pos] === target) { steps.push({ type: 'found', index: pos }); return steps; }
            if (arr[pos] < target) low = pos + 1;
            else high = pos - 1;
        }
        steps.push({ type: 'not_found' });
    } else if (algo === 'fibonacci_search') {
        let n = arr.length, f2 = 0, f1 = 1, fm = f2 + f1;
        while (fm < n) { f2 = f1; f1 = fm; fm = f2 + f1; }
        let offset = -1;
        while (fm > 1) {
            let i = Math.min(offset + f2, n - 1);
            steps.push({ type: 'check', index: i });
            if (arr[i] < target) { fm = f1; f1 = f2; f2 = fm - f1; offset = i; }
            else if (arr[i] > target) { fm = f2; f1 = f1 - f2; f2 = fm - f1; }
            else { steps.push({ type: 'found', index: i }); return steps; }
        }
        if (f1 && arr[offset + 1] === target) steps.push({ type: 'found', index: offset + 1 });
        else steps.push({ type: 'not_found' });
    } else if (algo === 'exponential_search') {
        let n = arr.length;
        if (arr[0] === target) { steps.push({ type: 'found', index: 0 }); return steps; }
        let i = 1;
        while (i < n && arr[i] <= target) {
            steps.push({ type: 'check', index: i });
            if (arr[i] === target) { steps.push({ type: 'found', index: i }); return steps; }
            i = i * 2;
        }
        let low = i / 2, high = Math.min(i, n - 1);
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            steps.push({ type: 'check', index: mid });
            if (arr[mid] === target) { steps.push({ type: 'found', index: mid }); return steps; }
            if (arr[mid] < target) low = mid + 1;
            else high = mid - 1;
        }
        steps.push({ type: 'not_found' });
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
              complexity: algorithm === 'linear_search' ? 'O(n)' : 'O(log n)'
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
              complexity: algorithm === 'linear_search' ? 'O(n)' : 'O(log n)'
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
        <div className="glass-card p-6 md:p-10 rounded-[32px] space-y-10 border border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-[100px] -mr-32 -mt-32 rounded-full" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
            <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex-grow md:flex-none bg-white/[0.03] px-6 py-4 rounded-2xl flex items-center gap-4 border border-white/5">
                    <Target className="w-5 h-5 text-accent" />
                    <div>
                        <span className="text-[10px] text-white/30 uppercase block font-bold tracking-widest">Active Target</span>
                        <span className="text-2xl font-bold text-accent font-syne">{target}</span>
                    </div>
                </div>
                <div className="flex-grow md:flex-none bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-white/30 uppercase block font-bold tracking-widest">Current Index</span>
                    <span className="text-2xl font-bold text-white font-syne">{currentIndex === -1 ? '—' : currentIndex}</span>
                </div>
            </div>

            <div className="flex items-center gap-6 bg-white/[0.03] p-3 rounded-[28px] border border-white/10 w-full md:w-auto justify-center">
                <button onClick={reset} className="p-4 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white hover:rotate-180">
                    <RotateCcw className="w-6 h-6" />
                </button>
                <button
                    onClick={startVisualizing}
                    className={cn(
                    "p-6 rounded-2xl transition-all scale-110 shadow-2xl",
                    isPlaying ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-accent text-black font-bold shadow-[0_0_40px_rgba(0,217,255,0.3)] hover:scale-125"
                    )}
                >
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                <div className="hidden sm:flex flex-col px-4 gap-2 border-l border-white/10">
                    <span className="text-[9px] text-white/20 uppercase font-extrabold tracking-widest">Scanning Speed</span>
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

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 lg:grid-cols-12 gap-3 overflow-y-auto max-h-[360px] p-4 md:p-8 bg-black/40 rounded-[28px] border border-white/5 relative z-10 custom-scrollbar">
            <AnimatePresence>
                {items.map((item, i) => (
                    <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        "aspect-square flex flex-col items-center justify-center rounded-xl border text-[11px] font-bold transition-all duration-500 relative",
                        item.status === 'default' && "bg-white/[0.03] border-white/5 text-white/20",
                        item.status === 'checking' && "bg-accent border-accent text-black scale-110 z-10 shadow-[0_0_25px_rgba(0,217,255,0.4)]",
                        item.status === 'found' && "bg-success border-success text-black scale-125 shadow-[0_0_40px_rgba(0,255,157,0.6)] z-20",
                        item.status === 'discarded' && "bg-white/[0.01] border-transparent text-white/5 scale-90"
                    )}
                    >
                        <span className="text-[7px] absolute top-1 left-1.5 opacity-40 font-mono">{i}</span>
                        {item.value}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 relative z-10 pt-4 border-t border-white/5">
            <div className="flex flex-wrap justify-center gap-6">
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white/10 rounded-full" /> Initialized</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-accent rounded-full animate-pulse" /> Active Probe</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-success rounded-full shadow-[0_0_10px_rgba(0,255,157,0.4)]" /> Target Matched</div>
                <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white/5 rounded-full opacity-30" /> Pruned Space</div>
            </div>
            <div className="flex items-center gap-2 text-white/40">
                <Search className="w-3 h-3" /> {algorithm.replace('_', ' ')} DNA Scan
            </div>
        </div>
        </div>

        {/* Results Panel */}
        <AnimatePresence>
            {results && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                    <div className={cn(
                        "glass-card p-6 rounded-2xl space-y-2 border-l-4 transition-all",
                        results.found ? "border-l-success hover:bg-success/5" : "border-l-red-500 hover:bg-red-500/5"
                    )}>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Discovery Status</span>
                        <div className="flex items-center gap-2">
                             <ShieldCheck className={cn("w-4 h-4", results.found ? "text-success" : "text-red-500")} />
                             <span className="text-lg md:text-xl font-syne font-bold">{results.found ? 'Match Verified' : 'No Presence'}</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl space-y-2 group hover:bg-accent/5 transition-all">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Location Data</span>
                        <div className="flex items-center gap-2">
                             <Activity className="w-4 h-4 text-accent" />
                             <span className="text-lg md:text-xl font-syne font-bold">{results.found ? `Idx: ${results.index}` : 'NULL'}</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl space-y-2 group hover:bg-primary/5 transition-all">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Scan Latency</span>
                        <div className="flex items-center gap-2">
                             <Clock className="w-4 h-4 text-primary" />
                             <span className="text-lg md:text-xl font-syne font-bold">{formatTime(results.runtime)}</span>
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-2xl space-y-2 group hover:bg-secondary/5 transition-all">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Complexity</span>
                        <div className="flex items-center gap-2">
                             <Box className="w-4 h-4 text-secondary" />
                             <span className="text-lg md:text-xl font-syne font-bold">{results.complexity}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default SearchVisualizer;
