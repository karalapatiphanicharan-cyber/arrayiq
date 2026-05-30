import React from 'react';
import { motion } from 'framer-motion';
import { Info, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { cn } from '../../utils/cn';

interface Props {
  name: string;
  description: string;
  pros: string[];
  cons: string[];
  bestUseCases: string;
  complexity: {
    best: string;
    avg: string;
    worst: string;
    space: string;
  };
}

const EducationalSection: React.FC<Props> = ({
  name,
  description,
  pros,
  cons,
  bestUseCases,
  complexity
}) => {
  return (
    <div className="space-y-12 py-12 border-t border-white/5 mt-12">
      <div className="grid lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-3xl font-syne font-bold">Understanding {name}</h3>
            <p className="text-lg text-white/60 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-success/5 border border-success/10 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-success font-bold text-sm uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Advantages
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                {pros.map((pro, i) => <li key={i} className="flex items-start gap-2"><span>•</span> {pro}</li>)}
              </ul>
            </div>
            <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" /> Disadvantages
              </div>
              <ul className="space-y-2 text-sm text-white/70">
                {cons.map((con, i) => <li key={i} className="flex items-start gap-2"><span>•</span> {con}</li>)}
              </ul>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 p-6 rounded-2xl flex gap-4">
            <div className="bg-primary/20 p-3 rounded-xl h-fit">
              <Lightbulb className="w-6 h-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-primary">Best Use Cases</h4>
              <p className="text-sm text-white/70 leading-relaxed">
                {bestUseCases}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h4 className="text-xl font-bold font-syne flex items-center gap-2">
            <Info className="w-5 h-5 text-accent" /> Complexity Analysis
          </h4>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Best Case', value: complexity.best, color: 'text-success' },
              { label: 'Average Case', value: complexity.avg, color: 'text-accent' },
              { label: 'Worst Case', value: complexity.worst, color: 'text-red-400' },
              { label: 'Space Complexity', value: complexity.space, color: 'text-primary' },
            ].map((item, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl text-center space-y-2">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.label}</p>
                <p className={cn("text-2xl font-syne font-bold", item.color)}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="glass-card p-8 rounded-2xl">
            <div className="h-40 flex items-end justify-between gap-2 px-4">
              {[0.2, 0.4, 0.7, 0.3, 0.6, 0.9, 0.5].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h * 100}%` }}
                  className="w-full bg-gradient-to-t from-accent/20 to-accent rounded-t-sm"
                />
              ))}
            </div>
            <p className="text-center text-xs text-white/30 mt-6 italic">Relative performance growth visualized</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationalSection;
