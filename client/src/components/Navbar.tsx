import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Bell, User, Settings, LogOut, Plus, TrendingUp, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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

  // navLinks for easy mapping
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Discover', href: '#discover' },
    { name: 'Events', href: '#events' },
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: -100, opacity: 0, x: '-50%' }}
        animate={{ y: 0, opacity: 1, x: '-50%' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="navbar-pill"
        style={{ width: 'auto', minWidth: 'max-content', zIndex: 1000 }}
      >
        {/* LOGO SECTION */}
        <div 
          style={{ 
            fontWeight: 800, 
            fontSize: '1.1rem', 
            paddingRight: '1rem', 
            borderRight: '1px solid rgba(0,0,0,0.1)',
            letterSpacing: '-0.02em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onClick={() => { window.location.hash = '#home'; setIsMobileMenuOpen(false); }}
        >
          <img src="/favicon.svg" alt="" style={{ height: '24px', width: 'auto' }} />
          <span className="mobile-hidden">Find my event.</span>
        </div>

        {/* DESKTOP LINKS */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }} className="mobile-hidden">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="nav-link">{link.name}</a>
          ))}
        </div>

        {/* ACTIONS SECTION */}
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
                  style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#666' }}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell size={20} strokeWidth={2} />
                  {notifications.length > 0 && (
                    <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#ff6f3f', borderRadius: '50%', border: '2px solid #fff' }}></span>
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

              {/* Create Event - Only if profile completed */}
              {user?.hasCompletedProfile && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="nav-button"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> <span className="mobile-hidden">Create Event</span>
                </motion.button>
              )}
              
              {!user?.hasCompletedProfile && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.hash = '#signin'}
                  style={{ 
                    background: 'rgba(255, 111, 63, 0.1)', 
                    color: '#ff6f3f', 
                    border: '1px solid rgba(255, 111, 63, 0.2)',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '999px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Complete Profile
                </motion.button>
              )}
              
              {/* Profile Dropdown Trigger */}
              <div style={{ position: 'relative' }}>
                <motion.div 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  whileHover={{ scale: 1.05 }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.2rem', 
                    cursor: 'pointer',
                    background: 'rgba(0,0,0,0.05)',
                    padding: '2px 4px 2px 2px',
                    borderRadius: '999px',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  <img 
                    src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} 
                    alt="Avatar" 
                    style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <ChevronDown size={14} color="#666" />
                </motion.div>

                {/* Dropdown Menu */}
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
                        background: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        padding: '0.5rem',
                        minWidth: '180px',
                        zIndex: 2000
                      }}
                    >
                      <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '0.5rem' }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1a1a1a' }}>{user?.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{user?.email}</div>
                      </div>
                      
                      <button className="dropdown-item" onClick={() => { setIsProfileOpen(false); /* Navigate to settings */ }}>
                        <Settings size={16} /> <span>General Settings</span>
                      </button>
                      <button className="dropdown-item" onClick={() => { setIsProfileOpen(false); /* Navigate to edit */ }}>
                        <User size={16} /> <span>Edit Profile</span>
                      </button>
                      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '0.5rem 0' }}></div>
                      <button className="dropdown-item logout" onClick={logout}>
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

          {/* MOBILE TOGGLE */}
          <button 
            className="mobile-only"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#1a1a1a', display: 'none', padding: '0.5rem' }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      {/* MOBILE OVERLAY */}
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
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(15px)',
              borderRadius: '24px',
              padding: '1.5rem',
              zIndex: 90,
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.5)'
            }}
          >
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                style={{ textDecoration: 'none', color: '#1a1a1a', fontWeight: 600, fontSize: '1.2rem', padding: '0.5rem 0' }}
              >
                {link.name}
              </a>
            ))}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              {isLoggedIn ? (
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                  style={{ width: '100%', background: '#ef4444', color: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', fontWeight: 700 }}
                >
                  Sign Out
                </button>
              ) : (
                <button 
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
      `}</style>
    </>
  );
};

export default Navbar;
