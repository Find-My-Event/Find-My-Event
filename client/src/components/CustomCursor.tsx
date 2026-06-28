import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [ringClass, setRingClass] = useState('');

  useEffect(() => {
    let dotX = 0, dotY = 0;
    let ringX = 0, ringY = 0;
    let raf: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
      if (!visible) setVisible(true);
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    // Detect hover targets
    const onMouseOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const isCard = el.closest('.lp-event-card, .lp-gallery-item, .lp-step-icon-wrap');
      const isBtn  = el.closest('button, a, .lp-btn-primary, .lp-btn-secondary, .lp-btn-glass, .nav-cta-btn, .nav-link, .nav-button');
      if (isCard) setRingClass('expanded');
      else if (isBtn) setRingClass('hovering-btn');
      else setRingClass('');
    };

    const animate = () => {
      ringX = lerp(ringX, dotX, 0.12);
      ringY = lerp(ringY, dotY, 0.12);

      if (dotRef.current) {
        dotRef.current.style.left  = `${dotX}px`;
        dotRef.current.style.top   = `${dotY}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${ringX}px`;
        ringRef.current.style.top  = `${ringY}px`;
      }
      raf = requestAnimationFrame(animate);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onMouseOver);
    raf = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onMouseOver);
      cancelAnimationFrame(raf);
    };
  }, [visible]);

  // Only show custom cursor on non-touch devices
  const [isTouch] = useState(() => window.matchMedia('(hover: none)').matches);
  if (isTouch) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: visible ? 1 : 0 }}
      />
      <div
        ref={ringRef}
        className={`cursor-ring ${ringClass}`}
        style={{ opacity: visible ? 1 : 0 }}
      />
    </>
  );
};

export default CustomCursor;
