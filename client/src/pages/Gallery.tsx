import React from 'react';
import Footer from '../components/Footer';

const IMAGES = [
  'https://res.cloudinary.com/ddnr2nfnr/image/upload/v1784481825/eventum_gallery/DSC_0751.jpg.jpg',
  'https://res.cloudinary.com/ddnr2nfnr/image/upload/v1784481826/eventum_gallery/gallary_2_.jpg',
  'https://res.cloudinary.com/ddnr2nfnr/image/upload/v1784481827/eventum_gallery/gallary_3_.jpg',
  'https://res.cloudinary.com/ddnr2nfnr/image/upload/v1784481828/eventum_gallery/gallary_4_.jpg',
  'https://res.cloudinary.com/ddnr2nfnr/image/upload/v1784481829/eventum_gallery/gallary_5_.jpg',
  'https://res.cloudinary.com/ddnr2nfnr/image/upload/v1784481831/eventum_gallery/gallary_6_.jpg',
  'https://res.cloudinary.com/ddnr2nfnr/image/upload/v1784481832/eventum_gallery/gallary_7.jpg',
  'https://res.cloudinary.com/ddnr2nfnr/image/upload/v1784481833/eventum_gallery/gallary_8.jpg'
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
        {/* True Masonry Layout using CSS Columns */}
        <div className="gallery-masonry">
          {IMAGES.map((imgSrc, i) => (
            <div key={i} className="gallery-item">
              <img src={imgSrc} alt={`Gallery event ${i+1}`} loading="lazy" />
            </div>
          ))}
        </div>

      </div>

      <Footer />

      {/* True Masonry CSS */}
      <style>{`
        .gallery-masonry {
          column-count: 4;
          column-gap: 1.5rem;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }
        .gallery-item {
          break-inside: avoid;
          margin-bottom: 1.5rem;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          background: #e5e7eb;
        }
        .gallery-item img {
          width: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .gallery-item:hover img {
          transform: scale(1.05);
        }
        
        @media (max-width: 1024px) {
          .gallery-masonry { column-count: 3; }
        }
        @media (max-width: 768px) {
          .gallery-masonry { column-count: 2; }
        }
        @media (max-width: 480px) {
          .gallery-masonry { column-count: 1; }
        }
      `}</style>
    </div>
  );
};

export default Gallery;
