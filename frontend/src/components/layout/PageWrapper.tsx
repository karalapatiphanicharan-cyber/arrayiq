import React from 'react';
import { motion } from 'framer-motion';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="container mx-auto px-6 py-12 max-w-7xl"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
