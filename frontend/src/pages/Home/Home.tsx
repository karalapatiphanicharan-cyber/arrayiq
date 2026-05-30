import { motion, type Variants } from 'framer-motion';
import { ArrowRight, BarChart3, Cpu, Sparkles, Zap, Search, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      } as any
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#0A0A0A]">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 right-0 h-screen overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-accent/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-white/[0.03] border border-white/[0.08] px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] text-primary mb-8 backdrop-blur-md">
              <Sparkles className="w-3 h-3" /> The Future of Algorithm Analysis
            </div>

            <h1 className="text-6xl md:text-[100px] font-syne font-extrabold tracking-tight leading-[0.9] mb-8">
              Find The Best <br />
              <span className="gradient-text">Algorithm</span> <br />
              For Every Array
            </h1>

            <p className="text-lg md:text-2xl text-white/40 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
              Analyze arrays, benchmark algorithms, visualize execution, and discover the optimal solution instantly.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                to="/sorting"
                className="group relative bg-white text-black px-10 py-5 rounded-2xl font-bold flex items-center gap-3 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                Start Analyzing
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-white blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
              <Link
                to="/benchmark"
                className="px-10 py-5 rounded-2xl font-bold border border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.05] transition-all flex items-center gap-3 backdrop-blur-md"
              >
                <Zap className="w-5 h-5 text-accent" /> Run Benchmark
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section id="features" className="py-40 relative px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-24 space-y-4 max-w-2xl">
            <h2 className="text-4xl md:text-7xl font-syne font-bold leading-[1.1]">Engineered for <br /><span className="text-white/20">Absolute Performance.</span></h2>
            <p className="text-white/40 text-lg">Harness AI-driven insights to optimize your data structures and computational efficiency.</p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6"
          >
            {/* Main Bento Card */}
            <motion.div variants={item} className="md:col-span-8 glass-card p-12 rounded-[40px] flex flex-col justify-between group h-[480px] overflow-hidden relative">
              <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent -z-10 group-hover:scale-110 transition-transform duration-700" />
              <div className="space-y-8 relative z-10">
                <div className="bg-primary/20 p-5 rounded-3xl w-fit glow-primary">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-4xl font-syne font-bold">Smart Recommendations</h3>
                  <p className="text-white/40 text-xl max-w-md leading-relaxed">
                    Our proprietary intelligence engine analyzes array size, distribution, and entropy to suggest the optimal algorithm.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                {['Accuracy 99%', 'Latency <5ms', 'AI Powered'].map(tag => (
                  <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/30">{tag}</span>
                ))}
              </div>
            </motion.div>

            <motion.div variants={item} className="md:col-span-4 glass-card p-12 rounded-[40px] flex flex-col justify-between group h-[480px]">
              <div className="bg-accent/20 p-5 rounded-3xl w-fit glow-accent">
                <BarChart3 className="w-10 h-10 text-accent" />
              </div>
              <div className="space-y-4">
                <h3 className="text-3xl font-syne font-bold leading-tight">Benchmark <br /> Dashboard</h3>
                <p className="text-white/40 text-lg leading-relaxed">
                  Real-time telemetry comparison across every algorithm.
                </p>
              </div>
              <div className="pt-8 border-t border-white/5">
                <Link to="/benchmark" className="text-sm font-bold flex items-center gap-2 group-hover:text-accent transition-colors">
                  Explore Metrics <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>

            <motion.div variants={item} className="md:col-span-4 glass-card p-10 rounded-[40px] space-y-8 group">
              <div className="bg-secondary/20 p-5 rounded-3xl w-fit glow-secondary">
                <Layers className="w-8 h-8 text-secondary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-syne font-bold">Advanced Sorting</h3>
                <p className="text-white/40">From Timsort to Radix, visualize the complexity of 11+ algorithms.</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="md:col-span-4 glass-card p-10 rounded-[40px] space-y-8 group">
              <div className="bg-success/20 p-5 rounded-3xl w-fit">
                <Search className="w-8 h-8 text-success" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-syne font-bold">Search Analytics</h3>
                <p className="text-white/40">Optimize lookups with advanced searching strategies and traversal analysis.</p>
              </div>
            </motion.div>

            <motion.div variants={item} className="md:col-span-4 glass-card p-10 rounded-[40px] space-y-8 group bg-gradient-to-br from-secondary/10 to-transparent">
              <div className="bg-white/10 p-5 rounded-3xl w-fit">
                <Cpu className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-syne font-bold">Quantum Simulation</h3>
                <p className="text-white/40">Simulate Grover's search and explore quadratic speedups in a sandbox.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
