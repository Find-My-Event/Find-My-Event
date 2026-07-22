import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Footer from '../components/Footer';
import api from '../api/axios';
import gsap from 'gsap';

const Home2 = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeIndex, setActiveIndex] = useState(2);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const marker1Ref = useRef<HTMLSpanElement>(null);
  const marker2Ref = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5);
    }, 3000);

    // GSAP Animation for Hero
    if (heroRef.current) {
      const lines = heroRef.current.querySelectorAll('.hero-line');
      gsap.fromTo(lines,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2 }
      );

      gsap.fromTo([marker1Ref.current, marker2Ref.current],
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.out', stagger: 0.2, delay: 0.6 }
      );
    }

    return () => clearInterval(interval);
  }, []);

  const categories = [
    { name: 'Hackathon', icon: '🎪', color: '#ffb3ba' },
    { name: 'Photography', icon: '📷', color: '#baffc9' },
    { name: 'E-Sports', icon: '🎮', color: '#bae1ff' },
    { name: 'Sports', icon: '🏆', color: '#d5baff' },
    { name: 'Cultural', icon: '🎭', color: '#ffbaff' },
    { name: 'Literature', icon: '📚', color: '#bafff0' },
    { name: 'Drama', icon: '🎬', color: '#ffc9ba' },
    { name: 'Comedy', icon: '🎭', color: '#e6ffba' },
  ];

  const filterCategories = ['All', 'Music', 'Gaming', 'Tech', 'Dance', 'Drama', 'Academics', 'Workshops', 'Culture', 'Media', 'Socialz', 'Empower'];

  const [loading, setLoading] = useState(true);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [showAllClubs, setShowAllClubs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, approvedRes, clubsRes] = await Promise.all([
          api.get('/events'),
          api.get('/events/approved'),
          api.get('/clubs')
        ]);

        const mappedApproved = approvedRes.data.map((s: any) => ({
          id: s._id,
          title: s.title,
          desc: s.description || '',
          date: s.startDate,
          location: s.location || 'TBA',
          price: 'Free',
          img: s.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
          category: 'Workshops',
        }));

        const mappedEvents = eventsRes.data.map((s: any) => ({
          id: s._id,
          title: s.title,
          desc: s.description || '',
          date: s.date,
          location: s.venue || 'TBA',
          price: s.price || 'Free',
          img: s.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
          category: s.category || 'Tech',
        }));

        setEventsList([...mappedApproved, ...mappedEvents]);
        setClubs(clubsRes.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEvents = eventsList.filter(ev => activeCategory === 'All' || ev.category === activeCategory);
  
  const displayedClubs = showAllClubs ? clubs : clubs.filter(c => c.type === 'Initiative');

  const top5Events = eventsList.slice(0, 5);
  const displayEvents = top5Events.length > 0 
    ? [0, 1, 2, 3, 4].map(i => top5Events[i % top5Events.length])
    : [1, 2, 3, 4, 5].map(item => ({ id: `loading-${item}`, title: `Loading...`, isLoading: true }));

  return (
    <div className="home2-page" style={{ background: '#FFFFFF', minHeight: '100vh', color: '#111', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .premium-hero-heading {
          font-family: 'Inter', 'SF Pro Display', 'Neue Haas Grotesk', sans-serif;
          font-weight: 700;
          text-align: center;
          line-height: 0.98;
          color: #111111;
          margin: 0 auto 3rem;
          max-width: 900px;
          letter-spacing: -1px;
        }
        @media (min-width: 1200px) {
          .premium-hero-heading { font-size: 60px; }
        }
        @media (min-width: 1024px) and (max-width: 1199px) {
          .premium-hero-heading { font-size: 54px; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .premium-hero-heading { font-size: 46px; }
        }
        @media (max-width: 767px) {
          .premium-hero-heading { font-size: 34px; }
        }
        .hero-line {
          display: block;
          opacity: 0;
        }
        .marker-highlight {
          position: absolute;
          top: 45%;
          bottom: 0%;
          left: -10px;
          right: -10px;
          border-radius: 999px;
          z-index: -1;
          transform: rotate(-2deg);
        }
        .marker-pink {
          background-color: #FF5DAA;
        }
        .marker-cyan {
          background-color: #49D8F6;
        }

        /* Mobile Categories Horizontal Scroll */
        @media (max-width: 768px) {
          .categories-section { padding: 2rem 1.25rem !important; }
          .categories-title { font-size: 1.35rem !important; margin-bottom: 1.25rem !important; }
          .categories-grid { 
            display: flex !important; 
            overflow-x: auto !important; 
            scroll-snap-type: x mandatory; 
            gap: 1rem !important; 
            padding-bottom: 1rem !important;
            margin: 0 -1.25rem !important;
            padding: 0 1.25rem 1rem 1.25rem !important;
            -webkit-overflow-scrolling: touch;
          }
          .categories-grid::-webkit-scrollbar { display: none; }
          .category-card { 
            min-width: 100px !important; 
            flex: 0 0 100px !important; 
            scroll-snap-align: start; 
          }
          .category-icon { font-size: 2rem !important; }
          .category-text { font-size: 0.75rem !important; }
        }
      `}</style>

      {/* Hero Section */}
      <section style={{ paddingTop: '8rem', paddingBottom: '4rem', textAlign: 'center', overflow: 'hidden', background: '#FFFFFF' }}>
        <h1 ref={heroRef} className="premium-hero-heading">
          <span className="hero-line">
            Where JECRC <span style={{ position: 'relative', display: 'inline-block', fontStyle: 'italic', zIndex: 1, marginLeft: '0.1em' }}>
              <span ref={marker1Ref} className="marker-highlight marker-pink" />
              Comes
            </span>
          </span>
          <span className="hero-line" style={{ marginTop: '0.15em' }}>
            <span style={{ position: 'relative', display: 'inline-block', fontStyle: 'italic', zIndex: 1, margin: '0 0.15em' }}>
              <span ref={marker2Ref} className="marker-highlight marker-cyan" />
              Alive
            </span> Daily
          </span>
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '3rem', position: 'relative', height: isMobile ? '400px' : '500px', width: '100%', overflow: 'hidden' }}>
          {displayEvents.map((event, index) => {
            const offset = (index - activeIndex + 5) % 5;

            const isCenter = offset === 0;
            const isAdjRight = offset === 1;
            const isFarRight = offset === 2;
            const isFarLeft = offset === 3;
            const isAdjLeft = offset === 4;

            let zIndex = 1;
            let left = '50%';
            let height = '300px';
            let width = '15vw';

            if (isMobile) {
              if (isCenter) {
                zIndex = 10; left = '50%'; height = '360px'; width = '255px';
              } else if (isAdjLeft) {
                zIndex = 5; left = '20%'; height = '280px'; width = '198px';
              } else if (isAdjRight) {
                zIndex = 5; left = '80%'; height = '280px'; width = '198px';
              } else if (isFarLeft) {
                zIndex = 2; left = '-5%'; height = '220px'; width = '156px';
              } else if (isFarRight) {
                zIndex = 2; left = '105%'; height = '220px'; width = '156px';
              }
            } else {
              if (isCenter) {
                zIndex = 10; left = '50%'; height = '480px'; width = '340px';
              } else if (isAdjLeft) {
                zIndex = 5; left = '35%'; height = '380px'; width = '269px';
              } else if (isAdjRight) {
                zIndex = 5; left = '65%'; height = '380px'; width = '269px';
              } else if (isFarLeft) {
                zIndex = 2; left = '22%'; height = '300px'; width = '212px';
              } else if (isFarRight) {
                zIndex = 2; left = '78%'; height = '300px'; width = '212px';
              }
            }

            return (
              <motion.div
                key={index}
                onClick={() => {
                  if (event && event.id && !event.id.toString().startsWith('static-')) {
                    window.location.hash = `#event-detail-${event.id}`;
                  }
                }}
                initial={false}
                animate={{
                  width,
                  height,
                  left,
                  zIndex,
                  opacity: 1
                }}
                transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
                style={{
                  borderRadius: '24px',
                  boxShadow: isCenter ? '0 30px 60px rgba(0,0,0,0.4)' : '0 15px 30px rgba(0,0,0,0.2)',
                  position: 'absolute',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  overflow: 'hidden',
                  background: '#111',
                  border: '2px solid #000',
                  cursor: 'pointer'
                }}
              >
                {event.isLoading ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <motion.svg
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </motion.svg>
                  </div>
                ) : (
                  <img
                    src={event.img}
                    alt={event.title || 'Event'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.15)' }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section" style={{ maxWidth: '1440px', margin: '0 auto', padding: '2rem 2.5rem' }}>
        <h2 className="categories-title" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Explore Events Categories</h2>
        <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              className="category-card"
              whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }}
              style={{
                background: `linear-gradient(to bottom, #ffffff 30%, ${cat.color}77 100%)`,
                borderRadius: '16px',
                border: '1px solid rgba(0,0,0,0.06)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                aspectRatio: '3/4',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <span className="category-text" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', zIndex: 1, textAlign: 'center', marginTop: '1.25rem', padding: '0 0.5rem', lineHeight: 1.2 }}>{cat.name}</span>
              <span className="category-icon" style={{ fontSize: '4.5rem', zIndex: 1, marginTop: 'auto', marginBottom: '0.75rem', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.15))' }}>{cat.icon}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {loading ? (
        <div style={{ padding: '6rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#FFFFFF', color: '#111' }}>
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem' }}>
            <motion.div animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }} style={{ width: '14px', height: '14px', background: 'linear-gradient(135deg, #8B5CF6, #C084FC)', borderRadius: '50%', boxShadow: '0 4px 10px rgba(139,92,246,0.3)' }} />
            <motion.div animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }} style={{ width: '14px', height: '14px', background: 'linear-gradient(135deg, #EC4899, #F472B6)', borderRadius: '50%', boxShadow: '0 4px 10px rgba(236,72,153,0.3)' }} />
            <motion.div animate={{ y: [0, -15, 0], scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} style={{ width: '14px', height: '14px', background: 'linear-gradient(135deg, #3B82F6, #60A5FA)', borderRadius: '50%', boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }} />
          </div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #111, #444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Loading...</h2>
          <p style={{ color: '#6B7280', fontSize: '1.05rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Curating the best events and clubs for you
          </p>
        </div>
      ) : (
        <>
          {/* Clubs Section */}
          <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '3rem 2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Explore Clubs in JECRC</h2>
              <button 
                onClick={() => {
                  if (!showAllClubs) {
                    setShowAllClubs(true);
                  } else {
                    window.location.hash = '#clubs'; // Ensure this matches your clubs route if you have one
                  }
                }}
                style={{ background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', color: '#8B5CF6' }}
              >
                {showAllClubs ? 'Go to Clubs Page →' : 'view more...'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
              {displayedClubs.map(club => (
                <div
                  key={club.id}
                  onClick={() => window.location.hash = `#club-detail-${club.id}`}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', minWidth: '120px', cursor: 'pointer' }}
                >
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={club.logo}
                    alt={club.name}
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', background: '#e2e8f0', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
                  />
                  <span style={{ fontWeight: 600 }}>{club.name}</span>
                </div>
              ))}
            </div>
          </section>

          {/* All Events Section */}
          <div style={{ background: '#FFFFFF' }}>
            <section style={{ maxWidth: '1440px', margin: '0 auto', padding: '4rem 2.5rem 6rem' }}>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2.5rem', color: '#111' }}>All events</h2>

              {/* Filters */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid #e2e8f0', width: '100%' }}>
                {filterCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      background: 'none',
                      border: 'none',
                      borderBottom: cat === activeCategory ? '2px solid #8B5CF6' : '2px solid transparent',
                      color: cat === activeCategory ? '#111' : '#94a3b8',
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      paddingBottom: '0.75rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.2s'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2rem' }}>
                {filteredEvents.map(event => (
                  <motion.div
                    key={event.id}
                    onClick={() => window.location.hash = `#event-detail-${event.id}`}
                    whileHover="hover"
                    initial="initial"
                    variants={{
                      initial: { y: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
                      hover: { y: -6, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }
                    }}
                    style={{ background: '#f8f9fa', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
                  >
                    <div style={{ height: '380px', position: 'relative', overflow: 'hidden' }}>
                      <motion.img
                        variants={{ initial: { scale: 1 }, hover: { scale: 1.05 } }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        src={event.img} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <div style={{ color: '#007BFF', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.6rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        {event.date || event.startDate || 'TBA'}
                      </div>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111', lineHeight: 1.3, marginBottom: '0.6rem' }}>{event.title}</h3>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#6B7280', fontSize: '0.85rem', fontWeight: 500, marginBottom: '1.25rem' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        {event.location || event.venue || 'TBA'}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6B7280', fontSize: '0.9rem', fontWeight: 500, marginTop: 'auto' }}>
                        <span>{event.capacity || event.seats || 'Limited'} Seats left</span>
                        <span style={{ color: '#D1D5DB' }}>|</span>
                        <span style={{ color: '#E11D48', fontWeight: 700 }}>
                          {event.tickets && event.tickets.length > 0 ? `₹${event.tickets[0].price}` : (event.price || 'Free')}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      {/* Footer (Dark variant by default from component) */}
      <div style={{ background: '#111' }}>
        <Footer />
      </div>
    </div>
  );
};

export default Home2;
