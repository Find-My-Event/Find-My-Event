import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import darkLogo from '../logo/dark logo.png';

const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    // Keep the preloader for 2.5 seconds total before hiding
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // Solid lighter purple gradient (no transparency)
        background: 'linear-gradient(180deg, #D49BFF 0%, #F3E8FF 35%, #FFFFFF 65%, #FFFFFF 100%)',
      }}
    >
      {/* Rotating Logo */}
      <motion.div
        initial={{ rotate: 0, scale: 0.8, opacity: 0 }}
        animate={{ rotate: 360, scale: 1, opacity: 1 }}
        transition={{ 
          rotate: { duration: 2, ease: "easeInOut" },
          scale: { duration: 0.8, ease: "easeOut" },
          opacity: { duration: 0.8, ease: "easeOut" }
        }}
        style={{ marginBottom: '0.75rem' }}
      >
        <img 
          src={darkLogo} 
          alt="Logo" 
          style={{ width: '160px', height: 'auto', display: 'block' }} 
        />
      </motion.div>

      {/* Appearing Text */}
      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        style={{
          fontSize: '2rem',
          fontWeight: 600,
          letterSpacing: '0.02em',
          color: '#000',
          margin: 0,
          fontFamily: 'Inter, sans-serif'
        }}
      >
        Eventum
      </motion.h1>
    </motion.div>
  );
};

export default Preloader;
