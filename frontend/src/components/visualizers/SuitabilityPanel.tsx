import { useState } from 'react';
import { CheckCircle2, XCircle, ShieldCheck, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  algorithms: { suitable: { name: string }[]; unsuitable: { name: string; reason: string }[] };
}

const SuitabilityPanel: React.FC<Props> = ({ algorithms }) => {
  const [isUnsuitableExpanded, setIsUnsuitableExpanded] = useState(false);

  return (
    <div className="glass-card p-6 rounded-[24px] space-y-6 h-fit sticky top-24">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold font-syne flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-accent" /> Intelligence Suite
        </h3>
        <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-white/40 font-bold uppercase tracking-widest">
            {algorithms.suitable.length + algorithms.unsuitable.length} Algos
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
             <div className="w-1 h-1 bg-success rounded-full" />
             <h4 className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/30">Verified Compatible</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {algorithms.suitable.length > 0 ? (
                algorithms.suitable.map(a => (
                    <div key={a.name} className="flex items-center gap-2 bg-success/5 border border-success/10 px-3 py-1.5 rounded-xl group">
                        <CheckCircle2 className="w-3 h-3 text-success shrink-0" />
                        <span className="text-[11px] font-bold text-white/60 group-hover:text-success transition-colors">{a.name}</span>
                    </div>
                ))
            ) : (
                <p className="text-[10px] text-white/20 italic">No compatible algorithms found.</p>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-white/5">
          <button
            onClick={() => setIsUnsuitableExpanded(!isUnsuitableExpanded)}
            className="flex items-center justify-between w-full group"
          >
            <div className="flex items-center gap-2">
                <div className="w-1 h-1 bg-red-500 rounded-full" />
                <h4 className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/30 group-hover:text-red-400 transition-colors">Not Recommended</h4>
            </div>
            {isUnsuitableExpanded ? <ChevronUp className="w-3 h-3 text-white/20" /> : <ChevronDown className="w-3 h-3 text-white/20" />}
          </button>

          <AnimatePresence>
            {isUnsuitableExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="grid gap-2 overflow-hidden"
                >
                    {algorithms.unsuitable.length > 0 ? (
                        algorithms.unsuitable.map(a => (
                            <div key={a.name} className="bg-red-500/5 border border-red-500/10 p-3 rounded-xl space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <XCircle className="w-3 h-3 text-red-500" />
                                    <span className="text-[11px] font-bold text-white/50">{a.name}</span>
                                </div>
                                <div className="flex items-start gap-1.5 text-[10px] text-white/30 leading-relaxed font-medium">
                                    <AlertCircle className="w-2.5 h-2.5 shrink-0 mt-0.5 opacity-50 text-red-500/50" />
                                    {a.reason}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-[10px] text-white/20 italic px-2">All analyzed algorithms are compatible.</p>
                    )}
                </motion.div>
            )}
          </AnimatePresence>

          {!isUnsuitableExpanded && algorithms.unsuitable.length > 0 && (
             <div className="flex items-center gap-2 px-2">
                <span className="text-[10px] text-white/20 font-medium">
                    {algorithms.unsuitable.length} algorithms flagged as inefficient.
                </span>
                <button onClick={() => setIsUnsuitableExpanded(true)} className="text-[10px] text-accent font-bold hover:underline">View All</button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuitabilityPanel;
