import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const STORY_CARDS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?q=80&w=400&auto=format&fit=crop"
];

const CARD_W = 260;
const CARD_H = 320;

const ProblemStory = () => {
  const containerRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const textChaosRef = useRef<HTMLHeadingElement>(null);
  const textSolutionRef = useRef<HTMLHeadingElement>(null);
  const labelsWrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const addCard = (el: HTMLDivElement | null, i: number) => { if (el) cardsRef.current[i] = el; };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current.filter(Boolean);
      const gap = 20;

      let mm = gsap.matchMedia();

      mm.add({
        isDesktop: "(min-width: 769px)",
        isMobile: "(max-width: 768px)"
      }, (context) => {
        let { isMobile } = context.conditions as any;
        const scaleFactor = isMobile ? 0.45 : 1;
        const spacingScale = isMobile ? 0.4 : 1;

        // ── INITIAL STATE ──
        // Card 0: slightly below center, slightly right of center
        gsap.set(cards[0], { x: 40 * scaleFactor, y: 60 * scaleFactor, rotate: 0, zIndex: 10, opacity: 1, scale: scaleFactor });

        // Cards 1–4: off-screen right, stacked
        for (let i = 1; i < 5; i++) {
          gsap.set(cards[i], { x: window.innerWidth + 100, y: 60 * scaleFactor, rotate: 0, zIndex: 10 - i, opacity: 1, scale: scaleFactor });
        }

        // Text, labels, button: hidden
        gsap.set(textChaosRef.current, { opacity: 0, y: 30 });
        gsap.set(textSolutionRef.current, { opacity: 0, y: 30 });
        gsap.set(labelsWrapRef.current, { opacity: 0 });
        gsap.set(btnRef.current, { opacity: 0, y: 20 });

        // ── TIMELINE ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: isMobile ? '+=100%' : '+=250%',
            scrub: 1,
            pin: true,
            anticipatePin: 1
          }
        });

        // ── PHASE 1: Cards slide in horizontally and line up ──
        const actualCardW = CARD_W * spacingScale;
        const actualGap = gap * spacingScale;
        const totalRow = 5 * actualCardW + 4 * actualGap;
        const startX = -totalRow / 2 + actualCardW / 2;

        tl.to(cards[0], {
          x: startX,
          y: 60 * scaleFactor,
          rotate: 0,
          ease: 'power3.out',
          duration: 1
        }, 0);

        for (let i = 1; i < 5; i++) {
          tl.to(cards[i], {
            x: startX + i * (actualCardW + actualGap),
            y: 60 * scaleFactor,
            rotate: 0,
            ease: 'power3.out',
            duration: 1
          }, 0.1 + i * 0.12);
        }

        tl.to({}, { duration: 0.6 });

        // ── PHASE 2: Cards tilt & push down to bottom ──
        const rots = [-11.74, -20.99, 10.49, -10.43, -24];
        const chaosX = isMobile ? [-120, -50, 0, 50, 120] : [-220, -110, 0, 120, 240];
        const chaosY = isMobile ? [180, 200, 170, 210, 180] : [320, 340, 310, 350, 320];

        tl.addLabel("tilt");

        cards.forEach((card, i) => {
          tl.to(card, {
            x: chaosX[i],
            y: chaosY[i],
            rotate: rots[i],
            ease: 'power2.inOut',
            duration: 1.2
          }, "tilt");
        });

        tl.to({}, { duration: 0.4 });

        // ── PHASE 3: Arrows + text appear ──
        tl.addLabel("reveal");

        tl.to(textChaosRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "reveal");
        tl.to(btnRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "reveal+=0.1");
        tl.to(labelsWrapRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, "reveal+=0.3");

        tl.to({}, { duration: 1.0 });

        // ── PHASE 4: Transition to Solution Text ──
        tl.addLabel("solution");

        tl.to(textChaosRef.current, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, "solution");
        tl.to(textSolutionRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "solution+=0.4");
        tl.to({}, { duration: 0.2 });

        return () => {
          tl.kill();
        };
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="problem-story" ref={containerRef} style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      background: '#ffffff',
      overflow: 'hidden',
    }}>

      {/* ── TEXT + BUTTON AREA (top area) ── */}
      <div style={{
        position: 'absolute',
        top: '12%',
        left: 0,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 30,
        padding: '0 1rem'
      }}>
        <div style={{ position: 'relative', width: '100%', height: '80px', display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <h2 ref={textChaosRef} style={{
            position: 'absolute',
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 700,
            color: '#111',
            letterSpacing: '-0.03em',
            margin: '0',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}>
            Campus events are a chaotic mess.
          </h2>
          <h2 ref={textSolutionRef} style={{
            position: 'absolute',
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 700,
            color: '#111',
            letterSpacing: '-0.03em',
            margin: '0',
            textAlign: 'center',
            fontFamily: 'Inter, sans-serif',
          }}>
            Eventum solves all of these!
          </h2>
        </div>

        <button ref={btnRef} style={{
          padding: '0.8rem 2.2rem',
          borderRadius: '999px',
          fontSize: '0.95rem',
          fontWeight: 600,
          background: '#000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          fontFamily: 'Inter, sans-serif',
          transition: 'transform 0.2s',
        }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Launch
        </button>
      </div>

      {/* ── CARDS ARENA ── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 0,
        height: 0,
        zIndex: 20,
      }}>

        {/* LABELS + CURVED ARROWS */}
        <div ref={labelsWrapRef} className="problem-story-labels" style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 5,
          transform: 'translate(-50%, -50%)',
        }}>
          <style>{`
            .ps-svg-desktop { display: block !important; }
            .ps-svg-mobile { display: none !important; }
            @media (max-width: 768px) {
              .ps-svg-desktop { display: none !important; }
              .ps-svg-mobile { display: block !important; }
            }
          `}</style>
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <marker id="arrow-forward" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M 0 2 L 8 5 L 0 8" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </marker>
            </defs>
          </svg>

          {/* Fragmented Discovery — bottom-left */}
          <div className="ps-label ps-label-1" style={{ position: 'absolute' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#222', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              Fragmented Discovery
            </span>
            <svg width="220" height="270" className="ps-svg ps-svg-desktop" style={{ marginTop: '10px', marginLeft: '20px', overflow: 'visible' }}>
              <path d="M 200,250 Q -40,120 40,20" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#arrow-forward)" />
            </svg>
            <svg width="80" height="80" className="ps-svg ps-svg-mobile" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', overflow: 'visible' }}>
              <path d="M 60,75 Q 10,40 40,5" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#arrow-forward)" />
            </svg>
          </div>

          {/* Disconnected Experience — center-left */}
          <div className="ps-label ps-label-2" style={{ position: 'absolute' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#222', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              Disconnected Experience
            </span>
            <svg width="150" height="330" className="ps-svg ps-svg-desktop" style={{ marginTop: '10px', marginLeft: '30px', overflow: 'visible' }}>
              <path d="M 130,310 Q -40,150 40,20" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#arrow-forward)" />
            </svg>
            <svg width="80" height="80" className="ps-svg ps-svg-mobile" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', overflow: 'visible' }}>
              <path d="M 60,75 Q 50,40 40,5" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#arrow-forward)" />
            </svg>
          </div>

          {/* Clubs efforts — top-right */}
          <div className="ps-label ps-label-3" style={{ position: 'absolute' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#222', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              Clubs efforts to reach students
            </span>
            <svg width="100" height="330" className="ps-svg ps-svg-desktop" style={{ marginTop: '10px', marginLeft: '20px', overflow: 'visible' }}>
              <path d="M 80,310 Q 100,150 20,20" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#arrow-forward)" />
            </svg>
            <svg width="80" height="80" className="ps-svg ps-svg-mobile" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', overflow: 'visible' }}>
              <path d="M 20,75 Q 30,40 40,5" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#arrow-forward)" />
            </svg>
          </div>

          {/* Zero Personalization — far-right */}
          <div className="ps-label ps-label-4" style={{ position: 'absolute' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#222', fontSize: '1.05rem', letterSpacing: '-0.01em' }}>
              Zero Personalization
            </span>
            <svg width="100" height="270" className="ps-svg ps-svg-desktop" style={{ marginTop: '10px', marginLeft: '-20px', overflow: 'visible' }}>
              <path d="M 20,250 Q 140,120 60,20" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#arrow-forward)" />
            </svg>
            <svg width="80" height="80" className="ps-svg ps-svg-mobile" style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', overflow: 'visible' }}>
              <path d="M 20,75 Q 70,40 40,5" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" markerEnd="url(#arrow-forward)" />
            </svg>
          </div>
        </div>

        {/* CARDS */}
        {STORY_CARDS.map((img, i) => (
          <div
            key={i}
            ref={(el) => addCard(el, i)}
            style={{
              position: 'absolute',
              width: `${CARD_W}px`,
              height: `${CARD_H}px`,
              borderRadius: '20px',
              background: `url(${img}) center/cover no-repeat`,
              boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
              willChange: 'transform',
              top: `-${CARD_H / 2}px`,
              left: `-${CARD_W / 2}px`,
            }}
          />
        ))}
      </div>
      <style>{`
        .ps-label {
          white-space: nowrap;
        }
        
        /* DESKTOP / LAPTOP ALIGNMENT (Default) */
        .ps-label-1 { left: calc(50% - 420px); top: calc(50% + 0px); }
        .ps-label-2 { left: calc(50% - 240px); top: calc(50% - 60px); }
        .ps-label-3 { left: calc(50% + 40px); top: calc(50% - 60px); }
        .ps-label-4 { left: calc(50% + 280px); top: calc(50% + 0px); }

        @media (max-width: 768px) {
          /* MOBILE ALIGNMENT */
          .ps-label { 
            white-space: normal !important;
            max-width: 100px;
            text-align: center;
          }
          .ps-label span {
            font-size: 0.8rem !important;
            line-height: 1.2;
          }
          .ps-label-1 { left: calc(50% - 170px); top: calc(50% - 20px); }
          .ps-label-2 { left: calc(50% - 100px); top: calc(50% + 40px); }
          .ps-label-3 { left: calc(50% + 0px); top: calc(50% + 40px); }
          .ps-label-4 { left: calc(50% + 70px); top: calc(50% - 20px); }
          
          .ps-svg-desktop { display: none !important; }
          .ps-svg-mobile { display: block !important; }
        }
        @media (min-width: 769px) {
          .ps-svg-mobile { display: none !important; }
        }
      `}</style>
    </section>
  );
};

export default ProblemStory;
