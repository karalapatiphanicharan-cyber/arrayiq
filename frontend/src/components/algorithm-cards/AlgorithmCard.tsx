import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Box, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';

interface AlgorithmCardProps {
  name: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  type: 'sorting' | 'searching' | 'quantum';
  onClick?: () => void;
  active?: boolean;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({
  name,
  description,
  timeComplexity,
  spaceComplexity,
  type,
  onClick,
  active
}) => {
  const colors = {
    sorting: 'group-hover:border-primary/50',
    searching: 'group-hover:border-accent/50',
    quantum: 'group-hover:border-secondary/50'
  };

  const accentColors = {
    sorting: 'text-primary',
    searching: 'text-accent',
    quantum: 'text-secondary'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onClick={onClick}
      className={cn(
        "glass-card p-6 rounded-2xl cursor-pointer group flex flex-col justify-between h-full",
        colors[type],
        active && "border-white/30 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
      )}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h4 className="text-xl font-bold font-syne group-hover:gradient-text transition-all">{name}</h4>
          <div className={cn("p-2 rounded-lg bg-white/5", accentColors[type])}>
            <Zap className="w-4 h-4" />
          </div>
        </div>
        <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-white/30" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{timeComplexity}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Box className="w-3 h-3 text-white/30" />
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider">{spaceComplexity}</span>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-1" />
      </div>
    </motion.div>
  );
};

export default AlgorithmCard;
