import React from 'react';
import Footer from '../components/Footer';

const IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop',
];

const Gallery: React.FC = () => {
  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '8rem 2rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: '9999px', padding: '0.3rem 0.9rem',
            fontSize: '0.75rem', fontWeight: 600, color: '#8B5CF6',
            letterSpacing: '0.04em', marginBottom: '1.25rem',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#8B5CF6', display: 'inline-block' }} />
            GALLERY
          </div>
          <h2 style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1 }}>
            Memories from <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>recent events.</span>
          </h2>
        </div>

        {/* Grid (Static, without hover interactions) */}
        <div
          style={{
            width: '100%',
            maxWidth: '1100px',
            height: '600px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            margin: '0 auto',
          }}
          className="gallery-masonry"
        >
          {/* COLUMN 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
            <div style={{ height: '60%', borderRadius: '16px', background: `url(${IMAGES[0]}) center/cover no-repeat`, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
            <div style={{ height: '40%', borderRadius: '16px', background: `url(${IMAGES[3]}) center/cover no-repeat`, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
          </div>

          {/* COLUMN 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }} className="hide-mobile">
            <div style={{ height: '50%', borderRadius: '16px', background: `url(${IMAGES[1]}) center/cover no-repeat`, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
            <div style={{ height: '50%', borderRadius: '16px', background: `url(${IMAGES[4]}) center/cover no-repeat`, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
          </div>

          {/* COLUMN 3 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }} className="hide-tablet">
            <div style={{ height: '40%', borderRadius: '16px', background: `url(${IMAGES[2]}) center/cover no-repeat`, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
            <div style={{ height: '60%', borderRadius: '16px', background: `url(${IMAGES[5]}) center/cover no-repeat`, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }} />
          </div>
        </div>

      </div>

      <Footer />

      {/* Basic responsive styles */}
      <style>{`
        @media (max-width: 900px) {
          .hide-tablet { display: none !important; }
          .gallery-masonry { grid-template-columns: 1fr 1fr !important; height: 500px !important; }
        }
        @media (max-width: 600px) {
          .hide-mobile { display: none !important; }
          .gallery-masonry { grid-template-columns: 1fr !important; height: 400px !important; }
        }
      `}</style>
    </div>
  );
};

export default Gallery;
