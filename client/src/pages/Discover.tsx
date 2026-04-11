import { useState, useEffect, useMemo, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X, Sparkles, TrendingUp, Clock, Calendar, MoreHorizontal, Loader2, Filter } from 'lucide-react';
import api from '../api/axios';
import { EventDetail, RegisterView } from '../components/SharedViews';
import { darkPageShell } from '../theme/darkShell';
import { useAuth } from '../contexts/AuthContext';

// ─── Tag Badge ────────────────────────────────────────────────────────────────
const TagBadge = ({ tag }: { tag: string }) => {
  if (!tag) return null;
  const colors: Record<string, string> = {
    Trending: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    Hot: 'linear-gradient(135deg, #ef4444, #ec4899)',
    New: 'linear-gradient(135deg, #06b6d4, #ff4d00)',
  };
  return (
    <div style={{
      position: 'absolute', top: '10px', left: '10px', zIndex: 3,
      background: colors[tag] || '#ff4d00',
      color: '#ffffff', fontSize: '0.65rem', fontWeight: 700,
      padding: '3px 8px', borderRadius: '20px',
      textTransform: 'uppercase', letterSpacing: '0.08em',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', gap: '3px',
    }}>
      {tag === 'Trending' && <TrendingUp size={10} />}
      {tag === 'Hot' && '🔥'}
      {tag === 'New' && <Sparkles size={10} />}
      {tag}
    </div>
  );
};

const allEvents = [
  { id: 1, title: 'Indie Night: Live Bands & Open Mic', organizer: 'JECRC Music Club', date: 'Sat, Feb 14 • 4:45 am', venue: 'Jaipur, Rajasthan', image: '/event1.png', category: 'Music', price: 'Free', seats: '69/100', tag: 'Trending' },
  { id: 2, title: 'EDM Blast Fest 2026', organizer: 'Hukum Productions', date: 'Sat, Feb 14 • 4:45 am', venue: 'Jaipur, Rajasthan', image: '/event2.png', category: 'Music', price: 'Free', seats: '69/100', tag: 'Hot' },
  { id: 3, title: 'Udaipur World Music Festival', organizer: 'City Palace Events', date: 'Sat, Feb 14 • 4:45 am', venue: 'Jaipur, Rajasthan', image: '/event1.png', category: 'Music', price: 'Free', seats: '69/100', tag: '' },
  { id: 4, title: 'Bollywood Beats DJ Party', organizer: 'Club Rhythm', date: 'Sat, Feb 14 • 4:45 am', venue: 'Jaipur, Rajasthan', image: '/event2.png', category: 'Gaming', price: 'Free', seats: '69/100', tag: 'New' },
  { id: 5, title: "It's all a DREAM, Karan Aujla India Tour", organizer: 'BookMyShow Live', date: 'Sat, Feb 14 • 4:45 am', venue: 'Jaipur, Rajasthan', image: '/event1.png', category: 'Music', price: 'Free', seats: '69/100', tag: '' },
  { id: 6, title: 'Hukum Live in USA, Diljeet', organizer: 'International Shows', date: 'Sat, Feb 14 • 4:45 am', venue: 'Jaipur, Rajasthan', image: '/event2.png', category: 'Dance', price: 'Free', seats: '69/100', tag: 'Hot' },
  { id: 7, title: 'Acoustic Vibes: Coffee & Music', organizer: 'Café Culture Events', date: 'Sat, Feb 14 • 4:45 am', venue: 'Jaipur, Rajasthan', image: '/event1.png', category: 'Music', price: 'Free', seats: '69/100', tag: '' },
  { id: 8, title: 'Jaana Samjho Na, Aditya Rikhari India Tour 2026', organizer: 'Live Nation India', date: 'Sat, Feb 14 • 4:45 am', venue: 'Jaipur, Rajasthan', image: '/event2.png', category: 'Tech', price: 'Free', seats: '69/100', tag: 'Trending' },
];

const categories = ['All', 'Music', 'Gaming', 'Tech', 'Dance', 'Drama', 'Academics', 'Workshops', 'Culture'];

type ApiApproved = {
  _id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  mode: string;
  location: string;
  capacity?: number;
  imageUrl?: string;
  organizer?: { name?: string };
};

