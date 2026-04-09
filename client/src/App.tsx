import { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './pages/Events';
import Discover from './pages/Discover';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import ServiceShowcase from './components/ServiceShowcase';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './index.css';

gsap.registerPlugin(ScrollTrigger);

/* ── Rive Character Animation (looping, non-scrubbed) ── */
const PeopleAnimation = () => {
  const { RiveComponent, rive } = useRive({
    src: '/hero_animation.riv',
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });

  useEffect(() => {
    if (rive) {
      const sm = rive.stateMachineNames[0];
      if (sm) rive.play(sm);
    }
  }, [rive]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <RiveComponent />
    </div>
  );
};


/* ════════════════════════════════════════ */
/* ── Main App                          ── */
/* ════════════════════════════════════════ */
function AppContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const windingPathRef = useRef<SVGPathElement>(null);
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#home');
  const { user, isLoggedIn, loading } = useAuth();

  useEffect(() => {
    const onHash = () => { setCurrentRoute(window.location.hash || '#home'); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    // Only initialize Lenis and GSAP ScrollTrigger on the Home route
    if (currentRoute === '#events' || currentRoute === '#discover' || currentRoute === '#signin' || currentRoute === '#admin') {
       document.body.style.backgroundColor = '';
       document.body.style.color = '';
       return;
    }
    document.body.style.backgroundColor = '';
    document.body.style.color = '';

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 2 });
    function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    const ctx = gsap.context(() => {
      /* Theme transition */
      gsap.to(document.body, {
        backgroundColor: '#111', color: '#fff',
        scrollTrigger: { trigger: '.content-section', start: 'top 80%', end: 'top 20%', scrub: true },
      });
      gsap.to('.dot-grid', {
        opacity: 0,
        scrollTrigger: { trigger: '.content-section', start: 'top 80%', end: 'top 20%', scrub: true },
      });

      /* Tagline timeline */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.content-section', start: 'top 70%', end: '40% 50%', scrub: 1.5 },
      });
      tl.from('.problem-group', { x: -200, opacity: 0, duration: 1 })
        .from('.scratch-path', { strokeDashoffset: 450, opacity: 0, stagger: 0.1, duration: 0.8 }, '-=0.3')
        .from('.gateway-text', { x: 200, opacity: 0, duration: 1 }, '-=0.8')
        .from('.main-tagline-part1', { y: 50, opacity: 0, duration: 1 }, '-=0.5')
        .from('.main-tagline-part2', { y: 50, opacity: 0, duration: 1 }, '-=0.5');

      /* Red hill */
      gsap.from('.red-hill-base', {
        scaleX: 0, opacity: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: '.character-illustration', start: 'top 85%', end: 'top 50%', scrub: 1 },
      });

      /* Orange winding line — scroll-scrubbed draw animation exactly tracking scroll */
      if (windingPathRef.current) {
        const length = windingPathRef.current.getTotalLength();
        windingPathRef.current.style.strokeDasharray = String(length);
        windingPathRef.current.style.strokeDashoffset = String(length);

        gsap.to(windingPathRef.current, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: '.winding-section',
            start: 'top 50%', // Start drawing slightly later when section enters middle
            end: 'bottom 80%', // Finish drawing before reaching absolute bottom
            scrub: true,
          },
        });
      }

      gsap.utils.toArray('.line-text-block').forEach((el: any) => {
        gsap.from(el, {
          y: 60, opacity: 0,
          scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 50%', scrub: 1 },
        });
      });

      /* CTA Section */
      gsap.from('.cta-section', { y: 80, opacity: 0, scrollTrigger: { trigger: '.cta-section', start: 'top 85%', end: 'top 55%', scrub: 1 } });
    });

    return () => { lenis.destroy(); ctx.revert(); };
  }, [currentRoute, isLoggedIn]);

  const renderContent = () => {
    if (currentRoute === '#events') return <Events isLoggedIn={isLoggedIn} />;
    if (currentRoute === '#discover') return <Discover isLoggedIn={isLoggedIn} />;
    if (currentRoute === '#signin') return <Auth />;
    if (currentRoute === '#admin') {
      if (isLoggedIn && user?.role === 'admin') {
        return <AdminDashboard />;
      }
      window.location.hash = '#home';
      return null;
    }
    
    if (isLoggedIn) return <Dashboard />;
    
    return (
      <>
        <div className="dot-grid"></div>
        <Hero />
        {/* ═══════ CONTENT SECTION: taglines ═══════ */}
        <section className="content-section" style={{ minHeight: '180vh', display: 'flex', flexDirection: 'column', padding: '12vh 0', position: 'relative', zIndex: 1 }}>
          {/* Tagline: Top-Left */}
          <div className="problem-group" style={{ maxWidth: '800px', position: 'relative', paddingLeft: '6rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', opacity: 0.5, letterSpacing: '0.15em' }}>Our Work</span>
            </div>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 3.8rem)', fontWeight: 800, lineHeight: 1, position: 'relative', display: 'inline-block' }}>
              solve the problem of <br />
              <span className="serif-italic" style={{ fontWeight: 400 }}>"students missing events"</span>
              <svg viewBox="0 0 450 40" style={{ position: 'absolute', bottom: '-15px', left: 0, width: '100%', height: '40px', overflow: 'visible', color: '#ff4d00' }}>
                <path className="scratch-path" d="M10,20 Q120,5 240,20 T440,20" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="450" strokeDashoffset="0" />
                <path className="scratch-path" d="M15,25 Q130,10 250,25 T445,25" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="450" strokeDashoffset="0" opacity="0.6" />
              </svg>
            </h2>
          </div>

          {/* Tagline: Bottom-Right */}
          <div className="gateway-text" style={{ alignSelf: 'flex-end', textAlign: 'right', maxWidth: '500px', paddingRight: '6rem', marginTop: '6vh' }}>
            <h3 style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', fontWeight: 500, lineHeight: 1.4, opacity: 0.8 }}>
              Your Gateway to <br />
              <span className="serif-italic" style={{ fontWeight: 500 }}>Every College Event</span>
            </h3>
          </div>

          {/* Tagline: Large Centered */}
          <div style={{ width: '100%', textAlign: 'center', paddingTop: '8vh' }}>
            <h2 style={{ fontSize: 'clamp(3.5rem, 9.5vw, 7.8rem)', fontWeight: 800, lineHeight: 0.85, letterSpacing: '-0.04em' }}>
              <div className="main-tagline-part1">All your campus events</div>
              <div className="main-tagline-part2" style={{ marginTop: '0.2em' }}>
                <span className="serif-italic" style={{ fontWeight: 400 }}>one search away.</span>
              </div>
            </h2>
          </div>

          {/* Character Group on Red Hill */}
          <div className="character-illustration" style={{ width: '100%', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', marginTop: '5vh' }}>
            <svg className="red-hill-base" viewBox="0 0 1440 400" style={{ position: 'absolute', bottom: '5%', width: '130%', height: 'auto', zIndex: 0, color: '#ff4d00' }}>
              <path d="M-100,400 C300,80 1140,80 1540,400" fill="currentColor" />
            </svg>
            <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
              <PeopleAnimation />
            </div>
          </div>
        </section>

        {/* ═══════ FUNTOWN-STYLE SERVICE SHOWCASE ═══════ */}
        <ServiceShowcase />

        {/* ═══════ WINDING LINE + TEXT IN BLACK SPACES ═══════ */}
        <section className="winding-section" style={{ position: 'relative', minHeight: '300vh', padding: '0', overflow: 'hidden', background: '#111' }}>
          {/* Thick winding orange line */}
          <svg viewBox="0 0 1440 2800" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
            <path
              ref={windingPathRef}
              className="winding-line"
              d="M720,-50 C720,150 100,300 100,550 S1340,700 1340,950 S100,1200 100,1450 S1340,1700 1340,1950 S720,2200 720,2800"
              fill="none"
              stroke="#ff4d00"
              strokeWidth="180"
              strokeLinecap="round"
              opacity="0.85"
            />
          </svg>

          {/* Text in the empty black spaces between line curves */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', padding: '10vh 0' }}>
            {/* Text 1: RIGHT side */}
            <div className="line-text-block" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '6rem', paddingLeft: '55%' }}>
              <div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#fff' }}>
                  Discover <br/>
                  <span className="serif-italic" style={{ fontWeight: 400 }}>Events.</span>
                </h2>
                <p style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', lineHeight: 1.75, opacity: 0.5, maxWidth: '420px', fontWeight: 400, color: '#fff' }}>
                  Find all events happening in your college in one place. Never miss a workshop, fest, or hackathon again.
                </p>
              </div>
            </div>

            {/* Text 2: LEFT side */}
            <div className="line-text-block" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', paddingLeft: '6rem', paddingRight: '55%' }}>
              <div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#fff' }}>
                  Create & <br/>
                  <span className="serif-italic" style={{ fontWeight: 400 }}>Register Event.</span>
                </h2>
                <p style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', lineHeight: 1.75, opacity: 0.5, maxWidth: '420px', fontWeight: 400, color: '#fff' }}>
                  Hosting an event? Publish it and reach more students across campus instantly.
                </p>
              </div>
            </div>

            {/* Text 3: RIGHT side */}
            <div className="line-text-block" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '6rem', paddingLeft: '55%' }}>
              <div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#fff' }}>
                  Register for <br/>
                  <span className="serif-italic" style={{ fontWeight: 400 }}>Events.</span>
                </h2>
                <p style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', lineHeight: 1.75, opacity: 0.5, maxWidth: '420px', fontWeight: 400, color: '#fff' }}>
                  Register instantly for events with a single click. No forms, no hassle.
                </p>
              </div>
            </div>

            {/* Text 4: LEFT side */}
            <div className="line-text-block" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', paddingLeft: '6rem', paddingRight: '55%' }}>
              <div>
                <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#fff' }}>
                  Track & <br/>
                  <span className="serif-italic" style={{ fontWeight: 400 }}>Manage.</span>
                </h2>
                <p style={{ fontSize: 'clamp(1rem, 1.2vw, 1.15rem)', lineHeight: 1.75, opacity: 0.5, maxWidth: '420px', fontWeight: 400, color: '#fff' }}>
                  Get real-time insights on registrations, attendance, and engagement for your events.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════ CTA SECTION ═══════ */}
        <section className="cta-section" style={{ textAlign: 'center', padding: '6vh 4rem', background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '1rem', color: '#fff' }}>
            Ready to find your next event<span style={{ color: '#ff4d00' }}>?</span>
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.5, maxWidth: '550px', margin: '0 auto', lineHeight: 1.6, color: '#fff' }}>
            Join thousands of students discovering campus events every day.
          </p>
        </section>
        <Footer />
      </>
    );
  };

  return (
    <div className="App" ref={containerRef}>
      <Navbar />
      <main>
        {renderContent()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
