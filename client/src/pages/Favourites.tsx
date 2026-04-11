import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, MoreHorizontal, Loader2, Heart, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useLikedEvents } from '../hooks/useLikedEvents';
import { darkPageShell } from '../theme/darkShell';

export default function Favourites() {
  const { user } = useAuth();
  const { toggleLike, isLiked } = useLikedEvents();
  const [allEvents, setAllEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = async () => {
    try {
      const [eventsRes, approvedRes] = await Promise.all([
        api.get('/events'),
        api.get('/events/approved')
      ]);

      const mappedApproved = approvedRes.data.map((s: any) => ({
        id: s._id,
        title: s.title,
        description: s.description,
        date: s.startDate,
        venue: s.location,
        image: s.imageUrl || '/event1.png',
        organizer: s.organizer?.name || 'Unknown',
        category: 'Workshops',
      }));

      setAllEvents([...mappedApproved, ...eventsRes.data]);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ ...darkPageShell, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#ff4d00' }} />
      </div>
    );
  }

  const favoriteEventsList = allEvents.filter(ev => isLiked(String(ev.id)));

  return (
    <div style={{ ...darkPageShell, minHeight: '100vh' }}>
      <div className="page-padding" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.2, backgroundImage: 'radial-gradient(circle at top right, rgba(239,68,68,0.15) 0%, transparent 40%)' }} />
      
        <button
          onClick={() => { window.location.hash = '#home'; }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            Favourites <Heart fill="#ef4444" color="#ef4444" size={36} />
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Events you've saved to attend.</p>
        </motion.div>

        {favoriteEventsList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card-hover)', borderRadius: 24, border: '1px dashed var(--border-color)' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '1rem' }}>No favourites yet!</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>Browse the discover page and hit the heart icon on events you like.</p>
            <button
              onClick={() => { window.location.hash = '#discover'; }}
              style={{ background: '#ff4d00', color: 'var(--text-primary)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Discover Events
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {favoriteEventsList.map((event, i) => {
              const isOrganizer = user && (event.organizer === user.name || event.organizer === user.id);
              return (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden', padding: '1.5rem', cursor: 'pointer' }}
                  onClick={() => { window.location.hash = '#events'; }} // Ideally open details view, but #events is fine for now
                >
                  <div style={{ width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
                    <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                        onClick={(e) => { e.stopPropagation(); toggleLike(String(event.id)); }} 
                        style={{
                          position: 'absolute', top: '10px', right: '10px', width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                          border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backdropFilter: 'blur(8px)', zIndex: 10
                        }}>
                        <Heart size={14} fill="#ef4444" color="#ef4444" />
                    </button>
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

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!isOrganizer && (
                      <button style={{ background: '#ff4d00', color: 'var(--text-primary)', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', flex: 1 }}>
                        Register
                      </button>
                    )}
                    <button style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-color)', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: isOrganizer ? 1 : undefined }}>
                      <MoreHorizontal size={16} /> {isOrganizer && <span style={{ marginLeft: 4 }}>View Details</span>}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
