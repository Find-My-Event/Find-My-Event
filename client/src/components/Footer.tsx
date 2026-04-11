import { motion } from 'framer-motion';

const Footer = () => (
  <footer style={{
    backgroundColor: '#0a0a0a',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '5rem 6rem 3rem 6rem',
    color: '#ffffff',
    fontFamily: "'Outfit', sans-serif",
  }}
  className="site-footer"
  >
    {/* Top: Big brand + tagline */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem', marginBottom: '4rem' }}>
      <div>
        <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.8rem' }}>
          Find my event<span style={{ color: '#ff4d00' }}>.</span>
        </h2>
        <p style={{ fontSize: '1.05rem', opacity: 0.45, maxWidth: '380px', lineHeight: 1.6 }}>
          Your one-stop platform to discover, create, and register for campus events.
        </p>
      </div>

      <div className="footer-columns" style={{ display: 'flex', gap: '5rem' }}>
        {/* Column 1 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.3, marginBottom: '0.5rem', color: '#fff' }}>Product</span>
          <a href="#home" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.6, fontSize: '0.95rem', transition: 'opacity 0.2s' }}>Home</a>
          <a href="#events" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.6, fontSize: '0.95rem' }}>Events</a>
          <a href="#discover" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.6, fontSize: '0.95rem' }}>Discover</a>
        </div>
        {/* Column 2 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.3, marginBottom: '0.5rem', color: '#fff' }}>Company</span>
          <a href="#about" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.6, fontSize: '0.95rem' }}>About</a>
          <a href="#contact" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.6, fontSize: '0.95rem' }}>Contact</a>
          <a href="#careers" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.6, fontSize: '0.95rem' }}>Careers</a>
        </div>
        {/* Column 3 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.3, marginBottom: '0.5rem', color: '#fff' }}>Social</span>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.6, fontSize: '0.95rem' }}>Twitter</a>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.6, fontSize: '0.95rem' }}>Instagram</a>
          <a href="#" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.6, fontSize: '0.95rem' }}>LinkedIn</a>
        </div>
      </div>
    </div>

    {/* Divider */}
    <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.1)', marginBottom: '2rem' }} />

    {/* Bottom bar */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <p style={{ fontSize: '0.85rem', opacity: 0.3, color: '#fff' }}>© 2026 Find My Event. All rights reserved.</p>
      <div style={{ display: 'flex', gap: '2rem' }}>
        <a href="#" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.3, fontSize: '0.85rem' }}>Privacy Policy</a>
        <a href="#" style={{ color: '#ffffff', textDecoration: 'none', opacity: 0.3, fontSize: '0.85rem' }}>Terms of Service</a>
      </div>
    </div>

    {/* Giant watermark text */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.03 }}
      viewport={{ once: true }}
      style={{ textAlign: 'center', marginTop: '3rem', fontSize: 'clamp(4rem, 12vw, 10rem)', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9, userSelect: 'none', pointerEvents: 'none' }}
    >
      FIND MY EVENT
    </motion.div>

    <style>{`
      @media (max-width: 768px) {
        .site-footer {
          padding: 3rem 1.5rem 2rem 1.5rem !important;
        }
        .footer-columns {
          gap: 2rem !important;
          flex-wrap: wrap !important;
        }
      }
    `}</style>
  </footer>
);

export default Footer;

