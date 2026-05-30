import { Link } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.05] bg-[#050505] py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="space-y-8 max-w-sm">
            <div className="flex items-center gap-3">
              <img src={logo} alt="ArrayIQ Logo" className="h-10 w-auto" />
              <span className="font-syne font-bold text-3xl tracking-tighter">ArrayIQ</span>
            </div>
            <p className="text-white/30 leading-relaxed text-lg">
              Analyze. Benchmark. Optimize. The complete AI-powered platform for algorithm analysis and array operations.
            </p>
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-white/20">
              © 2026 ArrayIQ. Built for performance.
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-16 lg:gap-32">
            <div className="space-y-6">
              <h4 className="font-syne font-bold uppercase tracking-widest text-white/50 text-xs">Platform</h4>
              <ul className="space-y-4 text-white/30 text-sm font-medium">
                <li><Link to="/sorting" className="hover:text-primary transition-colors">Sorting Lab</Link></li>
                <li><Link to="/searching" className="hover:text-primary transition-colors">Search Lab</Link></li>
                <li><Link to="/benchmark" className="hover:text-primary transition-colors">Benchmark Hub</Link></li>
                <li><Link to="/quantum" className="hover:text-primary transition-colors">Quantum Space</Link></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-syne font-bold uppercase tracking-widest text-white/50 text-xs">Resources</h4>
              <ul className="space-y-4 text-white/30 text-sm font-medium">
                <li><Link to="/about" className="hover:text-primary transition-colors">Our Vision</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Algorithm Guide</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-white/20">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
          <div className="bg-white/5 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest text-white/40">
            System Status: <span className="text-success">Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
