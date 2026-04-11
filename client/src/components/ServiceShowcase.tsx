import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* ── Original Funtown-style Unicorn SVGs with "Smooth Groove" Dancing ── */

const UnicornBase = ({ children }: { children: React.ReactNode }) => {
  return (
    <svg viewBox="0 0 300 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      {children}
    </svg>
  );
};

/* Pose 1: Hands on hips — sassy (original reference) */
const UnicornPose1 = () => (
  <UnicornBase>
    <polygon className="horn" points="150,20 140,80 160,80" fill="#FFC312" />
    <polygon className="horn-shine" points="150,20 143,55 157,55" fill="#F79F1F" />
    <polygon points="115,90 105,55 130,80" fill="#ddd" />
    <polygon points="185,90 195,55 170,80" fill="#ddd" />
    <polygon className="ear-inner" points="118,85 110,62 128,78" fill="#FFB8D0" />
    <polygon className="ear-inner" points="182,85 190,62 172,78" fill="#FFB8D0" />
    <g className="head-group">
      <ellipse cx="150" cy="120" rx="55" ry="50" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
      <rect x="115" y="105" width="30" height="18" rx="4" fill="#222" />
      <rect x="155" y="105" width="30" height="18" rx="4" fill="#222" />
      <line x1="145" y1="114" x2="155" y2="114" stroke="#222" strokeWidth="3" />
      <ellipse className="snout" cx="150" cy="145" rx="20" ry="12" fill="#FFE0F0" />
      <circle cx="143" cy="143" r="3" fill="#FF69B4" />
      <circle cx="157" cy="143" r="3" fill="#FF69B4" />
      <path d="M135,155 Q150,170 165,155" fill="none" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round" />
    </g>
    <path className="mane-strand" d="M95,100 Q80,130 85,170" stroke="#00D2D3" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path className="mane-strand" d="M90,110 Q72,145 80,185" stroke="#54A0FF" strokeWidth="8" fill="none" strokeLinecap="round" />
    <g className="body-group">
      <rect x="110" y="170" width="80" height="100" rx="20" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
      <path className="arm-left" d="M110,200 L70,220 L80,250" stroke='var(--text-primary)' strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path className="arm-right" d="M190,200 L230,220 L220,250" stroke='var(--text-primary)' strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="80" cy="253" r="10" fill='var(--text-primary)' stroke="#333" strokeWidth="1.5" />
      <circle cx="220" cy="253" r="10" fill='var(--text-primary)' stroke="#333" strokeWidth="1.5" />
    </g>
    <path className="tail" d="M185,190 Q240,230 220,300 Q200,340 230,370" fill="#00D2D3" opacity="0.8" />
    <rect x="120" y="270" width="18" height="60" rx="9" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
    <rect x="162" y="270" width="18" height="60" rx="9" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
    <ellipse cx="129" cy="335" rx="18" ry="10" fill="#333" />
    <ellipse cx="171" cy="335" rx="18" ry="10" fill="#333" />
  </UnicornBase>
);

