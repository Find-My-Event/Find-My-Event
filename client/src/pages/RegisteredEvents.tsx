import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MapPin, QrCode, X, Calendar } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

export default function RegisteredEvents() {
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const { user } = useAuth();

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

  const parseDateInfo = (dateStr: string, ev?: any) => {
    if (!dateStr) {
      return { day: '📅', month: '', shortMonth: 'DATE', weekday: '', fullDate: 'TBA', time: ev?.time || 'TBA', timelineDate: 'TBA', timelineDay: '' };
    }

    // Handle "YYYY-MM-DD • HH:MM" format
    let datePart = dateStr;
    let timePart = ev?.time || '';
    
    if (dateStr.includes('•')) {
      const parts = dateStr.split('•').map(s => s.trim());
      datePart = parts[0];
      timePart = parts[1] || timePart;
    }

    const d = new Date(datePart);
    if (isNaN(d.getTime())) {
      return {
        day: '📅',
        month: '',
        shortMonth: 'DATE',
        weekday: '',
        fullDate: dateStr,
        time: timePart || 'TBA',
        timelineDate: datePart,
        timelineDay: ''
      };
    }

    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'long' });
    const shortMonth = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const weekday = d.toLocaleString('default', { weekday: 'long' });
    
    let time = timePart || d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (time === '12:00 AM') time = 'TBA';

    return {
      day: day.toString(),
      month: month,
      shortMonth: shortMonth,
      weekday: weekday,
      fullDate: `${weekday}, ${day} ${month}`,
      time: time,
      timelineDate: `${day} ${month}`,
      timelineDay: weekday
    };
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#f8f9fc', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#111' }} />
      </div>
    );
  }

  // Filter based on activeTab
  const filteredEvents = registeredEvents.filter(() => {
    if (activeTab === 'past') return false; 
    return true; 
  });

  return (
    <div style={{ 
      backgroundColor: '#f8f9fc', 
      minHeight: '100vh',
      fontFamily: "'Inter', sans-serif",
      color: '#111',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      {/* Top Gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '400px',
        background: 'radial-gradient(ellipse at 50% -50%, rgba(139, 92, 246, 0.25), transparent 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <style>{`
        @media (max-width: 768px) {
          .events-container { padding: 6rem 1rem 3rem 1rem !important; }
          .header-flex { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; margin-bottom: 2.5rem !important; }
          .header-title { font-size: 2.2rem !important; }
          .timeline-wrap { gap: 1.5rem !important; }
          .timeline-line { left: 85px !important; }
          .timeline-item { gap: 1rem !important; }
          .timeline-date { width: 70px !important; }
          .timeline-date > div:first-child { font-size: 0.95rem !important; }
          .timeline-date > div:last-child { font-size: 0.7rem !important; padding: 1px 6px !important; }
          .event-card { padding: 1rem !important; flex-direction: column !important; border-radius: 16px !important; }
        }
      `}</style>

      <div className="events-container" style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '8rem 2rem 4rem 2rem' }}>
        
        {/* Header */}
        <div className="header-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <h1 className="header-title" style={{ fontSize: '2.5rem', fontWeight: 600, margin: 0, letterSpacing: '-0.02em', color: '#111827' }}>
            My Events<span style={{ color: '#ec4899' }}>.</span>
          </h1>

          {/* Toggle */}
          <div style={{ 
            display: 'flex', 
            background: '#ffffff', 
            padding: '4px', 
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
          }}>
            <button
              onClick={() => setActiveTab('upcoming')}
              style={{
                background: activeTab === 'upcoming' ? '#ffffff' : 'transparent',
                boxShadow: activeTab === 'upcoming' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                color: activeTab === 'upcoming' ? '#111' : '#6b7280',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab('past')}
              style={{
                background: activeTab === 'past' ? '#ffffff' : 'transparent',
                boxShadow: activeTab === 'past' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                color: activeTab === 'past' ? '#111' : '#6b7280',
                border: 'none',
                padding: '0.6rem 1.5rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              Past
            </button>
          </div>
        </div>

        {/* Timeline & Events */}
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: '#6b7280' }}>
            <h2>No events found.</h2>
          </div>
        ) : (
          <div className="timeline-wrap" style={{ display: 'flex', gap: '3rem', position: 'relative' }}>
            
            {/* Vertical Timeline Line */}
            <div className="timeline-line" style={{ 
              position: 'absolute', 
              top: '20px', 
              bottom: '50px', 
              left: '125px', 
              width: '2px', 
              background: 'linear-gradient(to bottom, #d1d5db 50%, transparent 100%)',
              borderStyle: 'dashed',
              borderWidth: '0 2px 0 0',
              borderColor: '#d1d5db',
              zIndex: 0
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', width: '100%' }}>
              {filteredEvents.map((ev, i) => {
                const dateInfo = parseDateInfo(ev.date || ev.startDate, ev);
                
                return (
                  <motion.div 
                    key={ev._id || i}
                    className="timeline-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}
                  >
                    {/* Left Timeline Date */}
                    <div className="timeline-date" style={{ width: '100px', textAlign: 'left', paddingTop: '10px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#111827', lineHeight: 1.3 }}>
                        {dateInfo.timelineDate}
                      </div>
                      {dateInfo.timelineDay && (
                        <div style={{ color: '#9ca3af', fontSize: '0.72rem', fontWeight: 500, marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {dateInfo.timelineDay}
                        </div>
                      )}
                      <div style={{ color: '#9ca3af', fontSize: '0.75rem', fontWeight: 400, marginTop: '4px' }}>
                        {dateInfo.time}
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="timeline-dot" style={{ 
                      width: '12px', 
                      height: '12px', 
                      background: '#9ca3af', 
                      borderRadius: '50%', 
                      marginTop: '16px',
                      marginLeft: '-11px',
                      marginRight: '1rem',
                      boxShadow: '0 0 0 6px #f8f9fc',
                      position: 'relative',
                      zIndex: 2
                    }} />

                    {/* Event Card */}
                    <div className="event-card" style={{ 
                      background: '#ffffff', 
                      borderRadius: '20px', 
                      padding: '1.5rem', 
                      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                      display: 'flex',
                      gap: '1.5rem',
                      flex: 1,
                      border: '1px solid #f3f4f6'
                    }}>
                      
                      {/* Card Content (Left) */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#111827' }}>
                          {ev.title || 'Event Title'}
                        </h3>
                        <p style={{ color: '#6b7280', margin: '0 0 1.5rem 0', fontSize: '0.95rem' }}>
                          Organized by <span style={{ fontWeight: 600, color: '#374151' }}>{ev.organizer?.name || ev.organizer || 'Unknown'}</span>
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', alignItems: 'flex-start' }}>
                          {/* Calendar Icon */}
                          <div style={{ 
                            background: '#fdf2f8', 
                            color: '#ec4899', 
                            borderRadius: '50%', 
                            width: '40px', 
                            height: '40px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(236,72,153,0.15)'
                          }}>
                            <Calendar size={20} />
                          </div>

                          <div>
                            <div style={{ fontWeight: 600, color: '#4b5563', fontSize: '1rem' }}>{dateInfo.fullDate}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{dateInfo.time}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                          <div style={{ 
                            background: '#e0e7ff', 
                            color: '#4f46e5', 
                            borderRadius: '50%', 
                            width: '40px', 
                            height: '40px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <MapPin size={20} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#4b5563', fontSize: '1rem' }}>{ev.venue || 'Cafeteria, JECRC University'}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{ev.location || 'Jaipur, Rajasthan'}</div>
                          </div>
                        </div>

                          <button 
                            className="my-ticket-btn"
                            onClick={() => setSelectedTicket(ev)}
                            style={{ 
                            background: '#f3f4f6',
                            color: '#111827',
                            border: 'none',
                            padding: '0.75rem 1.25rem',
                            borderRadius: '10px',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            width: 'fit-content',
                            marginTop: 'auto'
                          }}>
                            {ev.qrToken ? 'My Ticket' : 'Entry Pass'} 
                            {ev.qrToken ? <QrCode size={16} /> : <div style={{width: 8, height: 8, background: '#10b981', borderRadius: '50%'}} />}
                          </button>
                      </div>

                      {/* Card Image (Right) */}
                      <div className="event-card-img" style={{ 
                        width: '260px', 
                        height: '260px', 
                        borderRadius: '16px', 
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        <img 
                          src={ev.image || ev.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop'} 
                          alt={ev.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Ticket Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(8px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem'
            }}
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: '#fff',
                borderRadius: '24px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
              }}
            >
              <button 
                onClick={() => setSelectedTicket(null)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={18} color="#4b5563" />
              </button>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111', margin: '0 0 0.5rem 0' }}>{selectedTicket.qrToken ? 'Digital Ticket' : 'Entry Pass'}</h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>{selectedTicket.title}</p>

              {selectedTicket.qrToken ? (
                <div style={{ 
                  background: '#f8f9fc', 
                  padding: '1.5rem', 
                  borderRadius: '16px', 
                  display: 'inline-block',
                  border: '1px solid #e5e7eb'
                }}>
                  <QRCodeSVG value={selectedTicket.qrToken} size={200} level="H" />
                </div>
              ) : (
                <div style={{
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #3b82f6 100%)',
                  padding: '2rem',
                  borderRadius: '16px',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 10px 25px -5px rgba(139, 92, 246, 0.4)'
                }}>
                  <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Registration Confirmed</h3>
                  <p style={{ fontSize: '0.9rem', opacity: 0.9, margin: 0 }}>Please show this pass & valid ID at the entry desk.</p>
                </div>
              )}

              <div style={{ marginTop: '2rem', textAlign: 'left', borderTop: '1px dashed #e5e7eb', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Attendee</span>
                  <span style={{ fontWeight: 600, color: '#111' }}>{user?.name || 'You'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>{selectedTicket.rollNo ? 'Roll No' : 'Registration ID'}</span>
                  <span style={{ fontWeight: 800, color: '#8B5CF6' }}>{selectedTicket.rollNo || selectedTicket._id?.substring(0, 8).toUpperCase()}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .events-container { padding: 6rem 1.25rem 3rem 1.25rem !important; }
          .header-flex { flex-direction: column !important; align-items: flex-start !important; gap: 1.5rem; margin-bottom: 2.5rem !important; }
          .header-title { font-size: 2.5rem !important; }
          
          /* Remove Timeline for Full Width Cards */
          .timeline-wrap { gap: 1.5rem !important; }
          .timeline-line { display: none !important; }
          .timeline-date { display: none !important; }
          .timeline-dot { display: none !important; }
          .timeline-item { gap: 0 !important; }
          
          /* Card Stacking & Premium Poster Look */
          .event-card { flex-direction: column-reverse !important; padding: 1rem !important; gap: 1.25rem !important; border-radius: 20px !important; }
          .event-card-img { width: 100% !important; height: 360px !important; border-radius: 12px !important; }
          
          /* Full width button */
          .my-ticket-btn { width: 100% !important; justify-content: center !important; margin-top: 0.5rem !important; }
        }
      `}</style>
    </div>
  );
}
