import { motion } from 'framer-motion';

const Footer = () => (
  <footer className="lp-footer site-footer" style={{ fontFamily: "'Plus Jakarta Sans', 'Poppins', sans-serif" }}>
    {/* Top */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '3rem', marginBottom: '4rem' }}>
      {/* Brand */}
      <div style={{ maxWidth: '340px' }}>
        <h2 className="lp-footer-brand">
          Eventum<span className="accent">.</span>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginTop: '0.75rem' }}>
          Your one-stop platform to discover, register for, and create unforgettable campus events.
        </p>
        {/* Social links */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          {['𝕏', 'ig', 'in'].map(s => (
            <motion.a
              key={s}
              href="#"
              whileHover={{ scale: 1.1, background: 'rgba(139,92,246,0.3)' }}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700,
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
            >
              {s}
            </motion.a>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="footer-columns" style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap' }}>
        {[
          {
            label: 'Product',
            links: [
              { name: 'Home',     href: '#home' },
              { name: 'Events',   href: '#events' },
              { name: 'Discover', href: '#discover' },
              { name: 'Clubs',    href: '#clubs' },
              { name: 'Gallery',  href: '#gallery' },
            ],
          },
          {
            label: 'Company',
            links: [
              { name: 'About',    href: '#' },
              { name: 'Contact',  href: '#' },
              { name: 'Careers',  href: '#' },
              { name: 'Blog',     href: '#' },
            ],
          },
          {
            label: 'Legal',
            links: [
              { name: 'Privacy Policy', href: '#' },
              { name: 'Terms of Use',   href: '#' },
              { name: 'Cookie Policy',  href: '#' },
            ],
          },
        ].map(col => (
          <div key={col.label} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <span className="lp-footer-label">{col.label}</span>
            {col.links.map(l => (
              <a key={l.name} href={l.href} className="lp-footer-link">
                {l.name}
              </a>
            ))}
          </div>
        ))}
      </div>
    </div>

    {/* Divider */}
    <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', marginBottom: '2rem' }} />

    {/* Bottom */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.25)' }}>
        © 2026 Eventum. All rights reserved.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>Built with</span>
        <span style={{ color: '#C084FC', fontSize: '0.8rem' }}>♥</span>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>for campus students</span>
      </div>
    </div>

    {/* Giant watermark */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.025 }}
      viewport={{ once: true }}
      style={{
        textAlign: 'center', marginTop: '3rem',
        fontSize: 'clamp(3rem,10vw,9rem)', fontWeight: 900,
        letterSpacing: '-0.05em', lineHeight: 0.9,
        userSelect: 'none', pointerEvents: 'none',
        color: '#fff',
      }}
    >
      EVENTUM
    </motion.div>

    <style>{`
      @media (max-width: 768px) {
        .site-footer { padding: 3rem 1.5rem 2rem !important; }
        .footer-columns { gap: 2rem !important; }
      }
    `}</style>
  </footer>
);

export default Footer;
