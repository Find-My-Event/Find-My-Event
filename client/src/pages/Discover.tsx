import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { MapPin, Search, Sparkles, TrendingUp, Clock, Star, Loader2 } from 'lucide-react';
import api from '../api/axios';

import { EventDetail, RegisterView } from '../components/SharedViews';

// ─── Tag Badge ────────────────────────────────────────────────────────────────
const TagBadge = ({ tag }: { tag: string }) => {
  if (!tag) return null;
  const colors: Record<string, string> = {
    Trending: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    Hot: 'linear-gradient(135deg, #ef4444, #ec4899)',
    New: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
  };
  return (
    <div style={{
      position: 'absolute', top: '10px', left: '10px', zIndex: 3,
      background: colors[tag] || '#3b82f6',
      color: '#fff', fontSize: '0.65rem', fontWeight: 700,
      padding: '3px 8px', borderRadius: '20px',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', gap: '3px'
    }}>
      {tag === 'Trending' && <TrendingUp size={10} />}
      {tag === 'Hot' && '🔥'}
      {tag === 'New' && <Sparkles size={10} />}
      {tag}
    </div>
  );
};

// ─── Featured Event Card ────────────────────────────────────────────────────────
const FeaturedCard = ({ event, onClick }: { event: any; onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(99,102,241,0.1))',
        border: '1px solid rgba(139,92,246,0.3)',
        borderRadius: '20px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(139,92,246,0.2)',
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '60%', overflow: 'hidden', background: '#1a1a1f' }}>
        <TagBadge tag={event.tag} />
        <motion.img
          src={event.image}
          alt={event.title}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5 }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)'
        }} />
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Star size={16} color="#fbbf24" fill="#fbbf24" />
          <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>Featured</span>
        </div>

        <h3 style={{
          color: '#f1f5f9', fontSize: '1.1rem', fontWeight: 700,
          lineHeight: 1.3, marginBottom: '0.5rem'
        }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <MapPin size={14} color="#8b5cf6" />
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{event.venue}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Seats: {event.seats}</span>
          <span style={{
            fontSize: '0.85rem', fontWeight: 700,
            color: event.price === 'Free' ? '#34d399' : '#f59e0b',
            background: event.price === 'Free' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)',
            padding: '3px 10px', borderRadius: '15px'
          }}>
            {event.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Animated Card ────────────────────────────────────────────────────────────
const DiscoverCard = ({ event, index, onClick }: { event: any; index: number; onClick: () => void }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, scale: 0.92 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.65, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.3, ease: 'easeOut' } }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        backdropFilter: 'blur(8px)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <div style={{ position: 'relative', width: '100%', paddingTop: '75%', overflow: 'hidden', background: '#1a1a1f' }}>
        <TagBadge tag={event.tag} />
        <motion.img
          src={event.image}
          alt={event.title}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
          pointerEvents: 'none'
        }} />
      </div>

      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Clock size={12} color="#6b7280" />
          <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{event.date}</span>
        </div>

        <h3 style={{
          color: '#f1f5f9', fontSize: '0.92rem', fontWeight: 600,
          lineHeight: 1.35, marginBottom: '0.5rem',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {event.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.6rem' }}>
          <MapPin size={12} color="#8b5cf6" />
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{event.venue}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.65rem' }}>
          <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>Seats: {event.seats}</span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 700,
            color: event.price === 'Free' ? '#34d399' : '#f59e0b',
            background: event.price === 'Free' ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)',
            padding: '2px 8px', borderRadius: '20px'
          }}>
            {event.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Discover Page ───────────────────────────────────────────────────────
// ... inside Discover component ...
export default function Discover({ }: { isLoggedIn?: boolean }) {
  const [currentView, setCurrentView] = useState<'grid' | 'details' | 'register'>('grid');
  const [eventList, setEventList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [sortBy] = useState<'date' | 'popularity' | 'name'>('popularity');

  const categories = ['All', 'Music', 'Gaming', 'Tech', 'Dance', 'Drama', 'Academics', 'Workshops', 'Culture'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEventList(res.data);
    } catch (err) {
      console.error('Failed to fetch in Discover:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = eventList.filter(e => {
    const matchCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    const aScore = (a.tag === 'Trending' ? 3 : a.tag === 'Hot' ? 2 : a.tag === 'New' ? 1 : 0);
    const bScore = (b.tag === 'Trending' ? 3 : b.tag === 'Hot' ? 2 : b.tag === 'New' ? 1 : 0);
    return bScore - aScore;
  });

  const featuredEvents = eventList.filter(e => e.tag === 'Trending' || e.tag === 'Hot').slice(0, 3);

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentView === 'register') {
      setCurrentView('details');
    } else {
      setSelectedEvent(null);
      setCurrentView('grid');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#08080c',
      backgroundImage: `
        radial-gradient(ellipse at 20% 0%, rgba(139,92,246,0.18) 0%, transparent 45%),
        radial-gradient(ellipse at 80% 10%, rgba(99,102,241,0.12) 0%, transparent 40%)
      `,
      fontFamily: "'Outfit', sans-serif",
      overflowX: 'hidden',
    }}>
      <AnimatePresence mode="wait">
        {currentView === 'details' && selectedEvent ? (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
            <EventDetail event={selectedEvent} onBack={handleBack} onRegister={handleRegisterClick} />
          </motion.div>
        ) : currentView === 'register' && selectedEvent ? (
          <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>
            <RegisterView event={selectedEvent} onBack={handleBack} />
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'relative', zIndex: 1, padding: '7rem 2rem 6rem 2rem', maxWidth: '1300px', margin: '0 auto' }}
          >
            {/* Header */}
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
               <h1 style={{ color: '#fff', fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 800, marginBottom: '0.5rem' }}>Discover Events<span style={{ color: '#8b5cf6' }}>.</span></h1>
               <p style={{ color: '#64748b' }}>Handpicked experiences for you.</p>
            </div>

            {/* Search */}
            <div style={{ maxWidth: '560px', margin: '0 auto 3rem auto', position: 'relative' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', 
                border: `1px solid ${searchFocused ? '#8b5cf6' : 'rgba(255,255,255,0.1)'}`, 
                borderRadius: '16px', padding: '1rem 1.5rem', transition: 'all 0.3s' 
              }}>
                <Search size={20} color={searchFocused ? '#8b5cf6' : '#64748b'} />
                <input 
                  onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)}
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search events, organizers..."
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '1rem' }}
                />
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader2 className="spin" size={40} color="#8b5cf6" /></div>
            ) : (
              <>
                {/* Featured */}
                {selectedCategory === 'All' && !searchQuery && featuredEvents.length > 0 && (
                  <div style={{ marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                      <Sparkles size={24} color="#8b5cf6" />
                      <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Featured</h2>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                      {featuredEvents.map(e => <FeaturedCard key={e._id} event={e} onClick={() => handleEventClick(e)} />)}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                   {categories.map(cat => (
                     <button key={cat} onClick={() => setSelectedCategory(cat)} style={{ flexShrink: 0, padding: '0.6rem 1.5rem', borderRadius: '12px', background: selectedCategory === cat ? '#8b5cf6' : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{cat}</button>
                   ))}
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                  {filteredEvents.map((e, i) => (
                    <DiscoverCard key={e._id} event={e} index={i} onClick={() => handleEventClick(e)} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
