import { CheckCircle2, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  algorithms: { suitable: { name: string }[]; unsuitable: { name: string; reason: string }[] };
}

const SuitabilityPanel: React.FC<Props> = ({ algorithms }) => {
  return (
    <div className="glass-card p-8 rounded-[32px] space-y-8 h-full">
      <h3 className="text-xl font-bold font-syne flex items-center gap-3">
        <ShieldCheck className="w-6 h-6 text-accent" /> Lab Suitability
      </h3>

      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 bg-success rounded-full" />
             <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40">Highly Compatible</h4>
          </div>
          <div className="grid gap-2">
            {algorithms.suitable.length > 0 ? (
                algorithms.suitable.map(a => (
                    <div key={a.name} className="flex items-center gap-3 bg-success/5 border border-success/10 p-4 rounded-2xl group hover:bg-success/10 transition-colors">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{a.name}</span>
                    </div>
                ))
            ) : (
                <p className="text-[10px] text-white/20 italic px-2">No algorithms currently verified for this dataset configuration.</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
             <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
             <h4 className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/40">Not Recommended</h4>
          </div>
          <div className="grid gap-2">
            {algorithms.unsuitable.length > 0 ? (
                algorithms.unsuitable.map(a => (
                    <div key={a.name} className="flex items-start gap-4 bg-red-500/5 border border-red-500/10 p-4 rounded-2xl group hover:bg-red-500/10 transition-colors">
                        <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <span className="text-sm font-bold text-white/60 group-hover:text-red-200 transition-colors">{a.name}</span>
                            <div className="flex items-start gap-1 text-[10px] text-white/30 leading-relaxed font-medium">
                                <AlertCircle className="w-3 h-3 shrink-0 mt-0.5 opacity-50" />
                                {a.reason}
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-[10px] text-white/20 italic px-2">All analyzed algorithms are compatible with current constraints.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuitabilityPanel;
