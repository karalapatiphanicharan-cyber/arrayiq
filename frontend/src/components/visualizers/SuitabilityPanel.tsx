import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface Props {
  algorithms: { name: string; suitable: boolean; reason?: string }[];
}

const SuitabilityPanel: React.FC<Props> = ({ algorithms }) => {
  return (
    <div className="glass-card p-8 rounded-3xl space-y-6 h-full">
      <h3 className="text-xl font-bold font-syne flex items-center gap-2">
        <Info className="w-5 h-5 text-accent" /> Algorithm Suitability
      </h3>

      <div className="space-y-6">
        <div>
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-success mb-3">Suitable</h4>
          <div className="space-y-2">
            {algorithms.filter(a => a.suitable).map(a => (
              <div key={a.name} className="flex items-center gap-3 bg-success/5 border border-success/10 p-3 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                <span className="text-sm font-medium">{a.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-[10px] uppercase font-bold tracking-widest text-red-400 mb-3">Not Suitable</h4>
          <div className="space-y-2">
            {algorithms.filter(a => !a.suitable).map(a => (
              <div key={a.name} className="flex items-start gap-3 bg-red-500/5 border border-red-500/10 p-3 rounded-xl">
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-sm font-medium">{a.name}</span>
                  <p className="text-[10px] text-white/40 leading-tight">{a.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuitabilityPanel;
