import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ── Unicorn SVG components (unchanged logic, restyled colors) ── */
const UnicornBase = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 300 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
    {children}
  </svg>
);

const UNICORN_BODY = '#111111';
const UNICORN_STROKE = '#222';

const UnicornPose1 = () => (
  <UnicornBase>
    <polygon points="150,20 140,80 160,80" fill="#8B5CF6" />
    <polygon points="150,20 143,55 157,55" fill="#6D28D9" />
    <polygon points="115,90 105,55 130,80" fill="#ddd" />
    <polygon points="185,90 195,55 170,80" fill="#ddd" />
    <polygon points="118,85 110,62 128,78" fill="#C084FC" />
    <polygon points="182,85 190,62 172,78" fill="#C084FC" />
    <g>
      <ellipse cx="150" cy="120" rx="55" ry="50" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
      <rect x="115" y="105" width="30" height="18" rx="4" fill="#fff" opacity="0.9" />
      <rect x="155" y="105" width="30" height="18" rx="4" fill="#fff" opacity="0.9" />
      <line x1="145" y1="114" x2="155" y2="114" stroke="#333" strokeWidth="3" />
      <ellipse cx="150" cy="145" rx="20" ry="12" fill="#EEE5FF" />
      <circle cx="143" cy="143" r="3" fill="#8B5CF6" />
      <circle cx="157" cy="143" r="3" fill="#8B5CF6" />
      <path d="M135,155 Q150,170 165,155" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
    </g>
    <path d="M95,100 Q80,130 85,170" stroke="#8B5CF6" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path d="M90,110 Q72,145 80,185" stroke="#C084FC" strokeWidth="8" fill="none" strokeLinecap="round" />
    <g>
      <rect x="110" y="170" width="80" height="100" rx="20" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
      <path d="M110,200 L70,220 L80,250" stroke={UNICORN_BODY} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M190,200 L230,220 L220,250" stroke={UNICORN_BODY} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="253" r="10" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="1.5" />
      <circle cx="220" cy="253" r="10" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="1.5" />
    </g>
    <path d="M185,190 Q240,230 220,300 Q200,340 230,370" fill="#8B5CF6" opacity="0.6" />
    <rect x="120" y="270" width="18" height="60" rx="9" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
    <rect x="162" y="270" width="18" height="60" rx="9" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
    <ellipse cx="129" cy="335" rx="18" ry="10" fill="#333" />
    <ellipse cx="171" cy="335" rx="18" ry="10" fill="#333" />
  </UnicornBase>
);

const UnicornPose2 = () => (
  <UnicornBase>
    <polygon points="150,15 140,75 160,75" fill="#8B5CF6" />
    <polygon points="150,15 143,50 157,50" fill="#6D28D9" />
    <polygon points="115,85 105,50 130,75" fill="#ddd" />
    <polygon points="185,85 195,50 170,75" fill="#ddd" />
    <polygon points="118,80 110,57 128,73" fill="#C084FC" />
    <polygon points="182,80 190,57 172,73" fill="#C084FC" />
    <g>
      <ellipse cx="150" cy="115" rx="55" ry="50" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
      <rect x="115" y="100" width="30" height="18" rx="4" fill="#fff" opacity="0.9" />
      <rect x="155" y="100" width="30" height="18" rx="4" fill="#fff" opacity="0.9" />
      <ellipse cx="150" cy="140" rx="20" ry="12" fill="#EEE5FF" />
      <circle cx="143" cy="138" r="3" fill="#8B5CF6" />
      <circle cx="157" cy="138" r="3" fill="#8B5CF6" />
      <path d="M135,152 Q150,165 165,152" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
    </g>
    <path d="M95,95 Q75,125 82,165" stroke="#C084FC" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path d="M90,105 Q68,140 78,180" stroke="#8B5CF6" strokeWidth="8" fill="none" strokeLinecap="round" />
    <g>
      <rect x="110" y="165" width="80" height="100" rx="20" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
      <path d="M110,195 L60,160 L50,130" stroke={UNICORN_BODY} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M190,195 L230,230 L240,260" stroke={UNICORN_BODY} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="125" r="10" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="1.5" />
      <circle cx="240" cy="263" r="10" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="1.5" />
    </g>
    <path d="M185,185 Q245,220 225,295 Q210,335 235,365" fill="#8B5CF6" opacity="0.6" />
    <path d="M130,265 L100,330" stroke={UNICORN_BODY} strokeWidth="16" strokeLinecap="round" />
    <path d="M170,265 L200,330" stroke={UNICORN_BODY} strokeWidth="16" strokeLinecap="round" />
    <ellipse cx="95" cy="338" rx="18" ry="10" fill="#333" />
    <ellipse cx="205" cy="338" rx="18" ry="10" fill="#333" />
  </UnicornBase>
);

