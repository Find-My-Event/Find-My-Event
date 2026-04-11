import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';

const Hero = () => {
  const [inputs, setInputs] = useState<any[]>([]);
  const mascotRef = useRef<HTMLDivElement>(null);

  const { RiveComponent, rive } = useRive({
    src: 'https://cdn.prod.website-files.com/66b0c146aa30e40075a7013f/6717774f2eba913f99710e52_unicorn.riv',
    autoplay: true,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
  });

  useEffect(() => {
    if (rive) {
      // Dynamically discover and play the first available state machine
      const smName = rive.stateMachineNames[0];
      if (smName) {
        rive.play(smName);
        const smInputs = rive.stateMachineInputs(smName);
        setInputs(smInputs);
        console.log(`Rive Connected: ${smName}`, smInputs);
      }
    }
  }, [rive]);

  const onMouseMove = (e: React.MouseEvent) => {
    if (rive && inputs.length > 0) {
      // Discover mouse tracking and interaction inputs
      const px = inputs.find(i => i.name.toLowerCase().includes('x'));
      const py = inputs.find(i => i.name.toLowerCase().includes('y'));
      const dance = inputs.find(i => i.name.toLowerCase().includes('dance'));

      if (px && py) {
        px.value = (e.clientX / window.innerWidth) * 100;
        py.value = (e.clientY / window.innerHeight) * 100;
      }

      if (dance && mascotRef.current) {
        const rect = mascotRef.current.getBoundingClientRect();
        const mascotX = rect.left + rect.width / 2;
        const mascotY = rect.top + rect.height / 2;
        const distance = Math.hypot(e.clientX - mascotX, e.clientY - mascotY);
        dance.value = distance < 350; // Larger trigger radius for premium feel
      }
    }
  };

  const tagline = "Campus Events,";
  const serifText = "Sorted.";

  const containerVars: Variants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  const wordVars: Variants = {
    initial: { y: 100, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" }
    },
  };

  return (
    <section 
      onMouseMove={onMouseMove}
      style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        textAlign: 'center',
        position: 'relative',
        padding: '0 2rem'
      }}
    >
      <motion.div 
        variants={containerVars}
        initial="initial"
        animate="animate"
        style={{ width: '100%', maxWidth: '1400px' }}
      >
        <h1 
          className="hero-tagline"
          style={{ 
            fontSize: 'clamp(4rem, 11vw, 8rem)', 
            fontWeight: 800, 
            lineHeight: 0.85,
            marginBottom: '2.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center',
            gap: '0.1em',
            letterSpacing: '-0.04em',
            width: '100%',
            maxWidth: '100vw'
          }}
        >
          <div style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '0.15em' }}>
            {tagline.split(' ').map((word, i) => (
              <motion.span key={i} variants={wordVars} style={{ display: 'inline-block' }}>
                {word}
              </motion.span>
            ))}
          </div>
          
          <motion.div 
            ref={mascotRef}
            className="hero-mascot-wrapper"
            variants={wordVars}
            style={{ 
              width: '2.6em', 
              height: '2.6em', 
              backgroundColor: '#0a0a0a', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              overflow: 'visible',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              flexShrink: 0,
              position: 'relative'
            }}
          >
            <div style={{ width: '100%', height: '100%', position: 'absolute', top: '-8%', left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RiveComponent 
                style={{ width: '145%', height: '145%' }} 
              />
            </div>
          </motion.div>

          <div style={{ textAlign: 'left' }}>
            <motion.span 
              variants={wordVars} 
              className="serif-italic"
              style={{ display: 'inline-block' }}
            >
              {serifText}
            </motion.span>
          </div>
        </h1>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 1.6, duration: 1.2 }}
        style={{ 
            maxWidth: '650px', 
            fontSize: 'clamp(1.1rem, 2.5vw, 1.6rem)', 
            color: 'var(--bg-primary)', 
            marginTop: '1.5rem', 
            fontWeight: 400,
            lineHeight: 1.4
        }}
      >
        Discover the best mini-events, workshops, and student-run festivals across your campus.
      </motion.p>

      <style>{`
        @media (max-width: 768px) {
          .hero-tagline { 
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          .hero-tagline > div:first-child { justify-content: center !important; text-align: center !important; }
          .hero-tagline > div:last-child { text-align: center !important; }
          .hero-mascot-wrapper { 
            margin: 0 auto !important;
            width: 5em !important; 
            height: 5em !important; 
          }
          .hero-watermark { display: none !important; }
        }
      `}</style>
      <div className="hero-watermark" style={{ position: 'absolute', bottom: '4rem', left: '5rem', fontSize: '1rem', fontWeight: 600, opacity: 0.3 }}>
        @findmyevent
      </div>
      <div className="hero-watermark" style={{ position: 'absolute', bottom: '4rem', right: '5rem', fontSize: '1rem', fontWeight: 600, opacity: 0.3 }}>
        Designing moments that matter.
      </div>
    </section>
  );
};

export default Hero;
