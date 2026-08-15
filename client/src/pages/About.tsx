import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      padding: isMobile ? '6rem 1.5rem 4rem' : '8rem 2.5rem 6rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      <div style={{ maxWidth: '1000px', width: '100%' }}>
        
        {/* Header Section */}
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeIn}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <span style={{ 
            display: 'inline-block', 
            padding: '0.5rem 1rem', 
            background: 'rgba(139, 92, 246, 0.1)', 
            color: '#8B5CF6', 
            borderRadius: '99px', 
            fontWeight: 700,
            fontSize: '0.85rem',
            letterSpacing: '0.05em',
            marginBottom: '1.5rem'
          }}>
            OUR STORY
          </span>
          <h1 style={{ 
            fontSize: isMobile ? '2.5rem' : '4rem', 
            fontWeight: 800, 
            color: '#0f172a', 
            lineHeight: 1.1, 
            marginBottom: '1.5rem',
            letterSpacing: '-0.03em'
          }}>
            Empowering Campus <br />
            <span style={{ color: '#8B5CF6' }}>Communities.</span>
          </h1>
          <p style={{ 
            fontSize: isMobile ? '1.05rem' : '1.2rem', 
            color: '#64748b', 
            maxWidth: '650px', 
            margin: '0 auto',
            lineHeight: 1.6 
          }}>
            Eventum is the ultimate platform designed to bridge the gap between students, clubs, and organizers, making campus events accessible and effortless.
          </p>
        </motion.div>

        {/* Vision & Mission Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
          gap: '2rem',
          marginBottom: '5rem'
        }}>
          {/* Mission Card */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            style={{
              background: '#ffffff',
              padding: isMobile ? '2.5rem 1.5rem' : '3.5rem',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Our Mission</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1.05rem' }}>
              To eliminate the chaos of WhatsApp groups and scattered Google Forms by providing a unified, seamless, and intelligent ecosystem for every single campus event.
            </p>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            style={{
              background: '#ffffff',
              padding: isMobile ? '2.5rem 1.5rem' : '3.5rem',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ background: '#f1f5f9', width: '60px', height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-9 5 18 3-9h5"/></svg>
            </div>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Our Vision</h3>
            <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '1.05rem' }}>
              We envision a vibrant campus life where students never miss out on opportunities, and organizers can focus on creating magical experiences instead of managing spreadsheets.
            </p>
          </motion.div>
        </div>

        {/* Why Eventum Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          style={{
            background: '#0f172a',
            padding: isMobile ? '3rem 2rem' : '5rem',
            borderRadius: '24px',
            color: '#ffffff',
            textAlign: 'center'
          }}
        >
          <h2 style={{ fontSize: isMobile ? '2rem' : '2.5rem', fontWeight: 800, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Built for Students. <br /> Perfected for Organizers.
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Whether you are looking to discover the next big hackathon or managing a cultural fest for 5,000 attendees, Eventum provides the tools you need to succeed.
          </p>

          <div style={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row', 
            gap: '2rem', 
            justifyContent: 'center',
            textAlign: 'left'
          }}>
            {[
              { title: "One-Click Registration", desc: "No more tedious forms. Register instantly and get your tickets directly on your dashboard." },
              { title: "Smart Verification", desc: "Built-in QR code scanners ensure secure and lightning-fast check-ins at the venue." },
              { title: "Real-Time Analytics", desc: "Organizers get live insights into registrations, attendance, and audience engagement." }
            ].map((feature, idx) => (
              <div key={idx} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#f8fafc' }}>{feature.title}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default About;
