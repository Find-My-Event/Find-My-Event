import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { darkPageShell } from '../theme/darkShell';
import { fallbackClubs } from '../data/clubs';
import type { Club } from '../data/clubs';

interface ClubDetailProps {
  hash: string;
}

export default function ClubDetail({ hash }: ClubDetailProps) {
  const [club, setClub] = useState<Club | null>(null);
  const [clubLoading, setClubLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Extract ID from hash (e.g. #club-detail?id=student-council-ju)
  const clubId = useMemo(() => {
    const params = new URLSearchParams(hash.split('?')[1] || '');
    return params.get('id') || '';
  }, [hash]);

  // Fetch Club details
  useEffect(() => {
    if (!clubId) return;

    let active = true;
    setClubLoading(true);
    api.get(`/clubs/${clubId}`)
      .then((res) => {
        if (active && res.data) {
          setClub(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch club details from API, using fallback:', err);
        if (active) {
          const found = fallbackClubs.find((c) => c.id === clubId);
          setClub(found || null);
        }
      })
      .finally(() => {
        if (active) setClubLoading(false);
      });

    return () => {
      active = false;
    };
  }, [clubId]);

  // Fetch Approved Events
  useEffect(() => {
    let active = true;
    setEventsLoading(true);
    api.get('/events/approved')
      .then((res) => {
        if (active && Array.isArray(res.data)) {
          setEvents(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch events for club detail:', err);
      })
      .finally(() => {
        if (active) setEventsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Filter events matching the club organizer
  const clubEvents = useMemo(() => {
    if (!club) return [];
    return events.filter((e: any) => {
      const organizerName = e.organizer?.name || e.organizer || '';
      return organizerName.toLowerCase().includes(club.name.toLowerCase()) || 
             club.name.toLowerCase().includes(organizerName.toLowerCase());
    });
  }, [events, club]);

  if (clubLoading) {
    return (
      <div style={{ ...darkPageShell, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader2 className="spin" size={40} color="#ff4d00" />
        <style>{`
          .spin { animation: spin-anim 1s linear infinite; }
          @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  if (!club) {
    return (
      <div style={{ ...darkPageShell, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '1rem' }}>
        <h2 style={{ color: 'var(--text-primary)' }}>Club/Initiative Not Found</h2>
        <button
          onClick={() => { window.location.hash = '#clubs'; }}
          style={{
            background: '#ff4d00',
            color: '#fff',
            border: 'none',
            padding: '0.8rem 1.5rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Back to Clubs
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...darkPageShell }}>
      <div className="dot-grid" style={{ opacity: 0.08 }}></div>
      <div
        className="discover-padding"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '8rem 6rem 4rem 6rem',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: '100vh',
        }}
      >
        {/* Back navigation */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => {
            // Check history or go back to clubs list
            if (window.history.length > 1) {
              window.history.back();
            } else {
              window.location.hash = '#clubs';
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff4d00',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '3rem',
            padding: 0,
          }}
        >
          <ArrowLeft size={18} /> Back
        </motion.button>

        {/* Club Details Header */}
        <div className="club-detail-header-grid" style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '3rem', marginBottom: '4rem', alignItems: 'start' }}>
          {/* Logo container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{
              width: '150px',
              height: '150px',
              borderRadius: '24px',
              overflow: 'hidden',
              border: '2px solid var(--border-color)',
              background: '#fff',
              boxShadow: '0 15px 40px rgba(0,0,0,0.4)',
            }}
          >
            <img src={club.logo} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </motion.div>

          {/* Details column */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Title & Tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                {club.name}
              </h1>
              <span
                style={{
                  fontSize: '0.75rem',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  background: club.type === 'Club' ? 'rgba(59,130,246,0.15)' : club.type === 'Initiative' ? 'rgba(249,115,22,0.15)' : 'rgba(16,185,129,0.15)',
                  color: club.type === 'Club' ? '#3b82f6' : club.type === 'Initiative' ? '#f97316' : '#10b981',
                }}
              >
                {club.type}
              </span>
            </div>

            {/* About Us */}
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ff4d00', marginBottom: '0.75rem', marginTop: '1.5rem' }}>
              About Us
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.7, opacity: 0.9 }}>
              {club.aboutUs}
            </p>

            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
              {club.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: 'var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    padding: '4px 10px',
                    borderRadius: '8px',
                  }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Glimpses Gallery */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '4.5rem' }}
        >
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ImageIcon size={22} color="#ff4d00" />
            Glimpses
          </h2>
          <div
            className="glimpses-scroll"
            style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              paddingBottom: '1.5rem',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {club.glimpses.map((glimpseUrl, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03 }}
                style={{
                  minWidth: '320px',
                  width: '320px',
                  height: '200px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  scrollSnapAlign: 'start',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  background: 'var(--bg-card-hover)',
                  cursor: 'pointer',
                }}
              >
                <img src={glimpseUrl} alt={`Glimpse ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Club Events */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: '3rem' }}
        >
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={22} color="#ff4d00" />
            Upcoming Events & Activities
          </h2>

          {eventsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <Loader2 className="spin" size={30} color="#ff4d00" />
            </div>
          ) : clubEvents.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 350px), 1fr))', gap: '2rem' }}>
              {clubEvents.map((event, idx) => (
                <motion.div
                  key={event._id || event.id || idx}
                  whileHover={{ y: -5 }}
                  onClick={() => { window.location.hash = '#discover'; }} // Navigate to discover details
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    background: 'var(--bg-card-hover)',
                    padding: '1.25rem',
                    borderRadius: '20px',
                    border: '1px solid var(--border-subtle)',
                    alignItems: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={event.image || event.imageUrl || '/event1.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '0.4rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {event.title}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', opacity: 0.5, fontSize: '0.82rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={13} /> {event.date || event.startDate}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={13} /> {event.venue || event.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-card-hover)', borderRadius: '20px', border: '1px dashed var(--border-color)' }}>
              <Calendar size={40} color="#666" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.25rem' }}>No upcoming events scheduled</p>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>Check back later or explore other initiatives.</p>
            </div>
          )}
        </motion.section>
      </div>

      <style>{`
        /* Hide scrollbars for glimpses container */
        .glimpses-scroll::-webkit-scrollbar {
          height: 6px;
        }
        .glimpses-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .glimpses-scroll::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 10px;
        }
        .glimpses-scroll::-webkit-scrollbar-thumb:hover {
          background: #ff4d00;
        }
        
        @media (max-width: 768px) {
          .discover-padding { padding: 6rem 1rem 4rem 1rem !important; }
          .club-detail-header-grid {
            grid-template-columns: 1fr !important;
            justify-items: center;
            text-align: center;
            gap: 1.5rem !important;
          }
          .club-detail-header-grid h1 {
            font-size: 2.2rem !important;
          }
          .club-detail-header-grid div {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
