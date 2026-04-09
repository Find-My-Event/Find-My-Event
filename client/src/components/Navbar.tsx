import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Menu, X, Settings, User, LogOut, ChevronDown, Shield, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

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

  const dark = DARK_HASHES.has(hash) || (hash === '#home' && isLoggedIn);

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

  const navText = dark ? '#e4e4e7' : undefined;
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
            color: dark ? '#fafafa' : undefined,
          }}
          onClick={() => { window.location.hash = '#home'; setIsMobileMenuOpen(false); }}
        >
          <img src="/favicon.svg" alt="" style={{ height: '24px', width: 'auto' }} />
          <span className="mobile-hidden">Find my event.</span>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="mobile-hidden">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="nav-link"
              style={{ color: navText || (dark ? '#e4e4e7' : undefined) }}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
          {isLoggedIn ? (
            <>
              {/* Admin Panel Link - Only for Admins */}
              {user?.role === 'admin' && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.hash = '#admin'}
                  className="nav-button"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem', color: '#ff6f3f', border: '1px solid rgba(255,111,63,0.3)' }}
                >
                  <TrendingUp size={16} /> <span className="mobile-hidden">Admin Panel</span>
                </motion.button>
              )}

              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="nav-icon-button"
                  style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', color: dark ? '#a1a1aa' : '#666' }}
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
                        width: '300px', background: '#18181b', borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                        zIndex: 1000, padding: '1rem', maxHeight: '400px', overflowY: 'auto'
                      }}
                    >
                      <h4 style={{ color: '#fff', fontSize: '0.9rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Notifications</h4>
                      {notifications.length === 0 ? (
                        <p style={{ color: '#52525b', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>No new notifications</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {notifications.map((n) => (
                            <div key={n._id} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid #ff6f3f' }}>
                              <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2px' }}>{n.title}</p>
                              <p style={{ color: '#a1a1aa', fontSize: '0.75rem', lineHeight: 1.4 }}>{n.message}</p>
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
                    background: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                    padding: '2px 4px 2px 2px',
                    borderRadius: '999px',
                    border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                  }}
                >
                  <img
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'}
                    alt="Avatar"
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <ChevronDown size={14} color={dark ? '#a1a1aa' : '#666'} />
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
                        background: dark ? 'rgba(24,24,27,0.96)' : 'white',
                        borderRadius: '12px',
                        boxShadow: dark ? '0 16px 48px rgba(0,0,0,0.55)' : '0 10px 25px rgba(0,0,0,0.1)',
                        border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
                        padding: '0.5rem',
                        minWidth: '200px',
                        zIndex: 2000,
                        backdropFilter: dark ? 'blur(12px)' : undefined,
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`, marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: dark ? '#fafafa' : '#1a1a1a' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: dark ? '#a1a1aa' : '#666' }}>{user?.email}</div>
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
                      {user?.role === 'admin' && (
                        <button
                          type="button"
                          className={`dropdown-item${dark ? ' dropdown-item-dark' : ''}`}
                          onClick={() => { setIsProfileOpen(false); window.location.hash = '#admin'; }}
                        >
                          <Shield size={16} /> <span>Admin</span>
                        </button>
                      )}
                      <div style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`, margin: '0.5rem 0' }} />
                      <button type="button" className={`dropdown-item logout${dark ? ' dropdown-item-dark' : ''}`} onClick={logout}>
                        <LogOut size={16} /> <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="nav-button"
              onClick={() => { window.location.hash = '#signin'; }}
            >
              Sign In
            </motion.button>
          )}

          <button
            type="button"
            className="mobile-only"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: dark ? '#fafafa' : '#1a1a1a', display: 'none', padding: '0.5rem' }}
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
              top: '6rem',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              background: dark ? 'rgba(24,24,27,0.95)' : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              borderRadius: '24px',
              padding: '1.5rem',
              zIndex: 90,
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(255, 255, 255, 0.5)'}`,
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: 'none', color: dark ? '#fafafa' : '#1a1a1a', fontWeight: 600, fontSize: '1.2rem', padding: '0.5rem 0' }}
              >
                {link.name}
              </a>
            ))}
            {isLoggedIn && (
              <>
                <button type="button" onClick={() => { window.location.hash = '#create-event'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: dark ? '#fafafa' : '#1a1a1a', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0' }}>Create Event</button>
                <button type="button" onClick={() => { window.location.hash = '#settings'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: dark ? '#fafafa' : '#1a1a1a', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0' }}>General Settings</button>
                <button type="button" onClick={() => { window.location.hash = '#edit-profile'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: dark ? '#fafafa' : '#1a1a1a', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0' }}>Edit Profile</button>
                {user?.role === 'admin' && (
                  <button type="button" onClick={() => { window.location.hash = '#admin'; setIsMobileMenuOpen(false); }} style={{ textAlign: 'left', background: 'none', border: 'none', color: dark ? '#fafafa' : '#1a1a1a', fontWeight: 600, fontSize: '1.05rem', cursor: 'pointer', padding: '0.5rem 0' }}>Admin</button>
                )}
              </>
            )}
            <div style={{ borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`, paddingTop: '1rem', marginTop: '0.5rem' }}>
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700 }}
                >
                  Sign Out
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { window.location.hash = '#signin'; setIsMobileMenuOpen(false); }}
                  style={{ width: '100%', background: '#ff6f3f', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700 }}
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
          .mobile-only { display: block !important; }
          .navbar-pill {
            width: 90% !important;
            padding: 0.5rem 0.75rem !important;
            gap: 1rem !important;
          }
        }
        .dropdown-item-dark {
          color: #e4e4e7 !important;
        }
        .dropdown-item-dark:hover {
          background: rgba(255,255,255,0.08) !important;
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
