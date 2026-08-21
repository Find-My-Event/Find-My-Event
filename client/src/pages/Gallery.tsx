import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  return (
    <div style={{ background: '#fafafa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Main Content */}
      <div style={{ flex: 1, padding: '5.5rem 2rem 4rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1 }}>
            Memories from <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>recent events.</span>
          </h2>
        </div>

        {/* Masonry Grid */}
        <div className="gallery-masonry">
          {IMAGES.map((imgSrc, i) => (
            <div 
              key={i} 
              className="gallery-item"
              onClick={() => setSelectedImageIndex(i)}
              style={{ cursor: 'pointer' }}
            >
              <img src={imgSrc} alt={`Gallery event ${i+1}`} loading="lazy" />
            </div>
          ))}
        </div>

      </div>

      <Footer />

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImageIndex(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(10px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImageIndex(null)}
              style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                borderRadius: '50%',
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#fff',
                zIndex: 10000,
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
            >
              <X size={24} />
            </button>

            {/* Prev Button */}
            {selectedImageIndex > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex - 1); }}
                style={{
                  position: 'absolute',
                  left: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  zIndex: 10000,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {/* Image */}
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              src={IMAGES[selectedImageIndex]}
              style={{
                maxHeight: '85vh',
                maxWidth: '90vw',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)'
              }}
            />

            {/* Next Button */}
            {selectedImageIndex < IMAGES.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedImageIndex(selectedImageIndex + 1); }}
                style={{
                  position: 'absolute',
                  right: '1.5rem',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  zIndex: 10000,
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
              >
                <ChevronRight size={32} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
