import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Keyboard,
  Trash2,
  Database,
  ChevronDown,
  Sparkles,
  RefreshCcw,
  Binary,
  ArrowUpRight,
  TrendingDown,
  Layers,
  CircleDashed,
  Cpu,
  BrainCircuit,
  Workflow
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props {
  onArrayChange: (arr: number[]) => void;
  initialArray: number[];
}

const ArrayInputModule: React.FC<Props> = ({ onArrayChange, initialArray }) => {
  const [input, setInput] = useState(initialArray.join(', '));
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const handleManualChange = (val: string) => {
    setInput(val);
    const parsed = val.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    onArrayChange(parsed);
    setActivePreset(null);
  };

  const updateArray = (arr: number[], presetName: string) => {
    setInput(arr.join(', '));
    onArrayChange(arr);
    setActivePreset(presetName);
    setIsOptionsOpen(false);
  };

  const generators = {
    random: (size: number, range = 100) => Array.from({ length: size }, () => Math.floor(Math.random() * range)),
    sorted: (size: number) => Array.from({ length: size }, (_, i) => i + 1),
    reverse: (size: number) => Array.from({ length: size }, (_, i) => size - i),
    nearlySorted: (size: number) => {
        const arr = Array.from({ length: size }, (_, i) => i + 1);
        for (let i = 0; i < size / 10; i++) {
            const idx1 = Math.floor(Math.random() * size);
            const idx2 = Math.floor(Math.random() * size);
            [arr[idx1], arr[idx2]] = [arr[idx2], arr[idx1]];
        }
        return arr;
    },
    duplicates: (size: number) => Array.from({ length: size }, () => Math.floor(Math.random() * (size / 5))),
    negatives: (size: number) => Array.from({ length: size }, () => Math.floor(Math.random() * 200) - 100),
    floating: (size: number) => Array.from({ length: size }, () => parseFloat((Math.random() * 100).toFixed(2))),
    powerOfTwo: (size: number) => Array.from({ length: size }, () => Math.pow(2, Math.floor(Math.random() * 10))),
  };

  const presets = [
    { name: 'Random Small', icon: RefreshCcw, gen: () => generators.random(10), color: 'text-primary' },
    { name: 'Random Large', icon: Layers, gen: () => generators.random(100, 1000), color: 'text-secondary' },
    { name: 'Perfectly Sorted', icon: ArrowUpRight, gen: () => generators.sorted(25), color: 'text-success' },
    { name: 'Reverse Order', icon: TrendingDown, gen: () => generators.reverse(25), color: 'text-red-400' },
    { name: 'Nearly Sorted', icon: CircleDashed, gen: () => generators.nearlySorted(40), color: 'text-accent' },
    { name: 'Duplicate Heavy', icon: Database, gen: () => generators.duplicates(50), color: 'text-yellow-400' },
    { name: 'Signed Integers', icon: Binary, gen: () => generators.negatives(20), color: 'text-blue-400' },
    { name: 'Floating Point', icon: Cpu, gen: () => generators.floating(15), color: 'text-purple-400' },
    { name: 'Worst Case Quick', icon: Workflow, gen: () => generators.sorted(100), color: 'text-orange-400' },
    { name: 'Unique Only', icon: BrainCircuit, gen: () => generators.random(30, 500).filter((v, i, a) => a.indexOf(v) === i), color: 'text-cyan-400' },
  ];

  return (
    <div className="glass-card p-6 md:p-8 rounded-[32px] h-full flex flex-col space-y-6 border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-40 h-40 bg-accent/5 blur-[80px] -ml-20 -mt-20 rounded-full" />

      <div className="flex items-center justify-between relative z-10">
        <div className="space-y-1">
          <h3 className="text-xl font-bold font-syne flex items-center gap-3 tracking-tight">
            <Database className="w-5 h-5 text-accent" /> Dataset Factory
          </h3>
          <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">Source material configuration</p>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={() => handleManualChange('')}
                className="p-2.5 hover:bg-red-500/10 rounded-xl text-white/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                title="Purge Dataset"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
      </div>

      <div className="space-y-6 relative z-10 flex-grow">
        <div className="relative group/input">
            <div className="absolute left-4 top-4 text-accent/40 group-focus-within/input:text-accent transition-colors">
                <Keyboard className="w-4 h-4" />
            </div>
            <textarea
                value={input}
                onChange={(e) => handleManualChange(e.target.value)}
                placeholder="Comma separated sequence (e.g. 10, 42, 7)..."
                className="w-full bg-white/[0.02] border border-white/10 rounded-[24px] pl-12 pr-4 py-4 min-h-[140px] text-sm font-medium focus:outline-none focus:border-accent/40 focus:bg-white/[0.04] transition-all resize-none custom-scrollbar leading-relaxed"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                    {input.split(',').filter(x => x.trim()).length} Elements
                </div>
            </div>
        </div>

        <div className="relative">
            <button
                onClick={() => setIsOptionsOpen(!isOptionsOpen)}
                className={cn(
                    "w-full bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 p-4 rounded-2xl flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] transition-all",
                    isOptionsOpen ? "text-accent border-accent/20" : "text-white/40"
                )}
            >
                <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-accent animate-pulse" />
                    {activePreset || 'Load Intelligent Preset'}
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform duration-500", isOptionsOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
                {isOptionsOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="absolute top-full mt-4 left-0 w-full bg-[#0D0D0D] border border-white/10 rounded-[24px] p-2 z-[100] shadow-[0_30px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl grid grid-cols-1 sm:grid-cols-2 gap-1.5"
                    >
                        {presets.map((preset) => (
                            <button
                                key={preset.name}
                                onClick={() => updateArray(preset.gen(), preset.name)}
                                className="group flex items-center justify-between p-3.5 hover:bg-white/[0.03] rounded-xl transition-all border border-transparent hover:border-white/5"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={cn("p-2 rounded-lg bg-white/5 group-hover:scale-110 transition-transform", preset.color)}>
                                        <preset.icon className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 group-hover:text-white transition-colors">{preset.name}</span>
                                </div>
                                <ArrowUpRight className="w-3 h-3 text-white/10 group-hover:text-white/40 transition-colors" />
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ArrayInputModule;
