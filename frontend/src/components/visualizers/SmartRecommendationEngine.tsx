import { Sparkles, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface Recommendation {
  name: string;
  confidence: number;
  reason: string;
}

interface Props {
  recommendations: Recommendation[];
}

const SmartRecommendationEngine: React.FC<Props> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-primary" />
        <h3 className="text-xl font-bold font-syne">AI Recommendations</h3>
      </div>

      <div className="grid gap-4">
        {recommendations.map((rec, i) => (
          <motion.div
            key={rec.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 rounded-2xl flex items-start gap-6 border-l-4 border-l-primary"
          >
            <div className="relative">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={175.9}
                  strokeDashoffset={175.9 * (1 - rec.confidence / 100)}
                  className="text-primary"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-syne">
                {rec.confidence}%
              </span>
            </div>

            <div className="space-y-2 flex-grow">
              <div className="flex justify-between items-start">
                <h4 className="text-lg font-bold font-syne text-primary">{rec.name}</h4>
                <div className="bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-1 rounded">Recommended</div>
              </div>
              <p className="text-sm text-white/60 leading-relaxed max-w-xl">
                {rec.reason}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <button className="text-xs font-bold flex items-center gap-1 text-white hover:text-primary transition-colors">
                  Learn Why <ChevronRight className="w-3 h-3" />
                </button>
                <button className="text-xs font-bold flex items-center gap-1 text-white hover:text-primary transition-colors">
                  Apply & Run <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SmartRecommendationEngine;
