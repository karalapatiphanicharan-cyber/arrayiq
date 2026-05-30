import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo/logo.png';
import { cn } from '../../utils/cn';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Analysis Lab', href: '/sorting' },
    { name: 'Quantum Space', href: '/quantum' },
    { name: 'Our Vision', href: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 md:p-8">
      <div className="glass px-6 md:px-10 py-4 rounded-[24px] flex items-center gap-16 max-w-7xl w-full justify-between shadow-2xl">
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <img src={logo} alt="ArrayIQ Logo" className="h-10 w-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-6" />
          <span className="font-syne font-bold text-2xl tracking-tighter">ArrayIQ</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-primary",
                location.pathname === link.href ? "text-primary" : "text-white/40"
              )}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <Link
          to="/sorting"
          className="bg-white text-black hover:bg-primary hover:text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shrink-0"
        >
          Start Analysis
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
