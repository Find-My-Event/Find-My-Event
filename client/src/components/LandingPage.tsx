import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useInView, type Variants } from 'framer-motion';
import { Calendar, Users, Zap, MapPin, Star, Mic, Code, Palette, Dumbbell, Camera } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type Ease4 = [number, number, number, number];

const EASE: Ease4 = [0.22, 1, 0.36, 1];

/* ── Fade-up variant ── */
const fadeUp = (delay = 0): Variants => ({
  hidden:  { opacity: 0, y: 48, filter: 'blur(6px)' },
  visible: { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { duration: 0.7, ease: EASE, delay } },
});

const fadeLeft = (delay = 0): Variants => ({
  hidden:  { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.65, ease: EASE, delay } },
});

const fadeRight = (delay = 0): Variants => ({
  hidden:  { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.65, ease: EASE, delay } },
});

/* ─────────────────────────────────────
   Section label pill
───────────────────────────────────── */
const SectionPill = ({ text }: { text: string }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: 'rgba(139,92,246,0.08)',
    border: '1px solid rgba(139,92,246,0.2)',
    borderRadius: '9999px',
    padding: '0.3rem 0.9rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    color: '#8B5CF6',
    letterSpacing: '0.04em',
    marginBottom: '1.25rem',
  }}>
    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#8B5CF6', display: 'inline-block' }} />
    {text}
  </div>
);

/* ─────────────────────────────────────
   PROBLEM SECTION
───────────────────────────────────── */
const PROBLEMS = [
  { icon: MapPin,    title: 'Fragmented Discovery',       desc: 'Events scattered across WhatsApp groups, posters, and word-of-mouth. No single source of truth.' },
  { icon: Users,     title: 'Disconnected Experience',    desc: 'Students and clubs operate in silos. There\'s no shared platform for campus activities.' },
  { icon: Star,      title: 'Zero Personalization',       desc: 'Generic announcements that don\'t match your interests or schedule.' },
  { icon: Zap,       title: 'Low Club Visibility',        desc: 'Student clubs struggle to reach beyond their immediate circle despite great events.' },
];

