import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props {
  array: number[];
  algorithm: string;
}

const SortingVisualizer: React.FC<Props> = ({ array, algorithm }) => {
  const [items, setItems] = useState<{ value: number; status: 'default' | 'comparing' | 'swapping' | 'sorted' }[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });

  const timeoutsRef = useRef<any[]>([]);

  useEffect(() => {
    reset();
  }, [array]);

  const reset = () => {
    clearTimeouts();
    setItems(array.map(v => ({ value: v, status: 'default' })));
    setIsPlaying(false);
    setProgress(0);
    setStats({ comparisons: 0, swaps: 0 });
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

    let currentStep = progress;
    const run = () => {
      if (currentStep >= steps.length) {
        setIsPlaying(false);
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
      if (step.type === 'compare') setStats(s => ({ ...s, comparisons: s.comparisons + 1 }));
      if (step.type === 'swap') setStats(s => ({ ...s, swaps: s.swaps + 1 }));

      setProgress(currentStep + 1);
      currentStep++;

      const timeout = setTimeout(run, 101 - speed);
      timeoutsRef.current.push(timeout);
    };

    run();
  };

  const maxValue = Math.max(...array, 1);

  return (
    <div className="glass-card p-8 rounded-3xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-4">
          <div className="bg-white/5 px-4 py-2 rounded-xl">
            <span className="text-[10px] text-white/40 uppercase block mb-1">Comparisons</span>
            <span className="text-xl font-bold text-accent font-syne">{stats.comparisons}</span>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-xl">
            <span className="text-[10px] text-white/40 uppercase block mb-1">Swaps</span>
            <span className="text-xl font-bold text-secondary font-syne">{stats.swaps}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/5 p-2 rounded-2xl">
          <button onClick={reset} className="p-3 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button
            onClick={startVisualizing}
            className={cn(
              "p-4 rounded-xl transition-all scale-110",
              isPlaying ? "bg-red-500/20 text-red-500" : "bg-primary text-white shadow-[0_0_20px_rgba(0,102,255,0.4)]"
            )}
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>
          <div className="flex flex-col px-4 gap-1">
            <span className="text-[8px] text-white/30 uppercase font-bold">Speed</span>
            <input
              type="range"
              min="1"
              max="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </div>

      <div className="h-80 flex items-end justify-center gap-1 md:gap-2 px-4 border-b border-white/5">
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
                "w-full rounded-t-sm transition-colors duration-200",
                item.status === 'default' && "bg-white/20",
                item.status === 'comparing' && "bg-accent",
                item.status === 'swapping' && "bg-secondary",
                item.status === 'sorted' && "bg-success"
              )}
            >
              {array.length <= 20 && (
                <div className="text-[10px] text-center -mt-6 font-bold text-white/40">
                  {item.value}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-white/20">
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white/20 rounded-full" /> Idle</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-accent rounded-full" /> Comparing</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-secondary rounded-full" /> Swapping</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-success rounded-full" /> Sorted</div>
        </div>
        <div>{algorithm.replace('_', ' ')} Visualization</div>
      </div>
    </div>
  );
};

export default SortingVisualizer;
