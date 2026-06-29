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

      // ── INITIAL STATE ──
      // Card 0: slightly below center, slightly right of center
      gsap.set(cards[0], { x: 40, y: 60, rotate: 0, zIndex: 10, opacity: 1 });

      // Cards 1–4: off-screen right, stacked
      for (let i = 1; i < 5; i++) {
        gsap.set(cards[i], { x: window.innerWidth + 100, y: 60, rotate: 0, zIndex: 10 - i, opacity: 1 });
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
          end: '+=250%', // 2.5 screens of scrolling (slower, smoother)
          scrub: 1,
          pin: true,
          anticipatePin: 1
        }
      });

      // ── PHASE 1: Cards slide in horizontally and line up ──
      // Calculate positions so all 5 cards sit in a row centered on screen
      const totalRow = 5 * CARD_W + 4 * gap;
      const startX = -totalRow / 2 + CARD_W / 2;

      // Card 0 slides to its row position
      tl.to(cards[0], {
        x: startX,
        y: 60,
        rotate: 0,
        ease: 'power3.out',
        duration: 1
      }, 0);

      // Cards 1–4 fly in from right to their row positions
      for (let i = 1; i < 5; i++) {
        tl.to(cards[i], {
          x: startX + i * (CARD_W + gap),
          y: 60,
          rotate: 0,
          ease: 'power3.out',
          duration: 1
        }, 0.1 + i * 0.12);
      }

      // Dwell so user sees the neat row
      tl.to({}, { duration: 0.6 });

      // ── PHASE 2: Cards tilt & push down to bottom ──
      const rots = [-11.74, -20.99, 10.49, -10.43, -24];
      // Push cards much lower so they bleed off the bottom edge of the screen
      const chaosX = [-220, -110, 0, 120, 240];
      const chaosY = [320, 340, 310, 350, 320];

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

      // Dwell so user sees the chaos
      tl.to({}, { duration: 0.4 });

      // ── PHASE 3: Arrows + text appear ──
      tl.addLabel("reveal");

      tl.to(textChaosRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "reveal");
      tl.to(btnRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "reveal+=0.1");
      tl.to(labelsWrapRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, "reveal+=0.3");

      // Dwell so user reads the chaos text
      tl.to({}, { duration: 1.0 });

      // ── PHASE 4: Transition to Solution Text ──
      tl.addLabel("solution");
      
      // Fade out chaos text ONLY (keep arrows/labels visible)
      tl.to(textChaosRef.current, { opacity: 0, y: -20, duration: 0.5, ease: 'power2.in' }, "solution");
      
      // Fade in solution text
      tl.to(textSolutionRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, "solution+=0.4");

      // Hold everything visible briefly before unpinning
      tl.to({}, { duration: 0.2 });

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
      }}>
        <div style={{ position: 'relative', width: '100%', height: '80px', display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
          <h2 ref={textChaosRef} style={{
            position: 'absolute',
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
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
            fontSize: 'clamp(1.8rem, 3.5vw, 3rem)',
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
        <div ref={labelsWrapRef} style={{
          position: 'absolute',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 25,
          transform: 'translate(-50%, -50%)',
        }}>
          {/* Fragmented Discovery — bottom-left */}
          <div style={{ position: 'absolute', left: '8%', top: '58%' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
              Fragmented Discovery
            </span>
            <svg width="50" height="70" viewBox="0 0 50 70" style={{ display: 'block', marginTop: '4px', transform: 'rotate(15deg)' }}>
              <path d="M10,70 Q8,30 45,8" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M35,3 L50,8 L40,22" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Disconnected Experience — center-left */}
          <div style={{ position: 'absolute', left: '22%', top: '48%' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
              Disconnected Experience
            </span>
            <svg width="70" height="70" viewBox="0 0 70 70" style={{ display: 'block', marginTop: '4px', transform: 'rotate(40deg)' }}>
              <path d="M10,70 Q8,30 60,8" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M50,3 L65,8 L55,22" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Clubs efforts — top-right */}
          <div style={{ position: 'absolute', right: '22%', top: '45%' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
              Clubs efforts to reach students
            </span>
            <svg width="60" height="70" viewBox="0 0 60 70" style={{ display: 'block', marginTop: '4px', transform: 'rotate(-30deg) scaleX(-1)' }}>
              <path d="M10,70 Q8,30 50,8" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M40,3 L55,8 L45,22" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Zero Personalization — far-right */}
          <div style={{ position: 'absolute', right: '10%', top: '53%' }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, color: '#555', fontSize: '0.9rem' }}>
              Zero Personalization
            </span>
            <svg width="60" height="70" viewBox="0 0 60 70" style={{ display: 'block', marginTop: '4px', transform: 'rotate(-15deg) scaleX(-1)' }}>
              <path d="M10,70 Q8,30 50,8" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M40,3 L55,8 L45,22" fill="none" stroke="#555" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
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
    </section>
  );
};

export default ProblemStory;