/* Pose 2: Dancing — one arm up, one down (original reference) */
const UnicornPose2 = () => (
  <UnicornBase>
    <polygon className="horn" points="150,15 140,75 160,75" fill="#FFC312" />
    <polygon className="horn-shine" points="150,15 143,50 157,50" fill="#F79F1F" />
    <polygon points="115,85 105,50 130,75" fill="#ddd" />
    <polygon points="185,85 195,50 170,75" fill="#ddd" />
    <polygon className="ear-inner" points="118,80 110,57 128,73" fill="#FFB8D0" />
    <polygon className="ear-inner" points="182,80 190,57 172,73" fill="#FFB8D0" />
    <g className="head-group">
      <ellipse cx="150" cy="115" rx="55" ry="50" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
      <rect x="115" y="100" width="30" height="18" rx="4" fill="#222" />
      <rect x="155" y="100" width="30" height="18" rx="4" fill="#222" />
      <line x1="145" y1="109" x2="155" y2="109" stroke="#222" strokeWidth="3" />
      <ellipse cx="150" cy="140" rx="20" ry="12" fill="#FFE0F0" />
      <circle cx="143" cy="138" r="3" fill="#FF69B4" />
      <circle cx="157" cy="138" r="3" fill="#FF69B4" />
      <path d="M135,152 Q150,165 165,152" fill="none" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round" />
    </g>
    <path className="mane-strand" d="M95,95 Q75,125 82,165" stroke="#FF6B6B" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path className="mane-strand" d="M90,105 Q68,140 78,180" stroke="#EE5A24" strokeWidth="8" fill="none" strokeLinecap="round" />
    <g className="body-group">
      <rect x="110" y="165" width="80" height="100" rx="20" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
      <path className="arm-left" d="M110,195 L60,160 L50,130" stroke='var(--text-primary)' strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path className="arm-right" d="M190,195 L230,230 L240,260" stroke='var(--text-primary)' strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="50" cy="125" r="10" fill='var(--text-primary)' stroke="#333" strokeWidth="1.5" />
      <circle cx="240" cy="263" r="10" fill='var(--text-primary)' stroke="#333" strokeWidth="1.5" />
    </g>
    <path className="tail" d="M185,185 Q245,220 225,295 Q210,335 235,365" fill="#00D2D3" opacity="0.8" />
    <path className="leg-left" d="M130,265 L100,330" stroke='var(--text-primary)' strokeWidth="16" strokeLinecap="round" />
    <path className="leg-right" d="M170,265 L200,330" stroke='var(--text-primary)' strokeWidth="16" strokeLinecap="round" />
    <ellipse cx="95" cy="338" rx="18" ry="10" fill="#333" />
    <ellipse cx="205" cy="338" rx="18" ry="10" fill="#333" />
  </UnicornBase>
);

/* Pose 3: Pointing right — tongue out (original reference) */
const UnicornPose3 = () => (
  <UnicornBase>
    <polygon className="horn" points="160,10 148,70 172,70" fill="#FFC312" />
    <polygon className="horn-shine" points="160,10 152,45 168,45" fill="#F79F1F" />
    <polygon points="120,80 108,45 138,72" fill="#ddd" />
    <polygon points="190,80 202,45 172,72" fill="#ddd" />
    <polygon className="ear-inner" points="123,75 113,52 135,68" fill="#FFB8D0" />
    <polygon className="ear-inner" points="187,75 197,52 169,68" fill="#FFB8D0" />
    <g className="head-group">
      <ellipse cx="155" cy="110" rx="55" ry="48" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
      <rect x="120" y="96" width="28" height="18" rx="4" fill="#222" />
      <rect x="160" y="96" width="28" height="18" rx="4" fill="#222" />
      <line x1="148" y1="105" x2="160" y2="105" stroke="#222" strokeWidth="3" />
      <ellipse cx="155" cy="136" rx="18" ry="11" fill="#FFE0F0" />
      <circle cx="148" cy="134" r="3" fill="#FF69B4" />
      <circle cx="162" cy="134" r="3" fill="#FF69B4" />
      <ellipse className="tongue" cx="155" cy="152" rx="8" ry="10" fill="#FF69B4" />
    </g>
    <path className="mane-strand" d="M100,90 Q78,120 84,160" stroke="#A29BFE" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path className="mane-strand" d="M95,100 Q70,135 80,175" stroke="#6C5CE7" strokeWidth="8" fill="none" strokeLinecap="round" />
    <g className="body-group">
      <rect x="115" y="158" width="80" height="105" rx="20" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
      <path className="pointing-arm" d="M195,190 L250,175 L270,170" stroke='var(--text-primary)' strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M115,200 L70,230" stroke='var(--text-primary)' strokeWidth="14" fill="none" strokeLinecap="round" />
      <circle cx="275" cy="168" r="10" fill='var(--text-primary)' stroke="#333" strokeWidth="1.5" />
      <circle cx="65" cy="233" r="10" fill='var(--text-primary)' stroke="#333" strokeWidth="1.5" />
    </g>
    <path className="tail" d="M190,180 Q250,215 230,295 Q215,330 240,360" fill="#00D2D3" opacity="0.8" />
    <rect x="125" y="263" width="16" height="60" rx="8" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
    <rect x="165" y="263" width="16" height="60" rx="8" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
    <ellipse cx="133" cy="328" rx="16" ry="9" fill="#333" />
    <ellipse cx="173" cy="328" rx="16" ry="9" fill="#333" />
  </UnicornBase>
);

