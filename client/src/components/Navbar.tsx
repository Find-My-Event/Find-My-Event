import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Menu, X, Settings, User, LogOut, ChevronDown, Shield, TrendingUp, Calendar, Heart, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../api/axios';

import darkLogo from '../logo/dark logo.png';
import lightLogo from '../logo/light logo .png';

const DARK_HASHES = new Set([
  '#events',
  '#discover',
  '#signin',
  '#create-event',
  '#settings',
  '#edit-profile',
  '#admin',
]);

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [hash, setHash] = useState(() => window.location.hash || '#home');
  const profileWrapRef = useRef<HTMLDivElement>(null);
  const { user, isLoggedIn, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn]);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const { theme, toggleTheme } = useTheme();

  // Override dark calculation to respect global theme
  const dark = theme === 'dark';

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '#home');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!profileWrapRef.current?.contains(e.target as Node)) setIsProfileOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Discover', href: '#discover' },
    { name: 'Events', href: '#events' },
  ];

  const navText = dark ? 'var(--text-primary)' : undefined;
  const borderColor = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';
  const pillBg = dark ? 'rgba(20,20,24,0.85)' : 'rgba(255, 255, 255, 0.85)';
  const logoBorder = dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)';

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="navbar-pill"
        style={{
          width: 'auto',
          minWidth: 'max-content',
          zIndex: 1000,
          background: pillBg,
          border: `1px solid ${borderColor}`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: dark ? '0 12px 40px rgba(0,0,0,0.45)' : '0 10px 30px rgba(0, 0, 0, 0.05)',
        }}
      >
        <div
          className="navbar-brand"
          style={{
            fontWeight: 800,
            fontSize: '1.1rem',
            paddingRight: '1rem',
            borderRight: `1px solid ${logoBorder}`,
            letterSpacing: '-0.02em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: dark ? 'var(--text-primary)' : undefined,
          }}
          onClick={() => { window.location.hash = '#home'; setIsMobileMenuOpen(false); }}
        >
          <img src={dark ? lightLogo : darkLogo} alt="Logo" style={{ height: '32px', width: 'auto' }} />
          <span>Find my event.</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="mobile-hidden">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
              style={{ color: navText || (dark ? 'var(--text-primary)' : undefined) }}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* ACTIONS SECTION */}
        <div className="mobile-hidden" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
          {isLoggedIn ? (
            <>
              {/* Admin Panel Link - Only for Admins */}
              {user?.role === 'admin' && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.hash = '#admin'}
                  className="nav-button"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem', color: 'var(--text-primary)', border: '1px solid rgba(255,111,63,0.3)' }}
                >
                  <TrendingUp size={16} /> <span className="mobile-hidden">Admin Portal</span>
                </motion.button>
              )}

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="nav-icon-button"
                  style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', color: dark ? 'var(--text-secondary)' : '#666' }}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} strokeWidth={2} />
                  {notifications.length > 0 && (
                    <span style={{ position: 'absolute', top: '-1px', right: '-1px', width: '8px', height: '8px', background: '#ff6f3f', borderRadius: '50%', border: '2px solid #fff' }}></span>
                  )}
                </motion.div>

                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute', top: '100%', right: 0, marginTop: '1rem',
                        width: '300px', background: 'var(--bg-card)', borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        zIndex: 1000, padding: '1rem', maxHeight: '400px', overflowY: 'auto'
                      }}
                    >
                      <h4 style={{ color: 'var(--text-primary)', fontSize: '0.9rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>Notifications</h4>
                      {notifications.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>No new notifications</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {notifications.map((n) => (
                            <div key={n._id} style={{ padding: '0.75rem', background: 'var(--bg-card-hover)', borderRadius: '8px', borderLeft: '3px solid #ff6f3f' }}>
                              <p style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px' }}>{n.title}</p>
                              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.4 }}>{n.message}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Create Event */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="nav-button"
                onClick={() => { window.location.hash = '#create-event'; setIsMobileMenuOpen(false); }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> <span className="mobile-hidden">Create Event</span>
              </motion.button>
              
              {/* Theme Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', padding: '0.5rem',
                  color: dark ? 'var(--text-primary)' : '#18181b'
                }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              
              {/* Profile Dropdown */}
              <div style={{ position: 'relative' }} ref={profileWrapRef}>
                <motion.div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  whileHover={{ scale: 1.05 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    cursor: 'pointer',
                    background: dark ? 'var(--border-subtle)' : 'rgba(0,0,0,0.05)',
                    padding: '2px 4px 2px 2px',
                    borderRadius: '999px',
                    border: `1px solid ${dark ? 'var(--border-color)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                    alt="Avatar"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <ChevronDown size={14} color={dark ? 'var(--text-secondary)' : '#666'} />
                </motion.div>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '0.5rem',
                        background: dark ? 'var(--bg-card)' : 'white',
                        borderRadius: '12px',
                        boxShadow: dark ? '0 16px 48px rgba(0,0,0,0.55)' : '0 10px 25px rgba(0,0,0,0.1)',
                        border: `1px solid ${dark ? 'var(--border-color)' : 'rgba(0,0,0,0.05)'}`,
                        padding: '0.5rem',
                        minWidth: '200px',
                        zIndex: 2000,
                        backdropFilter: dark ? 'blur(12px)' : undefined,
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: `1px solid ${dark ? 'var(--border-subtle)' : 'rgba(0,0,0,0.05)'}`, marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: dark ? 'var(--text-primary)' : 'var(--bg-card)' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: dark ? 'var(--text-secondary)' : '#666' }}>{user?.email}</div>
                      </div>

                      <button
                        type="button"
                        className={`dropdown-item${dark ? ' dropdown-item-dark' : ''}`}
                        onClick={() => { setIsProfileOpen(false); window.location.hash = '#settings'; }}
                      >
                        <Settings size={16} /> <span>General Settings</span>
                      </button>
                      <button
                        type="button"
                        className={`dropdown-item${dark ? ' dropdown-item-dark' : ''}`}
                        onClick={() => { setIsProfileOpen(false); window.location.hash = '#edit-profile'; }}
                      >
                        <User size={16} /> <span>Edit Profile</span>
                      </button>
                      <button
                        type="button"
                        className={`dropdown-item${dark ? ' dropdown-item-dark' : ''}`}
                        onClick={() => { setIsProfileOpen(false); window.location.hash = '#your-events'; }}
                      >
                        <Calendar size={16} /> <span>Your Events</span>
                      </button>
                      <button
                        type="button"
                        className={`dropdown-item${dark ? ' dropdown-item-dark' : ''}`}
                        onClick={() => { setIsProfileOpen(false); window.location.hash = '#registered-events'; }}
                      >
                        <Calendar size={16} /> <span>Registered Events</span>
                      </button>
                      <button
                        type="button"
                        className={`dropdown-item${dark ? ' dropdown-item-dark' : ''}`}
                        onClick={() => { setIsProfileOpen(false); window.location.hash = '#favourites'; }}
                      >
                        <Heart size={16} /> <span>Favourites</span>
                      </button>
                      {user?.role === 'admin' && (
                        <button
                          type="button"
                          className={`dropdown-item${dark ? ' dropdown-item-dark' : ''}`}
                          onClick={() => { setIsProfileOpen(false); window.location.hash = '#admin'; }}
                        >
                          <Shield size={16} /> <span>Admin</span>
                        </button>
                      )}
                      <div style={{ borderTop: `1px solid ${dark ? 'var(--border-subtle)' : 'rgba(0,0,0,0.05)'}`, margin: '0.5rem 0' }} />
                      <button type="button" className={`dropdown-item logout${dark ? ' dropdown-item-dark' : ''}`} onClick={logout}>
                        <LogOut size={16} /> <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              {/* Theme Toggle (Logged out) */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', padding: '0.5rem',
                  color: dark ? 'var(--text-primary)' : '#18181b'
                }}
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="nav-button"
                onClick={() => { window.location.hash = '#signin'; }}
              >
                Sign In
              </motion.button>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE & THEME */}
        <div className="mobile-only" style={{ display: 'none', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
          <button 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: dark ? 'var(--text-primary)' : '#18181b' }}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <button 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed',
              top: '5.5rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(94%, 480px)',
              background: dark ? 'var(--bg-card)' : 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(15px)',
              borderRadius: '28px',
              padding: '1.75rem',
              zIndex: 9000,
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.8rem',
              border: `1px solid ${dark ? 'var(--border-color)' : 'rgba(0, 0, 0, 0.1)'}`,
              maxHeight: '82vh',
              overflowY: 'auto'
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.2rem', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}
              >
                {link.name}
              </a>
            ))}
            {isLoggedIn && (
              <>
                <button type="button" onClick={() => { window.location.hash = '#create-event'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Plus size={18} /> Create Event</button>
                <button type="button" onClick={() => { window.location.hash = '#settings'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Settings size={18} /> General Settings</button>
                <button type="button" onClick={() => { window.location.hash = '#edit-profile'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><User size={18} /> Edit Profile</button>
                <button type="button" onClick={() => { window.location.hash = '#your-events'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Calendar size={18} /> Your Events</button>
                <button type="button" onClick={() => { window.location.hash = '#registered-events'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Calendar size={18} /> Registered Events</button>
                <button type="button" onClick={() => { window.location.hash = '#favourites'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Heart size={18} /> Favourites</button>
                {user?.role === 'admin' && (
                  <button type="button" onClick={() => { window.location.hash = '#admin'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: 'var(--text-primary)', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Shield size={18} /> Admin</button>
                )}
              </>
            )}
            <div style={{ borderTop: `1px solid ${dark ? 'var(--border-color)' : 'rgba(0,0,0,0.05)'}`, paddingTop: '1rem', marginTop: '0.5rem' }}>
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  style={{ width: '100%', background: '#ef4444', color: 'var(--text-primary)', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <LogOut size={20} /> Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { window.location.hash = '#signin'; setIsMobileMenuOpen(false); }}
                  style={{ width: '100%', background: '#ff6f3f', color: 'var(--text-primary)', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700 }}
                >
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .mobile-hidden { display: none !important; }
          .mobile-only { display: flex !important; }
          .navbar-pill {
            width: 92% !important;
            padding: 0.5rem 1rem !important;
            min-width: unset !important;
          }
          .navbar-brand span {
             display: block !important;
             font-size: 1rem;
          }
          .navbar-brand {
             border-right: none !important;
             padding-right: 0 !important;
          }
        }
        .dropdown-item-dark {
          color: var(--text-primary) !important;
        }
        .dropdown-item-dark:hover {
          background: var(--border-subtle) !important;
          color: #fff !important;
        }
        .dropdown-item-dark.logout {
          color: #fca5a5 !important;
        }
        .dropdown-item-dark.logout:hover {
          background: rgba(239, 68, 68, 0.12) !important;
        }
      `}</style>
    </>
  );
};

export default Navbar;
