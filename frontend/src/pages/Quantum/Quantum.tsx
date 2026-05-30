import { useState } from 'react';
import axios from 'axios';
import PageWrapper from '../../components/layout/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu, Zap, Info, ArrowRight, Activity,
  Binary, Target, Database, HelpCircle,
  Lightbulb, ShieldCheck, Microscope
} from 'lucide-react';
import { API_BASE_URL } from '../../constants';
import { cn } from '../../utils/cn';

const Quantum = () => {
  const [array, setArray] = useState([5, 2, 9, 1, 7]);
  const [target, setTarget] = useState(7);
  const [simulation, setSimulation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runSimulation = async (algo: string) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/quantum/${algo}`, { array, target });
      setSimulation(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const educationalCards = [
    {
        title: "Qubits vs Bits",
        desc: "Classical bits are 0 or 1. Qubits can exist in superposition, representing both states simultaneously.",
        icon: Binary,
        color: "text-blue-400"
    },
    {
        title: "Superposition",
        desc: "The ability of a quantum system to be in multiple states at the same time until measured.",
        icon: Activity,
        color: "text-purple-400"
    },
    {
        title: "Entanglement",
        desc: "A phenomenon where qubits become linked, such that the state of one instantly influences another.",
        icon: Database,
        color: "text-secondary"
    }
  ];

  return (
    <PageWrapper>
      <div className="space-y-20 pb-20">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                <Zap className="w-3.5 h-3.5 text-secondary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-secondary">The Quantum Frontier</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-syne font-bold leading-tight">
                Quantum <span className="text-gradient">Space</span>
            </h2>
            <p className="text-lg text-white/50 leading-relaxed font-medium">
                Explore the theoretical boundaries of computation. ArrayIQ simulates quantum search and sort algorithms to demonstrate how quadratic speedups reshape algorithm complexity.
            </p>
          </div>
          <div className="bg-white/[0.02] border border-white/10 p-6 rounded-[32px] max-w-xs space-y-4">
            <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-success" />
                <span className="text-xs font-bold text-white/80">Educational Fidelity</span>
            </div>
            <p className="text-[11px] text-white/30 leading-relaxed font-medium">
                These simulations use classical approximations to illustrate the mathematical advantage of quantum gate operations. No real quantum hardware is accessed.
            </p>
          </div>
        </div>

        {/* Simulator Workspace */}
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-8">
            <div className="glass-card p-8 md:p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-secondary/5 blur-3xl -ml-16 -mt-16 rounded-full" />
                <h3 className="text-2xl font-bold font-syne flex items-center gap-4 relative z-10">
                <div className="p-2 bg-secondary/20 rounded-xl">
                    <Cpu className="w-5 h-5 text-secondary" />
                </div>
                Simulator Parameters
                </h3>

                <div className="space-y-8 mt-10 relative z-10">
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Target Array</label>
                        <Microscope className="w-3 h-3 text-white/10" />
                    </div>
                    <div className="relative group/input">
                        <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-secondary transition-colors" />
                        <input
                            type="text"
                            value={array.join(', ')}
                            onChange={(e) => setArray(e.target.value.split(',').map(s => Number(s.trim())))}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-secondary/40 focus:bg-white/[0.05] transition-all"
                            placeholder="e.g. 5, 2, 9, 1, 7"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 px-1">Search Target</label>
                    <div className="relative group/input">
                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within/input:text-secondary transition-colors" />
                        <input
                            type="number"
                            value={target}
                            onChange={(e) => setTarget(Number(e.target.value))}
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm font-medium focus:outline-none focus:border-secondary/40 focus:bg-white/[0.05] transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                    {[
                        { id: 'grovers', label: "Grover's Search" },
                        { id: 'amplitude_amplification', label: "Amplitude Amp." },
                        { id: 'quantum_walk', label: "Quantum Walk" },
                        { id: 'quantum_bitonic_sort', label: "Bitonic Sort" }
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            disabled={isLoading}
                            onClick={() => runSimulation(btn.id)}
                            className={cn(
                                "group py-4 px-4 rounded-2xl font-bold transition-all text-[11px] uppercase tracking-widest border border-white/5",
                                simulation?.id === btn.id ? "bg-secondary text-white border-secondary/20 shadow-lg shadow-secondary/20" : "bg-white/[0.03] hover:bg-white/[0.07] text-white/60 hover:text-white"
                            )}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
                </div>
            </div>
          </div>

          <div className="lg:col-span-7 h-full">
             <AnimatePresence mode="wait">
               {simulation ? (
                 <motion.div
                   key={simulation.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="glass-card p-10 md:p-12 rounded-[40px] h-full flex flex-col border-secondary/20 bg-secondary/[0.03] relative overflow-hidden"
                 >
                   <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 blur-[150px] -mr-48 -mt-48 rounded-full" />

                   <div className="flex justify-between items-start relative z-10">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-secondary" />
                            <span className="text-[10px] uppercase font-bold text-secondary tracking-[0.3em]">Simulation Output</span>
                        </div>
                        <h4 className="text-4xl font-syne font-bold tracking-tight">Computational <span className="text-secondary">Advantage</span></h4>
                     </div>
                     <div className="bg-secondary/10 border border-secondary/20 p-5 rounded-3xl group">
                        <Zap className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                     </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 relative z-10">
                      <div className="bg-[#0D0D0D] p-8 rounded-[32px] border border-white/5 space-y-4 group hover:bg-[#121212] transition-colors">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] uppercase font-bold text-white/20 tracking-widest">Classical Logic</span>
                            <div className="w-1.5 h-1.5 bg-white/10 rounded-full" />
                        </div>
                        <div>
                            <div className="text-4xl font-syne font-bold text-white/90">
                            {simulation.classical_steps !== undefined ? simulation.classical_steps : 'N/A'}
                            </div>
                            <div className="text-[10px] font-bold text-white/30 mt-2 uppercase tracking-tighter">{simulation.classical_complexity} Operations</div>
                        </div>
                      </div>

                      <div className="bg-secondary/10 p-8 rounded-[32px] border border-secondary/20 space-y-4 relative group hover:bg-secondary/[0.15] transition-colors overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent" />
                        <div className="flex justify-between items-center relative z-10">
                            <span className="text-[11px] uppercase font-bold text-secondary/60 tracking-widest">Quantum State</span>
                            <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" />
                        </div>
                        <div className="relative z-10">
                            <div className="text-4xl font-syne font-bold text-secondary">
                            {simulation.quantum_steps !== undefined ? simulation.quantum_steps : 'Simulated'}
                            </div>
                            <div className="text-[10px] font-bold text-secondary/40 mt-2 uppercase tracking-tighter">{simulation.quantum_complexity} theoretical operations</div>
                        </div>
                      </div>
                   </div>

                   <div className="mt-10 p-8 bg-white/[0.02] border border-white/5 rounded-[32px] flex-grow relative z-10">
                      <div className="flex items-center gap-3 mb-4">
                        <Info className="w-4 h-4 text-white/40" />
                        <h5 className="font-bold text-white/60 text-xs uppercase tracking-widest">Algorithmic Insight</h5>
                      </div>
                      <p className="text-sm md:text-base text-white/40 leading-relaxed font-medium">{simulation.description}</p>
                   </div>
                 </motion.div>
               ) : (
                 <div className="glass-card p-12 rounded-[40px] h-full flex flex-col items-center justify-center text-center space-y-8 border-dashed bg-white/[0.01]">
                   <div className="relative">
                       <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full" />
                       <div className="bg-white/5 p-10 rounded-full relative z-10 border border-white/5">
                         <Activity className="w-16 h-16 text-white/5 animate-pulse" />
                       </div>
                   </div>
                   <div className="space-y-3 max-w-sm">
                      <h4 className="text-2xl font-syne font-bold">Ready for Synthesis</h4>
                      <p className="text-sm text-white/30 leading-relaxed font-medium">Select a quantum algorithm to begin the simulated gate measurement and compare theoretical complexities.</p>
                   </div>
                 </div>
               )}
             </AnimatePresence>
          </div>
        </div>

        {/* Educational Section */}
        <div className="grid md:grid-cols-3 gap-6">
            {educationalCards.map((card, i) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card p-8 rounded-[32px] border border-white/5 hover:bg-white/[0.02] transition-all space-y-6 group"
                >
                    <div className={cn("p-4 rounded-2xl bg-white/5 w-fit group-hover:scale-110 transition-transform", card.color)}>
                        <card.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-3">
                        <h4 className="text-xl font-bold font-syne tracking-tight text-white/90">{card.title}</h4>
                        <p className="text-sm text-white/40 leading-relaxed font-medium">{card.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>

        {/* Comparison Table */}
        <div className="glass-card p-10 md:p-12 rounded-[48px] border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -mb-48 -mr-48 rounded-full" />
            <div className="space-y-10 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <h3 className="text-3xl md:text-4xl font-syne font-bold">Complexity <span className="text-gradient">Benchmark</span></h3>
                        <p className="text-white/40 text-lg font-medium">Theoretical complexity comparison between computation models.</p>
                    </div>
                    <div className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40">
                        O(f(n)) Notation
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="pb-6 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Algorithm Type</th>
                                <th className="pb-6 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Classical (O)</th>
                                <th className="pb-6 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Quantum (O)</th>
                                <th className="pb-6 text-[10px] font-bold text-white/20 uppercase tracking-[0.3em]">Advantage</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {[
                                { name: 'Linear Unstructured Search', classical: 'n', quantum: '√n', adv: 'Quadratic' },
                                { name: 'Structured Database Search', classical: 'log n', quantum: 'log n', adv: 'Negligible' },
                                { name: 'Sorting Unordered Array', classical: 'n log n', quantum: 'n', adv: 'Log-Linear' },
                                { name: 'Pattern Recognition', classical: 'Poly(n)', quantum: 'log n', adv: 'Exponential' }
                            ].map((row) => (
                                <tr key={row.name} className="group hover:bg-white/[0.01] transition-colors">
                                    <td className="py-8 font-bold text-white/80 group-hover:text-white transition-colors">{row.name}</td>
                                    <td className="py-8 text-white/40 font-mono text-sm">{row.classical}</td>
                                    <td className="py-8 text-secondary font-mono text-sm font-bold">{row.quantum}</td>
                                    <td className="py-8">
                                        <span className="px-3 py-1 rounded-md bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest border border-secondary/20">
                                            {row.adv}
                                        }</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Technical Deep Dive */}
        <div className="glass-card rounded-[48px] p-12 md:p-20 overflow-hidden relative group">
           <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.08] to-transparent -z-10" />
           <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                 <div className="space-y-4">
                    <h3 className="text-4xl md:text-5xl font-syne font-bold leading-tight">Grover's <br /><span className="text-secondary">Amplification</span></h3>
                    <p className="text-xl text-white/40 leading-relaxed font-medium">
                        Unlike classical search which inspects items one by one, Grover's algorithm uses quantum interference to amplify the probability of the correct state through iterative reflections.
                    </p>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 group/item">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full group-hover/item:scale-150 transition-transform" />
                        <span className="text-sm font-bold text-white/60 tracking-wide uppercase">Oracle Reflection</span>
                    </div>
                    <div className="flex items-center gap-4 group/item">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full group-hover/item:scale-150 transition-transform" />
                        <span className="text-sm font-bold text-white/60 tracking-wide uppercase">Diffusion Operator</span>
                    </div>
                 </div>
                 <button className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-white transition-all border border-white/10 w-fit">
                    Access Quantum Library <HelpCircle className="w-5 h-5 text-secondary" />
                 </button>
              </div>
              <div className="flex justify-center relative">
                 <div className="absolute inset-0 bg-secondary/10 blur-[120px] rounded-full scale-150" />
                 <div className="relative w-80 h-80">
                    {[...Array(4)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          rotate: 360,
                          scale: [1, 1.15, 1],
                          opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{
                          duration: 12 + i * 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        className="absolute inset-0 border-[3px] border-secondary/20 rounded-[40%] group-hover:border-secondary/40 transition-colors"
                        style={{ margin: i * 25 }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="w-10 h-10 bg-secondary rounded-full shadow-[0_0_50px_#7B2EFF] flex items-center justify-center"
                       >
                           <Zap className="w-5 h-5 text-white" />
                       </motion.div>
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