/* Pose 4: Both arms up — celebration (original reference) */
const UnicornPose4 = () => (
  <UnicornBase>
    <polygon className="horn" points="150,5 138,65 162,65" fill="#FFC312" />
    <polygon className="horn-shine" points="150,5 143,40 157,40" fill="#F79F1F" />
    <polygon points="112,78 100,42 128,68" fill="#ddd" />
    <polygon points="188,78 200,42 172,68" fill="#ddd" />
    <polygon className="ear-inner" points="115,73 105,49 125,64" fill="#FFB8D0" />
    <polygon className="ear-inner" points="185,73 195,49 175,64" fill="#FFB8D0" />
    <g className="head-group">
      <ellipse cx="150" cy="108" rx="55" ry="48" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
      <rect x="115" y="94" width="28" height="18" rx="4" fill="#222" />
      <line x1="160" y1="103" x2="185" y2="103" stroke="#222" strokeWidth="4" strokeLinecap="round" />
      <line x1="143" y1="103" x2="155" y2="103" stroke="#222" strokeWidth="3" />
      <ellipse cx="150" cy="134" rx="18" ry="11" fill="#FFE0F0" />
      <circle cx="143" cy="132" r="3" fill="#FF69B4" />
      <circle cx="157" cy="132" r="3" fill="#FF69B4" />
      <path d="M138,148 Q150,160 162,148" fill="none" stroke="#FF69B4" strokeWidth="3" strokeLinecap="round" />
    </g>
    <path className="mane-strand" d="M95,88 Q72,118 80,158" stroke="#FD79A8" strokeWidth="12" fill="none" strokeLinecap="round" />
    <path className="mane-strand" d="M90,98 Q65,133 75,173" stroke="#E84393" strokeWidth="8" fill="none" strokeLinecap="round" />
    <g className="body-group">
      <rect x="110" y="156" width="80" height="105" rx="20" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
      <g className="both-arms">
        <path d="M115,185 L60,130 L50,90" stroke='var(--text-primary)' strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M185,185 L240,130 L250,90" stroke='var(--text-primary)' strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="48" cy="85" r="10" fill='var(--text-primary)' stroke="#333" strokeWidth="1.5" />
        <circle cx="252" cy="85" r="10" fill='var(--text-primary)' stroke="#333" strokeWidth="1.5" />
        <text x="30" y="75" fontSize="20" className="sparkle">✨</text>
        <text x="240" y="75" fontSize="20" className="sparkle">✨</text>
      </g>
    </g>
    <path className="tail" d="M185,178 Q248,210 228,290 Q212,328 238,358" fill="#00D2D3" opacity="0.8" />
    <rect x="122" y="261" width="16" height="58" rx="8" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
    <rect x="162" y="261" width="16" height="58" rx="8" fill='var(--text-primary)' stroke="#333" strokeWidth="2" />
    <ellipse cx="130" cy="324" rx="16" ry="9" fill="#333" />
    <ellipse cx="170" cy="324" rx="16" ry="9" fill="#333" />
  </UnicornBase>
);

const cards = [
  {
    title: 'Campus',
    highlight: 'Events.',
    text: 'Discover everything happening in your college, all in one place. FindMyEvent helps you explore fests, hackathons, workshops, and more with ease. We make event discovery simple, seamless, and accessible—so you never miss out on what matters.',
    Unicorn: UnicornPose1,
  },
  {
    title: 'Find Your',
    highlight: 'Vibe.',
    text: 'Stay connected with every event happening on your campus. From cultural fests to technical workshops, FindMyEvent brings everything together—helping you discover, register, and be part of the experience effortlessly.',
    Unicorn: UnicornPose2,
  },
  {
    title: 'Event',
    highlight: 'Discovery.',
    text: 'A smarter way to explore college events. FindMyEvent connects students with opportunities to engage, learn, and participate—ensuring every event is just a click away.',
    Unicorn: UnicornPose3,
  },
  {
    title: 'Never',
    highlight: 'Miss Out.',
    text: 'Your campus is full of experiences waiting to be discovered. FindMyEvent keeps you updated with every event, making it easy to find, join, and enjoy the moments that define college life.',
    Unicorn: UnicornPose4,
  },
];

const AUTO_PLAY_TIME = 3500; // 3.5 seconds

const ServiceShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);
  const progressRef = useRef<number>(0);
  const lastUpdateRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
    progressRef.current = 0;
    lastUpdateRef.current = Date.now();
    
    timerRef.current = setInterval(() => {
      const now = Date.now();
      const delta = now - lastUpdateRef.current;
      lastUpdateRef.current = now;
      
      progressRef.current += (delta / AUTO_PLAY_TIME) * 100;
      
      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setActiveIndex((prev) => (prev + 1) % cards.length);
      }
      
      setProgress(progressRef.current);
    }, 50);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % cards.length);
    resetTimer();
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length);
    resetTimer();
  };

  return (
    <div style={{ height: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', overflow: 'hidden', position: 'relative' }}>
      
      {/* Background Decorative Element */}
      <div style={{ 
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        width: '80vw', height: '80vw', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.05) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Manual Controls */}
      <div className="sv-controls" style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: '1.5rem', zIndex: 100 }}>
        <motion.button 
          whileHover={{ scale: 1.1, background: 'var(--border-color)' }}
          whileTap={{ scale: 0.9 }}
          onClick={handlePrev}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--border-subtle)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.1, background: 'var(--border-color)' }}
          whileTap={{ scale: 0.9 }}
          onClick={handleNext}
          style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--border-subtle)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      <div className="sv-main-container" style={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        paddingLeft: 'clamp(2rem, 8vw, 8rem)',
        paddingRight: 'clamp(2rem, 8vw, 8rem)',
        zIndex: 10,
        gap: '2rem'
      }}>
        
        {/* Left: Text Content */}
        <div className="sv-text-content" style={{ flex: '0 0 clamp(300px, 45vw, 600px)', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: -30, y: 20 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 20, y: -20 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 style={{ fontSize: 'clamp(2.5rem, 5.5vw, 5rem)', fontWeight: 800, lineHeight: 1, marginBottom: '2rem', letterSpacing: '-0.03em' }}>
                {cards[activeIndex].title} <br/>
                <span className="serif-italic" style={{ fontWeight: 400, color: 'rgba(255,255,255,0.9)' }}>{cards[activeIndex].highlight}</span>
              </h2>
              <p style={{ fontSize: 'clamp(1rem, 1.3vw, 1.25rem)', lineHeight: 1.8, opacity: 0.6, maxWidth: '500px', fontWeight: 400 }}>
                {cards[activeIndex].text}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Unicorn Animation */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="sv-unicorn-box"
              style={{ width: 'clamp(300px, 35vw, 550px)', height: 'clamp(300px, 35vw, 550px)' }}
            >
              {(() => {
                const Unicorn = cards[activeIndex].Unicorn;
                return <Unicorn />;
              })()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bars (Bottom - White) */}
      <div className="sv-progress" style={{ position: 'absolute', bottom: '10%', left: 'clamp(2rem, 8vw, 8rem)', width: 'clamp(250px, 30vw, 450px)', display: 'flex', gap: '16px', zIndex: 20 }}>
        {cards.map((_, i) => (
          <div key={i} style={{ flex: 1, cursor: 'pointer' }} onClick={() => { setActiveIndex(i); resetTimer(); }}>
            <div style={{ height: '3px', background: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
              <motion.div 
                style={{ 
                  width: i === activeIndex ? `${progress}%` : i < activeIndex ? '100%' : '0%', 
                  height: '100%', 
                  background: 'var(--text-primary)'
                }} 
              />
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.75rem', fontWeight: 700, opacity: i === activeIndex ? 1 : 0.3, letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'opacity 0.3s' }}>
              0{i + 1}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        @media (max-width: 768px) {
          .sv-main-container {
            flex-direction: column !important;
            padding: 5rem 1.5rem 2rem 1.5rem !important;
            justify-content: flex-start !important;
            text-align: center !important;
            gap: 1rem !important;
          }
          .sv-text-content {
            flex: 0 0 auto !important;
            width: 100% !important;
          }
          .sv-text-content h2 { margin-bottom: 1rem !important; }
          .sv-text-content p { margin: 0 auto !important; }
          .sv-unicorn-box { 
            width: min(80vw, 350px) !important; 
            height: min(80vw, 350px) !important; 
            margin-top: 2rem !important;
          }
          .sv-controls {
            right: 50% !important;
            top: unset !important;
            bottom: 5% !important;
            transform: translateX(50%) !important;
            flex-direction: row !important;
            gap: 1rem !important;
          }
          .sv-progress {
            bottom: 15% !important;
            width: 80% !important;
            left: 10% !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ServiceShowcase;
