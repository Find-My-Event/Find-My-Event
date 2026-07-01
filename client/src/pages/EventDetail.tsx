import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Edit, Loader2 } from 'lucide-react';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';
import { RegisterView } from '../components/SharedViews';

const EventDetail = ({ hash }: { hash?: string }) => {
  const { user, isLoggedIn } = useAuth();
  const isAdminOrOrganizer = isLoggedIn && ((user?.role as any) === 'admin' || (user?.role as any) === 'organizer' || (user?.role as any) === 'club_admin');
  const eventId = hash?.replace('#event-detail-', '') || '1';
  
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [rawEvent, setRawEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchEvent = async () => {
      try {
        if (eventId.startsWith('c') || eventId.length < 10) {
          // Dummy fallback for hero images or old hardcoded links
          const dummyEvent = {
            id: eventId,
            title: 'Discover events worth showing up for.',
            img: eventId.startsWith('c') ? `/hero-images/Rectangle 3${eventId.replace('c', '')}.png` : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
            date: 'TBA',
            venue: 'TBA',
            category: 'Featured',
            description: 'This is a featured event highlight.',
            organizer: 'Find My Event',
            price: 'Free',
            seats: 'Limited',
            isRegistered: false
          };
          setCurrentEvent(dummyEvent);
          setRawEvent(dummyEvent);
          setLoading(false);
          return;
        }

        const res = await api.get(`/events/${eventId}`);
        const data = res.data;
        setRawEvent(data);
        setCurrentEvent({
          id: data._id,
          title: data.title,
          img: data.image || data.imageUrl || '/event1.png',
          date: data.date || data.startDate || 'TBA',
          venue: data.venue || data.location || 'TBA',
          category: data.category || 'Event',
          description: data.description || 'No description available',
          organizer: data.organizer?.name || data.organizer || 'Host',
          price: data.pricing?.isPaid ? `₹${data.pricing.ticketPrice}` : (data.price || 'Free'),
          seats: data.pricing?.ticketCapacity || data.capacity || data.seats || 'Limited',
          isRegistered: data.isRegistered
        });
      } catch (err) {
        console.error('Error fetching event details', err);
        setCurrentEvent(null);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <Loader2 className="spin" size={40} color="#ff4d00" />
        <style>{`.spin { animation: spin-anim 1s linear infinite; } @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!currentEvent) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        <h2>Event not found</h2>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FAFAFA', minHeight: '100vh', fontFamily: "'Inter', 'SF Pro Display', sans-serif", color: '#111', position: 'relative' }}>
      
      {/* Background Gradient */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0,
        right: 0, 
        height: '600px', 
        background: 'linear-gradient(to bottom, #EFE6FF 0%, #FAFAFA 100%)', 
        zIndex: 0, 
        pointerEvents: 'none',
        opacity: 0.7
      }} />

      {showRegister ? (
        <div style={{ position: 'relative', zIndex: 1 }}>
          <RegisterView event={rawEvent} onBack={() => setShowRegister(false)} />
        </div>
      ) : (
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem 6rem', position: 'relative', zIndex: 1 }}>
        <div className="event-detail-grid">
          
          <style>{`
            .event-detail-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 3rem;
            }
            @media (min-width: 1024px) {
              .event-detail-grid {
                grid-template-columns: 360px 1fr;
              }
            }
            .prize-card {
              background: linear-gradient(180deg, #fff 0%, #e2e8f0 100%);
              border: 1px solid #cbd5e1;
            }
            .prize-card.gold { background: linear-gradient(180deg, #fff 0%, #fef08a 100%); border-color: #fde047; }
            .prize-card.bronze { background: linear-gradient(180deg, #fff 0%, #fed7aa 100%); border-color: #fdba74; }
          `}</style>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Event Poster */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: '#111', borderRadius: '16px', overflow: 'hidden', height: '420px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
            >
              <img src={currentEvent.img} alt={currentEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>

            {/* Organized by Card */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Organized by</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${currentEvent.organizer}`} alt="Organizer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#111' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{currentEvent.organizer}</h4>
              </div>
            </div>

            {/* Eligibility Card */}
            <div style={{ background: '#fff', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>Event Details</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0, margin: 0 }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.4rem', borderRadius: '8px' }}>
                    <Calendar size={16} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>
                    {currentEvent.date}
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#fdf2f8', color: '#db2777', padding: '0.4rem', borderRadius: '8px' }}>
                    <MapPin size={16} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500, lineHeight: 1.4 }}>
                    {currentEvent.venue}
                  </div>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ background: '#f3e8ff', color: '#9333ea', padding: '0.4rem', borderRadius: '8px' }}>
                    <Users size={16} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500, lineHeight: 1.4, alignSelf: 'center' }}>
                    Seats: {currentEvent.seats}
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            
            {/* Header */}
            <div style={{ marginBottom: '2.5rem', position: 'relative' }}>
              {isAdminOrOrganizer && (
                <button 
                  onClick={() => window.location.hash = `#edit-event-${currentEvent.id}`}
                  style={{ position: 'absolute', top: 0, right: 0, background: '#f8fafc', color: '#0f172a', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}
                >
                  <Edit size={14} /> Edit Event
                </button>
              )}
              <span style={{ display: 'inline-block', background: '#f3e8ff', color: '#9333ea', border: '1px solid #d8b4fe', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>{currentEvent.category}</span>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
                {currentEvent.title}
              </h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Date & Time */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: '#fff', border: '1px solid #ec4899', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <div style={{ background: '#ec4899', width: '100%', textAlign: 'center', color: '#fff', fontSize: '0.5rem', fontWeight: 800, padding: '0.1rem 0' }}>DATE</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111', lineHeight: 1.2, marginTop: '1px' }}>📅</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.date.split('•')[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{currentEvent.date.split('•')[1] || currentEvent.date}</div>
                  </div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: '#e0f2fe', color: '#3b82f6', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.venue.split(',')[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{currentEvent.venue.split(',')[1] || currentEvent.venue}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Card */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '2.5rem', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.1rem' }}>Ticket Price</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>{currentEvent.price}</div>
                </div>
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      window.location.hash = '#signin';
                      return;
                    }
                    if (!currentEvent.isRegistered) setShowRegister(true);
                  }}
                  style={{ background: currentEvent.isRegistered ? '#10b981' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', fontSize: '0.9rem', fontWeight: 700, cursor: currentEvent.isRegistered ? 'default' : 'pointer', transition: 'background 0.2s' }}
                >
                  {currentEvent.isRegistered ? 'Registered' : 'Register Now'}
                </button>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '1.25rem' }}>
                Limited slots available. Register now to confirm your spot!
              </div>
            </div>

            {/* About Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>About</h2>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                {currentEvent.description}
              </p>
            </div>

          </div>
        </div>
      </main>
      )}
      
      <Footer />
    </div>
  );
};

export default EventDetail;
