import { Zap, Activity, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface Recommendation {
  name: string;
  confidence: number;
  reason: string;
  complexity?: string;
  efficiency?: string;
}

interface Props {
  recommendation: Recommendation | null;
  type: 'search' | 'sort';
}

const RecommendationCard: React.FC<Props> = ({ recommendation, type }) => {
  if (!recommendation) return (
    <div className="glass-card p-6 rounded-[24px] h-full flex flex-col items-center justify-center text-center space-y-4 border-dashed border-white/5 opacity-50">
        <Activity className="w-8 h-8 text-white/10" />
        <p className="text-[10px] uppercase font-bold tracking-widest text-white/20">Analyzing dataset...</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-[24px] h-full space-y-5 border-l-4 border-l-primary/30 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 p-8 -mr-4 -mt-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
         {type === 'search' ? <ShieldCheck className="w-24 h-24" /> : <Cpu className="w-24 h-24" />}
      </div>

      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className={cn("w-1.5 h-1.5 rounded-full", type === 'search' ? "bg-accent" : "bg-primary")} />
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                {type === 'search' ? 'Optimal Search' : 'Optimal Sorting'}
            </span>
          </div>
          <h4 className="text-xl font-bold font-syne">{recommendation.name}</h4>
        </div>
        <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
            <Zap className="w-3 h-3 text-success fill-success" />
            <span className="text-[11px] font-bold text-success font-syne">{recommendation.confidence}% Match</span>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        <p className="text-xs text-white/40 leading-relaxed font-medium line-clamp-2 group-hover:line-clamp-none transition-all">
          {recommendation.reason}
        </p>

        <div className="flex items-center gap-4">
            <div className="flex flex-col">
                <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest">Complexity</span>
                <span className="text-[11px] font-bold text-white/60">{recommendation.complexity || "Variable"}</span>
            </div>
            <div className="flex flex-col">
                <span className="text-[8px] uppercase font-bold text-white/20 tracking-widest">Rating</span>
                <span className="text-[11px] font-bold text-white/60">{recommendation.efficiency || "Optimal"}</span>
            </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
