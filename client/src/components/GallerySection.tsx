import { useRef } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 36, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.65, ease: EASE, delay } },
});
const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Hackathon 2025',
    category: 'Tech',
    className: 'tall',
    gradient: 'linear-gradient(135deg,#1a1a2e 0%,#0f3460 100%)',
    emoji: '💻',
    accent: '#64d8cb',
  },
  {
    id: 2,
    title: 'Cultural Fest',
    category: 'Culture',
    className: 'short',
    gradient: 'linear-gradient(135deg,#2d1b4e 0%,#7b2ff7 100%)',
    emoji: '🎭',
    accent: '#f8b4d9',
  },
  {
    id: 3,
    title: 'Music Night',
    category: 'Music',
    className: 'short',
    gradient: 'linear-gradient(135deg,#1a0a00 0%,#8b2500 100%)',
    emoji: '🎵',
    accent: '#ffd700',
  },
  {
    id: 4,
    title: 'Sports Meet',
    category: 'Sports',
    className: 'tall',
    gradient: 'linear-gradient(135deg,#003300 0%,#006600 100%)',
    emoji: '🏆',
    accent: '#90ee90',
  },
  {
    id: 5,
    title: 'Art Exhibition',
    category: 'Art',
    className: 'wide',
    gradient: 'linear-gradient(135deg,#2c0060 0%,#8b5cf6 100%)',
    emoji: '🎨',
    accent: '#fbbf24',
  },
  {
    id: 6,
    title: 'Photography Club',
    category: 'Photography',
    className: 'short',
    gradient: 'linear-gradient(135deg,#111 0%,#333 100%)',
    emoji: '📷',
    accent: '#e2e8f0',
  },
  {
    id: 7,
    title: 'Tech Talk',
    category: 'Tech',
    className: 'short',
    gradient: 'linear-gradient(135deg,#00008b 0%,#0000cd 100%)',
    emoji: '⚡',
    accent: '#93c5fd',
  },
  {
    id: 8,
    title: 'Workshop Day',
    category: 'Workshop',
    className: 'short',
    gradient: 'linear-gradient(135deg,#4a1900 0%,#ff6600 100%)',
    emoji: '🔧',
    accent: '#fed7aa',
  },
];



const GallerySection = () => {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="gallery"
      ref={ref}
      className="lp-gallery-section"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Blobs */}
      <div className="lp-blob" style={{ width: '400px', height: '400px', background: 'rgba(139,92,246,0.1)', top: '-100px', right: '-80px' }} />
      <div className="lp-blob" style={{ width: '300px', height: '300px', background: 'rgba(192,132,252,0.1)', bottom: '-60px', left: '10%', animationDelay: '2s' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <motion.div variants={fadeUp(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
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
          </motion.div>
          <motion.h2 variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1 }}>
            Events that define<br />
            <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>campus life.</span>
          </motion.h2>
          <motion.p variants={fadeUp(0.2)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ color: '#6B7280', fontSize: 'clamp(0.9rem,1.3vw,1rem)', marginTop: '0.85rem', maxWidth: '460px', margin: '0.85rem auto 0', lineHeight: 1.65 }}>
            From hackathons to concerts, every campus experience has a story. Here are some of ours.
          </motion.p>
        </div>

        {/* Masonry grid */}
        <div className="lp-gallery-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gridAutoRows: '200px' }}>
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeUp(0.05 + i * 0.06)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className={`lp-gallery-item ${item.className}`}
              style={{
                background: item.gradient,
                minHeight: '200px',
              }}
            >
              {/* Glowing orb */}
              <div style={{
                position: 'absolute', top: '20%', left: '20%',
                width: '80px', height: '80px',
                borderRadius: '50%', background: item.accent,
                filter: 'blur(30px)', opacity: 0.4,
                pointerEvents: 'none',
              }} />

              {/* Emoji */}
              <div style={{
                position: 'absolute', top: '1.2rem', left: '1.2rem',
                fontSize: item.className === 'tall' ? '2.5rem' : '1.8rem',
                lineHeight: 1, zIndex: 1,
              }}>
                {item.emoji}
              </div>

              {/* Category chip */}
              <div style={{
                position: 'absolute', top: '1.1rem', right: '1.1rem',
                background: 'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '9999px',
                padding: '0.2rem 0.65rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.9)',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                zIndex: 1,
              }}>
                {item.category}
              </div>

              {/* Caption (on hover) */}
              <div className="lp-gallery-caption" style={{ zIndex: 3 }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.72rem', opacity: 0.75, marginTop: '0.15rem' }}>{item.category}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA below gallery */}
        <motion.div
          variants={fadeUp(0.4)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center', marginTop: '3rem' }}
        >
          <button
            className="lp-btn-primary"
            onClick={() => { window.location.hash = '#events'; }}
          >
            Explore All Events →
          </button>
        </motion.div>
      </div>

      {/* Responsive grid styles */}
      <style>{`
        @media (max-width: 768px) {
          .lp-gallery-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            grid-auto-rows: 160px !important;
          }
          .lp-gallery-item.tall { grid-row: span 1 !important; }
          .lp-gallery-item.wide { grid-column: span 1 !important; }
        }
        @media (max-width: 480px) {
          .lp-gallery-grid {
            grid-template-columns: 1fr !important;
            grid-auto-rows: 180px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default GallerySection;
