import { useState } from 'react';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Info, ArrowRight, Activity } from 'lucide-react';

const Quantum = () => {
  const [array, setArray] = useState([5, 2, 9, 1, 7]);
  const [target, setTarget] = useState(7);
  const [simulation, setSimulation] = useState<any>(null);

  const runSimulation = async (algo: string) => {
    try {
      const res = await axios.post(`http://localhost:8000/api/quantum/${algo}`, { array, target });
      setSimulation(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <PageWrapper>
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-syne font-bold">Quantum Simulations</h2>
            <p className="text-white/50 max-w-xl">Educational simulations of quantum algorithms and their theoretical speedups over classical counterparts.</p>
          </div>
          <div className="bg-secondary/10 border border-secondary/20 px-6 py-3 rounded-full text-secondary font-bold text-sm flex items-center gap-2">
            <Info className="w-4 h-4" /> Educational Simulation Only
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card p-10 rounded-[32px] space-y-8">
            <h3 className="text-2xl font-bold font-syne flex items-center gap-3">
              <Cpu className="w-6 h-6 text-secondary" /> Simulation Controls
            </h3>

            <div className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Input Array</label>
                <input
                  type="text"
                  value={array.join(', ')}
                  onChange={(e) => setArray(e.target.value.split(',').map(s => Number(s.trim())))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary"
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Target Element</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <button
                  onClick={() => runSimulation('grovers')}
                  className="bg-secondary hover:bg-secondary/90 text-white py-4 rounded-2xl font-bold transition-all"
                >
                  Run Grover's
                </button>
                <button
                  onClick={() => runSimulation('quantum_walk')}
                  className="bg-white/5 border border-white/10 hover:bg-white/10 text-white py-4 rounded-2xl font-bold transition-all"
                >
                  Quantum Walk Search
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
             <AnimatePresence mode="wait">
               {simulation ? (
                 <motion.div
                   key="result"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   className="glass-card p-10 rounded-[32px] h-full space-y-8 border-secondary/30 bg-secondary/5"
                 >
                   <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-secondary tracking-[0.2em]">Simulation Results</span>
                        <h4 className="text-3xl font-syne font-bold">Efficiency Leap</h4>
                     </div>
                     <div className="bg-secondary/20 p-4 rounded-2xl">
                        <Zap className="w-8 h-8 text-secondary" />
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-black/40 p-6 rounded-2xl border border-white/5 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-white/30">Classical Steps</p>
                        <p className="text-3xl font-syne font-bold">{simulation.classical_steps}</p>
                        <p className="text-[10px] text-white/20">{simulation.classical_complexity}</p>
                      </div>
                      <div className="bg-secondary/20 p-6 rounded-2xl border border-secondary/20 space-y-2">
                        <p className="text-[10px] uppercase font-bold text-secondary/60">Quantum Steps</p>
                        <p className="text-3xl font-syne font-bold text-secondary">{simulation.quantum_steps}</p>
                        <p className="text-[10px] text-secondary/40">{simulation.quantum_complexity}</p>
                      </div>
                   </div>

                   <div className="p-6 bg-white/5 rounded-2xl space-y-3">
                      <h5 className="font-bold flex items-center gap-2 text-sm"><Info className="w-4 h-4" /> Description</h5>
                      <p className="text-sm text-white/50 leading-relaxed">{simulation.description}</p>
                   </div>
                 </motion.div>
               ) : (
                 <div className="glass-card p-10 rounded-[32px] h-full flex flex-col items-center justify-center text-center space-y-6 border-dashed">
                   <div className="bg-white/5 p-8 rounded-full">
                     <Activity className="w-12 h-12 text-white/10" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-syne font-bold">Initialize Simulation</h4>
                      <p className="text-white/40 max-w-xs mx-auto">Set an array and target, then select a quantum algorithm to see the theoretical speedup.</p>
                   </div>
                 </div>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* Visual Simulation Component Placeholder */}
        <div className="glass-card rounded-[40px] p-12 overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent -z-10" />
           <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                 <h3 className="text-4xl font-syne font-bold">Visualizing <br /><span className="text-secondary">Quantum States</span></h3>
                 <p className="text-lg text-white/50 leading-relaxed">
                   In Grover's algorithm, the amplitude of the marked state is increased while others are decreased through a series of reflections.
                 </p>
                 <button className="flex items-center gap-2 font-bold text-secondary hover:underline">
                   Read Technical Deep Dive <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
              <div className="flex justify-center">
                 <div className="relative w-64 h-64">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          rotate: 360,
                          scale: [1, 1.1, 1],
                          opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{
                          duration: 10 + i * 2,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-0 border-2 border-secondary/30 rounded-full"
                        style={{ margin: i * 20 }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-4 h-4 bg-secondary rounded-full shadow-[0_0_20px_#7B2EFF]" />
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Quantum;
