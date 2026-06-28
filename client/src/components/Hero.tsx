/**
 * Hero.tsx — Awwwards × Linear × Apple quality animations
 *
 * DESIGN RULE: Zero changes to layout, colors, classes, spacing or typography.
 * This file only adds / replaces the animation layer.
 *
 * Animation tiers:
 *  1. Page-load intro timeline (badge → headline lines → subtitle → CTAs)
 *  2. Two-phase card animation (stack-rise → fan-spread)
 *  3. Label pop-in (scale bounce stagger)
 *  4. Continuous idle (cards float, labels bob, glow breathes)
 *  5. Mouse parallax (rAF lerp — cards tilt, blobs follow, labels drift)
 *  6. Card hover (lift + glow + rotate)
 *  7. Magnetic buttons (elastic snap-back)
 *  8. Scroll parallax via ScrollTrigger scrub (layered depth, no pin)
 *  9. Full reverse on scroll-back (scrub handles it automatically)
 */

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Card data (design-unchanged) ── */
const EVENT_CARDS = [
  { label: 'Comedy',    bg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)', emoji: '🎭', color: '#e8c468' },
  { label: 'Sports',    bg: 'linear-gradient(135deg,#0f3460 0%,#1a4a8a 100%)', emoji: '⚽', color: '#64d8cb' },
  { label: 'Hackathon', bg: 'linear-gradient(135deg,#0d1117 0%,#1c2a3a 100%)', emoji: '💻', color: '#79d47e' },
  { label: 'Concert',   bg: 'linear-gradient(135deg,#2d1b4e 0%,#4a2878 100%)', emoji: '🎵', color: '#c57bf8' },
  { label: 'Workshop',  bg: 'linear-gradient(135deg,#1a2f1a 0%,#243824 100%)', emoji: '🔧', color: '#84e19c' },
];

/* Fan positions (final resting state, wider fan spread) */
const CARD_X_FINAL   = [-220, -110, 0, 110, 220]; // px offset from center
const CARD_ROT_FINAL = [-18, -9, 0, 9, 18];        // degrees

/* Floating labels (precisely positioned relative to center) */
const FLOAT_LABELS = [
  { label: '🎭 Comedy',    top: '0%',   left: 'calc(50% - 280px)', right: undefined },
  { label: '⚽ Sports',    top: '85%',  left: 'calc(50% - 140px)', right: undefined },
  { label: '💻 Hackathon', top: '-5%',  left: 'calc(50% - 50px)',  right: undefined },
  { label: '🎵 Concert',   top: '85%',  left: 'calc(50% + 50px)',  right: undefined },
  { label: '🔧 Workshop',  top: '5%',   left: 'calc(50% + 160px)', right: undefined },
];

