import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import Lenis from 'lenis';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home/Home'));
const AnalysisLab = React.lazy(() => import('./pages/AnalysisLab/AnalysisLab'));
const Quantum = React.lazy(() => import('./pages/Quantum/Quantum'));
const About = React.lazy(() => import('./pages/About/About'));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const AppContent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const timer = setTimeout(() => setLoading(false), 2000);
    return () => {
      clearTimeout(timer);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!loading && (
        <div className="flex flex-col min-h-screen bg-[#0A0A0A]">
          <Navbar />
          <main className="flex-grow pt-24">
            <React.Suspense fallback={<div className="h-screen bg-[#0A0A0A]" />}>
              <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<Home />} />
                  <Route path="/lab" element={<AnalysisLab />} />
                  <Route path="/sorting" element={<AnalysisLab />} />
                  <Route path="/searching" element={<AnalysisLab />} />
                  <Route path="/benchmark" element={<AnalysisLab />} />
                  <Route path="/quantum" element={<Quantum />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </AnimatePresence>
            </React.Suspense>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
