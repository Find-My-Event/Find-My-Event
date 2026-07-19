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
          {[
            { 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              ), 
              href: 'https://www.instagram.com/theeventum/' 
            },
            { 
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              ), 
              href: 'https://www.linkedin.com/company/theeventum' 
            }
          ].map((s, idx) => (
            <motion.a
              key={idx}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, background: 'rgba(139,92,246,0.3)', color: '#fff' }}
              style={{
                width: '36px', height: '36px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {s.icon}
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
              <a 
                key={l.name} 
                href={l.href} 
                onClick={(e) => {
                  if (l.name === 'Home') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    window.location.hash = '';
                  }
                }}
                className="lp-footer-link"
              >
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
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Made by</span>
        <a 
          href="https://www.linkedin.com/in/nilesh-choudhary-5137ab229/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: '0.8rem', color: '#C084FC', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#d8b4fe'}
          onMouseOut={(e) => e.currentTarget.style.color = '#C084FC'}
        >
          Nilesh Choudhary
        </a>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>and</span>
        <a 
          href="https://www.linkedin.com/in/pratyush-sharma-65816531b" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ fontSize: '0.8rem', color: '#C084FC', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
          onMouseOver={(e) => e.currentTarget.style.color = '#d8b4fe'}
          onMouseOut={(e) => e.currentTarget.style.color = '#C084FC'}
        >
          Pratyush Sharma
        </a>
      </div>
    </div>

    {/* Giant watermark */}
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.08 }}
      viewport={{ once: true }}
      style={{
        textAlign: 'center', marginTop: '3rem',
        fontSize: 'clamp(5rem,15vw,14rem)', fontWeight: 900,
        letterSpacing: '-0.03em', lineHeight: 0.9,
        userSelect: 'none', pointerEvents: 'none',
        color: '#fff',
        width: '100%',
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
