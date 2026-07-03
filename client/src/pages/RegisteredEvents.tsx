import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, MapPin, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../lib/api';

export default function RegisteredEvents() {
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);

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
    const d = new Date(dateStr);
    if (!dateStr || isNaN(d.getTime())) {
      // Fallback if date is just a random string
      return {
        day: '📅',
        month: '',
        shortMonth: 'DATE',
        weekday: '',
        fullDate: dateStr || 'TBA',
        time: ev?.time || 'TBA',
        timelineDate: dateStr || 'TBA',
        timelineDay: ''
      };
    }
    const day = d.getDate();
    const month = d.toLocaleString('default', { month: 'long' });
    const shortMonth = d.toLocaleString('default', { month: 'short' }).toUpperCase();
    const weekday = d.toLocaleString('default', { weekday: 'long' });
    
    let time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (time === '12:00 AM') time = '3:30 PM - 4:30 PM'; // Assume default if no time set

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

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '8rem 2rem 4rem 2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em', color: '#111827' }}>
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
          <div style={{ display: 'flex', gap: '3rem', position: 'relative' }}>
            
            {/* Vertical Timeline Line */}
            <div style={{ 
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
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}
                  >
                    {/* Left Timeline Date */}
                    <div style={{ width: '100px', textAlign: 'left', paddingTop: '10px' }}>
                      <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#111827' }}>{dateInfo.timelineDate}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: 500 }}>{dateInfo.timelineDay}</div>
                    </div>

                    {/* Dot */}
                    <div style={{ 
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
                    <div style={{ 
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
                          {/* Calendar Box */}
                          <div style={{ 
                            background: '#ffffff',
                            border: '1px solid #f3f4f6',
                            borderRadius: '12px',
                            padding: '0.4rem',
                            textAlign: 'center',
                            minWidth: '60px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                          }}>
                            <div style={{ background: '#ec4899', color: '#fff', fontSize: '0.7rem', fontWeight: 700, borderRadius: '6px', padding: '2px 0' }}>
                              {dateInfo.shortMonth}
                            </div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827', marginTop: '2px' }}>
                              {dateInfo.day}
                            </div>
                          </div>

                          <div style={{ paddingTop: '0.2rem' }}>
                            <div style={{ fontWeight: 600, color: '#4b5563', fontSize: '1rem' }}>{dateInfo.fullDate}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{dateInfo.time}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '2rem' }}>
                          <div style={{ 
                            background: '#e0e7ff', 
                            color: '#4f46e5', 
                            borderRadius: '50%', 
                            width: '36px', 
                            height: '36px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            <MapPin size={18} />
                          </div>
                          <div style={{ paddingTop: '0.2rem' }}>
                            <div style={{ fontWeight: 600, color: '#4b5563', fontSize: '1rem' }}>{ev.venue || 'Cafeteria, JECRC University'}</div>
                            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{ev.location || 'Jaipur, Rajasthan'}</div>
                          </div>
                        </div>

                          <button 
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
                            My Ticket <QrCode size={16} />
                          </button>
                      </div>

                      {/* Card Image (Right) */}
                      <div style={{ 
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

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111', margin: '0 0 0.5rem 0' }}>Digital Ticket</h2>
              <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '2rem' }}>{selectedTicket.title}</p>

              <div style={{ 
                background: '#f8f9fc', 
                padding: '1.5rem', 
                borderRadius: '16px', 
                display: 'inline-block',
                border: '1px solid #e5e7eb'
              }}>
                {selectedTicket.qrToken ? (
                  <QRCodeSVG value={selectedTicket.qrToken} size={200} level="H" />
                ) : (
                  <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                    Generating...
                  </div>
                )}
              </div>

              <div style={{ marginTop: '2rem', textAlign: 'left', borderTop: '1px dashed #e5e7eb', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Attendee</span>
                  <span style={{ fontWeight: 600, color: '#111' }}>You</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>Ticket ID</span>
                  <span style={{ fontWeight: 600, color: '#111' }}>#{selectedTicket._id?.substring(0, 8).toUpperCase()}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
