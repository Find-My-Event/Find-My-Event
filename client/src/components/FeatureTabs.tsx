import { useState, useEffect, useRef } from 'react';

const TABS = [
  { name: 'Discover', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Analytics', img: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Notifications', img: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Manage Events', img: 'https://images.unsplash.com/photo-1633477189709-661832fa85e8?q=80&w=1200&auto=format&fit=crop' },
  { name: 'Club Details', img: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=1200&auto=format&fit=crop' }
];

const FeatureTabs = () => {
  const [activeTab, setActiveTab] = useState(0);
  const timerRef = useRef<number | null>(null);

  // Auto-play logic
  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setActiveTab((prev) => (prev + 1) % TABS.length);
    }, 4000); // Switch every 4 seconds
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    startTimer(); // Reset timer so it doesn't immediately skip after user clicks
  };

  return (
    <section style={{
      width: '100%',
      padding: '4rem 2rem',
      background: '#fafafa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      
      {/* ── HEADING ── */}
      <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)',
          fontWeight: 700,
          color: '#111',
          fontFamily: 'Inter, sans-serif',
          margin: 0,
          letterSpacing: '-0.02em'
        }}>
          Features
        </h2>
      </div>

      {/* ── IMAGE GALLERY ── */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        height: '600px', // Large display area
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
        marginBottom: '2rem',
        background: '#fff'
      }}>
        {TABS.map((tab, index) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: `url(${tab.img}) center/cover no-repeat`,
              opacity: activeTab === index ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out',
              zIndex: activeTab === index ? 2 : 1,
              pointerEvents: activeTab === index ? 'auto' : 'none'
            }}
          />
        ))}
      </div>

      {/* ── CONTROLS (PILL BUTTONS) ── */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        width: '100%',
        maxWidth: '1200px'
      }}>
        {TABS.map((tab, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={index}
              onClick={() => handleTabClick(index)}
              style={{
                padding: '0.8rem 1.5rem',
                borderRadius: '999px',
                border: 'none',
                background: isActive ? '#fef3c7' : 'transparent', // Yellow-ish if active, transparent otherwise
                color: isActive ? '#111' : '#666',
                fontWeight: isActive ? 700 : 500,
                fontSize: '1rem',
                fontFamily: 'Inter, sans-serif',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#111';
                  e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.color = '#666';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {tab.name}
            </button>
          );
        })}
      </div>

    </section>
  );
};

export default FeatureTabs;
