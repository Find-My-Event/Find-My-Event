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
  const eventsSectionRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categoryName: string) => {
    setActiveCategory(categoryName);
    if (eventsSectionRef.current) {
      eventsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };



  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {

    // GSAP Animation for Hero
    if (heroRef.current) {
      const lines = heroRef.current.querySelectorAll('.hero-line');
      if (lines.length > 0) {
        gsap.fromTo(lines,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.2 }
        );
      }

      if (marker1Ref.current && marker2Ref.current) {
        gsap.fromTo([marker1Ref.current, marker2Ref.current],
          { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)', duration: 1, ease: 'power3.out', stagger: 0.2, delay: 0.6 }
        );
      }
    }
  }, []);

  const categories = [
    { name: 'Tech', icon: '💻', color: '#f43f5e' },
    { name: 'Gaming', icon: '🎮', color: '#0ea5e9' },
    { name: 'Music', icon: '🎵', color: '#d946ef' },
    { name: 'Culture', icon: '🎭', color: '#f97316' },
    { name: 'Arts', icon: '📷', color: '#10b981' },
    { name: 'Sports', icon: '⚽', color: '#8b5cf6' },
    { name: 'Workshops', icon: '📚', color: '#14b8a6' },
    { name: 'Media', icon: '📢', color: '#eab308' },
    { name: 'Literature', icon: '📖', color: '#a855f7' },
  ];

  const filterCategories = [
    'All',
    'Tech',
    'Gaming',
    'Music',
    'Culture',
    'Arts',
    'Sports',
    'Workshops',
    'Media',
    'Literature'
  ];

  const [loading, setLoading] = useState(true);
  const [eventsList, setEventsList] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);

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
          category: s.category || 'Workshops',
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

  const filteredEvents = eventsList.filter(ev => {
    if (activeCategory === 'All') return true;
    if (!ev.category) return false;
    const c1 = ev.category.toLowerCase().trim();
    const c2 = activeCategory.toLowerCase().trim();
    const categoryMap: Record<string, string[]> = {
      'tech': ['tech', 'technology', 'hackathon', 'coding', 'tech & hackathons'],
      'gaming': ['gaming', 'esports', 'e-sports', 'gaming & e-sports'],
      'music': ['music', 'dance', 'singing', 'music & dance'],
      'culture': ['culture', 'cultural', 'drama', 'comedy', 'theatre', 'cultural & drama'],
      'arts': ['art', 'arts', 'art & design', 'photography', 'photo', 'art & photography'],
      'sports': ['sports', 'sport', 'fitness'],
      'workshops': ['workshop', 'workshops', 'academic', 'academics', 'workshops & academics'],
      'media': ['media', 'socialz', 'social', 'empower', 'media & social'],
      'literature': ['literature', 'literary', 'books']
    };

    const targetList = categoryMap[c2];
    if (targetList) {
      return targetList.some(alias => c1.includes(alias) || alias.includes(c1));
    }
    return c1.includes(c2) || c2.includes(c1);
  });

  const initiativeKeywords = ['initiative', 'center', 'centre', 'council', 'jic', 'iaeste', 'zarurat', 'makerspace', 'socialz', 'mpower', 'nss', 'upscale', 'incubation', 'cell', 'outreach'];

  const displayedClubs = [...clubs].sort((a, b) => {
    const nameA = (a.name || '').toLowerCase();
    const nameB = (b.name || '').toLowerCase();
    const isAStudentCouncil = nameA.includes('student council');
    const isBStudentCouncil = nameB.includes('student council');
    if (isAStudentCouncil && !isBStudentCouncil) return -1;
    if (!isAStudentCouncil && isBStudentCouncil) return 1;

    const typeA = (a.type || '').toLowerCase();
    const typeB = (b.type || '').toLowerCase();
    const isAInit = typeA === 'initiative' || typeA === 'center' || typeA === 'centre' || initiativeKeywords.some(k => nameA.includes(k));
    const isBInit = typeB === 'initiative' || typeB === 'center' || typeB === 'centre' || initiativeKeywords.some(k => nameB.includes(k));
    if (isAInit && !isBInit) return -1;
    if (!isAInit && isBInit) return 1;
    return 0;
  });

  const top5Events = [...eventsList]
    .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 5);
  const displayEvents = top5Events.length > 0
    ? top5Events
    : [{ id: `loading-1`, title: `Loading...`, isLoading: true }];

  return (
    <div className="home2-page" style={{ background: '#FFFFFF', minHeight: '100vh', color: '#111', fontFamily: "'Plus Jakarta Sans', sans-serif", overflowX: 'hidden' }}>
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
      <section style={{ paddingTop: isMobile ? '4.5rem' : '6rem', paddingBottom: '3rem', textAlign: 'center', overflow: 'hidden', background: '#FFFFFF' }}>
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
            const length = displayEvents.length;
            const normalizedActive = ((activeIndex % length) + length) % length;
            const offset = (index - normalizedActive + length) % length;

            let isCenter = false, isAdjRight = false, isFarRight = false, isFarLeft = false, isAdjLeft = false, isHidden = false;

            if (length === 1) {
              isCenter = true;
            } else if (length === 2) {
              isAdjLeft = offset === 0;
              isAdjRight = offset === 1;
            } else if (length === 3) {
              isCenter = offset === 0;
              isAdjRight = offset === 1;
              isAdjLeft = offset === 2;
            } else if (length === 4) {
              isAdjLeft = offset === 0;
              isAdjRight = offset === 1;
              isHidden = offset === 2 || offset === 3;
            } else {
              isCenter = offset === 0;
              isAdjRight = offset === 1;
              isFarRight = offset === 2;
              isFarLeft = offset === 3;
              isAdjLeft = offset === 4;
            }

            let zIndex = 1;
            let left = '50%';
            let height = '300px';
            let width = '15vw';
            let opacity = 1;
            let isTwoCardsLayout = length === 2 || length === 4;

            if (isMobile) {
              if (isTwoCardsLayout) {
                if (isAdjLeft) { zIndex = 15; left = 'calc(50% - 70px)'; height = '360px'; width = '255px'; }
                else if (isAdjRight) { zIndex = 10; left = 'calc(50% + 70px)'; height = '360px'; width = '255px'; }
                else if (isHidden) { zIndex = 1; left = '50%'; height = '220px'; width = '156px'; opacity = 0; }
              } else {
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
                } else if (isHidden) {
                  zIndex = 1; left = '50%'; height = '220px'; width = '156px'; opacity = 0;
                }
              }
            } else {
              if (isTwoCardsLayout) {
                if (isAdjLeft) { zIndex = 10; left = 'calc(50% - 180px)'; height = '480px'; width = '340px'; }
                else if (isAdjRight) { zIndex = 10; left = 'calc(50% + 180px)'; height = '480px'; width = '340px'; }
                else if (isHidden) { zIndex = 1; left = '50%'; height = '300px'; width = '212px'; opacity = 0; }
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
                } else if (isHidden) {
                  zIndex = 1; left = '50%'; height = '300px'; width = '212px'; opacity = 0;
                }
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
                  opacity
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
                ) : event.isDummy ? (
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: '#94a3b8' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#f1f5f9', textAlign: 'center', padding: '0 1rem' }}>More Events</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Coming Soon...</div>
                  </div>
                ) : (
                  <img
                    src={event.img}
                    alt={event.title || 'Event'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
                  />
                )}
              </motion.div>
            )
          })}
        </div>
      </section>

      {loading ? (
        <div style={{ padding: '6rem 2rem', textAlign: 'center' }}><h2>Loading...</h2></div>
      ) : (
        <>
          <section className="initiatives-section" style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '2rem 0' : '3rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem', padding: isMobile ? '0 1.25rem' : '0 2.5rem' }}>
              <h2 style={{ fontSize: isMobile ? '1.2rem' : '1.5rem', fontWeight: 700 }}>Explore Initiatives, Clubs & Centers in JECRC</h2>
              <button onClick={() => window.location.hash = '#clubs'} style={{ background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', color: '#8B5CF6', fontSize: isMobile ? '0.85rem' : '0.95rem', marginLeft: 'auto' }}>view more...</button>
            </div>
            <div className="no-scrollbar" style={{ display: 'flex', gap: isMobile ? '1.25rem' : '2rem', overflowX: 'auto', padding: isMobile ? '0.5rem 1.25rem 1.5rem' : '0.5rem 2.5rem 1.5rem' }}>
              {displayedClubs.map((club, idx) => (
                <div key={`${club.id}-${idx}`} onClick={() => window.location.hash = `#club-detail-${club.id}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', minWidth: isMobile ? '95px' : '120px', cursor: 'pointer' }}>
                  <motion.img whileHover={{ scale: 1.05 }} src={club.logo} alt={club.name} style={{ width: isMobile ? '90px' : '120px', height: isMobile ? '90px' : '120px', borderRadius: '50%', objectFit: 'cover', background: '#e2e8f0', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', flexShrink: 0 }} />
                  <span style={{ fontWeight: 600, fontSize: isMobile ? '0.82rem' : '0.95rem', textAlign: 'center', lineHeight: 1.2 }}>{club.name}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="categories-section" style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '1.5rem 1.5rem 1rem' : '2rem 2.5rem 1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem' }}>Explore Events Categories</h2>
            <div className="categories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(135px, 1fr))', gap: '1.5rem' }}>
              {categories.map((cat) => (
                <motion.div key={cat.name} className="category-card" onClick={() => handleCategoryClick(cat.name)} whileHover={{ y: -8, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' }} style={{ background: `linear-gradient(to bottom, #ffffff 10%, ${cat.color}25 55%, ${cat.color}88 100%)`, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', aspectRatio: '3/4' }}>
                  <span className="category-text" style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', zIndex: 1, textAlign: 'center', marginTop: '1.25rem', padding: '0 0.5rem' }}>{cat.name}</span>
                  <span className="category-icon" style={{ fontSize: '4.5rem', zIndex: 1, marginTop: 'auto', marginBottom: '0.75rem' }}>{cat.icon}</span>
                </motion.div>
              ))}
            </div>
          </section>

          <div style={{ background: '#FFFFFF' }} ref={eventsSectionRef}>
            <section style={{ maxWidth: '1440px', margin: '0 auto', padding: isMobile ? '2.5rem 1.25rem 4rem' : '4rem 2.5rem 6rem' }}>
              <h2 style={{ fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: 800, marginBottom: isMobile ? '1.5rem' : '2.5rem', color: '#111' }}>All events</h2>
              <div className="no-scrollbar" style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2.5rem', borderBottom: '1px solid #e2e8f0', width: '100%' }}>
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
                {filteredEvents.length === 0 ? (
                  <div style={{ gridColumn: '1 / -1', padding: '4rem 1rem', textAlign: 'center', background: '#f8fafc', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎈</div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.4rem' }}>No events in "{activeCategory}" yet</h4>
                    <p style={{ fontSize: '0.95rem', color: '#64748b', margin: 0 }}>Organizers haven't published any events under this category yet. Check back soon!</p>
                  </div>
                ) : (
                  filteredEvents.map(event => (
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
                          {(() => {
                            const priceText = event.tickets && event.tickets.length > 0 ? event.tickets[0].price : (event.price || 'Free');
                            const isFree = String(priceText).toLowerCase() === 'free' || String(priceText) === '0';
                            if (isFree) return null;
                            return (
                              <>
                                <span style={{ color: '#D1D5DB' }}>|</span>
                                <span style={{ color: '#E11D48', fontWeight: 700 }}>
                                  {String(priceText).includes('₹') ? priceText : `₹${priceText}`}
                                </span>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
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
