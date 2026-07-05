import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Footer from '../components/Footer';
import { api } from '../lib/api';

const ClubCard = ({ club }: { club: any }) => (
  <motion.div 
    onClick={() => window.location.hash = `#club-detail-${club.id}`}
    whileHover="hover"
    initial="initial"
    variants={{
      initial: { y: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.04)' },
      hover: { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }
    }}
    style={{ 
      background: '#fff', 
      borderRadius: '20px', 
      overflow: 'hidden', 
      border: '1px solid rgba(0,0,0,0.06)', 
      display: 'flex', 
      flexDirection: 'row', 
      alignItems: 'center',
      padding: '1.25rem',
      gap: '1.5rem',
      cursor: 'pointer',
      height: '100%'
    }}
  >
    <div style={{ width: '110px', height: '110px', flexShrink: 0, borderRadius: '16px', overflow: 'hidden', background: '#f4f4f5', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.img 
        variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        src={club.logo || '/club-images/Rectangle 31.png'} 
        alt={club.name} 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111', lineHeight: 1.3, margin: '0 0 0.4rem 0' }}>
        {club.name}
      </h3>
      <p style={{ color: '#6B7280', fontSize: '0.9rem', fontWeight: 500, margin: 0, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {club.description || 'JECRC Incubation Centre backs visionary founders with capital.'}
      </p>
    </div>
  </motion.div>
);

export default function Clubs() {
  const heroRef = useRef<HTMLHeadingElement>(null);
  const marker1Ref = useRef<HTMLSpanElement>(null);
  const marker2Ref = useRef<HTMLSpanElement>(null);
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    api.get('/clubs')
      .then(res => {
        if (Array.isArray(res.data)) {
          setClubs(res.data);
        }
      })
      .catch(console.error);

    if (heroRef.current) {
      const lines = heroRef.current.querySelectorAll('.hero-line');
      gsap.fromTo(lines, 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2 }
      );

      gsap.fromTo([marker1Ref.current, marker2Ref.current],
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.out', stagger: 0.2, delay: 0.6 }
      );
    }
  }, []);

  const initiativesList = clubs.filter(c => c.type === 'Initiative');
  const clubsList = clubs.filter(c => c.type === 'Club');

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', fontFamily: "'Inter', 'SF Pro Display', sans-serif", color: '#111', position: 'relative', overflowX: 'hidden' }}>
      
      <style>{`
        .premium-hero-heading {
          font-family: 'Inter', 'SF Pro Display', 'Neue Haas Grotesk', sans-serif;
          font-weight: 600;
          text-align: center;
          line-height: 0.98;
          color: #111111;
          margin: 0 auto 3rem;
          max-width: 900px;
          letter-spacing: -1.5px;
        }
        @media (min-width: 1200px) {
          .premium-hero-heading { font-size: 72px; }
        }
        @media (min-width: 1024px) and (max-width: 1199px) {
          .premium-hero-heading { font-size: 64px; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .premium-hero-heading { font-size: 54px; }
        }
        @media (max-width: 767px) {
          .premium-hero-heading { font-size: 38px; }
        }
        .hero-line {
          display: block;
          opacity: 0;
        }
        .marker-highlight {
          position: absolute;
          top: 6%;
          bottom: 6%;
          left: -10px;
          right: -10px;
          border-radius: 999px;
          z-index: -1;
          transform: rotate(-2deg);
        }
        .marker-pink {
          background-color: #FF5DAA;
        }
        .marker-cyan {
          background-color: #49D8F6;
        }
      `}</style>

      {/* Background Gradient */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0,
        right: 0, 
        height: '800px', 
        background: 'radial-gradient(ellipse at top, rgba(239, 230, 255, 1) 0%, #FAFAFA 80%)', 
        zIndex: 0, 
        pointerEvents: 'none',
      }} />

      <main style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Massive Hero Section */}
        <section style={{ padding: '8rem 2rem 4rem', textAlign: 'center', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
          
          <h1 ref={heroRef} className="premium-hero-heading">
            <span className="hero-line">
              JECRC <span style={{ position: 'relative', display: 'inline-block', fontStyle: 'italic', zIndex: 1, marginLeft: '0.1em' }}>
                <span ref={marker1Ref} className="marker-highlight marker-pink" />
                University
              </span> have
            </span>
            <span className="hero-line" style={{ marginTop: '0.15em' }}>
              soo many <span style={{ position: 'relative', display: 'inline-block', fontStyle: 'italic', zIndex: 1, margin: '0 0.15em' }}>
                <span ref={marker2Ref} className="marker-highlight marker-cyan" />
                clubs
              </span> and initiatives.
            </span>
          </h1>

          {/* Hero Image */}
          <div style={{ position: 'relative', width: '100%', margin: '0 auto', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(139,92,246,0.2)' }}>
            <motion.img 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              src="/jecrc_image.png" 
              alt="JECRC University Campus" 
              style={{ width: '100%', height: '500px', objectFit: 'cover', display: 'block' }} 
            />
          </div>
        </section>

        {/* All Initiatives Section */}
        {initiativesList.length > 0 && (
          <section style={{ maxWidth: '1440px', margin: '2rem auto 4rem', padding: '0 2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 700, fontFamily: "'Inter', sans-serif", color: '#111', letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
                All Initiatives
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {initiativesList.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </section>
        )}

        {/* All Clubs Section */}
        {clubsList.length > 0 && (
          <section style={{ maxWidth: '1440px', margin: '2rem auto 6rem', padding: '0 2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 700, fontFamily: "'Inter', sans-serif", color: '#111', letterSpacing: '-0.03em', lineHeight: 1, margin: 0 }}>
                All Clubs
              </h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {clubsList.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}
            </div>
          </section>
        )}
        
      </main>
      
      <Footer />
    </div>
  );
}