const UnicornPose3 = () => (
  <UnicornBase>
    <polygon points="160,10 148,70 172,70" fill="#8B5CF6" />
    <polygon points="160,10 152,45 168,45" fill="#6D28D9" />
    <polygon points="120,80 108,45 138,72" fill="#ddd" />
    <polygon points="190,80 202,45 172,72" fill="#ddd" />
    <polygon points="123,75 113,52 135,68" fill="#C084FC" />
    <polygon points="187,75 197,52 169,68" fill="#C084FC" />
    <g>
      <ellipse cx="155" cy="110" rx="55" ry="48" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
      <rect x="120" y="96" width="28" height="18" rx="4" fill="#fff" opacity="0.9" />
      <rect x="160" y="96" width="28" height="18" rx="4" fill="#fff" opacity="0.9" />
      <ellipse cx="155" cy="136" rx="18" ry="11" fill="#EEE5FF" />
      <circle cx="148" cy="134" r="3" fill="#8B5CF6" />
      <circle cx="162" cy="134" r="3" fill="#8B5CF6" />
      <ellipse cx="155" cy="152" rx="8" ry="10" fill="#C084FC" />
    </g>
    <path d="M100,90 Q78,120 84,160" stroke="#8B5CF6" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path d="M95,100 Q70,135 80,175" stroke="#C084FC" strokeWidth="8" fill="none" strokeLinecap="round" />
    <g>
      <rect x="115" y="158" width="80" height="105" rx="20" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
      <path d="M195,190 L250,175 L270,170" stroke={UNICORN_BODY} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M115,200 L70,230" stroke={UNICORN_BODY} strokeWidth="14" fill="none" strokeLinecap="round" />
      <circle cx="275" cy="168" r="10" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="1.5" />
      <circle cx="65" cy="233" r="10" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="1.5" />
    </g>
    <path d="M190,180 Q250,215 230,295 Q215,330 240,360" fill="#8B5CF6" opacity="0.6" />
    <rect x="125" y="263" width="16" height="60" rx="8" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
    <rect x="165" y="263" width="16" height="60" rx="8" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
    <ellipse cx="133" cy="328" rx="16" ry="9" fill="#333" />
    <ellipse cx="173" cy="328" rx="16" ry="9" fill="#333" />
  </UnicornBase>
);

const UnicornPose4 = () => (
  <UnicornBase>
    <polygon points="150,5 138,65 162,65" fill="#8B5CF6" />
    <polygon points="150,5 143,40 157,40" fill="#6D28D9" />
    <polygon points="112,78 100,42 128,68" fill="#ddd" />
    <polygon points="188,78 200,42 172,68" fill="#ddd" />
    <polygon points="115,73 105,49 125,64" fill="#C084FC" />
    <polygon points="185,73 195,49 175,64" fill="#C084FC" />
    <g>
      <ellipse cx="150" cy="108" rx="55" ry="48" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
      <rect x="115" y="94" width="28" height="18" rx="4" fill="#fff" opacity="0.9" />
      <ellipse cx="150" cy="134" rx="18" ry="11" fill="#EEE5FF" />
      <circle cx="143" cy="132" r="3" fill="#8B5CF6" />
      <circle cx="157" cy="132" r="3" fill="#8B5CF6" />
      <path d="M138,148 Q150,160 162,148" fill="none" stroke="#8B5CF6" strokeWidth="3" strokeLinecap="round" />
    </g>
    <path d="M95,88 Q72,118 80,158" stroke="#C084FC" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path d="M90,98 Q65,133 75,173" stroke="#8B5CF6" strokeWidth="8" fill="none" strokeLinecap="round" />
    <g>
      <rect x="110" y="156" width="80" height="105" rx="20" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
      <g>
        <path d="M115,185 L60,130 L50,90" stroke={UNICORN_BODY} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M185,185 L240,130 L250,90" stroke={UNICORN_BODY} strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="48" cy="85" r="10" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="1.5" />
        <circle cx="252" cy="85" r="10" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="1.5" />
        <text x="30" y="75" fontSize="20">✨</text>
        <text x="240" y="75" fontSize="20">✨</text>
      </g>
    </g>
    <path d="M185,178 Q248,210 228,290 Q212,328 238,358" fill="#8B5CF6" opacity="0.6" />
    <rect x="122" y="261" width="16" height="58" rx="8" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
    <rect x="162" y="261" width="16" height="58" rx="8" fill={UNICORN_BODY} stroke={UNICORN_STROKE} strokeWidth="2" />
    <ellipse cx="130" cy="324" rx="16" ry="9" fill="#333" />
    <ellipse cx="170" cy="324" rx="16" ry="9" fill="#333" />
  </UnicornBase>
);

