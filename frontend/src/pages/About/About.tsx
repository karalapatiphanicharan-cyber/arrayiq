import { motion } from 'framer-motion';
import logo from '../../assets/logo/logo.png';

const About = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-24 py-12">
      <section className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block"
        >
          <img src={logo} alt="ArrayIQ Logo" className="h-32 w-auto mx-auto mb-8" />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-syne font-bold tracking-tight">About ArrayIQ</h1>
          <p className="text-xl text-white/50 font-medium">Analyze. Benchmark. Optimize.</p>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl font-syne font-bold">The Vision</h2>
          <p className="text-lg text-white/60 leading-relaxed">
            ArrayIQ was born from the need for a high-performance, visually intuitive platform for algorithm analysis. We believe that understanding complexity shouldn't be complex.
          </p>
          <p className="text-lg text-white/60 leading-relaxed">
            Our mission is to provide developers, students, and engineers with the tools they need to make informed decisions about algorithm selection and performance optimization.
          </p>
        </div>
        <div className="glass-card p-10 rounded-[40px] bg-primary/5 border-primary/20">
           <div className="space-y-6">
              {[
                { label: 'Precision', desc: 'Real-time telemetry and exact metrics.' },
                { label: 'Education', desc: 'Visual simulations and deep dives.' },
                { label: 'Intelligence', desc: 'AI-driven recommendations.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2" />
                  <div>
                    <h4 className="font-bold text-white">{item.label}</h4>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>

      <section className="space-y-12">
        <h2 className="text-3xl font-syne font-bold text-center">The Tech Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {['React', 'FastAPI', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts', 'Lucide React', 'Lenis Scroll'].map((tech) => (
            <div key={tech} className="glass-card p-6 rounded-2xl text-center font-bold text-white/60 hover:text-white hover:border-white/20 transition-all">
              {tech}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
