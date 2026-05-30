import { Sparkles, ChevronRight, Zap, Target, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Recommendation {
  name: string;
  confidence: number;
  reason: string;
  type: 'search' | 'sort';
}

interface Props {
  recommendations: Recommendation[];
}

const SmartRecommendationEngine: React.FC<Props> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
                <Brain className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold font-syne tracking-tight">Intelligent Recommendations</h3>
          </div>
          <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20 pl-11">Heuristic Pattern Matching</p>
        </div>

        <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-white/40 uppercase tracking-widest">
                Optimized for Real-world data
            </span>
        </div>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {recommendations.map((rec, i) => (
            <motion.div
              key={`${rec.name}-${rec.type}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.1, type: 'spring', damping: 20 }}
              className="glass-card p-6 md:p-8 rounded-[32px] flex flex-col md:flex-row items-center md:items-start gap-8 border border-white/5 relative overflow-hidden group hover:bg-white/[0.02] transition-colors"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_20px_rgba(0,102,255,0.5)]" />

              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-50 group-hover:scale-100 transition-transform duration-700" />
                <svg className="w-24 h-24 transform -rotate-90 relative z-10">
                  <circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="42"
                    stroke="currentColor"
                    strokeWidth="6"
                    fill="transparent"
                    initial={{ strokeDashoffset: 263.9 }}
                    animate={{ strokeDashoffset: 263.9 * (1 - rec.confidence / 100) }}
                    strokeDasharray={263.9}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                    className="text-primary"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center relative z-20">
                  <span className="text-xl font-bold font-syne text-white">{rec.confidence}%</span>
                  <span className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Confidence</span>
                </div>
              </div>

              <div className="space-y-4 flex-grow relative z-10 text-center md:text-left">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                        {rec.type === 'sort' ? <Zap className="w-3.5 h-3.5 text-accent" /> : <Target className="w-3.5 h-3.5 text-secondary" />}
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
                            Best {rec.type === 'sort' ? 'Sorting' : 'Search'} Strategy
                        </span>
                    </div>
                    <h4 className="text-2xl font-bold font-syne text-white group-hover:text-primary transition-colors">{rec.name}</h4>
                  </div>
                  <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
                    <Sparkles className="w-3 h-3 text-primary" />
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">Optimal Fit</span>
                  </div>
                </div>

                <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-2xl font-medium">
                  {rec.reason}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 group/link cursor-pointer">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover/link:text-white transition-colors">Analytical Depth</span>
                        <ChevronRight className="w-3 h-3 text-white/20 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                    <div className="flex items-center gap-2 group/link cursor-pointer">
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest group-hover/link:text-white transition-colors">Complexity Review</span>
                        <ChevronRight className="w-3 h-3 text-white/20 group-hover/link:translate-x-1 transition-transform" />
                    </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SmartRecommendationEngine;