/* ── Cards data ── */
const cards = [
  { title: 'Campus', highlight: 'Events.', text: 'Discover everything happening in your college, all in one beautifully organised place. Never miss a workshop, fest, or hackathon again.', Unicorn: UnicornPose1 },
  { title: 'Find Your', highlight: 'Vibe.', text: 'From cultural fests to tech workshops, Eventum surfaces events aligned with your interests — effortlessly.', Unicorn: UnicornPose2 },
  { title: 'Event', highlight: 'Discovery.', text: 'A smarter way to explore campus events. One search, infinite possibilities. Connect with your campus community.', Unicorn: UnicornPose3 },
  { title: 'Never', highlight: 'Miss Out.', text: 'Real-time updates, one-click registration, and smart reminders so every great experience is within reach.', Unicorn: UnicornPose4 },
];

const AUTO_PLAY_TIME = 3500;

const ServiceShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress]       = useState(0);
  const timerRef      = useRef<any>(null);
  const progressRef   = useRef<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
    progressRef.current   = 0;
    lastUpdateRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const now   = Date.now();
      const delta = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      progressRef.current += (delta / AUTO_PLAY_TIME) * 100;

      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setActiveIndex(prev => (prev + 1) % cards.length);
      }
      setProgress(progressRef.current);
    }, 50);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handleNext = () => { setActiveIndex(p => (p + 1) % cards.length); resetTimer(); };
  const handlePrev = () => { setActiveIndex(p => (p - 1 + cards.length) % cards.length); resetTimer(); };

  return (
    <div
      className="sv-landing-wrap"
      style={{
        height: '100vh',
        background: '#ffffff',
        color: '#111',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* BG radial glow */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '80vw', height: '80vw',
        background: 'radial-gradient(circle,rgba(139,92,246,0.06) 0%,transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Navigation controls */}
      <div className="sv-controls" style={{ position: 'absolute', right: '4%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '1rem', zIndex: 100 }}>
        {[handlePrev, handleNext].map((fn, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1, background: 'rgba(139,92,246,0.1)' }}
            whileTap={{ scale: 0.9 }}
            onClick={fn}
            style={{
              width: '46px', height: '46px', borderRadius: '50%',
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.15)',
              color: '#8B5CF6',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'none',
            }}
          >
            {i === 0 ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
          </motion.button>
        ))}
      </div>

      {/* Main layout */}
      <div className="sv-main-container" style={{
        width: '100%', height: '100%', position: 'relative',
        display: 'flex', alignItems: 'center',
        paddingLeft: 'clamp(2rem,8vw,8rem)',
        paddingRight: 'clamp(2rem,8vw,8rem)',
        zIndex: 10, gap: '2rem',
      }}>
        {/* Left: Text */}
        <div className="sv-text-content" style={{ flex: '0 0 clamp(280px,42vw,560px)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 style={{ fontSize: 'clamp(2.2rem,5vw,4.5rem)', fontWeight: 800, lineHeight: 1.0, marginBottom: '1.5rem', letterSpacing: '-0.03em', color: '#111' }}>
                {cards[activeIndex].title}<br />
                <span style={{
                  background: 'linear-gradient(135deg,#8B5CF6,#C084FC)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {cards[activeIndex].highlight}
                </span>
              </h2>
              <p style={{ fontSize: 'clamp(0.9rem,1.2vw,1.1rem)', lineHeight: 1.75, color: '#6B7280', maxWidth: '460px', fontWeight: 400 }}>
                {cards[activeIndex].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Unicorn */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.08, rotate: 4 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="sv-unicorn-box"
              style={{ width: 'clamp(260px,32vw,500px)', height: 'clamp(260px,32vw,500px)' }}
            >
              {(() => { const U = cards[activeIndex].Unicorn; return <U />; })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress bars */}
      <div className="sv-progress" style={{ position: 'absolute', bottom: '10%', left: 'clamp(2rem,8vw,8rem)', width: 'clamp(220px,28vw,400px)', display: 'flex', gap: '14px', zIndex: 20 }}>
        {cards.map((_, i) => (
          <div key={i} style={{ flex: 1, cursor: 'none' }} onClick={() => { setActiveIndex(i); resetTimer(); }}>
            <div style={{ height: '2.5px', background: 'rgba(139,92,246,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div
                style={{
                  width: i === activeIndex ? `${progress}%` : i < activeIndex ? '100%' : '0%',
                  height: '100%',
                  background: 'linear-gradient(90deg,#8B5CF6,#C084FC)',
                }}
              />
            </div>
            <div style={{
              marginTop: '8px', fontSize: '0.7rem', fontWeight: 700,
              opacity: i === activeIndex ? 1 : 0.3,
              letterSpacing: '0.08em', textTransform: 'uppercase', color: '#8B5CF6',
              transition: 'opacity 0.3s',
            }}>0{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceShowcase;
