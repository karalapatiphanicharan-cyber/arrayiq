import { motion } from 'framer-motion';
import logo from '../../assets/logo/logo.png';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
      className="fixed inset-0 z-[100] bg-[#0A0A0A] flex flex-col items-center justify-center"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
          className="relative z-10"
        >
          <img src={logo} alt="Logo" className="h-28 w-auto filter drop-shadow-[0_0_20px_rgba(0,102,255,0.3)]" />
        </motion.div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute inset-0 bg-primary/40 blur-[80px] -z-10 rounded-full"
        />
      </div>

      <div className="mt-16 space-y-4 text-center">
        <div className="w-48 h-[1px] bg-white/5 rounded-full overflow-hidden relative">
          <motion.div
            animate={{ x: [-200, 200] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-primary to-transparent"
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-syne text-[10px] uppercase tracking-[0.4em] text-white/30"
        >
          Initializing Laboratory
        </motion.p>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
