import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Keyboard,
  RefreshCcw,
  Trash2,
  Database,
  ChevronDown,
  Settings2,
  Sparkles,
  Check
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props {
  onArrayChange: (arr: number[]) => void;
  initialArray: number[];
}

const ArrayInputModule: React.FC<Props> = ({ onArrayChange, initialArray }) => {
  const [input, setInput] = useState(initialArray.join(', '));
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  const handleManualChange = (val: string) => {
    setInput(val);
    const parsed = val.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    onArrayChange(parsed);
  };

  const generateRandom = (size: number, range = 100) => {
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * range));
    updateArray(arr);
  };

  const generateSorted = (size: number) => {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    updateArray(arr);
  };

  const updateArray = (arr: number[]) => {
    setInput(arr.join(', '));
    onArrayChange(arr);
    setIsOptionsOpen(false);
  };

  return (
    <div className="glass-card p-6 md:p-8 rounded-[32px] h-full flex flex-col space-y-6 border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-32 h-32 bg-accent/5 blur-[60px] -ml-16 -mt-16 rounded-full" />

      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-syne flex items-center gap-3 tracking-tight">
            <Database className="w-5 h-5 text-accent" /> Dataset Factory
          </h3>
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">Source material configuration</p>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={() => setInput('')}
                className="p-2 hover:bg-white/5 rounded-lg text-white/20 hover:text-red-400 transition-all"
                title="Clear Data"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="space-y-4 relative z-10 flex-grow">
        <div className="relative group/input">
            <div className="absolute left-4 top-4 text-accent/40 group-focus-within/input:text-accent transition-colors">
                <Keyboard className="w-4 h-4" />
            </div>
            <textarea
                value={input}
                onChange={(e) => handleManualChange(e.target.value)}
                placeholder="Enter numbers separated by commas (e.g. 5, 2, 9)..."
                className="w-full bg-white/[0.03] border border-white/10 rounded-[20px] pl-11 pr-4 py-4 min-h-[120px] text-sm font-medium focus:outline-none focus:border-accent/50 focus:bg-white/[0.05] transition-all resize-none custom-scrollbar"
            />
        </div>

        <div className="relative">
            <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/5 p-3 rounded-xl flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/40 transition-all group/btn"
            >
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    Quick Generate
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isOptionsOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOptionsOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full mb-2 left-0 w-full bg-[#111] border border-white/10 rounded-2xl p-2 z-50 shadow-2xl backdrop-blur-xl grid grid-cols-2 gap-1"
                    >
                        <button onClick={() => generateRandom(10)} className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/60">
                            <RefreshCcw className="w-3 h-3" /> Random 10
                        </button>
                        <button onClick={() => generateRandom(50)} className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/60">
                            <RefreshCcw className="w-3 h-3" /> Random 50
                        </button>
                        <button onClick={() => generateSorted(20)} className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/60">
                            <Check className="w-3 h-3" /> Sorted 20
                        </button>
                        <button onClick={() => generateRandom(100, 1000)} className="flex items-center gap-2 p-3 hover:bg-white/5 rounded-xl text-[10px] font-bold uppercase tracking-widest text-white/60">
                            <Settings2 className="w-3 h-3" /> Large Range
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ArrayInputModule;