const ProblemSection = () => {
  /* ── DOM refs ── */
  const secRef   = useRef<HTMLElement>(null);
  const blobRef  = useRef<HTMLDivElement>(null);
  const pillRef  = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const line3Ref = useRef<HTMLSpanElement>(null);
  const line4Ref = useRef<HTMLSpanElement>(null);
  const descRef  = useRef<HTMLParagraphElement>(null);
  const ctaRef   = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const cardEls  = useRef<HTMLDivElement[]>([]);
  const addCard  = (el: HTMLDivElement | null, i: number) => { if (el) cardEls.current[i] = el; };

  const arrow0Ref = useRef<SVGPathElement>(null);
  const arrow1Ref = useRef<SVGPathElement>(null);
  const arrow2Ref = useRef<SVGPathElement>(null);
  const arrow3Ref = useRef<SVGPathElement>(null);

  const label0Ref = useRef<HTMLDivElement>(null);
  const label1Ref = useRef<HTMLDivElement>(null);
  const label2Ref = useRef<HTMLDivElement>(null);
  const label3Ref = useRef<HTMLDivElement>(null);

  const svgRef   = useRef<SVGSVGElement>(null);
  const microWrapRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const sec   = secRef.current;
    if (!sec) return;

    const cards = cardEls.current.filter(Boolean);
    const width = window.innerWidth;
    const isMobile = width < 768;

    // Responsive fan configuration offsets
    const xMult = isMobile ? 60 : 330;
    const yMult = isMobile ? 10 : 10;
    const rotMult = isMobile ? 4 : 9;

    const fanX = [-xMult, -xMult / 3, xMult / 3, xMult];
    const fanY = [yMult, 0, 0, yMult];
    const fanRot = [-rotMult, -rotMult / 3, rotMult / 3, rotMult];

    const ctx = gsap.context(() => {
      /* ─────────────────────────────────────────────
         TIER 1 — INITIAL STATE
         Clean, minimal, badge & text hidden.
         Card 0 centered & visible; cards 1,2,3 stacked behind.
      ───────────────────────────────────────────── */
      gsap.set(pillRef.current,  { scale: 0.85, opacity: 0, y: 20 });
      gsap.set(line1Ref.current, { y: 50, opacity: 0, filter: 'blur(14px)' });
      gsap.set(line2Ref.current, { y: 60, opacity: 0, filter: 'blur(16px)', scale: 0.97 });
      gsap.set([line3Ref.current, line4Ref.current], { y: 30, opacity: 0, filter: 'blur(8px)' });
      gsap.set(descRef.current,  { y: 30, opacity: 0, filter: 'blur(8px)'  });
      gsap.set(ctaRef.current,   { scale: 0.95, y: 15, opacity: 0 });

      // Start position (Card 0 is floating off-center initially, others stacked behind it)
      const startX = isMobile ? -40 : -200;
      const startY = isMobile ? 30 : 60;
      cards.forEach((card, i) => {
        if (i === 0) {
          gsap.set(card, { x: startX, y: startY, rotate: 0, scale: 1.05, opacity: 1, zIndex: 10 });
        } else {
          gsap.set(card, { x: startX, y: startY, rotate: 0, scale: 0.95, opacity: 0, zIndex: 10 - i });
        }
      });

      // Default subtle shadow for initial state
      gsap.set(cards, {
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
      });

      // SVG path length initialization
      [arrow0Ref.current, arrow1Ref.current, arrow2Ref.current, arrow3Ref.current].forEach(path => {
        if (path) {
          const len = path.getTotalLength();
          gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
        }
      });

      // Labels hidden
      gsap.set([label0Ref.current, label1Ref.current, label2Ref.current, label3Ref.current], { opacity: 0, scale: 0.85, y: 15 });

      /* ─────────────────────────────────────────────
         TIER 2 — ENTRANCE TIMELINE
         Cards emerge from behind Card 0 and fan out.
         Camera zooms out (container scales 1.05 -> 1).
         Heading and other text reveal after cards settle.
      ───────────────────────────────────────────── */
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start:   'top 100%',
          end:     'top top',
          scrub:   1,
          invalidateOnRefresh: true,
        }
      });

      // Camera zooms and translates with a natural smooth deceleration (Unified composition)
      entranceTl.fromTo(cardsRef.current, { scale: 1.08, y: 60 }, { scale: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0);

      // Deck opens up fanning out
      cards.forEach((card, i) => {
        entranceTl.to(card, {
          x: fanX[i],
          y: fanY[i],
          rotate: fanRot[i],
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out'
        }, 0);
      });

      // Shadow strength increases gradually
      entranceTl.to(cards, {
        boxShadow: '0 24px 64px rgba(139,92,246,0.14), 0 4px 16px rgba(0,0,0,0.06)',
        duration: 0.6,
        ease: 'power1.out',
      }, 0);

      // ── Breathing Pause: 0.5s (from t = 0.6 to t = 1.1)

      // ── Badge Reveal (pillRef): t = 1.1s to 1.7s
      entranceTl.to(pillRef.current, {
        scale: 1,
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out'
      }, 1.1);

      // ── Heading Line 1 Reveal: t = 1.7s to 2.6s (after badge finishes)
      entranceTl.to(line1Ref.current, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        ease: 'power4.out'
      }, 1.7);

      // ── Heading Line 2 Reveal: t = 1.85s to 2.85s (150ms after Line 1 starts)
      entranceTl.to(line2Ref.current, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        scale: 1,
        duration: 1.0,
        ease: 'expo.out'
      }, 1.85);

      // ── Description Reveal: t = 3.05s to 3.85s (200ms after heading finishes)
      entranceTl.to(descRef.current, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        ease: 'power3.out'
      }, 3.05);

      // ── CTA Button Reveal: t = 4.0s to 4.7s (150ms after description finishes)
      entranceTl.to(ctaRef.current, {
        scale: 1,
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'power3.out'
      }, 4.0);

      /* ─────────────────────────────────────────────
         TIER 3 — STORYTELLING PIN TIMELINE
         Phase 1 -> Phase 2 text swap.
         Curved connector lines drawing one-by-one with labels.
         Cards remain pinned and fanned.
      ───────────────────────────────────────────── */
      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start:   'top top',
          end:     '+=130%',
          pin:     true,
          pinSpacing:    true,
          scrub:   1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        }
      });

      // Text swap is heavily delayed (approx 65% of pin scroll) to increase screen reading time
      storyTl.to([line1Ref.current, line2Ref.current], { y: -25, opacity: 0, filter: 'blur(6px)', duration: 0.8, ease: 'power3.inOut' }, 2.6);
      storyTl.to(line3Ref.current, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.inOut' }, 3.1);
      storyTl.to(line4Ref.current, { y: 0, opacity: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power3.inOut' }, 3.35);

      // Desktop connector lines & annotations draw sequentially
      if (!isMobile) {
        // Arrow 0 + Label 0
        storyTl.to(arrow0Ref.current, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, 3.7);
        storyTl.to(label0Ref.current, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 3.85);

        // Arrow 1 + Label 1
        storyTl.to(arrow1Ref.current, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, 4.1);
        storyTl.to(label1Ref.current, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 4.25);

        // Arrow 2 + Label 2
        storyTl.to(arrow2Ref.current, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, 4.5);
        storyTl.to(label2Ref.current, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 4.65);

        // Arrow 3 + Label 3
        storyTl.to(arrow3Ref.current, { strokeDashoffset: 0, duration: 0.6, ease: 'power1.inOut' }, 4.9);
        storyTl.to(label3Ref.current, { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 5.05);
      }

      /* ─────────────────────────────────────────────
         TIER 4 — EXIT TIMELINE
         Fades the entire composition out & upwards.
      ───────────────────────────────────────────── */
      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start:   'bottom bottom',
          end:     'bottom top',
          scrub:   1,
          invalidateOnRefresh: true,
        }
      });

      exitTl.to([line3Ref.current, line4Ref.current, descRef.current, ctaRef.current], {
        y: -60, opacity: 0, filter: 'blur(6px)', ease: 'none'
      }, 0);

      // Keep fanned cards alive until the very end by shifting them down to counter scroll up (Parallax Escort)
      exitTl.to(cardsRef.current, {
        y: 100, opacity: 0.05, filter: 'blur(5px)', ease: 'power1.out'
      }, 0);

      if (!isMobile) {
        exitTl.to([label0Ref.current, label1Ref.current, label2Ref.current, label3Ref.current], {
          y: -40, opacity: 0, ease: 'none'
        }, 0);
      }

      /* ─────────────────────────────────────────────
         TIER 5 — CONTINUOUS IDLE ANIMATIONS
         (Targeted at lp-card-inner wrapper to prevent ScrollTrigger conflict)
      ───────────────────────────────────────────── */
      cards.forEach((card, i) => {
        const inner = card.querySelector('.lp-card-inner');
        if (!inner) return;
        const dir = i % 2 === 0 ? 1 : -1;
        const amp = 6 + i * 1.2;
        gsap.to(inner, {
          y: `+=${dir * amp}`,
          duration: 2.6 + i * 0.4,
          ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.25,
        });
      });

      // Camera micro-movements on microWrapRef.current (infinite yoyo sine pan, absolute coordinates for safety)
      if (microWrapRef.current) {
        gsap.fromTo(microWrapRef.current,
          { x: -5, y: -3, scale: 1 },
          {
            x: 5,
            y: 3,
            scale: 1.015,
            duration: 7,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          }
        );
      }

      // Purple background radial glow breathing
      if (blobRef.current) {
        gsap.set(blobRef.current, { scale: 1, opacity: 0.08 });
        gsap.to(blobRef.current, {
          scale: 1.12,
          opacity: 0.12,
          duration: 8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      }
    }, secRef);

    /* ─────────────────────────────────────────────
       TIER 6 — MOUSE PARALLAX (rAF lerp)
    ───────────────────────────────────────────── */
    let rawMx = 0, rawMy = 0, smMx = 0, smMy = 0;
    const LERP = 0.06;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      const r  = sec.getBoundingClientRect();
      rawMx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      rawMy = ((e.clientY - r.top)  / r.height - 0.5) * 2;
    };

    const tick = () => {
      smMx += (rawMx - smMx) * LERP;
      smMy += (rawMy - smMy) * LERP;

      cards.forEach((card, i) => {
        const d = 0.7 + i * 0.15;
        gsap.set(card, { rotateY: smMx * 4 * d, rotateX: -smMy * 3 * d });
      });

      if (blobRef.current) {
        gsap.set(blobRef.current, { x: smMx * 28, y: smMy * 18 });
      }

      rafId = requestAnimationFrame(tick);
    };

    sec.addEventListener('mousemove', onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      sec.removeEventListener('mousemove', onMove);
    };
  }, []);

  return (
    <section
      ref={secRef}
      style={{
        position: 'relative',
        padding: 'clamp(5rem,10vh,9rem) clamp(1.5rem,6vw,6rem)',
        background: 'linear-gradient(180deg, #EEE5FF 0%, #ffffff 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Blob */}
      <div
        ref={blobRef}
        className="lp-blob"
        style={{ width: '400px', height: '400px', background: 'rgba(139,92,246,0.1)', top: '-100px', right: '-100px' }}
      />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* ── Headline block ── */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>

          {/* Badge */}
          <div ref={pillRef} style={{ willChange: 'transform, opacity' }}>
            <SectionPill text="THE PROBLEM" />
          </div>

          {/* Headline */}
          <h2 style={{
            fontSize: 'clamp(2rem,4.5vw,3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#111',
            lineHeight: 1.1,
            position: 'relative',
            height: '2.3em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}>
            {/* Phase 1 Text */}
            <div style={{ position: 'absolute', willChange: 'transform, opacity, filter', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                ref={line1Ref}
                style={{ display: 'block', willChange: 'transform, opacity, filter' }}
              >
                Campus events are a
              </span>
              <span
                ref={line2Ref}
                style={{
                  display: 'block',
                  willChange: 'transform, opacity, filter',
                  background: 'linear-gradient(135deg,#8B5CF6,#C084FC)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >
                chaotic mess.
              </span>
            </div>

            {/* Phase 2 Text */}
            <div style={{ position: 'absolute', willChange: 'transform, opacity, filter', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                ref={line3Ref}
                style={{ display: 'block', willChange: 'transform, opacity, filter' }}
              >
                Eventum solves
              </span>
              <span
                ref={line4Ref}
                style={{
                  display: 'block',
                  willChange: 'transform, opacity, filter',
                  background: 'linear-gradient(135deg,#8B5CF6,#C084FC)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}
              >
                all of these!
              </span>
            </div>
          </h2>

          {/* Description */}
          <p
            ref={descRef}
            style={{
              color: '#6B7280', fontSize: 'clamp(0.9rem,1.3vw,1.05rem)',
              marginTop: '1rem', maxWidth: '500px', margin: '1rem auto 0', lineHeight: 1.65,
              willChange: 'transform, opacity, filter',
            }}
          >
            Without a unified platform, students miss out and clubs can&apos;t grow.
          </p>

          {/* CTA */}
          <div ref={ctaRef} style={{ marginTop: '2rem', willChange: 'transform, opacity' }}>
            <button className="lp-btn-primary lp-btn-cta" style={{ background: '#111' }} onClick={() => window.location.hash = '#signin'}>
              See How We Fix It →
            </button>
          </div>
        </div>

        {/* ── Problem cards container ── */}
        <div
          ref={cardsRef}
          style={{
            position: 'relative',
            height: '420px',
            width: '100%',
            maxWidth: '1000px',
            margin: '0 auto',
            top: '-15px',
            willChange: 'transform, opacity',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            perspective: '1200px',
          }}
        >
          {/* Infinite camera micro-movement wrapper */}
          <div
            ref={microWrapRef}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              willChange: 'transform',
            }}
          >
          {/* Floating annotations / labels (only visible on desktop) */}
          {!isMobile && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
              {/* Label 0 */}
              <div
                ref={label0Ref}
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '80px',
                  maxWidth: '150px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  lineHeight: 1.4,
                  willChange: 'transform, opacity',
                }}
              >
                Fragmented Discovery
              </div>

              {/* Label 1 */}
              <div
                ref={label1Ref}
                style={{
                  position: 'absolute',
                  left: '190px',
                  top: '40px',
                  maxWidth: '180px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  lineHeight: 1.4,
                  willChange: 'transform, opacity',
                }}
              >
                Disconnected Experience
              </div>

              {/* Label 2 */}
              <div
                ref={label2Ref}
                style={{
                  position: 'absolute',
                  right: '190px',
                  top: '40px',
                  maxWidth: '190px',
                  textAlign: 'right',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  lineHeight: 1.4,
                  willChange: 'transform, opacity',
                }}
              >
                Clubs efforts to reach students
              </div>

              {/* Label 3 */}
              <div
                ref={label3Ref}
                style={{
                  position: 'absolute',
                  right: '20px',
                  top: '80px',
                  maxWidth: '150px',
                  textAlign: 'right',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#6B7280',
                  lineHeight: 1.4,
                  willChange: 'transform, opacity',
                }}
              >
                Zero Personalization
              </div>
            </div>
          )}

          {/* SVG Connector Lines Container */}
          {!isMobile && (
            <svg
              ref={svgRef}
              viewBox="0 0 1000 420"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2 }}
            >
              <defs>
                <marker id="lp-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#8B5CF6" />
                </marker>
              </defs>
              <path ref={arrow0Ref} d="M60,100 Q130,120 190,185" stroke="#8B5CF6" strokeWidth="2" fill="none" markerEnd="url(#lp-arrow)" style={{ willChange: 'stroke-dashoffset' }} />
              <path ref={arrow1Ref} d="M205,55 Q275,85 340,165" stroke="#8B5CF6" strokeWidth="2" fill="none" markerEnd="url(#lp-arrow)" style={{ willChange: 'stroke-dashoffset' }} />
              <path ref={arrow2Ref} d="M795,55 Q725,85 660,165" stroke="#8B5CF6" strokeWidth="2" fill="none" markerEnd="url(#lp-arrow)" style={{ willChange: 'stroke-dashoffset' }} />
              <path ref={arrow3Ref} d="M940,100 Q870,120 810,185" stroke="#8B5CF6" strokeWidth="2" fill="none" markerEnd="url(#lp-arrow)" style={{ willChange: 'stroke-dashoffset' }} />
            </svg>
          )}

          {PROBLEMS.map((p, i) => (
            <div
              key={p.title}
              ref={el => addCard(el, i)}
              style={{
                position: 'absolute',
                width: '240px',
                height: '300px',
                left: '50%',
                top: '64%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(255,255,255,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(139,92,246,0.1)',
                borderRadius: '20px',
                padding: '1.5rem',
                willChange: 'transform, opacity, box-shadow, filter',
                transformStyle: 'preserve-3d',
                transition: 'box-shadow 0.3s ease',
                zIndex: 10 - i,
              }}
              onMouseEnter={e => gsap.to(e.currentTarget, { y: -4, boxShadow: '0 24px 64px rgba(139,92,246,0.18)', duration: 0.32, ease: 'power3.out', overwrite: 'auto' })}
              onMouseLeave={e => gsap.to(e.currentTarget, { y: 0,  boxShadow: '0 20px 60px rgba(139,92,246,0.12), 0 4px 16px rgba(0,0,0,0.06)', duration: 0.38, ease: 'power3.out', overwrite: 'auto' })}
            >
              <div className="lp-card-inner">
                <div style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(192,132,252,0.12))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  <p.icon size={18} color="#8B5CF6" strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#111', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>{p.title}</h3>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────
   SOLUTION SECTION
───────────────────────────────────── */
const SOLUTIONS = [
  { icon: Calendar, title: 'Unified Discovery',    desc: 'All campus events in one beautifully organised feed, filtered by your interests.' },
  { icon: Users,    title: 'Connected Community',  desc: 'Students and clubs on the same platform, building a thriving campus ecosystem.' },
  { icon: Star,     title: 'Smart Personalisation', desc: 'AI-powered recommendations that surface events you\'ll actually love.' },
  { icon: Zap,      title: 'Instant Registration', desc: 'One-click sign-up, real-time confirmations, no forms or friction.' },
];

const SolutionSection = () => {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(5rem,10vh,9rem) clamp(1.5rem,6vw,6rem)',
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <div className="lp-blob" style={{ width: '380px', height: '380px', background: 'rgba(139,92,246,0.08)', bottom: '-80px', left: '-80px', animationDelay: '2s' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '4rem', alignItems: 'center' }}>

          {/* Left text */}
          <div>
            <motion.div variants={fadeLeft(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <SectionPill text="THE SOLUTION" />
            </motion.div>
            <motion.h2 variants={fadeLeft(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              style={{ fontSize: 'clamp(2rem,4.5vw,3.5rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#111', lineHeight: 1.1, marginBottom: '1.25rem' }}>
              Eventum solves<br />
              <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>all of these.</span>
            </motion.h2>
            <motion.p variants={fadeLeft(0.2)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
              style={{ color: '#6B7280', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              One platform that connects every student to every event, and every club to every student.
            </motion.p>
            <motion.div variants={fadeLeft(0.3)} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <button className="lp-btn-primary" onClick={() => window.location.hash = '#signin'}>
                Get Started Free →
              </button>
            </motion.div>
          </div>

          {/* Right grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            {SOLUTIONS.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeRight(0.1 + i * 0.1)}
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(139,92,246,0.14)' }}
                style={{
                  background: i === 0
                    ? 'linear-gradient(135deg,#8B5CF6,#6D28D9)'
                    : 'rgba(247,242,255,0.9)',
                  border: `1px solid ${i === 0 ? 'transparent' : 'rgba(139,92,246,0.12)'}`,
                  borderRadius: '18px',
                  padding: '1.25rem',
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                <div style={{
                  width: '36px', height: '36px', borderRadius: '10px',
                  background: i === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(139,92,246,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '0.85rem',
                }}>
                  <s.icon size={17} color={i === 0 ? '#fff' : '#8B5CF6'} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 700, color: i === 0 ? '#fff' : '#111', marginBottom: '0.4rem', letterSpacing: '-0.01em' }}>{s.title}</h3>
                <p style={{ fontSize: '0.78rem', color: i === 0 ? 'rgba(255,255,255,0.75)' : '#6B7280', lineHeight: 1.55 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────
   HOW IT WORKS SECTION
───────────────────────────────────── */
const STEPS = [
  {
    number: '01',
    title: 'Discover',
    desc: 'Explore events, clubs, workshops, hackathons, and experiences tailored to your interests.',
  },
  {
    number: '02',
    title: 'Register',
    desc: 'Join any event in seconds with a seamless registration process and instant confirmation.',
  },
  {
    number: '03',
    title: 'Track',
    desc: 'Track your tickets, attend events, check-in using QR codes, and build your campus timeline.',
  },
];

const HowItWorksSection = () => {
  const secRef = useRef<HTMLElement>(null);
  const leftItemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const rightItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;

    const leftItems = leftItemsRef.current.filter(Boolean) as HTMLDivElement[];
    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const rightItems = rightItemsRef.current.filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      // 1. Initial State Setup
      
      // Left steps: 0 is active, others are faded
      gsap.set(leftItems[0], { opacity: 1 });
      gsap.set(leftItems[0].querySelector('.step-pill'), { background: '#111', color: '#fff' });
      gsap.set([leftItems[1], leftItems[2]], { opacity: 0.3 });
      gsap.set([leftItems[1].querySelector('.step-pill'), leftItems[2].querySelector('.step-pill')], { background: 'transparent', color: '#111', borderColor: 'rgba(0,0,0,0.2)' });

      // Center cards: 0 is front, 1 is middle, 2 is back
      gsap.set(cards[0], { zIndex: 10, scale: 1, x: 0, y: 0, rotate: 0, opacity: 1 });
      gsap.set(cards[1], { zIndex: 9, scale: 0.95, x: 25, y: -15, rotate: 6, opacity: 1 });
      gsap.set(cards[2], { zIndex: 8, scale: 0.9, x: 50, y: -30, rotate: 12, opacity: 1 });

      // Right descriptions: 0 is visible, others are hidden/shifted
      gsap.set(rightItems[0], { opacity: 1, y: 0 });
      gsap.set([rightItems[1], rightItems[2]], { opacity: 0, y: 30 });

      // 2. Scroll Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sec,
          start: 'top top',
          end: '+=200%',
          pin: true,
          pinSpacing: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // --- Transition 1: Step 0 -> Step 1 ---
      // Left
      tl.to(leftItems[0], { opacity: 0.3, duration: 1 }, 0);
      tl.to(leftItems[0].querySelector('.step-pill'), { background: 'transparent', color: '#111', borderColor: 'rgba(0,0,0,0.2)', duration: 1 }, 0);
      tl.to(leftItems[1], { opacity: 1, duration: 1 }, 0);
      tl.to(leftItems[1].querySelector('.step-pill'), { background: '#111', color: '#fff', borderColor: 'transparent', duration: 1 }, 0);
      
      // Center (Card 0 flies left/out, Card 1 moves to front, Card 2 moves to middle)
      tl.to(cards[0], { x: -150, y: 50, rotate: -15, opacity: 0, scale: 0.9, duration: 1 }, 0);
      tl.to(cards[1], { x: 0, y: 0, rotate: 0, scale: 1, duration: 1 }, 0);
      tl.to(cards[2], { x: 25, y: -15, rotate: 6, scale: 0.95, duration: 1 }, 0);

      // Right
      tl.to(rightItems[0], { opacity: 0, y: -30, duration: 1 }, 0);
      tl.to(rightItems[1], { opacity: 1, y: 0, duration: 1 }, 0);

      // --- Hold Phase 1 ---
      tl.to({}, { duration: 0.5 }); 

      // --- Transition 2: Step 1 -> Step 2 ---
      // Left
      tl.to(leftItems[1], { opacity: 0.3, duration: 1 }, 1.5);
      tl.to(leftItems[1].querySelector('.step-pill'), { background: 'transparent', color: '#111', borderColor: 'rgba(0,0,0,0.2)', duration: 1 }, 1.5);
      tl.to(leftItems[2], { opacity: 1, duration: 1 }, 1.5);
      tl.to(leftItems[2].querySelector('.step-pill'), { background: '#111', color: '#fff', borderColor: 'transparent', duration: 1 }, 1.5);
      
      // Center (Card 1 flies left/out, Card 2 moves to front)
      tl.to(cards[1], { x: -150, y: 50, rotate: -15, opacity: 0, scale: 0.9, duration: 1 }, 1.5);
      tl.to(cards[2], { x: 0, y: 0, rotate: 0, scale: 1, duration: 1 }, 1.5);

      // Right
      tl.to(rightItems[1], { opacity: 0, y: -30, duration: 1 }, 1.5);
      tl.to(rightItems[2], { opacity: 1, y: 0, duration: 1 }, 1.5);

      // --- Hold Phase 2 ---
      tl.to({}, { duration: 0.5 });

    }, secRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={secRef}
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg,#F7F2FF 0%,#FFFFFF 100%)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '6rem 2rem',
        overflow: 'hidden'
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        {/* Title */}
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 800,
          color: '#180828',
          letterSpacing: '-0.02em',
          marginBottom: '5rem'
        }}>
          3 Steps to LAUNCH
        </h2>

        {/* 3-Column Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1.5fr 1fr',
          gap: '4rem',
          alignItems: 'center',
        }}>
          
          {/* Left Column: Steps */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }} />
            {STEPS.map((step, idx) => (
              <div key={step.number}>
                <div
                  ref={el => { leftItemsRef.current[idx] = el; }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    padding: '2.5rem 0',
                    willChange: 'opacity',
                  }}
                >
                  <div className="step-pill" style={{
                    padding: '0.4rem 1.2rem',
                    borderRadius: '999px',
                    border: '1px solid transparent',
                    fontSize: '1rem',
                    fontWeight: 600,
                    transition: 'all 0.3s ease'
                  }}>
                    {step.number}
                  </div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111' }}>
                    {step.title}
                  </div>
                </div>
                <div style={{ width: '100%', height: '1px', background: 'rgba(0,0,0,0.1)' }} />
              </div>
            ))}
          </div>

          {/* Center Column: Card Stack */}
          <div style={{ position: 'relative', height: '450px', perspective: '1200px' }}>
            {/* Card 1 */}
            <div
              ref={el => { cardsRef.current[0] = el; }}
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                transformOrigin: 'bottom left',
                willChange: 'transform, opacity'
              }}
            >
              <img src="/event1.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Step 1" />
            </div>

            {/* Card 2 */}
            <div
              ref={el => { cardsRef.current[1] = el; }}
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                transformOrigin: 'bottom left',
                willChange: 'transform, opacity'
              }}
            >
              <img src="/event2.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Step 2" />
            </div>

            {/* Card 3 (Using Photo style) */}
            <div
              ref={el => { cardsRef.current[2] = el; }}
              style={{
                position: 'absolute', inset: 0,
                borderRadius: '24px', overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)',
                transformOrigin: 'bottom left',
                willChange: 'transform, opacity'
              }}
            >
              <img src="/event1.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Step 3" />
            </div>
          </div>

          {/* Right Column: Descriptions */}
          <div style={{ position: 'relative', height: '150px' }}>
            {STEPS.map((step, idx) => (
              <div
                key={step.number}
                ref={el => { rightItemsRef.current[idx] = el; }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: '1.25rem',
                  lineHeight: 1.6,
                  color: '#111',
                  fontWeight: 500,
                  willChange: 'transform, opacity'
                }}
              >
                {step.desc}
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};



/* ─────────────────────────────────────
   STATS STRIP
───────────────────────────────────── */
const STATS = [
  { value: '5,000+', label: 'Students' },
  { value: '200+',   label: 'Events' },
  { value: '50+',    label: 'Clubs' },
  { value: '98%',    label: 'Satisfaction' },
];

const StatsStrip = () => {
  const ref    = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div
      ref={ref}
      style={{
        background: 'linear-gradient(135deg,#8B5CF6 0%,#6D28D9 100%)',
        padding: 'clamp(2.5rem,5vh,4rem) clamp(1.5rem,6vw,6rem)',
        display: 'flex',
        justifyContent: 'center',
        gap: 'clamp(2rem,6vw,5rem)',
        flexWrap: 'wrap',
      }}
    >
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          variants={fadeUp(i * 0.1)}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: 'clamp(2rem,4vw,2.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
            {s.value}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginTop: '0.3rem', fontWeight: 500 }}>
            {s.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

/* ─────────────────────────────────────
   CTA SECTION
───────────────────────────────────── */
const CtaSection = () => {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="lp-cta-section"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Blobs */}
      <div className="lp-blob" style={{ width: '500px', height: '500px', background: 'rgba(139,92,246,0.15)', top: '-100px', left: '30%' }} />
      <div className="lp-blob" style={{ width: '300px', height: '300px', background: 'rgba(192,132,252,0.12)', bottom: '-80px', right: '10%', animationDelay: '2s' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
        <motion.div variants={fadeUp(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
          <SectionPill text="GET STARTED" />
        </motion.div>
        <motion.h2 variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          className="lp-cta-headline">
          Your next unforgettable event<br />
          <span style={{ background: 'linear-gradient(135deg,#8B5CF6,#C084FC)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            is just one click away.
          </span>
        </motion.h2>
        <motion.p variants={fadeUp(0.2)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ color: '#6B7280', fontSize: 'clamp(0.95rem,1.4vw,1.1rem)', marginTop: '1.25rem', lineHeight: 1.65 }}>
          Join thousands of students discovering the best campus events every day.
        </motion.p>
        <motion.div variants={fadeUp(0.3)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
          style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', marginTop: '2.25rem', flexWrap: 'wrap' }}>
          <button className="lp-btn-primary" style={{ fontSize: '1rem', padding: '0.9rem 2.25rem' }}
            onClick={() => { window.location.hash = '#signin'; }}>
            Start Exploring →
          </button>
          <button className="lp-btn-secondary"
            onClick={() => { window.location.hash = '#discover'; }}>
            View All Events
          </button>
        </motion.div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────
   TESTIMONIALS / SOCIAL PROOF
───────────────────────────────────── */
const TESTIMONIALS = [
  {
    text: 'I used to miss half the events on campus. Now I discover something new every week.',
    name: 'Priya M.',
    role: 'CS Student, 3rd Year',
    avatar: '🎓',
  },
  {
    text: 'As a club coordinator, Eventum helped us triple our event attendance in just one semester.',
    name: 'Rahul K.',
    role: 'Tech Club President',
    avatar: '⚡',
  },
  {
    text: 'The best thing about college is the events. Eventum makes it easy to never miss out.',
    name: 'Ananya S.',
    role: 'Design Student, 2nd Year',
    avatar: '🎨',
  },
];

const TestimonialsSection = () => {
  const ref    = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        padding: 'clamp(5rem,10vh,8rem) clamp(1.5rem,6vw,6rem)',
        background: '#ffffff',
        overflow: 'hidden',
      }}
    >
      <div className="lp-blob" style={{ width: '400px', height: '400px', background: 'rgba(139,92,246,0.07)', top: '0', right: '-100px', animationDelay: '0.5s' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <motion.div variants={fadeUp(0)} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
            <SectionPill text="TESTIMONIALS" />
          </motion.div>
          <motion.h2 variants={fadeUp(0.1)} initial="hidden" animate={inView ? 'visible' : 'hidden'}
            style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#111' }}>
            Loved by students<br />across campus.
          </motion.h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1rem' }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              variants={fadeUp(0.1 + i * 0.1)}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              whileHover={{ y: -4, boxShadow: '0 24px 64px rgba(139,92,246,0.12)' }}
              style={{
                background: i === 1 ? 'linear-gradient(135deg,#8B5CF6,#6D28D9)' : 'rgba(247,242,255,0.7)',
                border: `1px solid ${i === 1 ? 'transparent' : 'rgba(139,92,246,0.1)'}`,
                borderRadius: '22px',
                padding: '1.75rem',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '1rem' }}>{t.avatar}</div>
              <p style={{
                fontSize: '0.9rem',
                lineHeight: 1.65,
                color: i === 1 ? 'rgba(255,255,255,0.9)' : '#444',
                marginBottom: '1.25rem',
                fontStyle: 'italic',
              }}>
                "{t.text}"
              </p>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: i === 1 ? '#fff' : '#111' }}>{t.name}</div>
                <div style={{ fontSize: '0.75rem', color: i === 1 ? 'rgba(255,255,255,0.6)' : '#6B7280', marginTop: '0.15rem' }}>{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────
   FEATURE TAGS ROW (Marquee strip)
───────────────────────────────────── */
const FEATURE_TAGS = [
  { icon: Code,      label: 'Hackathons' },
  { icon: Mic,       label: 'Open Mics' },
  { icon: Palette,   label: 'Art Shows' },
  { icon: Dumbbell,  label: 'Sports Meets' },
  { icon: Camera,    label: 'Photography' },
  { icon: Users,     label: 'Networking' },
  { icon: Calendar,  label: 'Workshops' },
  { icon: Star,      label: 'Fests' },
  { icon: Zap,       label: 'Tech Talks' },
];

const MarqueeStrip = () => (
  <div style={{
    background: '#ffffff', // Changed to white
    padding: '1.5rem 0',
    overflow: 'hidden',
    position: 'relative',
    borderBottom: '1px solid rgba(0,0,0,0.05)',
  }}>
    <div style={{
      display: 'flex',
      gap: '2rem',
      animation: 'marquee 28s linear infinite',
      width: 'max-content',
    }}>
      {[...FEATURE_TAGS, ...FEATURE_TAGS].map((tag, i) => (
        <div 
          key={i} 
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: '9999px',
            padding: '0.45rem 1rem',
            whiteSpace: 'nowrap',
            color: '#111',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: 'default'
          }}
        >
          <tag.icon size={14} color="#8B5CF6" strokeWidth={2.5} />
          {tag.label}
        </div>
      ))}
    </div>
    <style>{`
      @keyframes marquee {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
    `}</style>
  </div>
);

/* ─────────────────────────────────────
   MAIN EXPORT — LandingPage
───────────────────────────────────── */
export { ProblemSection, SolutionSection, HowItWorksSection, StatsStrip, CtaSection, TestimonialsSection, MarqueeStrip };
