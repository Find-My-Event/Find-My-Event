import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence } from 'framer-motion';

/* ── Components ── */
import Preloader from './components/Preloader';
import Navbar    from './components/Navbar';
import Hero      from './components/Hero';
import Footer    from './components/Footer';

import ProblemStory    from './components/ProblemStory';
import LaunchSteps     from './components/LaunchSteps';
import FeatureTabs     from './components/FeatureTabs';
import BuildForBoth    from './components/BuildForBoth';
import GalleryCta      from './components/GalleryCta';
import {

  MarqueeStrip,
} from './components/LandingPage';
import PendingApprovalListener from './components/PendingApprovalListener';

/* ── Pages ── */
import Events         from './pages/Events';
import Discover       from './pages/Discover';
import Auth           from './pages/Auth';
import Clubs          from './pages/Clubs';
import Home2          from './pages/Home2';
import ClubDetail     from './pages/ClubDetail';
import EventDetail    from './pages/EventDetail';
import Dashboard      from './pages/Dashboard';
import CreateEvent    from './pages/CreateEvent';
import GeneralSettings from './pages/GeneralSettings';
import EditProfile    from './pages/EditProfile';
import ManageEvent    from './pages/ManageEvent';
import YourEvents     from './pages/YourEvents';
import RegisteredEvents from './pages/RegisteredEvents';
import Favourites     from './pages/Favourites';
import Gallery        from './pages/Gallery';
import AdminDashboard from './pages/AdminDashboard';
import OrganizerDashboard from './pages/OrganizerDashboard';
import PublicScanner  from './pages/PublicScanner';

/* ── Context ── */
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider }         from './contexts/ThemeContext';

import './index.css';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════
   App Content
══════════════════════════════════════════════ */
function AppContent() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '');
  const { user, isLoggedIn, loading }   = useAuth();

  /* ── Hash routing & Scroll Reset ── */
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    
    // Aggressively force absolute top on load (fights browser delayed scroll restoration)
    window.scrollTo(0, 0);
    const scrollInterval = setInterval(() => {
      window.scrollTo(0, 0);
    }, 10);
    setTimeout(() => clearInterval(scrollInterval), 1000);

    // Force absolute top before refresh so browser doesn't save scroll position
    const onBeforeUnload = () => {
      window.scrollTo(0, 0);
    };
    window.addEventListener('beforeunload', onBeforeUnload);

    const onHash = () => {
      setCurrentRoute(window.location.hash || '');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('beforeunload', onBeforeUnload);
    };
  }, []);

  /* ── Auth guard ── */
  useEffect(() => {
    if (loading) return;
    const protected_ = [
      '#create-event', '#settings', '#edit-profile', '#admin', 
      '#your-events', '#registered-events', '#organizer-dashboard', '#edit-event'
    ];
    
    const isProtected = protected_.some(prefix => currentRoute.startsWith(prefix));
    
    if (!isLoggedIn && isProtected) {
      window.location.hash = '#signin';
    }
  }, [currentRoute, isLoggedIn, loading]);

  /* ── Lenis smooth scroll (landing only) ── */
  useEffect(() => {
    const innerPages = [
      '#events','#discover','#clubs','#signin','#create-event',
      '#settings','#edit-profile','#your-events','#registered-events',
      '#favourites','#admin',
    ];
    const isInner = innerPages.includes(currentRoute)
      || currentRoute.startsWith('#club-detail')
      || currentRoute.startsWith('#event-detail')
      || currentRoute.startsWith('#edit-event');

    if (isInner) return;

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.8 });
    
    // Crucial: Lenis reads the browser scroll position on mount. We MUST force it to 0.
    lenis.scrollTo(0, { immediate: true });

    let raf: number;
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    return () => { lenis.destroy(); cancelAnimationFrame(raf); };
  }, [currentRoute, isLoggedIn]);

  /* ── Render ── */
  const renderContent = () => {
    if (currentRoute === '#home')            return <Home2 />;
    if (currentRoute === '#events')           return <Events isLoggedIn={isLoggedIn} />;
    if (currentRoute === '#discover')         return <Discover />;
    if (currentRoute === '#clubs')            return <Clubs />;
    if (currentRoute.startsWith('#club-detail')) return <ClubDetail hash={currentRoute} />;
    if (currentRoute.startsWith('#event-detail')) return <EventDetail hash={currentRoute} />;
    if (currentRoute === '#signin')           return <Auth />;
    if (currentRoute === '#your-events')      return <YourEvents />;
    if (currentRoute === '#registered-events') return <RegisteredEvents />;
    if (currentRoute === '#favourites')       return <Favourites />;
    if (currentRoute === '#gallery')          return <Gallery />;
    if (currentRoute.startsWith('#organizer-dashboard')) {
      if (!isLoggedIn) return null;
      return <OrganizerDashboard />;
    }

    if (currentRoute === '#create-event') {
      if (!isLoggedIn) return null;
      return <CreateEvent />;
    }
    if (currentRoute === '#settings') {
      if (!isLoggedIn) return null;
      return <GeneralSettings />;
    }
    if (currentRoute === '#edit-profile') {
      if (!isLoggedIn) return null;
      return <EditProfile />;
    }
    if (currentRoute.startsWith('#edit-event')) {
      if (!isLoggedIn) return null;
      return <ManageEvent />;
    }
    if (currentRoute === '#admin') {
      if (isLoggedIn && user?.role === 'admin') return <AdminDashboard />;
      window.location.hash = '';
      return null;
    }

    if (currentRoute.startsWith('#scanner=')) {
      const token = currentRoute.split('=')[1];
      return <PublicScanner token={token} />;
    }

    /* ── Logged-in home → Dashboard ── */
    if (isLoggedIn) return <Dashboard />;

    /* ══════════════════════════════════════
       PREMIUM LANDING PAGE
    ══════════════════════════════════════ */
    return (
      <div className="landing-page">
        {/* 1. Hero */}
        <Hero />

        {/* 2. Marquee feature strip */}
        <MarqueeStrip />

        {/* 3. Story Scroll Animation Section */}
        <ProblemStory />

        {/* 4. 3 Steps to LAUNCH */}
        <LaunchSteps />

        {/* 5. Feature Tabs (Replaces ServiceShowcase) */}
        <FeatureTabs />

        {/* 6. Build for Both */}
        <BuildForBoth />

        {/* 7. Gallery CTA */}
        <GalleryCta />

        {/* Footer */}
        <Footer />
      </div>
    );
  };

  return (
    <div className="App">
      {/* Navbar (Hidden on specific full-page dashboards) */}
      {!currentRoute.startsWith('#organizer-dashboard') && !currentRoute.startsWith('#edit-event') && !currentRoute.startsWith('#scanner=') && currentRoute !== '#admin' && <Navbar />}

      {/* Page content */}
      <main>
        {renderContent()}
      </main>

      {/* Auth-required listeners */}
      <PendingApprovalListener />
    </div>
  );
}

/* ══════════════════════════════════════════════
   Root
══════════════════════════════════════════════ */
export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AnimatePresence>
          {showPreloader && <Preloader key="preloader" onComplete={() => setShowPreloader(false)} />}
        </AnimatePresence>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
