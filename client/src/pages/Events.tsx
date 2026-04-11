import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, MoreHorizontal, Grid, List, Loader2, Heart } from 'lucide-react';
import api from '../api/axios';
import { useLikedEvents } from '../hooks/useLikedEvents';
import { useAuth } from '../contexts/AuthContext';
import '../index.css';

// ─── Shared View Imports ───────────────────────────────────────────────────────────
import { EventDetail, RegisterView } from '../components/SharedViews';

// ─── Timeline View Card ───────────────────────────────────────────────────────
const EventCard = ({ event, index, onViewMore, onRegister }: { event: any, index: number, onViewMore: () => void, onRegister: () => void }) => {
  const { isLiked: checkLiked, toggleLike } = useLikedEvents();
  const { user } = useAuth();
  const liked = checkLiked(String(event.id));
  const isOrganizer = user && (event.organizer === user.name || event.organizer === user.id);

  return (
    <motion.div 
      className="event-card-container"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      whileTap="hover"
      style={{
        display: 'flex',
        flexDirection: 'row',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '1.5rem',
        gap: '2rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        border: '1px solid var(--border-subtle)',
        width: '100%',
        maxWidth: '900px',
        alignItems: 'center',
        margin: '0 auto',
        cursor: 'pointer'
      }}
      variants={{
        hover: {
          y: -8,
          scale: 1.02,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          borderColor: 'rgba(255,255,255,0.15)',
          transition: { duration: 0.3, ease: 'easeOut' }
        }
      }}
      onClick={onViewMore}
    >
      <div className="event-card-image-box" style={{ width: '240px', height: '180px', flexShrink: 0, borderRadius: '12px', overflow: 'hidden', position: 'relative' }}>
        <motion.img 
          src={event.image} 
          alt={event.title} 
          variants={{
            hover: { scale: 1.08, transition: { duration: 0.4, ease: 'easeOut' } }
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <motion.button 
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleLike(String(event.id)); }} 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(8px)', zIndex: 10
            }}>
            <Heart size={16} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : 'var(--text-primary)'} />
        </motion.button>
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <h3 className="event-card-title" style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{event.title}</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Organized by {event.organizer}</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <Calendar size={18} color="#aaa" style={{ marginTop: '0.1rem' }} />
            <div>
              <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Date & Time</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>{event.date}</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <MapPin size={18} color="#aaa" style={{ marginTop: '0.1rem' }} />
            <div>
              <p style={{ fontSize: '0.75rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Venue</p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>{event.venue}</p>
            </div>
          </div>
        </div>

        <div className="event-actions-container" style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          {!isOrganizer && (
            <motion.button 
              onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRegister(); }}
              whileHover={{ scale: 1.05, backgroundColor: '#eee' }}
              whileTap={{ scale: 0.95 }}
              style={{
                background: '#ff4d00',
                color: '#ffffff',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.95rem',
                flex: 1
              }}
            >
              Register Now
            </motion.button>
          )}
          
          <motion.button 
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onViewMore(); }}
            whileHover={{ scale: 1.05, backgroundColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'transparent',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              flex: 1
            }}
          >
            < MoreHorizontal size={18} /> View More
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Grid View Card ───────────────────────────────────────────────────────────
const GridEventCard = ({ event, index, onViewMore, onRegister }: { event: any, index: number, onViewMore: () => void, onRegister: () => void }) => {
  const { isLiked: checkLiked, toggleLike } = useLikedEvents();
  const { user } = useAuth();
  const liked = checkLiked(String(event.id));
  const isOrganizer = user && (event.organizer === user.name || event.organizer === user.id);

  return (
    <motion.div 
      className="event-card-container"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      whileTap="hover"
      style={{
        background: 'var(--bg-card)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        maxWidth: '100%'
      }}
      variants={{
        hover: {
          y: -8,
          scale: 1.02,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
          borderColor: 'rgba(255,255,255,0.15)',
          transition: { duration: 0.3, ease: 'easeOut' }
        }
      }}
      onClick={onViewMore}
    >
      <div style={{ width: '100%', height: '180px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
        <motion.img 
          src={event.image} 
          alt={event.title} 
          variants={{
            hover: { scale: 1.08, transition: { duration: 0.4, ease: 'easeOut' } }
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <motion.button 
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggleLike(String(event.id)); }} 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(8px)', zIndex: 10
            }}>
            <Heart size={14} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : 'var(--text-primary)'} />
        </motion.button>
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

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        {!isOrganizer && (
          <motion.button 
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRegister(); }}
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
              flex: 1
            }}
          >
            Register
          </motion.button>
        )}
        
        <motion.button 
          onClick={(e: React.MouseEvent) => { e.stopPropagation(); onViewMore(); }}
          whileHover={{ scale: 1.05, backgroundColor: 'var(--border-subtle)' }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'transparent',
            color: 'var(--text-muted)',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '0.6rem 1rem',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: isOrganizer ? 1 : undefined
          }}
        >
          <MoreHorizontal size={16} /> {isOrganizer && <span style={{ marginLeft: '4px' }}>View More</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

// ─── Main Events Component ───────────────────────────────────────────────────────
export default function Events({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'list' | 'details' | 'register'>('list');
  const [eventList, setEventList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid'>('timeline');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const categories = ['all', 'Tech', 'Music', 'Gaming', 'Dance', 'Culture', 'Academics', 'Workshops'];

  useEffect(() => {
    fetchEvents();
  }, []);


  const fetchEvents = async () => {
    setLoading(true);
    try {
      const [eventsRes, approvedRes] = await Promise.all([
        api.get('/events'),
        api.get('/events/approved')
      ]);

      const mappedApproved = approvedRes.data.map((s: any) => ({
        _id: s._id,
        id: s._id,
        title: s.title,
        description: s.description,
        date: s.startDate,
        venue: s.location,
        image: s.imageUrl || '/event1.png',
        organizer: s.organizer?.name || 'Unknown',
        organizerId: s.organizer?._id || s.organizer,
        category: 'Workshops',
      }));

      const combined = [...mappedApproved, ...eventsRes.data];
      setEventList(combined);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: any) => {
    if (!isLoggedIn) {
       window.location.hash = '#signin';
       return;
    }
    setSelectedEvent(event);
    setCurrentView('register');
    window.scrollTo(0, 0);
  };

  const handleViewMore = (event: any) => {
    setSelectedEvent(event);
    setCurrentView('details');
    window.scrollTo(0, 0);
  };

  const handleBack = () => {
    setCurrentView('list');
    setSelectedEvent(null);
  };

  const filteredEventsAll = eventList.filter(event => {
    const matchCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchCategory;
  }).sort((a, b) => {
    if (!user) return 0;
    const aIsMine = a.organizer === user.name || String(a.organizerId || a.organizer) === String(user.id || user._id);
    const bIsMine = b.organizer === user.name || String(b.organizerId || b.organizer) === String(user.id || user._id);
    
    if (aIsMine && !bIsMine) return -1;
    if (!aIsMine && bIsMine) return 1;
    return 0;
  });

  const filteredEvents = !isLoggedIn ? filteredEventsAll.slice(0, 3) : filteredEventsAll;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      backgroundImage: `
        radial-gradient(circle at top right, rgba(255, 77, 0, 0.1) 0%, transparent 40%),
        radial-gradient(circle at 20% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 50%)
      `,
      fontFamily: "'Outfit', sans-serif",
      overflowX: 'hidden'
    }}>
      <AnimatePresence mode="popLayout">
        {currentView === 'list' && (
          <motion.main 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="events-main-section" 
            style={{ padding: '8rem 2rem 4rem 2rem', display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto' }}
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
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'center'
              }}
            >
              Events<motion.span 
                className="events-dot"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 10 }}
                style={{ color: '#ff4d00', fontSize: '4rem', lineHeight: '0' }}
              >.</motion.span>
            </motion.h1>

            <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '4px' }}
                >
                  {categories.map((cat) => {
                    const active = filterCategory === cat;
                    return (
                      <motion.button
                        key={cat}
                        type="button"
                        onClick={() => setFilterCategory(cat)}
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
                          textTransform: 'capitalize'
                        }}
                      >
                        {cat}
                      </motion.button>
                    );
                  })}
                </motion.div>

            {/* Filters */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <motion.button
                  onClick={() => setViewMode('timeline')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: viewMode === 'timeline' ? 'rgba(255,77,0,0.2)' : 'var(--border-color)',
                    border: `1px solid ${viewMode === 'timeline' ? '#ff4d00' : 'var(--border-color)'}`,
                    borderRadius: '8px', padding: '0.5rem 1rem', color: viewMode === 'timeline' ? '#ff4d00' : 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600
                  }}
                >
                  <List size={16} />
                  Timeline
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('grid')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: viewMode === 'grid' ? 'rgba(255,77,0,0.2)' : 'var(--border-color)',
                    border: `1px solid ${viewMode === 'grid' ? '#ff4d00' : 'var(--border-color)'}`,
                    borderRadius: '8px', padding: '0.5rem 1rem', color: viewMode === 'grid' ? '#ff4d00' : 'var(--text-secondary)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600
                  }}
                >
                  <Grid size={16} />
                  Grid
                </motion.button>
              </div>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}><Loader2 className="spin" size={40} color="#ff4d00" /></div>
            ) : filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.5 }}>No events found. Check back later!</div>
            ) : (
              <>
                {viewMode === 'timeline' ? (
                  <div style={{ display: 'flex', gap: '4rem', width: '100%' }}>
                    {/* Left Timeline Section */}
                    <div className="mobile-hidden" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100px' }}>
                      <div style={{
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        padding: '0.5rem 1.25rem',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        marginBottom: '2rem',
                        zIndex: 2
                      }}>
                        Today
                      </div>
                      
                      <div style={{ position: 'relative', width: '2px', background: 'var(--border-color)', flex: 1 }}>
                         {filteredEvents.map((_, index) => (
                           <div key={index} style={{
                             position: 'absolute',
                             top: `calc(${index * 280}px + 60px)`,
                             left: '50%',
                             transform: 'translateX(-50%)',
                             width: '12px',
                             height: '12px',
                             background: '#ff4d00',
                             borderRadius: '50%',
                             boxShadow: '0 0 0 4px #0a0a0c'
                           }}></div>
                         ))}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 1, paddingBottom: '4rem' }}>
                      {filteredEvents.map((event, index) => (
                        <EventCard 
                          key={event.id} 
                          event={event} 
                          index={index} 
                          onViewMore={() => handleViewMore(event)}
                          onRegister={() => handleRegister(event)} 
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: '2rem', paddingBottom: '4rem' }}
                  >
                    {filteredEvents.map((event, index) => (
                      <GridEventCard 
                        key={event.id} 
                        event={event} 
                        index={index} 
                        onViewMore={() => handleViewMore(event)}
                        onRegister={() => handleRegister(event)} 
                      />
                    ))}
                  </motion.div>
                )}

                {/* Login Wall UI */}
                {!isLoggedIn && (
                  <div style={{ 
                    marginTop: '5rem', 
                    textAlign: 'center', 
                    padding: '4rem 2rem',
                    background: 'rgba(255, 77, 0, 0.05)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255, 77, 0, 0.1)',
                    backdropFilter: 'blur(8px)',
                    width: '100%',
                    maxWidth: '900px',
                    margin: '5rem auto 0 auto'
                  }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                       <Calendar size={32} color="#ff4d00" style={{ margin: '0 auto 1rem' }} />
                       <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>Want to explore more events?</h3>
                       <p style={{ color: '#64748b', marginTop: '0.5rem' }}>Login to see the full schedule and secure your tickets.</p>
                    </div>
                    <button 
                      onClick={() => window.location.hash = '#signin'}
                      style={{ 
                        background: '#ff4d00', 
                        color: 'var(--text-primary)', 
                        border: 'none', 
                        padding: '1rem 2.5rem', 
                        borderRadius: '12px', 
                        fontWeight: 700, 
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        boxShadow: '0 4px 20px rgba(255, 77, 0, 0.4)'
                      }}
                    >
                      Login to Continue
                    </button>
                  </div>
                )}
              </>
            )}
          </motion.main>
        )}

        {currentView === 'details' && selectedEvent && (
          <EventDetail event={selectedEvent} onBack={handleBack} onRegister={() => handleRegister(selectedEvent)} />
        )}

        {currentView === 'register' && selectedEvent && (
          <RegisterView event={selectedEvent} onBack={handleBack} />
        )}
      </AnimatePresence>

      {!isLoggedIn && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '40vh', background: 'linear-gradient(to top, var(--bg-primary) 40%, transparent 100%)', zIndex: 10, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '4rem', pointerEvents: 'none' }}>
           <div style={{ textAlign: 'center', background: 'var(--bg-card-hover)', padding: '2rem', borderRadius: '24px', backdropFilter: 'blur(12px)', border: '1px solid var(--border-subtle)', pointerEvents: 'all', maxWidth: '400px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Want to see more?</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Sign in to view all details and register for events.</p>
              <button onClick={() => window.location.hash = '#signin'} style={{ background: '#ff4d00', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', width: '100%' }}>Login to Continue</button>
           </div>
        </div>
      )}
      <style>{`
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .events-main-section { padding: 6rem 1rem 4rem 1rem !important; }
          .events-h1 { font-size: 2.2rem !important; }
          .event-card-container { flex-direction: column !important; }
          .event-card-image-box { width: 100% !important; height: 160px !important; }
          .event-card-title { font-size: 1.2rem !important; }
          .event-actions-container { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