/* ══════════════════════════════════════════════════════════ */
const Hero = () => {
  /* ── Refs — one per animated group ── */
  const heroRef    = useRef<HTMLElement>(null);
  const gradRef    = useRef<HTMLDivElement>(null);
  const blobsRef   = useRef<HTMLDivElement>(null);
  const line1Ref   = useRef<HTMLSpanElement>(null); // "Never Miss,"
  const line2Ref   = useRef<HTMLSpanElement>(null); // "What's"
  const line3Ref   = useRef<HTMLSpanElement>(null); // "Happening!" (accent)
  const line4Ref   = useRef<HTMLSpanElement>(null); // "AROUND YOU"
  const subRef     = useRef<HTMLParagraphElement>(null);
  const ctaRef     = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<HTMLDivElement>(null);
  const labelsRef  = useRef<HTMLDivElement>(null);
  const moreRef    = useRef<HTMLDivElement>(null);
  const cardEls    = useRef<HTMLDivElement[]>([]);

  const addCard = (el: HTMLDivElement | null, i: number) => { if (el) cardEls.current[i] = el; };

  /* ════════════════════════════════════════════════════════
     MASTER EFFECT — all GSAP logic
  ════════════════════════════════════════════════════════ */
  useEffect(() => {
    /* ── Gather element groups ── */
    const cards    = cardEls.current.filter(Boolean);
    const labelEls = Array.from(labelsRef.current?.querySelectorAll('.lp-float-label') ?? []) as HTMLElement[];
    const btnEls   = Array.from(ctaRef.current?.querySelectorAll('button') ?? [])              as HTMLElement[];
    const blobEls  = Array.from(blobsRef.current?.querySelectorAll('.lp-blob') ?? [])          as HTMLElement[];

    const ctx = gsap.context(() => {
      /* ════════════════════════════════════════════════════════
         TIER 1: SET INITIAL HIDDEN STATES
         (instant, before first paint — no flash)
      ════════════════════════════════════════════════════════ */
      // Headline lines — slide-up + blur reveal
      gsap.set([line1Ref.current, line2Ref.current, line4Ref.current],
        { y: 80, opacity: 0, filter: 'blur(15px)' });
      // "Happening!" also gets a slight extra scale start
      gsap.set(line3Ref.current, { y: 80, opacity: 0, filter: 'blur(15px)', scale: 0.9 });

      // Subtitle
      gsap.set(subRef.current, { y: 40, opacity: 0, filter: 'blur(8px)' });

      // CTA buttons below description
      gsap.set(btnEls, { y: 25, opacity: 0 });

      // "and many more" button
      gsap.set(moreRef.current, { y: 18, opacity: 0 });

      // Cards — all stacked at center, below viewport start
      cards.forEach(card => {
        gsap.set(card, { x: 0, y: 250, rotate: 0, scale: 0.6, opacity: 0, transformOrigin: 'center bottom' });
      });

      // Labels — scale-collapsed
      gsap.set(labelEls, { scale: 0.6, opacity: 0 });

      // Blobs — invisible
      gsap.set(blobEls, { opacity: 0, scale: 0.8 });

      /* ════════════════════════════════════════════════════════
         TIER 2: MASTER INTRO TIMELINE
      ════════════════════════════════════════════════════════ */
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      /* — Blobs fade in early (background layer first) — */
      tl.to(blobEls, {
        opacity: 1, scale: 1,
        stagger: 0.15, duration: 1.4, ease: 'power2.out',
      }, 0.05);

      /* — Headline line 1: "Never Miss," — */
      tl.to(line1Ref.current, {
        y: 0, opacity: 1, filter: 'blur(0px)',
        duration: 0.85,
      }, 0.32);

      /* — Headline line 2: "What's" — */
      tl.to(line2Ref.current, {
        y: 0, opacity: 1, filter: 'blur(0px)',
        duration: 0.85,
      }, 0.44);

      /* — Headline line 3: "Happening!" — scale up + glow — */
      tl.to(line3Ref.current, {
        y: 0, opacity: 1, filter: 'blur(0px)', scale: 1,
        duration: 0.9, ease: 'expo.out',
      }, 0.56);

      /* — Glow pulse on "Happening!" — */
      tl.to(line3Ref.current, {
        textShadow: '0 0 40px rgba(139,92,246,0.5), 0 0 80px rgba(192,132,252,0.25)',
        duration: 0.5, ease: 'power2.out',
        yoyo: true, repeat: 1,
      }, '>-0.25');

      /* — Headline line 4: "AROUND YOU" — */
      tl.to(line4Ref.current, {
        y: 0, opacity: 1, filter: 'blur(0px)',
        duration: 0.9,
      }, 0.68);

      /* — Subtitle — */
      tl.to(subRef.current, {
        y: 0, opacity: 1, filter: 'blur(0px)',
        duration: 0.75,
      }, 0.95);

      /* — CTA buttons stagger — */
      tl.to(btnEls, {
        y: 0, opacity: 1,
        stagger: 0.1, duration: 0.65,
      }, 1.05);

      /* — "and many more" — */
      tl.to(moreRef.current, {
        y: 0, opacity: 1, duration: 0.55,
      }, 1.15);

      /* ─ TWO-PHASE CARD ANIMATION ─ */
      const cardStartAt = 0.78;

      /* Phase 1: All cards rise from below, stacked */
      tl.to(cards, {
        y: 0, scale: 0.85, opacity: 1,
        stagger: 0.045,
        duration: 0.75,
        ease: 'power3.out',
      }, cardStartAt);

      /* Phase 2: Cards spread into fan positions with rotation + slight overshoot */
      cards.forEach((card, i) => {
        tl.to(card, {
          x:       CARD_X_FINAL[i],
          rotate:  CARD_ROT_FINAL[i],
          scale:   1,
          duration: 0.95,
          ease:    'back.out(1.3)',
        }, cardStartAt + 0.58 + i * 0.04);
      });

      /* — Labels pop in with bounce after cards spread — */
      tl.to(labelEls, {
        scale: 1, opacity: 1,
        stagger: 0.1,
        duration: 0.55,
        ease: 'back.out(1.9)',
      }, cardStartAt + 1.1);

      /* ════════════════════════════════════════════════════════
         TIER 3: CONTINUOUS IDLE ANIMATIONS
         (targeted at inner elements to prevent scroll conflicts)
      ════════════════════════════════════════════════════════ */
      tl.call(() => {
        cards.forEach((card, i) => {
          const inner = card.querySelector('.lp-card-inner');
          if (!inner) return;
          const amp = 8 + i * 1.5;
          const dur = 2.8 + i * 0.35;
          const dir = i % 2 === 0 ? 1 : -1;
          gsap.to(inner, {
            y:      `+=${dir * amp}`,
            rotate: dir * 1.2,
            duration: dur, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.18,
          });
        });

        labelEls.forEach((el, i) => {
          const dir = i % 2 === 0 ? -1 : 1;
          gsap.to(el, {
            y: `+=${dir * 7}`,
            duration: 2.4 + i * 0.28, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.22,
          });
        });

        blobEls.forEach((blob, i) => {
          gsap.to(blob, {
            scale:   1.08 + i * 0.04,
            opacity: 0.55 + i * 0.05,
            duration: 4 + i * 1.5, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.8,
          });
        });

        if (gradRef.current) {
          gsap.to(gradRef.current, {
            backgroundPosition: '65% 65%',
            duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1,
          });
        }
      });

      /* ════════════════════════════════════════════════════════
         TIER 4: DECOUPLED SCROLL EXIT TIMELINE
         (One clean, robust scrubbed timeline, 100% reversible)
      ════════════════════════════════════════════════════════ */
      const hero = heroRef.current;
      if (hero) {
        const lineEls = [
          line1Ref.current, line2Ref.current,
          line3Ref.current, line4Ref.current,
        ].filter(Boolean) as HTMLElement[];

        const exitTl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });

        exitTl.fromTo(lineEls,
          { y: 0, opacity: 1, filter: 'blur(0px)' },
          { y: -100, opacity: 0, filter: 'blur(8px)', stagger: 0.04, duration: 0.8, ease: 'power1.in' },
          0
        );

        exitTl.fromTo(subRef.current,
          { y: 0, opacity: 1, filter: 'blur(0px)' },
          { y: -80, opacity: 0, filter: 'blur(4px)', duration: 0.8, ease: 'power1.in' },
          0.05
        );

        exitTl.fromTo(btnEls,
          { y: 0, opacity: 1 },
          { y: -60, opacity: 0, duration: 0.8, ease: 'power1.in' },
          0.05
        );

        exitTl.fromTo(moreRef.current,
          { y: 0, opacity: 1 },
          { y: -50, opacity: 0, duration: 0.8, ease: 'power1.in' },
          0.1
        );

        cards.forEach((card, i) => {
          exitTl.fromTo(card,
            { scale: 1, y: 0, rotate: CARD_ROT_FINAL[i], opacity: 1 },
            { scale: 1.12, y: -80, rotate: CARD_ROT_FINAL[i] * 0.6, opacity: 0, duration: 1.0, ease: 'power1.inOut' },
            0
          );
        });

        blobEls.forEach((blob) => {
          exitTl.fromTo(blob,
            { scale: 1, opacity: 1 },
            { scale: 1.25, opacity: 0, duration: 1.0, ease: 'power1.in' },
            0
          );
        });
      }
    }, heroRef);

    /* ════════════════════════════════════════════════════════
       TIER 5: MOUSE PARALLAX (rAF lerp — smooth inertia)
    ════════════════════════════════════════════════════════ */
    let rawMx = 0, rawMy = 0;
    let smMx  = 0, smMy  = 0;
    let rafId: number;
    const LERP = 0.055;

    const onMouseMove = (e: MouseEvent) => {
      const rect = heroRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawMx = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
      rawMy = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    };

    const parallaxTick = () => {
      smMx += (rawMx - smMx) * LERP;
      smMy += (rawMy - smMy) * LERP;

      cards.forEach((card, i) => {
        if (!card) return;
        const depth = (i - 2) * 0.3 + 1;
        gsap.set(card, {
          rotateX: -smMy * 5 * depth,
          rotateY:  smMx * 7 * depth,
          x:       CARD_X_FINAL[i] + smMx * 16 * depth,
        });
      });

      labelEls.forEach((el, i) => {
        const layer = 0.6 + i * 0.2;
        gsap.set(el, {
          x: smMx * (7 + i * 2.5) * layer,
          y: smMy * (5 + i * 1.5) * layer,
        });
      });

      blobEls.forEach((blob, i) => {
        gsap.set(blob as HTMLElement, {
          x: smMx * (18 + i * 8),
          y: smMy * (12 + i * 6),
        });
      });

      rafId = requestAnimationFrame(parallaxTick);
    };

    heroRef.current?.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(parallaxTick);

    /* ════════════════════════════════════════════════════════
       TIER 6: CARD HOVER
    ════════════════════════════════════════════════════════ */
    const hoverTimer = setTimeout(() => {
      cards.forEach(card => {
        const lift = () => gsap.to(card, {
          scale:     1.1,
          z:         50,
          rotateX:   -5,
          boxShadow: '0 44px 100px rgba(0,0,0,0.28), 0 0 48px rgba(139,92,246,0.22)',
          duration:  0.38, ease: 'power3.out', overwrite: 'auto',
        });
        const drop = () => gsap.to(card, {
          scale:     1,
          z:         0,
          rotateX:   0,
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.08)',
          duration:  0.48, ease: 'power3.out', overwrite: 'auto',
        });
        card.addEventListener('mouseenter', lift);
        card.addEventListener('mouseleave', drop);
      });
    }, 2200);

    /* ════════════════════════════════════════════════════════
       TIER 7: MAGNETIC BUTTONS
    ════════════════════════════════════════════════════════ */
    const magnetTimer = setTimeout(() => {
      const magnets = heroRef.current?.querySelectorAll<HTMLButtonElement>('.lp-btn-primary, .lp-btn-secondary') ?? [];
      magnets.forEach(btn => {
        const RADIUS = 85;

        const onMove = (e: MouseEvent) => {
          const r    = btn.getBoundingClientRect();
          const bx   = e.clientX - (r.left + r.width  / 2);
          const by   = e.clientY - (r.top  + r.height / 2);
          const dist = Math.hypot(bx, by);
          if (dist < RADIUS) {
            const pull = 1 - dist / RADIUS;
            gsap.to(btn, { x: bx * pull * 0.38, y: by * pull * 0.26, duration: 0.38, ease: 'power3.out', overwrite: 'auto' });
            const arrow = btn.querySelector('svg');
            if (arrow) gsap.to(arrow, { x: bx * pull * 0.16, duration: 0.32, ease: 'power3.out', overwrite: 'auto' });
          }
        };

        const onLeave = () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1,0.4)', overwrite: 'auto' });
          const arrow = btn.querySelector('svg');
          if (arrow) gsap.to(arrow, { x: 0, duration: 0.55, ease: 'elastic.out(1,0.45)', overwrite: 'auto' });
        };

        btn.addEventListener('mousemove', onMove);
        btn.addEventListener('mouseleave', onLeave);
      });
    }, 2300);

    /* ── Cleanup ── */
    return () => {
      ctx.revert();
      cancelAnimationFrame(rafId);
      heroRef.current?.removeEventListener('mousemove', onMouseMove);
      clearTimeout(hoverTimer);
      clearTimeout(magnetTimer);
    };
  }, []);

  /* ════════════════════════════════════════════════════════
     JSX — DESIGN UNCHANGED
     Only structural change: headline split into 4 individually
     ref-able line spans (visual result is identical).
  ════════════════════════════════════════════════════════ */
  return (
    <section
      ref={heroRef}
      id="hero"
      className="lp-hero lp-hero-bg lp-noise"
      style={{ position: 'relative', perspective: '1400px', minHeight: '85vh', paddingBottom: '2rem', paddingTop: '8rem' }}
    >
      {/* ── Animated gradient background ── */}
      <div
        ref={gradRef}
        style={{
          position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'linear-gradient(135deg,#ffffff 0%,#F7F2FF 40%,#EEE5FF 100%)',
          backgroundSize: '220% 220%',
          backgroundPosition: '0% 0%',
        }}
      />

      {/* ── Blur blobs ── */}
      <div ref={blobsRef} style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div className="lp-blob" style={{ width: '500px', height: '500px', background: 'rgba(139,92,246,0.12)', top: '-100px', left: '55%', animation: 'none' }} />
        <div className="lp-blob" style={{ width: '350px', height: '350px', background: 'rgba(192,132,252,0.10)', bottom: '10%', right: '5%',  animation: 'none' }} />
        <div className="lp-blob" style={{ width: '280px', height: '280px', background: 'rgba(139,92,246,0.08)', bottom: '20%', left: '5%',   animation: 'none' }} />
      </div>

      {/* ══════════════════════
         TEXT CONTENT
      ══════════════════════ */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>

        {/* ── Headline — 4 independently-animated line groups ── */}
        <h1 className="lp-hero-headline">

          {/* Visual line 1 contains three groups ("Never Miss,", "What's", "Happening!") */}
          <span style={{ display: 'block' }}>

            {/* "Never Miss," */}
            <span
              ref={line1Ref}
              style={{
                display: 'inline-block', marginRight: '0.25em',
                willChange: 'transform, opacity, filter',
              }}
            >
              Never Miss,
            </span>

            {/* "What's" */}
            <span
              ref={line2Ref}
              style={{
                display: 'inline-block', marginRight: '0.25em',
                willChange: 'transform, opacity, filter',
              }}
            >
              What&apos;s
            </span>

            {/* "Happening!" — accent gradient */}
            <span
              ref={line3Ref}
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity, filter',
                background: 'linear-gradient(135deg,#8B5CF6 0%,#C084FC 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Happening!
            </span>
          </span>

          {/* Visual line 2 — "AROUND YOU" */}
          <span style={{ display: 'block', fontSize: 'clamp(3rem,7.5vw,6.5rem)', marginTop: '-0.05em' }}>
            <span
              ref={line4Ref}
              style={{
                display: 'inline-block',
                willChange: 'transform, opacity, filter',
              }}
            >
              AROUND YOU
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          ref={subRef}
          className="lp-hero-sub"
          style={{
            willChange: 'transform, opacity, filter',
            maxWidth: '560px',
            margin: '1rem auto 1.5rem',
            textAlign: 'center',
          }}
        >
          Whether it&apos;s a comedy night, a hackathon, or a music fest — find and join the events that matter to you.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="lp-hero-cta-group">
          <button
            className="lp-btn-primary"
            style={{ willChange: 'transform, opacity' }}
            onClick={() => { window.location.hash = '#signin'; }}
          >
            Explore Events
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className="lp-btn-secondary"
            style={{ willChange: 'transform, opacity' }}
            onClick={() => { window.location.hash = '#discover'; }}
          >
            Browse Gallery
          </button>
        </div>
      </div>

      {/* ══════════════════════
         CARD FAN
      ══════════════════════ */}
      <div
        ref={cardsRef}
        className="lp-card-fan"
        style={{ position: 'relative', marginTop: '4rem' }}
      >
        {EVENT_CARDS.map((card, i) => (
          <div
            key={card.label}
            ref={el => addCard(el, i)}
            className="lp-event-card"
            style={{
              width:          '162px',
              height:         '238px',
              left:           '50%',
              top:            '50%',
              transform:      'translate(-50%,-50%)',   // GSAP overrides this
              background:     card.bg,
              zIndex:         5 - Math.abs(i - 2),
              willChange:     'transform, box-shadow, opacity',
              transformStyle: 'preserve-3d',
              boxShadow:      '0 30px 60px -12px rgba(0,0,0,0.5), 0 18px 36px -18px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <div className="lp-card-inner" style={{ width: '100%', height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '20%', left: '30%', width: '60px', height: '60px', borderRadius: '50%', background: card.color, filter: 'blur(20px)', opacity: 0.4, pointerEvents: 'none' }} />
              <div style={{ fontSize: '1.8rem', position: 'relative', zIndex: 1 }}>{card.emoji}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '0.05em', textTransform: 'uppercase', position: 'relative', zIndex: 1 }}>
                {card.label}
              </div>
            </div>
          </div>
        ))}

        {/* Floating labels */}
        <div ref={labelsRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {FLOAT_LABELS.map(lbl => (
            <div
              key={lbl.label}
              className="lp-float-label"
              style={{
                top:         lbl.top,
                left:        lbl.left,
                right:       lbl.right,
                willChange:  'transform, opacity',
                animation:   'none',   /* GSAP controls all motion */
              }}
            >
              {lbl.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── "and many more" ── */}
      <div
        ref={moreRef}
        style={{ position: 'relative', zIndex: 2, marginTop: '2rem', textAlign: 'center', willChange: 'transform, opacity' }}
      >
        <button
          className="lp-btn-primary"
          style={{ background: '#111', fontSize: '0.9rem', padding: '0.7rem 1.6rem' }}
          onClick={() => { window.location.hash = '#events'; }}
        >
          and many more
        </button>
      </div>

      {/* ── Bottom gradient fade ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px',
        background: 'linear-gradient(to bottom, transparent, rgba(238,229,255,0.5))',
        pointerEvents: 'none', zIndex: 1,
      }} />
    </section>
  );
};

export default Hero;
