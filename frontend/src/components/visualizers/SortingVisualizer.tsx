import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, RotateCcw, Clock, Box, Activity, Layers,
  SkipForward, Info, Gauge, Terminal, ChevronRight
} from 'lucide-react';
import { cn, formatTime, formatNumber } from '../../utils/cn';

interface Props {
  array: number[];
  algorithm: string;
}

type Status = 'default' | 'comparing' | 'swapping' | 'sorted' | 'pivot' | 'active';

interface VisualItem {
  value: number;
  status: Status;
}

interface Step {
  type: 'compare' | 'swap' | 'pivot' | 'sorted' | 'active' | 'info';
  indices?: number[];
  array: number[];
  message: string;
  line?: number;
  sortedIndices?: number[];
}

const SortingVisualizer: React.FC<Props> = ({ array, algorithm }) => {
  const [items, setItems] = useState<VisualItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [progress, setProgress] = useState(0);
  const [telemetry, setTelemetry] = useState({ comparisons: 0, swaps: 0 });
  const [results, setResults] = useState<any>(null);
  const [currentMessage, setCurrentMessage] = useState('Ready to analyze');
  const [steps, setSteps] = useState<Step[]>([]);
  const [showPseudocode, setShowPseudocode] = useState(true);

  const timeoutsRef = useRef<any[]>([]);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const generatedSteps = generateSteps(array, algorithm);
    setSteps(generatedSteps);
    reset(generatedSteps);
  }, [array, algorithm]);

  const reset = (initialSteps?: Step[]) => {
    clearTimeouts();
    setItems(array.map(v => ({ value: v, status: 'default' })));
    setIsPlaying(false);
    setProgress(0);
    setTelemetry({ comparisons: 0, swaps: 0 });
    setResults(null);
    setCurrentMessage('Ready to analyze');
    if (initialSteps) setSteps(initialSteps);
  };

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const generateSteps = (arr: number[], algo: string): Step[] => {
    const steps: Step[] = [];
    const a = [...arr];
    const n = a.length;
    const sortedIdx: number[] = [];

    const pushStep = (step: Omit<Step, 'array' | 'sortedIndices'>) => {
        if (step.type === 'sorted' && step.indices) {
            step.indices.forEach(idx => {
                if (!sortedIdx.includes(idx)) sortedIdx.push(idx);
            });
        }
        steps.push({
            ...step,
            array: [...a],
            sortedIndices: [...sortedIdx]
        });
    };

    if (algo === 'bubble_sort') {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          pushStep({ type: 'compare', indices: [j, j + 1], line: 2, message: `Comparing ${a[j]} and ${a[j+1]}` });
          if (a[j] > a[j + 1]) {
            [a[j], a[j + 1]] = [a[j + 1], a[j]];
            pushStep({ type: 'swap', indices: [j, j + 1], line: 3, message: `Swapping ${a[j]} and ${a[j+1]}` });
          }
        }
        pushStep({ type: 'sorted', indices: [n - i - 1], line: 0, message: `Element ${a[n-i-1]} is now in position` });
      }
    } else if (algo === 'selection_sort') {
      for (let i = 0; i < n; i++) {
        let minIdx = i;
        pushStep({ type: 'active', indices: [i], line: 1, message: `Pass ${i+1}: min_idx = ${i}` });
        for (let j = i + 1; j < n; j++) {
          pushStep({ type: 'compare', indices: [minIdx, j], line: 3, message: `Comparing min (${a[minIdx]}) with ${a[j]}` });
          if (a[j] < a[minIdx]) {
              minIdx = j;
              pushStep({ type: 'active', indices: [minIdx], line: 4, message: `New minimum: ${a[minIdx]}` });
          }
        }
        if (minIdx !== i) {
          [a[i], a[minIdx]] = [a[minIdx], a[i]];
          pushStep({ type: 'swap', indices: [i, minIdx], line: 5, message: `Swapping ${a[i]} with ${a[minIdx]}` });
        }
        pushStep({ type: 'sorted', indices: [i], line: 0, message: `Index ${i} finalized` });
      }
    } else if (algo === 'insertion_sort') {
      pushStep({ type: 'sorted', indices: [0], line: 0, message: `Initially consider index 0 sorted` });
      for (let i = 1; i < n; i++) {
        let key = a[i];
        let j = i - 1;
        pushStep({ type: 'active', indices: [i], line: 1, message: `Picking up ${key}` });
        while (j >= 0) {
          pushStep({ type: 'compare', indices: [j, j + 1], line: 3, message: `Is ${a[j]} > ${key}?` });
          if (a[j] > key) {
            a[j + 1] = a[j];
            pushStep({ type: 'swap', indices: [j, j + 1], line: 4, message: `Shifting ${a[j]} right` });
            j--;
          } else break;
        }
        a[j + 1] = key;
        pushStep({ type: 'sorted', indices: [i], line: 6, message: `${key} inserted` });
      }
    } else if (algo === 'quick_sort') {
        const quickSort = (l: number, r: number) => {
            if (l >= r) {
                if (l === r) pushStep({ type: 'sorted', indices: [l], line: 0, message: `${a[l]} is sorted` });
                return;
            }
            let pivot = a[r];
            pushStep({ type: 'pivot', indices: [r], line: 0, message: `Pivot: ${pivot}` });
            let i = l - 1;
            for (let j = l; j < r; j++) {
                pushStep({ type: 'compare', indices: [j, r], line: 2, message: `Comparing ${a[j]} with ${pivot}` });
                if (a[j] < pivot) {
                    i++;
                    [a[i], a[j]] = [a[j], a[i]];
                    pushStep({ type: 'swap', indices: [i, j], line: 3, message: `Moving ${a[i]} to left` });
                }
            }
            [a[i+1], a[r]] = [a[r], a[i+1]];
            pushStep({ type: 'swap', indices: [i+1, r], line: 4, message: `Placing pivot` });
            pushStep({ type: 'sorted', indices: [i+1], line: 0, message: `Pivot ${a[i+1]} fixed` });
            quickSort(l, i);
            quickSort(i + 2, r);
        };
        quickSort(0, n - 1);
    } else if (algo === 'merge_sort') {
        const merge = (l: number, m: number, r: number) => {
            let n1 = m - l + 1;
            let n2 = r - m;
            let L = a.slice(l, m + 1);
            let R = a.slice(m + 1, r + 1);
            let i = 0, j = 0, k = l;
            while (i < n1 && j < n2) {
                pushStep({ type: 'compare', indices: [l + i, m + 1 + j], line: 2, message: `Merging: ${L[i]} vs ${R[j]}` });
                if (L[i] <= R[j]) { a[k] = L[i]; i++; }
                else { a[k] = R[j]; j++; }
                pushStep({ type: 'active', indices: [k], line: 3, message: `Placing ${a[k]}` });
                k++;
            }
            while (i < n1) { a[k] = L[i]; i++; k++; pushStep({ type: 'active', indices: [k-1], line: 4, message: `Filling from left` }); }
            while (j < n2) { a[k] = R[j]; j++; k++; pushStep({ type: 'active', indices: [k-1], line: 5, message: `Filling from right` }); }
        };
        const sort = (l: number, r: number) => {
            if (l >= r) return;
            let m = Math.floor((l + r) / 2);
            sort(l, m);
            sort(m + 1, r);
            merge(l, m, r);
        };
        sort(0, n - 1);
        for(let i=0; i<n; i++) pushStep({type: 'sorted', indices: [i], message: 'Sorted'});
    } else if (algo === 'heap_sort') {
        const heapify = (n: number, i: number) => {
            let largest = i;
            let l = 2 * i + 1;
            let r = 2 * i + 2;
            if (l < n) {
                pushStep({ type: 'compare', indices: [largest, l], line: 3, message: 'Heap comparison' });
                if (a[l] > a[largest]) largest = l;
            }
            if (r < n) {
                pushStep({ type: 'compare', indices: [largest, r], line: 4, message: 'Heap comparison' });
                if (a[r] > a[largest]) largest = r;
            }
            if (largest !== i) {
                [a[i], a[largest]] = [a[largest], a[i]];
                pushStep({ type: 'swap', indices: [i, largest], line: 5, message: 'Heaping' });
                heapify(n, largest);
            }
        };
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
        for (let i = n - 1; i > 0; i--) {
            [a[0], a[i]] = [a[i], a[0]];
            pushStep({ type: 'swap', indices: [0, i], line: 2, message: 'Extracting root' });
            pushStep({ type: 'sorted', indices: [i], line: 0, message: 'Locked' });
            heapify(i, 0);
        }
        pushStep({ type: 'sorted', indices: [0], line: 0, message: 'Complete' });
    } else {
        // Handle others
        a.sort((x,y) => x-y);
        for(let i=0; i<n; i++) pushStep({type:'sorted', indices: [i], message: 'Complete'});
    }
    return steps;
  };

  const playNextStep = (currentIdx: number, stepList: Step[]) => {
    if (currentIdx === 0) startTimeRef.current = performance.now();
    if (currentIdx >= stepList.length) {
        setIsPlaying(false);
        setResults({
            runtime: performance.now() - startTimeRef.current,
            comparisons: telemetry.comparisons,
            swaps: telemetry.swaps,
            memory: (array.length * 8) / (1024 * 1024),
            complexity: algorithm.includes('quick') || algorithm.includes('merge') ? 'O(n log n)' : 'O(n²)'
        });
        setCurrentMessage('Analysis Complete');
        return;
    }

    const step = stepList[currentIdx];
    setCurrentMessage(step.message);
    setItems(step.array.map((v, i) => {
        let status: Status = 'default';
        if (step.sortedIndices?.includes(i)) status = 'sorted';
        if (step.indices?.includes(i)) {
            if (step.type === 'compare') status = 'comparing';
            else if (step.type === 'swap') status = 'swapping';
            else if (step.type === 'pivot') status = 'pivot';
            else if (step.type === 'active') status = 'active';
        }
        return { value: v, status };
    }));

    if (step.type === 'compare') setTelemetry(s => ({ ...s, comparisons: s.comparisons + 1 }));
    if (step.type === 'swap') setTelemetry(s => ({ ...s, swaps: s.swaps + 1 }));
    setProgress(currentIdx + 1);

    if (isPlaying) {
        const timeout = setTimeout(() => playNextStep(currentIdx + 1, stepList), 200 * (1 - speed/105));
        timeoutsRef.current.push(timeout);
    }
  };

  const getPseudocode = (algo: string) => {
    if (algo === 'bubble_sort') return ["for i from 0 to n-1:", "  for j from 0 to n-i-1:", "    if arr[j] > arr[j+1]:", "      swap(arr[j], arr[j+1])"];
    if (algo === 'selection_sort') return ["for i from 0 to n-1:", "  min_idx = i", "  for j from i+1 to n:", "    if arr[j] < arr[min_idx]:", "      min_idx = j", "  swap(arr[i], arr[min_idx])"];
    if (algo === 'insertion_sort') return ["for i from 1 to n:", "  key = arr[i], j = i-1", "  while j >= 0 and arr[j] > key:", "    arr[j+1] = arr[j]", "    j = j - 1", "  arr[j+1] = key"];
    return ["Executing algorithm logic...", "Traversing dataset...", "Optimizing memory layout...", "Finalizing state..."];
  };

  return (
    <div className="space-y-6">
        <div className="glass-card p-6 md:p-8 rounded-[32px] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div className="space-y-1">
                    <h3 className="text-xl font-syne font-bold text-white flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" /> Live Execution Visualizer
                    </h3>
                    <p className="text-xs text-white/40 font-medium uppercase tracking-widest">{algorithm.replace('_', ' ')} Laboratory</p>
                </div>
                <div className="flex items-center gap-4 bg-white/[0.03] p-2 rounded-2xl border border-white/5">
                    <div className="px-4 py-2 border-r border-white/10">
                        <span className="text-[9px] text-white/30 uppercase block font-bold">Progress</span>
                        <span className="text-sm font-bold text-white font-syne">{Math.round((progress / (steps.length || 1)) * 100)}%</span>
                    </div>
                    <div className="px-4 py-2">
                        <span className="text-[9px] text-white/30 uppercase block font-bold">Ops</span>
                        <span className="text-sm font-bold text-accent font-syne">{telemetry.comparisons + telemetry.swaps}</span>
                    </div>
                </div>
            </div>

            <motion.div key={currentMessage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="bg-primary/5 border border-primary/10 p-4 rounded-2xl mb-8 flex items-start gap-4">
                <div className="bg-primary/20 p-2 rounded-xl"><Info className="w-4 h-4 text-primary" /></div>
                <p className="text-sm text-white/80 font-medium">{currentMessage}</p>
            </motion.div>

            <div className="grid lg:grid-cols-12 gap-8 items-end mb-12">
                <div className="lg:col-span-8 h-[300px] flex items-end justify-center gap-1 sm:gap-2 px-2 relative">
                    <AnimatePresence mode="popLayout">
                        {items.map((item, i) => (
                            <motion.div key={i} layout initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1, height: `${(item.value / Math.max(...array, 1)) * 100}%` }} className={cn("w-full rounded-t-lg transition-all duration-300 min-w-[4px]", item.status === 'default' && "bg-white/10", item.status === 'comparing' && "bg-accent shadow-[0_0_20px_rgba(0,217,255,0.4)]", item.status === 'swapping' && "bg-secondary shadow-[0_0_20px_rgba(123,46,255,0.4)]", item.status === 'pivot' && "bg-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.4)]", item.status === 'active' && "bg-primary shadow-[0_0_20px_rgba(0,102,255,0.4)]", item.status === 'sorted' && "bg-success shadow-[0_0_15px_rgba(0,255,157,0.2)]")} />
                        ))}
                    </AnimatePresence>
                </div>
                <div className="lg:col-span-4 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/20 flex items-center gap-2"><Terminal className="w-3 h-3" /> Pseudocode</h4>
                        <button onClick={() => setShowPseudocode(!showPseudocode)} className="text-[9px] font-bold text-primary uppercase">{showPseudocode ? 'Hide' : 'Show'}</button>
                    </div>
                    {showPseudocode && (
                        <div className="bg-black/40 border border-white/5 rounded-2xl p-6 font-mono text-[11px] space-y-2 flex-grow overflow-y-auto custom-scrollbar">
                            {getPseudocode(algorithm).map((line, idx) => (
                                <div key={idx} className={cn("flex items-center gap-3 transition-all", steps[progress-1]?.line === idx ? "text-primary translate-x-2" : "text-white/20")}>
                                    <ChevronRight className={cn("w-3 h-3", steps[progress-1]?.line === idx ? "opacity-100" : "opacity-0")} />
                                    <span>{line}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8 pt-6 border-t border-white/5">
                <div className="flex items-center gap-4">
                    <button onClick={() => reset(steps)} className="p-3 hover:bg-white/5 rounded-xl text-white/40"><RotateCcw className="w-5 h-5" /></button>
                    <div className="flex items-center gap-2 bg-white/5 p-1.5 rounded-2xl">
                        <button onClick={() => { setIsPlaying(!isPlaying); if (!isPlaying) playNextStep(progress, steps); else clearTimeouts(); }} className={cn("p-4 rounded-xl", isPlaying ? "bg-red-500/10 text-red-500" : "bg-primary text-white")}>
                            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                        </button>
                        <button onClick={() => { if (progress > 0) { const prev = steps[progress-2]; if (prev) { setItems(prev.array.map(v => ({ value: v, status: 'default' }))); setProgress(progress - 1); } } }} className="p-4 hover:bg-white/10 rounded-xl text-white/60 rotate-180"><SkipForward className="w-6 h-6" /></button>
                        <button onClick={() => { if (progress < steps.length) playNextStep(progress, steps); }} className="p-4 hover:bg-white/10 rounded-xl text-white/60"><SkipForward className="w-6 h-6" /></button>
                    </div>
                </div>
                <div className="flex-grow w-full space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest flex items-center gap-2"><Gauge className="w-3 h-3" /> Animation Speed</span>
                    </div>
                    <input type="range" min="1" max="100" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" />
                </div>
            </div>
        </div>

        {results && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Time Metric', value: formatTime(results.runtime), icon: Clock, color: 'text-success' },
                    { label: 'Comparisons', value: formatNumber(results.comparisons), icon: Layers, color: 'text-accent' },
                    { label: 'Volatility', value: `${results.memory.toFixed(4)}MB`, icon: Box, color: 'text-primary' },
                    { label: 'Complexity', value: results.complexity, icon: Activity, color: 'text-secondary' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-5 rounded-2xl border border-white/5">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">{stat.label}</span>
                        <div className="flex items-center gap-3 mt-2"><stat.icon className={cn("w-4 h-4", stat.color)} /><span className="text-xl font-syne font-bold text-white">{stat.value}</span></div>
                    </div>
                ))}
            </motion.div>
        )}
    </div>
  );
};

export default SortingVisualizer;