function mapApprovedToCard(s: ApiApproved) {
  const cap = s.capacity ?? 0;
  return {
    id: `api-${s._id}`,
    title: s.title,
    organizer: s.organizer?.name || 'Campus host',
    date: `${s.startDate} → ${s.endDate}`,
    venue: `${s.location} · ${s.mode}`,
    image: s.imageUrl || '/event1.png',
    category: 'Culture',
    price: 'Free',
    seats: cap ? `${Math.min(12, cap)}/${cap}` : 'Open',
    tag: 'New' as const,
  };
}

const DiscoverGridCard = ({
  event,
  index,
  onViewMore,
  onRegister,
}: {
  event: any;
  index: number;
  onViewMore: () => void;
  onRegister: () => void;
}) => (
  <motion.div
    className="event-card-container"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px 0px -50px 0px' }}
    transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    whileHover="hover"
    whileTap="hover"
    style={{
      background: 'var(--bg-card)',
      borderRadius: '16px',
      padding: '1.5rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
      border: '1px solid var(--border-subtle)',
      cursor: 'pointer',
      width: '100%',
      maxWidth: '360px',
      margin: '0 auto',
    }}
    variants={{
      hover: {
        y: -8,
        scale: 1.02,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        borderColor: 'rgba(255,255,255,0.15)',
        transition: { duration: 0.3, ease: 'easeOut' },
      },
    }}
    onClick={onViewMore}
  >
    <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', background: '#1a1a1f' }}>
      <TagBadge tag={event.tag} />
      <motion.img
        src={event.image}
        alt={event.title}
        variants={{ hover: { scale: 1.08, transition: { duration: 0.4, ease: 'easeOut' } } }}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
    </div>

    <div style={{ marginBottom: '1rem' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem', lineHeight: 1.3 }}>{event.title}</h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>By {event.organizer}</p>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Calendar size={14} color="#aaa" />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{event.date}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <MapPin size={14} color="#aaa" />
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{event.venue}</span>
      </div>
    </div>

    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <motion.button
        type="button"
        onClick={(e: MouseEvent) => { e.stopPropagation(); onRegister(); }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: '#ff4d00',
          color: '#ffffff',
          border: 'none',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.85rem',
          flex: 1,
        }}
      >
        Register
      </motion.button>
      <motion.button
        type="button"
        onClick={(e: MouseEvent) => { e.stopPropagation(); onViewMore(); }}
        whileHover={{ scale: 1.05, backgroundColor: 'var(--border-subtle)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          background: 'transparent',
          color: 'var(--text-muted)',
          border: '1px solid var(--border-color)',
          padding: '0.6rem 1rem',
          borderRadius: '8px',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MoreHorizontal size={16} />
      </motion.button>
    </div>
  </motion.div>
);

// ─── Main Discover Page ───────────────────────────────────────────────────────
export default function Discover({ isLoggedIn: propIsLoggedIn }: { isLoggedIn?: boolean }) {
  const { isLoggedIn: authIsLoggedIn } = useAuth();
  const isLoggedIn = propIsLoggedIn ?? authIsLoggedIn;
  const [approvedFromApi, setApprovedFromApi] = useState<ReturnType<typeof mapApprovedToCard>[]>([]);
  const [currentView, setCurrentView] = useState<'grid' | 'details' | 'register'>('grid');
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'popularity' | 'name'>('popularity');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get<ApiApproved[]>('/events/approved')
      .then(({ data }) => {
        if (!cancelled && Array.isArray(data)) setApprovedFromApi(data.map(mapApprovedToCard));
      })
      .catch((err) => console.error('Discover fetch failed:', err))
      .finally(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const mergedEvents = useMemo(() => [...approvedFromApi, ...allEvents], [approvedFromApi]);

  const featuredEvents = useMemo(() => {
    const fromApproved = approvedFromApi.slice(0, 2);
    const fromStatic = allEvents.filter((e) => e.tag === 'Trending' || e.tag === 'Hot').slice(0, 2);
    const allFeatured = [...fromApproved, ...fromStatic];
    return !isLoggedIn ? allFeatured.slice(0, 1) : allFeatured.slice(0, 3);
  }, [approvedFromApi, isLoggedIn]);

  const filteredEventsAll = mergedEvents.filter((e) => {
    const matchCat = selectedCategory === 'All' || e.category === selectedCategory;
    const matchSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'date') {
      const ta = Date.parse(String(a.date)) || 0;
      const tb = Date.parse(String(b.date)) || 0;
      return ta - tb;
    }
    if (sortBy === 'name') return a.title.localeCompare(b.title);
    const aScore = (a.tag === 'Trending' ? 3 : a.tag === 'Hot' ? 2 : a.tag === 'New' ? 1 : 0);
    const bScore = (b.tag === 'Trending' ? 3 : b.tag === 'Hot' ? 2 : b.tag === 'New' ? 1 : 0);
    return bScore - aScore;
  });

  const gridEvents = useMemo(() => {
    const filtered = !isLoggedIn ? filteredEventsAll.slice(0, 3) : filteredEventsAll;
    const showFeatured = selectedCategory === 'All' && !searchQuery.trim() && featuredEvents.length > 0;
    if (!showFeatured) return filtered;
    const featuredIds = new Set(featuredEvents.map((e) => e.id));
    return filtered.filter((e) => !featuredIds.has(e.id));
  }, [filteredEventsAll, featuredEvents, selectedCategory, searchQuery, isLoggedIn]);

  const filteredEvents = !isLoggedIn ? filteredEventsAll.slice(0, 3) : filteredEventsAll;

  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
    setCurrentView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegisterClick = () => {
    setCurrentView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openRegisterForEvent = (event: any) => {
    setSelectedEvent(event);
    setCurrentView('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const guardOr = (fn: () => void) => {
    if (!isLoggedIn) {
      window.location.hash = '#signin';
      return;
    }
    fn();
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

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)]);
    }
    setShowRecent(false);
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
    setShowRecent(true);
  };

  const handleSearchBlur = () => {
    setTimeout(() => {
      setSearchFocused(false);
      setShowRecent(false);
    }, 150);
  };

  return (
    <div style={{ ...darkPageShell }}>
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
            className="events-main-section discover-padding"
            style={{
              position: 'relative',
              zIndex: 1,
              padding: '8rem 6rem 4rem 6rem',
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '1400px',
              margin: '0 auto',
            }}
          >
            <motion.h1
              className="events-h1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{
                color: 'var(--text-primary)',
                fontSize: '3.5rem',
                fontWeight: 700,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center',
              }}
            >
              Discover
              <motion.span
                className="events-dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.45, type: 'spring', stiffness: 200, damping: 10 }}
                style={{ color: '#ff4d00', fontSize: '4rem', lineHeight: '0' }}
              >.</motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              style={{
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '1rem',
                marginBottom: '2.5rem',
                maxWidth: '520px',
                marginLeft: 'auto',
                marginRight: 'auto',
                lineHeight: 1.5,
              }}
            >
              Exclusively featured events and campus listings all in one place.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ maxWidth: '560px', width: '100%', margin: '0 auto 2rem auto', position: 'relative' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  background: 'var(--border-subtle)',
                  border: `1px solid ${searchFocused ? '#ff4d00' : 'var(--border-color)'}`,
                  borderRadius: '8px',
                  padding: '0.65rem 1rem',
                  transition: 'border-color 0.2s',
                }}
              >
                <Search size={18} color={searchFocused ? '#ff4d00' : 'var(--text-muted)'} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit(searchQuery)}
                  placeholder="Search events, organizers, venues…"
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'var(--text-primary)',
                    fontSize: '0.9rem',
                    fontFamily: "'Outfit', sans-serif",
                  }}
                />
                {searchQuery && (
                  <button type="button" aria-label="Clear" onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}>
                    <X size={16} color="#666" />
                  </button>
                )}
              </div>
              <AnimatePresence>
                {showRecent && recentSearches.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 10,
                      marginTop: '0.5rem',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    {recentSearches.map((search, index) => (
                      <motion.button
                        type="button"
                        key={search}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 }}
                        onClick={() => handleSearchSubmit(search)}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.65rem 1rem',
                          cursor: 'pointer',
                          border: 'none',
                          borderBottom: index < recentSearches.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          fontSize: '0.88rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        <Clock size={14} color="#666" />
                        {search}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader2 className="spin" size={40} color="#ff4d00" /></div>
            ) : (
              <>
                {selectedCategory === 'All' && !searchQuery && featuredEvents.length > 0 && (
                  <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 }}
                    style={{ marginBottom: '2.5rem' }}
                  >
                    <h2 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={18} color="#ff4d00" />
                      Featured
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '2rem', paddingBottom: '0.5rem' }}>
                      {featuredEvents.map((event, index) => (
                        <DiscoverGridCard
                          key={event.id}
                          event={event}
                          index={index}
                          onViewMore={() => guardOr(() => handleEventClick(event))}
                          onRegister={() => guardOr(() => openRegisterForEvent(event))}
                        />
                      ))}
                    </div>
                  </motion.section>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Filter size={16} color="var(--text-muted)" />
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sort:</span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'date' | 'popularity' | 'name')}
                        style={{
                          background: 'var(--border-subtle)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '0.5rem 1rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      >
                        <option value="popularity">Popularity</option>
                        <option value="date">Date</option>
                        <option value="name">Name</option>
                      </select>
                    </div>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                  </span>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '4px' }}
                >
                  {categories.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <motion.button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                          flexShrink: 0,
                          background: active ? 'rgba(255,77,0,0.2)' : 'var(--border-color)',
                          color: active ? '#ff4d00' : 'var(--text-secondary)',
                          border: `1px solid ${active ? '#ff4d00' : 'var(--border-color)'}`,
                          padding: '0.45rem 1rem',
                          borderRadius: '8px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontSize: '0.82rem',
                          fontFamily: "'Outfit', sans-serif",
                        }}
                      >
                        {cat}
                      </motion.button>
                    );
                  })}
                </motion.div>

                <AnimatePresence mode="popLayout">
                  {filteredEvents.length > 0 ? (
                    gridEvents.length > 0 ? (
                      <motion.div
                        layout
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                          gap: '2rem',
                          paddingBottom: '3rem',
                        }}
                      >
                        {gridEvents.map((event, index) => (
                          <motion.div key={event.id} layout exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}>
                            <DiscoverGridCard
                              event={event}
                              index={index}
                              onViewMore={() => guardOr(() => handleEventClick(event))}
                              onRegister={() => guardOr(() => openRegisterForEvent(event))}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <p style={{ textAlign: 'center', color: '#666', fontSize: '0.9rem', padding: '2rem 1rem 3rem' }}>
                        All matching events are highlighted in Featured above.
                      </p>
                    )
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}
                    >
                      <Search size={40} style={{ margin: '0 auto 1rem', opacity: 0.35, display: 'block' }} />
                      <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-muted)' }}>No events match</p>
                      <p style={{ fontSize: '0.9rem', marginTop: '0.35rem' }}>Try another category or search term.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}

            {!isLoggedIn && (
              <div
                style={{
                  position: 'fixed',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '100vh',
                  background: 'linear-gradient(to top, var(--bg-primary) 40%, rgba(9,9,11,0.72) 72%, transparent 100%)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'all',
                  backdropFilter: 'blur(6px)',
                  paddingTop: '28vh',
                }}
              >
                <div style={{ textAlign: 'center', maxWidth: '450px', padding: '2rem' }}>
                  <h2 style={{ color: 'var(--text-primary)', fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.15 }}>
                    Sign in to explore Discover
                  </h2>
                  <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem', lineHeight: 1.55 }}>
                    Open full details, register for events, and sync with the rest of the app.
                  </p>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { window.location.hash = '#signin'; }}
                    style={{
                      background: '#ff4d00',
                      color: '#ffffff',
                      border: 'none',
                      padding: '1.1rem 2.75rem',
                      borderRadius: '50px',
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      cursor: 'pointer',
                      boxShadow: '0 15px 35px var(--border-subtle)',
                    }}
                  >
                    Login to view more
                  </motion.button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .discover-padding { padding: 6rem 1rem 4rem 1rem !important; }
          .events-h1 { font-size: 2.2rem !important; }
        }
      `}</style>
    </div>
  );
}
