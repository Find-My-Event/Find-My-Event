import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const IMAGES = [
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=600&auto=format&fit=crop',
];

const GalleryCta = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const img1Ref = useRef<HTMLDivElement>(null);
  const img2Ref = useRef<HTMLDivElement>(null);
  const img3Ref = useRef<HTMLDivElement>(null);
  const img4Ref = useRef<HTMLDivElement>(null);
  const img5Ref = useRef<HTMLDivElement>(null);
  const img6Ref = useRef<HTMLDivElement>(null);
  const centerTextRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const tl = gsap.timeline({ paused: true });

    tl.addLabel('hover');

    // Col 1: IMG1 shrinks (60% → 35%), IMG4 grows (40% → 65%)
    tl.to(img1Ref.current, { height: '35%', duration: 0.6, ease: 'power2.inOut' }, 'hover');
    tl.to(img4Ref.current, { height: '65%', duration: 0.6, ease: 'power2.inOut' }, 'hover');

    // Col 3: IMG3 grows (40% → 60%), IMG6 shrinks (60% → 35%)
    tl.to(img3Ref.current, { height: '60%', duration: 0.6, ease: 'power2.inOut' }, 'hover');
    tl.to(img6Ref.current, { height: '40%', duration: 0.6, ease: 'power2.inOut' }, 'hover');

    // Col 2: IMG2 slides UP, IMG5 slides DOWN to open a gap for text
    tl.to(img2Ref.current, { y: -50, height: '38%', duration: 0.6, ease: 'power2.inOut' }, 'hover');
    tl.to(img5Ref.current, { y: 50, height: '38%', duration: 0.6, ease: 'power2.inOut' }, 'hover');

    // Center text fades in
    tl.to(centerTextRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 'hover+=0.15');

    tlRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  const handleMouseEnter = () => { tlRef.current?.play(); };
  const handleMouseLeave = () => { tlRef.current?.reverse(); };

  return (
    <section
      ref={sectionRef}
      style={{
        width: '100%',
        padding: '4rem 2rem',
        background: '#fafafa',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        ref={gridRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          width: '100%',
          maxWidth: '1100px',
          height: '520px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '1rem',
          cursor: 'pointer',
        }}
      >

        {/* ── COLUMN 1 (Left) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div ref={img1Ref} style={{
            height: '60%',
            borderRadius: '16px',
            overflow: 'hidden',
            background: `url(${IMAGES[0]}) center/cover no-repeat`,
          }} />
          <div ref={img4Ref} style={{
            height: '40%',
            borderRadius: '16px',
            overflow: 'hidden',
            background: `url(${IMAGES[3]}) center/cover no-repeat`,
          }} />
        </div>

        {/* ── COLUMN 2 (Center) — 50/50 split, text hidden behind ── */}
        <div style={{
          position: 'relative',
          height: '100%',
          overflow: 'hidden',
        }}>
          {/* IMG 2 — top half */}
          <div ref={img2Ref} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '50%',
            borderRadius: '16px',
            overflow: 'hidden',
            background: `url(${IMAGES[1]}) center/cover no-repeat`,
            zIndex: 2,
          }} />

          {/* CTA Text — sits in the center, hidden by default */}
          <div
            ref={centerTextRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              opacity: 0,
              zIndex: 1,
            }}
          >
            <p style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#333',
              margin: 0,
              textAlign: 'center',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
            }}>
              Enough Scrolling.<br />
              Start Experiencing!
            </p>
            <button
              onClick={() => { window.location.hash = '#login'; }}
              style={{
                padding: '0.7rem 2rem',
                borderRadius: '999px',
                border: 'none',
                background: '#7c3aed',
                color: '#fff',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Get Started
            </button>
          </div>

          {/* IMG 5 — bottom half */}
          <div ref={img5Ref} style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '50%',
            borderRadius: '16px',
            overflow: 'hidden',
            background: `url(${IMAGES[4]}) center/cover no-repeat`,
            zIndex: 2,
          }} />
        </div>

        {/* ── COLUMN 3 (Right) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
          <div ref={img3Ref} style={{
            height: '40%',
            borderRadius: '16px',
            overflow: 'hidden',
            background: `url(${IMAGES[2]}) center/cover no-repeat`,
          }} />
          <div ref={img6Ref} style={{
            height: '60%',
            borderRadius: '16px',
            overflow: 'hidden',
            background: `url(${IMAGES[5]}) center/cover no-repeat`,
          }} />
        </div>

      </div>
    </section>
  );
};

export default GalleryCta;
