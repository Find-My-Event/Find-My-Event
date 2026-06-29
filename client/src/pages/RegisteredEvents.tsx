import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Ticket } from 'lucide-react';
import { api } from '../lib/api';
import { darkPageShell } from '../theme/darkShell';

export default function RegisteredEvents() {
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      const res = await api.get('/events/registered');
      setRegisteredEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch registered events:', err);
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

  return (
    <div style={{ ...darkPageShell, minHeight: '100vh' }}>
      <div className="page-padding" style={{ position: 'relative', zIndex: 1, maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.2, backgroundImage: 'radial-gradient(circle at top right, rgba(236,72,153,0.15) 0%, transparent 40%)' }} />
      
        <button
          onClick={() => { window.location.hash = '#home'; }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '3rem' }}>
          <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '0.5rem' }}>Registered Events</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>See all the events you have registered for.</p>
        </motion.div>

        {registeredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-card-hover)', borderRadius: 24, border: '1px dashed var(--border-color)' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', marginBottom: '1rem' }}>You haven't registered for any events yet.</h3>
            <button
              onClick={() => { window.location.hash = '#events'; }}
              style={{ background: '#ff4d00', color: 'var(--text-primary)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Discover Events
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {registeredEvents.map((ev, i) => (
              <motion.div 
                key={ev._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                style={{ background: 'var(--bg-card)', borderRadius: 16, border: '1px solid var(--border-subtle)', overflow: 'hidden', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '1.25rem', fontWeight: 600, margin: 0, paddingRight: '1rem', lineHeight: 1.3 }}>{ev.title}</h3>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.5 }}>
                  {ev.date && <span>{ev.date}<br/></span>}
                  {ev.venue}
                </p>
                <button
                  onClick={() => { window.location.hash = '#events' }}
                  style={{ marginTop: 'auto', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.3)', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}
                >
                  <Ticket size={16} /> Registered
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
