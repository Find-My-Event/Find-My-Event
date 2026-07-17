import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CARDS = [
  '/images/landing_page/image_6.png',
  '/images/landing_page/image_7.png',
  '/images/landing_page/image_8_.png',
];

const LaunchSteps = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  // Refs for Phase 1
  const headlineCharsRef = useRef<HTMLSpanElement[]>([]);
  const linePathRef = useRef<SVGPathElement>(null);

  // Refs for Phase 2+ (Columns)
  const columnsWrapRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const centerColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  // Steps
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  
  // Cards
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // Descriptions
  const desc1Ref = useRef<HTMLParagraphElement>(null);
  const desc2Ref = useRef<HTMLParagraphElement>(null);
  const desc3Ref = useRef<HTMLParagraphElement>(null);

  const addChar = (el: HTMLSpanElement | null, i: number) => { if (el) headlineCharsRef.current[i] = el; };
  const addCard = (el: HTMLDivElement | null, i: number) => { if (el) cardsRef.current[i] = el; };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── SET INITIAL STATES ──
      const chars = headlineCharsRef.current.filter(Boolean);
      gsap.set(chars, { opacity: 0.15 });

      if (linePathRef.current) {
        const length = linePathRef.current.getTotalLength();
        gsap.set(linePathRef.current, { strokeDasharray: length, strokeDashoffset: length });
      }

      // Hide columns initially
      gsap.set([leftColRef.current, centerColRef.current, rightColRef.current], { y: 60, opacity: 0 });

      // Steps states
      gsap.set(step1Ref.current, { color: '#000' });
      gsap.set([step2Ref.current, step3Ref.current], { color: '#ccc' });
      gsap.set(step1Ref.current?.querySelector('.circle')!, { background: '#000', color: '#fff' });
      gsap.set([step2Ref.current?.querySelector('.circle')!, step3Ref.current?.querySelector('.circle')!], { background: '#f0f0f0', color: '#ccc' });

      // Cards states
      const cards = cardsRef.current.filter(Boolean);
      gsap.set(cards[0], { y: 0, scale: 1, zIndex: 3 });
      gsap.set(cards[1], { y: 20, scale: 0.95, zIndex: 2, rotate: 2 });
      gsap.set(cards[2], { y: 40, scale: 0.9, zIndex: 1, rotate: -2 });

      // Descriptions states
      gsap.set(desc1Ref.current, { opacity: 1, y: 0 });
      gsap.set([desc2Ref.current, desc3Ref.current], { opacity: 0, y: 20 });

      const isMobile = window.innerWidth <= 768;
      // ── MASTER TIMELINE ──
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

      // ── PHASE 1: Headline Reveal & Line Draw ──
      tl.addLabel("phase1");
      tl.to(chars, {
        opacity: 1,
        stagger: 0.05,
        ease: 'none',
        duration: 1
      }, "phase1");

      if (linePathRef.current) {
        tl.to(linePathRef.current, {
          strokeDashoffset: 0,
          duration: 1,
          ease: 'none'
        }, "phase1");
      }

      tl.to({}, { duration: 0.2 }); // small dwell

      // ── PHASE 2: Layout Snaps Into View ──
      tl.addLabel("phase2");
      // Optional: fade out headline and line as columns come up
      tl.to('.headline-wrap', { opacity: 0, y: -40, duration: 0.5 }, "phase2");
      
      tl.to([leftColRef.current, centerColRef.current, rightColRef.current], {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out'
      }, "phase2+=0.2");

      tl.to({}, { duration: 0.5 }); // read Step 1

      // ── PHASE 4: Scroll to Step 02 ──
      tl.addLabel("step2");
      
      // Card 1 exits up
      tl.to(cards[0], { y: '-120%', opacity: 0, rotate: -5, duration: 1, ease: 'power2.inOut' }, "step2");
      // Card 2 scales up
      tl.to(cards[1], { y: 0, scale: 1, rotate: 0, duration: 1, ease: 'power2.inOut' }, "step2");
      
      // Step 1 to gray
      tl.to(step1Ref.current, { color: '#ccc', duration: 0.5 }, "step2");
      tl.to(step1Ref.current?.querySelector('.circle')!, { background: '#f0f0f0', color: '#ccc', duration: 0.5 }, "step2");
      
      // Step 2 to black
      tl.to(step2Ref.current, { color: '#000', duration: 0.5 }, "step2");
      tl.to(step2Ref.current?.querySelector('.circle')!, { background: '#000', color: '#fff', duration: 0.5 }, "step2");

      // Text crossfade
      tl.to(desc1Ref.current, { opacity: 0, y: -20, duration: 0.5 }, "step2");
      tl.to(desc2Ref.current, { opacity: 1, y: 0, duration: 0.5 }, "step2+=0.5");

      tl.to({}, { duration: 0.5 }); // read Step 2

      // ── PHASE 5: Scroll to Step 03 ──
      tl.addLabel("step3");
      
      // Card 2 exits up
      tl.to(cards[1], { y: '-120%', opacity: 0, rotate: 5, duration: 1, ease: 'power2.inOut' }, "step3");
      // Card 3 scales up
      tl.to(cards[2], { y: 0, scale: 1, rotate: 0, duration: 1, ease: 'power2.inOut' }, "step3");
      
      // Step 2 to gray
      tl.to(step2Ref.current, { color: '#ccc', duration: 0.5 }, "step3");
      tl.to(step2Ref.current?.querySelector('.circle')!, { background: '#f0f0f0', color: '#ccc', duration: 0.5 }, "step3");
      
      // Step 3 to black
      tl.to(step3Ref.current, { color: '#000', duration: 0.5 }, "step3");
      tl.to(step3Ref.current?.querySelector('.circle')!, { background: '#000', color: '#fff', duration: 0.5 }, "step3");

      // Text crossfade
      tl.to(desc2Ref.current, { opacity: 0, y: -20, duration: 0.5 }, "step3");
      tl.to(desc3Ref.current, { opacity: 1, y: 0, duration: 0.5 }, "step3+=0.5");

      // Final dwell before unpinning
      tl.to({}, { duration: 0.5 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Split headline for character animation
  const headline = "3 Steps to LAUNCH";
  const renderHeadline = () => {
    return headline.split('').map((char, index) => {
      if (char === ' ') return <span key={index} style={{ whiteSpace: 'pre' }}> </span>;
      const isLaunch = index >= headline.indexOf('LAUNCH');
      return (
        <span 
          key={index} 
          ref={(el) => addChar(el, index)}
          style={{ 
            fontWeight: isLaunch ? 800 : 600,
            color: '#111',
            textTransform: isLaunch ? 'uppercase' : 'none'
          }}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <section ref={containerRef} style={{
      position: 'relative',
      height: '100vh',
      width: '100%',
      background: '#fafafa',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      
      <style>{`
        .ls-grid { grid-template-columns: 1fr 1fr 1fr; gap: 4rem; }
        .ls-left-col { gap: 2rem; }
        .ls-center-col { height: 500px; }
        .ls-center-col > div { height: 420px; }
        .ls-right-col { height: 150px; }
        .ls-right-col p { font-size: 1.2rem; text-align: left; }
        .ls-step-font { font-size: 1.5rem; }
        .ls-step-circle { width: 40px; height: 40px; font-size: 1rem; }

        @media (max-width: 768px) {
          .ls-grid { grid-template-columns: 1fr; gap: 1.5rem !important; align-content: center; margin-top: 10vh; }
          .ls-left-col { gap: 1rem !important; flex-direction: row !important; justify-content: space-between; }
          .ls-left-col > div.ls-divider { display: none !important; }
          .ls-center-col { height: 420px !important; width: 100% !important; max-width: 340px !important; justify-self: center !important; }
          .ls-center-col > div { height: 420px !important; }
          .ls-right-col { height: 120px !important; justify-content: center; }
          .ls-right-col p { font-size: 1.05rem !important; text-align: center !important; }
          .ls-step-font { font-size: 1rem !important; }
          .ls-step-circle { width: 30px !important; height: 30px !important; font-size: 0.8rem !important; }
        }
      `}</style>

      {/* ── PHASE 1 OVERLAY (Headline & Line) ── */}
      <div className="headline-wrap" style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10
      }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          fontFamily: 'Inter, sans-serif',
          margin: 0,
          letterSpacing: '-0.03em',
          display: 'flex'
        }}>
          {renderHeadline()}
        </h2>
        
        <svg width="2" height="150" style={{ marginTop: '2rem' }}>
          <path 
            ref={linePathRef}
            d="M1 150 V0" 
            stroke="#111" 
            strokeWidth="2" 
            fill="none" 
          />
        </svg>
      </div>

      {/* ── PHASE 2+ LAYOUT (3 Columns) ── */}
      <div ref={columnsWrapRef} className="ls-grid" style={{
        position: 'absolute',
        width: '100%',
        maxWidth: '1200px',
        padding: '0 2rem',
        display: 'grid',
        alignItems: 'center',
        zIndex: 20
      }}>
        
        {/* LEFT COL: Steps List */}
        <div ref={leftColRef} className="ls-left-col" style={{ display: 'flex', flexDirection: 'column' }}>
          
          {/* Step 01 */}
          <div ref={step1Ref} className="ls-step-font" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, transition: 'color 0.3s' }}>
            <div className="circle ls-step-circle" style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
              01
            </div>
            Discover
          </div>
          <div className="ls-divider" style={{ height: '1px', background: 'rgba(0,0,0,0.1)', width: '100%' }} />

          {/* Step 02 */}
          <div ref={step2Ref} className="ls-step-font" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, transition: 'color 0.3s' }}>
            <div className="circle ls-step-circle" style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
              02
            </div>
            Register
          </div>
          <div className="ls-divider" style={{ height: '1px', background: 'rgba(0,0,0,0.1)', width: '100%' }} />

          {/* Step 03 */}
          <div ref={step3Ref} className="ls-step-font" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, transition: 'color 0.3s' }}>
            <div className="circle ls-step-circle" style={{ borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s' }}>
              03
            </div>
            Track
          </div>
          <div className="ls-divider" style={{ height: '1px', background: 'rgba(0,0,0,0.1)', width: '100%' }} />

        </div>

        {/* CENTER COL: Stacked Cards */}
        <div ref={centerColRef} className="ls-center-col" style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {CARDS.map((img, i) => (
            <div key={i} ref={(el) => addCard(el, i)} style={{
              position: 'absolute',
              width: '100%',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              willChange: 'transform, opacity',
              overflow: 'hidden',
              background: '#111'
            }}>
              <img src={img} alt={`Step ${i+1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        {/* RIGHT COL: Description Text */}
        <div ref={rightColRef} className="ls-right-col" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          
          <p ref={desc1Ref} style={{
            position: 'absolute',
            fontFamily: 'Inter, sans-serif',
            color: '#444',
            lineHeight: 1.5,
            margin: 0,
            width: '100%'
          }}>
            Explore events, clubs, workshops, hackathons, and experiences tailored to your interests.
          </p>
          
          <p ref={desc2Ref} style={{
            position: 'absolute',
            fontFamily: 'Inter, sans-serif',
            color: '#444',
            lineHeight: 1.5,
            margin: 0,
            width: '100%'
          }}>
            Stay updated with schedules, announcements, reminders, and your event progress in one place.
          </p>

          <p ref={desc3Ref} style={{
            position: 'absolute',
            fontFamily: 'Inter, sans-serif',
            color: '#444',
            lineHeight: 1.5,
            margin: 0,
            width: '100%'
          }}>
            Keep a live pulse on your entire campus journey. Track tickets, certificates, and memories effortlessly.
          </p>

        </div>

      </div>

    </section>
  );
};

export default LaunchSteps;
