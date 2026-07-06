import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Loader2, Mail, User, Image as ImageIcon } from 'lucide-react';
import { api } from '../lib/api';
import { fallbackClubs } from '../data/clubs';
import type { Club } from '../data/clubs';
import Footer from '../components/Footer';

interface ClubDetailProps {
  hash: string;
}

export default function ClubDetail({ hash }: ClubDetailProps) {
  const [club, setClub] = useState<Club | null>(null);
  const [clubLoading, setClubLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  // Extract ID from hash
  const clubId = useMemo(() => {
    const params = new URLSearchParams(hash.split('?')[1] || '');
    return params.get('id') || hash.replace('#club-detail-', '').split('?')[0] || '';
  }, [hash]);

  // Fetch Club details
  useEffect(() => {
    window.scrollTo(0, 0);
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

  // Fetch Club Events
  useEffect(() => {
    let active = true;
    if (!clubId) return;
    setEventsLoading(true);
    api.get(`/events/club/${clubId}`)
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
  }, [clubId]);

  const clubEvents = events;

  if (clubLoading) {
    return (
      <div style={{ backgroundColor: '#FAFAFA', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Loader2 className="spin" size={40} color="#ff4d00" />
        <style>{`.spin { animation: spin-anim 1s linear infinite; } @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!club) {
    return (
      <div style={{ backgroundColor: '#FAFAFA', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', gap: '1rem' }}>
        <h2 style={{ color: '#0f172a' }}>Club Not Found</h2>
        <button
          onClick={() => { window.location.hash = '#clubs'; }}
          style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', cursor: 'pointer', fontWeight: 700 }}
        >
          Back to Clubs
        </button>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: '#111', position: 'relative' }}>
      
      {/* Background Gradient */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0,
        right: 0, 
        height: '600px', 
        background: 'linear-gradient(to bottom, rgba(239, 230, 255, 0.7) 0%, #FAFAFA 100%)', 
        zIndex: 0, 
        pointerEvents: 'none'
      }} />

      <main className="club-detail-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '7rem 2rem 6rem', position: 'relative', zIndex: 1 }}>
        <div className="club-detail-grid">
          
          <style>{`
            .club-detail-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 3rem;
            }
            @media (min-width: 1024px) {
              .club-detail-grid {
                grid-template-columns: 360px 1fr;
              }
            }
            .gallery-masonry {
              column-count: 2;
              column-gap: 1rem;
            }
            @media (min-width: 768px) {
              .gallery-masonry {
                column-count: 3;
              }
            }
            .gallery-masonry img {
              width: 100%;
              border-radius: 16px;
              margin-bottom: 1rem;
              display: block;
              object-fit: cover;
            }
            
            @media (max-width: 768px) {
              .club-detail-main { padding: 5rem 1.25rem 3rem !important; }
              .club-detail-grid { gap: 1.5rem !important; }
              .club-logo-container { margin-left: 0 !important; border-radius: 12px !important; }
              .club-title { font-size: 2rem !important; }
              .gallery-masonry { column-gap: 0.75rem !important; }
              .gallery-masonry img { margin-bottom: 0.75rem !important; border-radius: 10px !important; }
            }
          `}</style>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Club Poster / Logo */}
            <motion.div 
              className="club-logo-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ borderRadius: '16px', overflow: 'hidden', width: '100%', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', display: 'flex', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              <img src={club.logo} alt={club.name} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
            </motion.div>

            {/* Social Icons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginTop: '1.25rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#d946ef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              <Mail color="#a855f7" size={24} style={{ cursor: 'pointer' }} />
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ display: 'inline-block', background: '#f3e8ff', color: '#9333ea', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem', width: 'fit-content' }}>
              {club.tags?.[0] || club.type || 'Entrepreneurship'}
            </span>
            <h1 className="club-title" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              {club.name}
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500, marginBottom: '2rem' }}>
              {club.description || 'Not Listed'}
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: '#fff', border: '1px solid #ec4899', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <div style={{ background: '#ec4899', width: '100%', textAlign: 'center', color: '#fff', fontSize: '0.5rem', fontWeight: 800, padding: '0.1rem 0' }}>Est.</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#111', lineHeight: 1.2, marginTop: '2px' }}>Yr</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>
                    {club.foundedOn ? new Date(club.foundedOn).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Not Listed'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Founded On</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: '#e0f2fe', color: '#3b82f6', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{club.venue || 'Not Listed'}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Venue</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ background: '#f3e8ff', color: '#9333ea', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800 }}>{club.eventsConducted || '0'}</span>
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{club.eventsConducted || '0'} Events Conducted</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Total Events</div>
                </div>
              </div>
            </div>

            {/* About */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>About</h2>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                {club.detailedDescription || club.aboutUs || 'Not Listed'}
              </p>
            </div>

            {/* Leadership & Team */}
            <div style={{ marginBottom: '3rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>Leadership & Team</h2>
              {!club.leadership || club.leadership.length === 0 ? (
                <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>Not Listed</div>
              ) : (
                <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                  {club.leadership.map((leader: any, i: number) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', minWidth: '120px' }}>
                      <div style={{ width: '120px', height: '150px', borderRadius: '16px', background: '#f1f5f9', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
                        {leader.photoUrl ? (
                          <img src={leader.photoUrl} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', color: '#94a3b8' }}>
                            <User size={48} />
                          </div>
                        )}
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{leader.name || 'Not Listed'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{leader.position || 'Not Listed'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Gallery Section */}
        <div style={{ marginBottom: '4rem', marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>Club Highlights</h2>
          {club.glimpses && club.glimpses.length > 0 ? (
            <div className="gallery-masonry">
              {club.glimpses.map((img, idx) => (
                <img key={idx} src={img} alt={`Highlight ${idx}`} />
              ))}
            </div>
          ) : (
            <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
              <ImageIcon size={40} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
              <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: 600 }}>No highlights added yet</p>
            </div>
          )}
        </div>

        {/* Events Section */}
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1.5rem', color: '#0f172a' }}>Past / Upcoming Events</h2>
          
          {eventsLoading ? (
             <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
               <Loader2 className="spin" size={30} color="#0f172a" />
             </div>
          ) : clubEvents.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              {clubEvents.map((event, idx) => (
                <div 
                  key={idx} 
                  onClick={() => window.location.hash = `#event-detail-${event._id || event.id}`}
                  style={{ background: '#111', borderRadius: '16px', overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column', border: '1px solid #e2e8f0', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', cursor: 'pointer' }}
                >
                  <div style={{ height: '280px', width: '100%', background: '#000', position: 'relative' }}>
                    <img src={event.image || event.imageUrl || '/event1.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '1rem', background: '#f8fafc', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <Calendar size={12} /> {event.date || event.startDate || 'TBA'}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {event.title}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem', flexGrow: 1 }}>
                      <MapPin size={12} /> {event.venue || event.location || 'TBA'}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.7rem', fontWeight: 600 }}>
                      <span style={{ color: '#475569' }}>{event.capacity || event.seats || '69'} Seats left</span>
                      <span style={{ color: '#cbd5e1' }}>|</span>
                      <span style={{ color: '#ef4444' }}>{event.pricing?.isPaid ? `₹${event.pricing.ticketPrice}` : (event.price || 'Free')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div style={{ padding: '3rem 2rem', textAlign: 'center', background: '#fff', borderRadius: '20px', border: '1px dashed #cbd5e1' }}>
               <Calendar size={40} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
               <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '0.25rem', fontWeight: 600 }}>No upcoming events scheduled</p>
             </div>
          )}
        </div>

      </main>
      
      <Footer />
    </div>
  );
}
