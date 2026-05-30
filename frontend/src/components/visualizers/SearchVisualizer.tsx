import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';
import { cn } from '../../utils/cn';

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

  const timeoutsRef = useRef<any[]>([]);

  useEffect(() => {
    reset();
  }, [array, target]);

  const reset = () => {
    clearTimeouts();
    setItems(array.map(v => ({ value: v, status: 'default' })));
    setIsPlaying(false);
    setCurrentIndex(-1);
    setProgress(0);
  };

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const startVisualizing = () => {
    if (isPlaying) {
      setIsPlaying(false);
      clearTimeouts();
      return;
    }

    setIsPlaying(true);
    let step = progress;

    const run = () => {
      if (step >= array.length) {
        setIsPlaying(false);
        return;
      }

      const newItems = array.map((v, i) => {
        let status: 'default' | 'checking' | 'found' | 'discarded' = 'default';
        if (i === step) status = 'checking';
        if (i < step) status = 'discarded';
        if (v === target && i === step) status = 'found';
        return { value: v, status };
      });

      setItems(newItems as any);
      setCurrentIndex(step);

      if (array[step] === target) {
        setIsPlaying(false);
        return;
      }

      setProgress(step + 1);
      step++;

      const timeout = setTimeout(run, 101 - speed);
      timeoutsRef.current.push(timeout);
    };

    run();
  };

  return (
    <div className="glass-card p-8 rounded-3xl space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/5 px-4 py-2 rounded-xl flex items-center gap-3">
            <Target className="w-4 h-4 text-accent" />
            <div>
              <span className="text-[10px] text-white/40 uppercase block">Target</span>
              <span className="text-xl font-bold text-accent font-syne">{target}</span>
            </div>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-xl">
            <span className="text-[10px] text-white/40 uppercase block mb-1">Index</span>
            <span className="text-xl font-bold text-white font-syne">{currentIndex === -1 ? '—' : currentIndex}</span>
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
              isPlaying ? "bg-red-500/20 text-red-500" : "bg-accent text-black font-bold shadow-[0_0_20px_rgba(0,217,255,0.4)]"
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
              className="w-24 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 overflow-y-auto max-h-80 p-4 bg-black/20 rounded-2xl">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "aspect-square flex items-center justify-center rounded-xl border text-sm font-bold transition-all duration-300",
                item.status === 'default' && "bg-white/5 border-white/10 text-white/60",
                item.status === 'checking' && "bg-accent border-accent text-black scale-110 z-10",
                item.status === 'found' && "bg-success border-success text-black scale-110 shadow-[0_0_20px_rgba(0,255,157,0.4)]",
                item.status === 'discarded' && "bg-white/5 border-transparent text-white/10"
              )}
            >
              {item.value}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold text-white/20">
        <div className="flex gap-4">
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-white/10 rounded-full" /> Pending</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-accent rounded-full" /> Checking</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-success rounded-full" /> Found</div>
        </div>
        <div>{algorithm.replace('_', ' ')} Simulation</div>
      </div>
    </div>
  );
};

export default SearchVisualizer;
