import { Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface Recommendation {
  name: string;
  confidence: number;
  reason: string;
}

interface Props {
  recommendation: Recommendation | null;
  type: 'search' | 'sort';
}

const RecommendationCard: React.FC<Props> = ({ recommendation, type }) => {
  if (!recommendation) return (
    <div className="glass-card p-8 rounded-[32px] h-full flex flex-col items-center justify-center text-center opacity-40">
        <Sparkles className="w-8 h-8 mb-4" />
        <p className="text-sm font-bold uppercase tracking-widest">Awaiting Analysis</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "glass-card p-8 rounded-[32px] h-full relative overflow-hidden group border-l-4",
        type === 'search' ? "border-l-accent glow-accent/20" : "border-l-primary glow-primary/20"
      )}
    >
      <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
        <Sparkles className={cn("w-20 h-20", type === 'search' ? "text-accent" : "text-primary")} />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 block mb-1">
                Recommended {type === 'search' ? 'Search' : 'Sorting'}
            </span>
            <h3 className={cn("text-3xl font-syne font-extrabold", type === 'search' ? "text-accent" : "text-primary")}>
                {recommendation.name}
            </h3>
          </div>

          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/5" />
                <circle
                  cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 * (1 - recommendation.confidence / 100)}
                  className={type === 'search' ? "text-accent" : "text-primary"}
                />
            </svg>
            <span className="absolute text-xs font-bold font-syne">{recommendation.confidence}%</span>
          </div>
        </div>

        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
            {recommendation.reason}
        </p>

        <div className="pt-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors cursor-pointer">
            View Technical reasoning <ChevronRight className="w-3 h-3" />
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
