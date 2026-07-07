import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Card data (Using high-quality Unsplash photos) ── */
const EVENT_CARDS = [
  { label: 'Comedy',    bg: 'url(https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=400&auto=format&fit=crop)' },
  { label: 'Sports',    bg: 'url(https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=400&auto=format&fit=crop)' },
  { label: 'Festival',  bg: 'url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=400&auto=format&fit=crop)' },
  { label: 'Game Room', bg: 'url(https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&auto=format&fit=crop)' },
  { label: 'Concert',   bg: 'url(https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400&auto=format&fit=crop)' },
  { label: 'Hackathon', bg: 'url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=400&auto=format&fit=crop)' },
];

const FLOAT_LABELS = [
  { label: 'Comedy',    top: '-10%', left: 'calc(50% - 35vw)', bg: '#0066FF', dtLeft: 'calc(50% - 500px)', dtTop: '-35px' },
  { label: 'Concert',   top: '90%', left: 'calc(50% + 25vw)', bg: '#22C55E', dtLeft: 'calc(50% + 300px)', dtTop: '295px' },
  { label: 'Hackathon', top: '-10%', left: 'calc(50% + 35vw)', bg: '#EC4899', dtLeft: 'calc(50% + 500px)', dtTop: '-35px' },
];

const Hero = () => {
  const heroRef    = useRef<HTMLElement>(null);
  const topTextRef = useRef<HTMLDivElement>(null);
  const botTextRef = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);
  const labelsRef  = useRef<HTMLDivElement>(null);
  const moreRef    = useRef<HTMLDivElement>(null);
  const cardEls    = useRef<HTMLDivElement[]>([]);

  const addCard = (el: HTMLDivElement | null, i: number) => { if (el) cardEls.current[i] = el; };

  useEffect(() => {
    const cards = cardEls.current.filter(Boolean);
    const labelEls = Array.from(labelsRef.current?.querySelectorAll('.lp-float-label') ?? []) as HTMLElement[];

    const ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)"
      }, (context) => {
        let { isMobile } = context.conditions as any;

        // Fan positions dynamically calculated based on screen size
        const CARD_X_FINAL   = isMobile ? [-140, -80, -20, 20, 80, 140] : [-500, -300, -100, 100, 300, 500];
        const CARD_ROT_FINAL = isMobile ? [-8, 6, -4, 5, 8, -6] : [-4, 5, -3, 4, 6, -6];
        const CARD_Y_FINAL   = isMobile ? [-30, 10, -20, 25, -15, 30] : [-15, 25, -20, 20, -10, 25];

        // 1. Initial State: EVERYTHING stacked/hidden in the center
        cards.forEach((card, i) => {
          gsap.set(card, { x: 0, y: 0, rotate: (i - 2) * 2, scale: 0.9, opacity: 1, zIndex: 10 + i });
        });

        gsap.set(topTextRef.current, { y: 180, opacity: 0, scale: 0.8 });
        gsap.set(botTextRef.current, { y: -180, opacity: 0, scale: 0.8 });
        gsap.set(moreRef.current, { y: -150, opacity: 0, scale: 0.8 });
        
        gsap.set(labelEls, { scale: 0, opacity: 0 });

        const tl = gsap.timeline({ delay: 3.3, defaults: { ease: 'back.out(1.2)' } });

        cards.forEach((card, i) => {
          tl.to(card, {
            x: CARD_X_FINAL[i],
            y: CARD_Y_FINAL[i],
            rotate: CARD_ROT_FINAL[i],
            scale: isMobile ? 0.75 : 1, // smaller cards on mobile
            duration: 1.2,
            ease: 'power3.inOut'
          }, 0);
        });

        tl.to(topTextRef.current, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.inOut' }, 0);
        tl.to(botTextRef.current, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.inOut' }, 0);
        tl.to(moreRef.current, { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: 'power3.inOut' }, 0.1);

        tl.to(labelEls, { scale: isMobile ? 0.8 : 1, opacity: 1, duration: 0.6, stagger: 0.1 }, 0.8);

        tl.call(() => {
          cards.forEach((card, i) => {
            gsap.to(card, {
              y: `+=${i % 2 === 0 ? 8 : -8}`,
              duration: 2.5 + i * 0.2,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1
            });
          });
          labelEls.forEach((lbl, i) => {
            gsap.to(lbl, {
              y: '+=10',
              duration: 2 + i * 0.3,
              ease: 'sine.inOut',
              yoyo: true,
              repeat: -1
            });
          });
        });
        
        // Clean up on matchMedia transition
        return () => {
          tl.kill();
        };
      });

    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="lp-hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        paddingTop: 'calc(64px + 3rem)', // Reduced padding
        paddingBottom: '6rem',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start'
      }}
    >
      {/* ── Top Text ── */}
      <div ref={topTextRef} style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginBottom: '2.5rem', padding: '0 1rem' }}>
        <h1 style={{ fontWeight: 600, fontSize: 'clamp(2.5rem, 6vw, 56px)', fontFamily: 'Inter, sans-serif', margin: 0, color: '#111' }}>
          Never Miss, What&apos;s Happening!
        </h1>
        <h2 style={{ fontWeight: 800, fontSize: 'clamp(3rem, 7vw, 64px)', fontFamily: 'Inter, sans-serif', margin: 0, marginTop: '-5px', color: '#111' }}>
          AROUND YOU
        </h2>
        <p style={{ fontWeight: 600, fontSize: 'clamp(1.2rem, 2.5vw, 24px)', fontFamily: 'Inter, sans-serif', margin: 0, marginTop: '1rem', color: '#333' }}>
          Whether it&apos;s a...
        </p>
      </div>

      {/* ── Card Fan ── */}
      <div ref={cardsRef} style={{ position: 'relative', height: '320px', width: '100%', maxWidth: '1200px', zIndex: 20 }}>
        {EVENT_CARDS.map((card, i) => (
          <div
            key={card.label}
            ref={el => addCard(el, i)}
            style={{
              position: 'absolute',
              width: '221.59px',
              height: '272.96px',
              left: '50%',
              top: '50%',
              marginLeft: '-110.8px',
              marginTop: '-136.48px',
              background: `${card.bg} center/cover no-repeat`,
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              border: '4px solid #fff',
              willChange: 'transform'
            }}
          />
        ))}

        {/* Floating labels */}
        <div ref={labelsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {FLOAT_LABELS.map((lbl, i) => (
            <div
              key={i}
              className="lp-float-label"
              style={{
                position: 'absolute',
                top: lbl.top,
                left: lbl.left,
                background: lbl.bg,
                color: '#fff',
                padding: '8px 16px',
                borderRadius: '999px',
                fontWeight: 700,
                fontSize: '14px',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                transform: 'translateX(-50%)',
              }}
            >
              {lbl.label}
              {/* Little triangle pointing to card */}
              <div style={{
                position: 'absolute',
                bottom: lbl.top.includes('-') ? '-6px' : 'auto',
                top: !lbl.top.includes('-') ? '-6px' : 'auto',
                left: '50%',
                transform: 'translateX(-50%)',
                borderWidth: lbl.top.includes('-') ? '6px 6px 0 6px' : '0 6px 6px 6px',
                borderStyle: 'solid',
                borderColor: lbl.top.includes('-') ? `${lbl.bg} transparent transparent transparent` : `transparent transparent ${lbl.bg} transparent`,
              }} />
              <style>{`
                 @media (min-width: 769px) {
                   .lp-float-label:nth-child(${i+1}) {
                     top: ${lbl.dtTop} !important;
                     left: ${lbl.dtLeft} !important;
                   }
                 }
              `}</style>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Text ── */}
      <div ref={botTextRef} style={{ textAlign: 'center', position: 'relative', zIndex: 1, marginTop: '2rem', padding: '0 1rem' }}>
        <p style={{ fontWeight: 400, fontSize: 'clamp(1rem, 2vw, 20px)', fontFamily: 'Inter, sans-serif', color: '#444', maxWidth: '600px', margin: '0 auto' }}>
          From hackathons to concerts, find and join the events that matter to you.
        </p>
      </div>

      {/* ── CTA Button ── */}
      <div ref={moreRef} style={{ position: 'relative', zIndex: 1, marginTop: '2.5rem' }}>
        <button
          onClick={() => { window.location.hash = '#events'; }}
          style={{
            background: '#000',
            color: '#fff',
            border: 'none',
            padding: '12px 32px',
            borderRadius: '999px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}
        >
          and many more
        </button>
      </div>
    </section>
  );
};

export default Hero;
