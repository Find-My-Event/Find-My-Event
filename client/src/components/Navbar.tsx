import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, Bell, Plus, Menu, X, Settings, User, LogOut, ChevronDown, Shield, TrendingUp, Calendar, Heart, Home, Globe, LayoutGrid, Command, Award } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

import darkLogo from '../logo/dark logo.png';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen]       = useState(false);
  const [hash, setHash]                         = useState(() => window.location.hash || '');
  const profileWrapRef                          = useRef<HTMLDivElement>(null);
  const navRef                                  = useRef<HTMLElement>(null);
  const { user, isLoggedIn, logout }            = useAuth();
  const [notifications, setNotifications]       = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);



  /* ── GSAP entry: slide down from -40px (Step 1 of global intro timeline) ── */
  useEffect(() => {
    if (!navRef.current) return;
    gsap.set(navRef.current, { y: -40, opacity: 0 });
    gsap.to(navRef.current, {
      y: 0, opacity: 1,
      duration: 0.75,
      ease: 'expo.out',
      delay: 0.05,
    });
  }, []);

  /* ── Hash tracking ── */
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  /* ── Outside click for profile ── */
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!profileWrapRef.current?.contains(e.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  /* ── Notifications ── */
  useEffect(() => {
    if (isLoggedIn) {
      api.get('/notifications').then(r => setNotifications(r.data)).catch(() => {});
    }
  }, [isLoggedIn]);

  // Determine which links to show based on login status
  const isLoggedInState = isLoggedIn;

  const navLinks: Array<{ name: string; href: string; icon?: string }> = !isLoggedInState
    ? [
        { name: 'Home',    href: '#home',   icon: 'Home' },
        { name: 'Clubs',   href: '#clubs',   icon: 'Award' },
        { name: 'Gallery', href: '#gallery', icon: 'LayoutGrid' },
      ]
    : [
        { name: 'Home',      href: '#home',        icon: 'Home' },
        { name: 'Clubs',     href: '#clubs',       icon: 'Award' },
        { name: 'My Events', href: '#registered-events', icon: 'Command' },
        { name: 'Gallery',   href: '#gallery',     icon: 'LayoutGrid' },
      ];

  // User requested landing page navbar styling globally across the entire website
  const isInnerPage = false;

  const textColor   = isInnerPage ? '#ffffff' : '#222';
  const logoSrc     = isInnerPage ? (darkLogo) : darkLogo;

  return (
    <>
      <div
        ref={navRef as React.Ref<HTMLDivElement>}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: isInnerPage ? '64px' : '140px', // Tall wrapper for the gradient
          zIndex: 1000,
          pointerEvents: 'none', // Let clicks pass through the invisible part of the gradient
          background: isInnerPage 
            ? 'var(--bg-card)' 
            : 'linear-gradient(180deg, #E9D5FF 0%, rgba(233,213,255,0) 100%)',
          borderBottom: isInnerPage ? '1px solid rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <nav
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 3rem',
            pointerEvents: 'auto', // Re-enable clicks for the actual navbar
          }}
        >
        {/* ── Logo ── */}
        <div
          style={{
            fontWeight: 600,
            fontSize: '20px',
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: textColor,
          }}
          onClick={() => { window.location.hash = ''; setIsMobileMenuOpen(false); }}
        >
          <img src={logoSrc} alt="Eventum Logo" style={{ height: '32px', width: 'auto' }} />
          <span>Eventum<span style={{ color: '#EC4899' }}>.</span></span>
        </div>

        {/* ── Nav links ── */}
        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }} className="mobile-hidden">
          {navLinks.map(link => {
            const IconComponent = link.icon === 'Home' ? Home : link.icon === 'Award' ? Award : link.icon === 'Command' ? Command : link.icon === 'LayoutGrid' ? LayoutGrid : link.icon === 'Globe' ? Globe : null;
            return (
              <a
                key={link.name}
                href={link.href}
                style={{ textDecoration: 'none', color: textColor, opacity: hash === link.href ? 1 : 0.75, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '16px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
              >
                {IconComponent && <IconComponent size={18} />}
                {link.name}
              </a>
            );
          })}
        </div>

        {/* ── Right actions ── */}
        <div className="mobile-hidden" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Search */}
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: isInnerPage ? 'rgba(255,255,255,0.6)' : '#333' }} aria-label="Search">
            <Search size={20} strokeWidth={2} />
          </button>

          {isLoggedIn ? (
            <>
              {/* Admin */}
              {user?.role === 'admin' && (
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.hash = '#admin'}
                  className="nav-button"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', border: '1px solid rgba(139,92,246,0.3)' }}
                >
                  <TrendingUp size={14} /> Admin
                </motion.button>
              )}

              {/* Notifications */}
              <div style={{ position: 'relative' }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="nav-icon-button"
                  style={{ cursor: 'pointer', color: isInnerPage ? 'rgba(255,255,255,0.6)' : '#666' }}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={18} strokeWidth={2} />
                  {notifications.length > 0 && (
                    <span style={{ position: 'absolute', top: '2px', right: '2px', width: '7px', height: '7px', background: '#8B5CF6', borderRadius: '50%', border: '1.5px solid #fff' }} />
                  )}
                </motion.div>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute', top: '120%', right: 0,
                        width: '300px', background: isInnerPage ? 'var(--bg-card)' : '#fff',
                        borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)', zIndex: 2000,
                        padding: '1rem', maxHeight: '380px', overflowY: 'auto',
                      }}
                    >
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.75rem', color: isInnerPage ? '#fff' : '#111' }}>Notifications</h4>
                      {notifications.length === 0 ? (
                        <p style={{ color: '#999', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>No new notifications</p>
                      ) : notifications.map(n => (
                        <div key={n._id} style={{ padding: '0.65rem', background: 'rgba(139,92,246,0.05)', borderRadius: '8px', borderLeft: '3px solid #8B5CF6', marginBottom: '0.5rem' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '2px', color: isInnerPage ? '#fff' : '#111' }}>{n.title}</p>
                          <p style={{ fontSize: '0.75rem', color: '#777', lineHeight: 1.4 }}>{n.message}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Avatar */}
              <div style={{ position: 'relative' }} ref={profileWrapRef}>
                <motion.div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  whileHover={{ scale: 1.05 }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', cursor: 'pointer', background: 'rgba(0,0,0,0.04)', padding: '2px 4px 2px 2px', borderRadius: '999px', border: '1px solid rgba(0,0,0,0.06)' }}
                >
                  <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="Avatar" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
                  <ChevronDown size={12} color="#888" />
                </motion.div>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute', top: '120%', right: 0,
                        background: isInnerPage ? 'var(--bg-card)' : '#fff',
                        borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(0,0,0,0.06)', padding: '0.5rem',
                        minWidth: '200px', zIndex: 2000,
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isInnerPage ? '#fff' : '#111' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#888' }}>{user?.email}</div>
                      </div>
                      {[
                        { icon: Settings, label: 'General Settings', href: '#settings' },
                        { icon: User,     label: 'Edit Profile',      href: '#edit-profile' },
                        { icon: Calendar, label: 'Your Events',       href: '#your-events' },
                        { icon: Calendar, label: 'Registered Events', href: '#registered-events' },
                        { icon: Heart,    label: 'Favourites',        href: '#favourites' },
                      ].map(item => (
                        <button key={item.label} type="button" className={`dropdown-item${isInnerPage ? ' dropdown-item-dark' : ''}`}
                          onClick={() => { setIsProfileOpen(false); window.location.hash = item.href; }}>
                          <item.icon size={15} /> <span>{item.label}</span>
                        </button>
                      ))}
                      {user?.role === 'admin' && (
                        <button type="button" className={`dropdown-item${isInnerPage ? ' dropdown-item-dark' : ''}`}
                          onClick={() => { setIsProfileOpen(false); window.location.hash = '#admin'; }}>
                          <Shield size={15} /> <span>Admin</span>
                        </button>
                      )}
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '0.4rem 0' }} />
                      <button type="button" className={`dropdown-item logout${isInnerPage ? ' dropdown-item-dark' : ''}`} onClick={logout}>
                        <LogOut size={15} /> <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            /* Logged-out CTA */
            <button
              onClick={() => window.location.hash = '#signin'}
              style={{
                background: '#000',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '999px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              Get Started
            </button>
          )}
        </div>

        {/* ── Mobile toggle ── */}
        <div className="mobile-only" style={{ display: 'none', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' }}>
          <button
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isInnerPage ? '#fff' : '#222', display: 'flex', alignItems: 'center' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            style={{
              position: 'fixed', top: '5rem', left: '50%', transform: 'translateX(-50%)',
              width: 'min(94%, 420px)',
              background: isInnerPage ? 'var(--bg-card)' : 'rgba(255,255,255,0.97)',
              backdropFilter: 'blur(20px)', borderRadius: '24px',
              padding: '1.5rem', zIndex: 9000,
              boxShadow: '0 24px 64px rgba(0,0,0,0.12)',
              border: `1px solid ${isInnerPage ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
              display: 'flex', flexDirection: 'column', gap: '0.65rem',
            }}
          >
            {navLinks.map(link => (
              <a key={link.name} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: 'none', color: isInnerPage ? '#fff' : '#111', fontWeight: 600, fontSize: '1.1rem', padding: '0.4rem 0' }}>
                {link.name}
              </a>
            ))}
            {isLoggedIn && (
              <>
                <button type="button" onClick={() => { window.location.hash = '#create-event'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: isInnerPage ? '#fff' : '#111', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', padding: '0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Plus size={16} /> Create Event
                </button>
                <button type="button" onClick={() => { window.location.hash = '#settings'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: isInnerPage ? '#fff' : '#111', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', padding: '0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={16} /> Settings
                </button>
                <button type="button" onClick={() => { window.location.hash = '#your-events'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: isInnerPage ? '#fff' : '#111', fontWeight: 600, fontSize: '1rem', cursor: 'pointer', padding: '0.4rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> Your Events
                </button>
              </>
            )}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '0.85rem', marginTop: '0.25rem' }}>
              {isLoggedIn ? (
                <button type="button" onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', fontFamily: 'inherit' }}>
                  <LogOut size={18} /> Sign Out
                </button>
              ) : (
                <button type="button" onClick={() => { window.location.hash = '#signin'; setIsMobileMenuOpen(false); }}
                  style={{ width: '100%', background: '#111', color: '#fff', border: 'none', padding: '0.85rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Get Started
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
