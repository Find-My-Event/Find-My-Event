import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ── Components ── */
import Navbar    from './components/Navbar';
import Hero      from './components/Hero';
import Footer    from './components/Footer';
import ServiceShowcase from './components/ServiceShowcase';
import GallerySection  from './components/GallerySection';
import {
  ProblemSection,
  SolutionSection,
  HowItWorksSection,
  StatsStrip,
  CtaSection,
  TestimonialsSection,
  MarqueeStrip,
} from './components/LandingPage';
import PendingApprovalListener from './components/PendingApprovalListener';

/* ── Pages ── */
import Events         from './pages/Events';
import Discover       from './pages/Discover';
import Auth           from './pages/Auth';
import Clubs          from './pages/Clubs';
import ClubDetail     from './pages/ClubDetail';
import Dashboard      from './pages/Dashboard';
import CreateEvent    from './pages/CreateEvent';
import GeneralSettings from './pages/GeneralSettings';
import EditProfile    from './pages/EditProfile';
import ManageEvent    from './pages/ManageEvent';
import YourEvents     from './pages/YourEvents';
import RegisteredEvents from './pages/RegisteredEvents';
import Favourites     from './pages/Favourites';
import AdminDashboard from './pages/AdminDashboard';

/* ── Context ── */
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider }         from './contexts/ThemeContext';

import './index.css';

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════
   App Content
══════════════════════════════════════════════ */
function AppContent() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#home');
  const { user, isLoggedIn, loading }   = useAuth();

  /* ── Hash routing ── */
  useEffect(() => {
    const onHash = () => {
      setCurrentRoute(window.location.hash || '#home');
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /* ── Auth guard ── */
  useEffect(() => {
    if (loading) return;
    const protected_ = ['#create-event', '#settings', '#edit-profile', '#admin', '#your-events', '#registered-events'];
    if (!isLoggedIn && protected_.includes(currentRoute)) {
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
      || currentRoute.startsWith('#edit-event');

    if (isInner) return;

    const lenis = new Lenis({ duration: 1.2, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.8 });
    let raf: number;
    const tick = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);

    return () => { lenis.destroy(); cancelAnimationFrame(raf); };
  }, [currentRoute, isLoggedIn]);

  /* ── Render ── */
  const renderContent = () => {
    if (currentRoute === '#events')           return <Events isLoggedIn={isLoggedIn} />;
    if (currentRoute === '#discover')         return <Discover />;
    if (currentRoute === '#clubs')            return <Clubs />;
    if (currentRoute.startsWith('#club-detail')) return <ClubDetail hash={currentRoute} />;
    if (currentRoute === '#signin')           return <Auth />;
    if (currentRoute === '#your-events')      return <YourEvents />;
    if (currentRoute === '#registered-events') return <RegisteredEvents />;
    if (currentRoute === '#favourites')       return <Favourites />;

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
      window.location.hash = '#home';
      return null;
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

        {/* 3. Problem Section */}
        <ProblemSection />

        {/* 4. Solution Section */}
        <SolutionSection />

        {/* 5. Stats Strip */}
        <StatsStrip />

        {/* 6. How It Works */}
        <HowItWorksSection />

        {/* 7. Service Showcase */}
        <ServiceShowcase />

        {/* 8. Gallery */}
        <GallerySection />

        {/* 9. Testimonials */}
        <TestimonialsSection />

        {/* 10. CTA */}
        <CtaSection />

        {/* 11. Footer */}
        <Footer />
      </div>
    );
  };

  return (
    <div className="App">
      {/* Navbar */}
      <Navbar />

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
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
