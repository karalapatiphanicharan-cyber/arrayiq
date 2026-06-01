import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Target, Box, Clock, ShieldCheck,
  Activity, Info, Terminal, ChevronRight, SkipForward
} from 'lucide-react';
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
  const [currentMessage, setCurrentMessage] = useState('Initialize scan...');
  const [showPseudocode, setShowPseudocode] = useState(true);
  const [stepsList, setStepsList] = useState<any[]>([]);

  const timeoutsRef = useRef<any[]>([]);

  useEffect(() => {
    const steps = generateSteps(array, target, algorithm);
    setStepsList(steps);
    reset();
  }, [array, target, algorithm]);

  const reset = () => {
    clearTimeouts();
    setItems(array.map(v => ({ value: v, status: 'default' })));
    setIsPlaying(false);
    setCurrentIndex(-1);
    setProgress(0);
    setResults(null);
    setCurrentMessage('Initialize scan...');
  };

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const generateSteps = (arr: any[], target: any, algo: string) => {
    const steps: any[] = [];
    if (algo === 'linear_search') {
      for (let i = 0; i < arr.length; i++) {
        steps.push({
            type: 'check', index: i, line: 1, message: `Checking index ${i}: ${arr[i]}`,
            discarded: Array.from({length: i}, (_, k) => k)
        });
        if (arr[i] === target) {
          steps.push({ type: 'found', index: i, line: 2, message: `Target found at index ${i}!` });
          return steps;
        }
      }
      steps.push({ type: 'not_found', line: 3, message: 'Target not found in array.' });
    } else if (algo === 'binary_search') {
      let left = 0, right = arr.length - 1;
      const discarded: number[] = [];
      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        steps.push({ type: 'check', index: mid, line: 1, message: `Checking midpoint ${mid}: ${arr[mid]}`, discarded: [...discarded] });
        if (arr[mid] === target) {
            steps.push({ type: 'found', index: mid, line: 2, message: `Target identified at index ${mid}!` });
            return steps;
        }
        if (arr[mid] < target) {
          steps.push({ type: 'check', index: mid, line: 3, message: `${arr[mid]} < ${target}. Ignoring left half.`, discarded: [...discarded] });
          for (let i = left; i <= mid; i++) if (!discarded.includes(i)) discarded.push(i);
          left = mid + 1;
        } else {
          steps.push({ type: 'check', index: mid, line: 4, message: `${arr[mid]} > ${target}. Ignoring right half.`, discarded: [...discarded] });
          for (let i = mid; i <= right; i++) if (!discarded.includes(i)) discarded.push(i);
          right = mid - 1;
        }
      }
      steps.push({ type: 'not_found', line: 5, message: 'Target not present in sorted range.' });
    } else if (algo === 'jump_search') {
        let n = arr.length, step = Math.floor(Math.sqrt(n)), prev = 0;
        const discarded: number[] = [];
        while (arr[Math.min(step, n) - 1] < target) {
            steps.push({ type: 'check', index: Math.min(step, n) - 1, message: 'Jumping to next block...', discarded: [...discarded] });
            for(let i=prev; i<Math.min(step, n); i++) discarded.push(i);
            prev = step; step += Math.floor(Math.sqrt(n));
            if (prev >= n) { steps.push({ type: 'not_found', message: 'Jumped past end of array.' }); return steps; }
        }
        while (arr[prev] < target) {
            steps.push({ type: 'check', index: prev, message: 'Linear scan within block...', discarded: [...discarded] });
            discarded.push(prev); prev++;
            if (prev === Math.min(step, n)) { steps.push({ type: 'not_found' }); return steps; }
        }
        if (arr[prev] === target) steps.push({ type: 'found', index: prev, message: 'Found in block!' });
        else steps.push({ type: 'not_found' });
    } else {
        // Fallback
        const idx = arr.indexOf(target);
        if (idx !== -1) steps.push({ type: 'found', index: idx, message: 'Element located via optimized scan.' });
        else steps.push({ type: 'not_found', message: 'Element not present in dataset.' });
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
    playStep(progress);
  };

  const playStep = (currentStep: number) => {
    if (currentStep >= stepsList.length) {
      setIsPlaying(false);
      return;
    }

    const step = stepsList[currentStep];
    const startTime = performance.now();

    setCurrentMessage(step.message || '');

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

    if (isPlaying) {
      const timeout = setTimeout(() => playStep(currentStep + 1), 101 - speed);
      timeoutsRef.current.push(timeout);
    }
  };

  const getPseudocode = (algo: string) => {
    if (algo === 'linear_search') return ["for i from 0 to n-1:", "  if arr[i] == target:", "    return i", "return -1"];
    if (algo === 'binary_search') return ["while low <= high:", "  mid = (low + high) / 2", "  if arr[mid] == target: return mid", "  if arr[mid] < target: low = mid + 1", "  else: high = mid - 1", "return -1"];
    return ["Initializing scan logic...", "Traversing dataset signature...", "Filtering search space...", "Finalizing results..."];
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
                        <span className="text-[10px] text-white/30 uppercase block font-bold tracking-widest">Target</span>
                        <span className="text-2xl font-bold text-accent font-syne">{target}</span>
                    </div>
                </div>
                <div className="flex-grow md:flex-none bg-white/[0.03] px-6 py-4 rounded-2xl border border-white/5">
                    <span className="text-[10px] text-white/30 uppercase block font-bold tracking-widest">Index</span>
                    <span className="text-2xl font-bold text-white font-syne">{currentIndex === -1 ? '—' : currentIndex}</span>
                </div>
            </div>

            <div className="flex items-center gap-6 bg-white/[0.03] p-3 rounded-[28px] border border-white/10 w-full md:w-auto justify-center">
                <button onClick={reset} className="p-4 hover:bg-white/5 rounded-2xl transition-all text-white/20 hover:text-white hover:rotate-180"><RotateCcw className="w-6 h-6" /></button>
                <button onClick={startVisualizing} className={cn("p-6 rounded-2xl transition-all scale-110", isPlaying ? "bg-red-500/10 text-red-500" : "bg-accent text-black font-bold shadow-lg shadow-accent/20")}>
                    {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                </button>
                <div className="flex items-center gap-2 bg-black/20 p-2 rounded-xl">
                    <button onClick={() => { setIsPlaying(false); if (progress > 1) { const prev = stepsList[progress-2]; setItems(array.map((v, i) => ({ value: v, status: i === prev.index ? 'checking' : (prev.discarded?.includes(i) ? 'discarded' : 'default') })) as any); setProgress(progress - 1); } }} className="p-3 hover:bg-white/10 rounded-lg text-white/60 rotate-180"><SkipForward className="w-5 h-5" /></button>
                    <button onClick={() => { setIsPlaying(false); playStep(progress); }} className="p-3 hover:bg-white/10 rounded-lg text-white/60"><SkipForward className="w-5 h-5" /></button>
                </div>
                <div className="hidden sm:flex flex-col px-4 gap-2 border-l border-white/10">
                    <span className="text-[9px] text-white/20 uppercase font-extrabold tracking-widest text-center">Scan Speed</span>
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

        <motion.div key={currentMessage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-accent/5 border border-accent/10 p-4 rounded-2xl flex items-center gap-4">
            <Info className="w-4 h-4 text-accent" />
            <p className="text-sm text-white/80 font-medium">{currentMessage}</p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-10 gap-3 overflow-y-auto max-h-[400px] p-4 md:p-8 bg-black/40 rounded-[28px] border border-white/5 custom-scrollbar">
                <AnimatePresence>
                    {items.map((item, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className={cn("aspect-square flex flex-col items-center justify-center rounded-xl border text-[11px] font-bold transition-all duration-300 relative", item.status === 'default' && "bg-white/[0.03] border-white/5 text-white/20", item.status === 'checking' && "bg-accent border-accent text-black scale-110 shadow-[0_0_20px_rgba(0,217,255,0.4)]", item.status === 'found' && "bg-success border-success text-black scale-125 shadow-[0_0_30px_rgba(0,255,157,0.5)]", item.status === 'discarded' && "bg-white/[0.01] border-transparent text-white/5 scale-90")}>
                            <span className="text-[7px] absolute top-1 left-1.5 opacity-40 font-mono">{i}</span>
                            {item.value}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <div className="lg:col-span-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2"><Terminal className="w-3 h-3" /> Search Logic</h4>
                    <button onClick={() => setShowPseudocode(!showPseudocode)} className="text-[9px] font-bold text-accent uppercase">{showPseudocode ? 'Hide' : 'Show'}</button>
                </div>
                {showPseudocode && (
                    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-[11px] space-y-2 flex-grow overflow-y-auto custom-scrollbar">
                        {getPseudocode(algorithm).map((line, idx) => (
                            <div key={idx} className={cn("flex items-center gap-3 transition-all", stepsList[progress-1]?.line === idx ? "text-accent translate-x-2" : "text-white/20")}>
                                <ChevronRight className={cn("w-3 h-3", stepsList[progress-1]?.line === idx ? "opacity-100" : "opacity-0")} />
                                <span>{line}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] font-bold text-white/20 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-accent rounded-full animate-pulse" /> Active Probe</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-success rounded-full" /> Match Found</div>
            <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white/5 rounded-full" /> Pruned Space</div>
        </div>
        </div>

        {results && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={cn("glass-card p-6 rounded-2xl border-l-4 transition-all", results.found ? "border-l-success" : "border-l-red-500")}>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Status</span>
                    <div className="flex items-center gap-2 mt-2"><ShieldCheck className={cn("w-4 h-4", results.found ? "text-success" : "text-red-500")} /><span className="text-xl font-syne font-bold">{results.found ? 'Found' : 'Null'}</span></div>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Time</span>
                    <div className="flex items-center gap-2 mt-2"><Clock className="w-4 h-4 text-primary" /><span className="text-xl font-syne font-bold">{formatTime(results.runtime)}</span></div>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Ops</span>
                    <div className="flex items-center gap-2 mt-2"><Activity className="w-4 h-4 text-accent" /><span className="text-xl font-syne font-bold">{results.comparisons}</span></div>
                </div>
                <div className="glass-card p-6 rounded-2xl border border-white/5">
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Complexity</span>
                    <div className="flex items-center gap-2 mt-2"><Box className="w-4 h-4 text-secondary" /><span className="text-xl font-syne font-bold">{results.complexity}</span></div>
                </div>
            </motion.div>
        )}
    </div>
  );
};

export default SearchVisualizer;
