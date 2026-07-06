import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Edit, Loader2, Trophy, Phone, FileText, ChevronRight, GraduationCap, ChevronUp, User, Mail, Bell } from 'lucide-react';
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
  const [showRules, setShowRules] = useState(false);

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
          isRegistered: data.isRegistered,
          startDate: data.startDate,
          endDate: data.endDate,
          mode: data.mode,
          location: data.location
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
      <main className="event-detail-main" style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 2rem 6rem', position: 'relative', zIndex: 1 }}>
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
            .info-box {
              background: #fff; border-radius: 12px; padding: 1.25rem; 
              box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #f1f5f9;
              margin-bottom: 1.5rem;
            }
            .prize-card {
              flex: 1; min-width: 150px;
              border-radius: 16px; padding: 1.5rem; text-align: center;
              box-shadow: 0 10px 30px rgba(0,0,0,0.05);
              border: 1px solid #e2e8f0;
              background: linear-gradient(180deg, #fff 0%, #f8fafc 100%);
              display: flex; flex-direction: column; align-items: center; justify-content: center;
              position: relative; overflow: hidden;
            }
            .prize-card.pos-1 { background: linear-gradient(180deg, #fff 0%, #fef08a 100%); border-color: #fde047; }
            .prize-card.pos-2 { background: linear-gradient(180deg, #fff 0%, #e2e8f0 100%); border-color: #cbd5e1; }
            .prize-card.pos-3 { background: linear-gradient(180deg, #fff 0%, #fed7aa 100%); border-color: #fdba74; }
            
            .timeline-container { position: relative; }

            @media (max-width: 768px) {
              .event-detail-main { padding: 5rem 1.25rem 3rem !important; }
              .event-poster { height: 320px !important; }
              .event-title { font-size: 2rem !important; margin-bottom: 1rem !important; }
              
              /* Timeline Mobile Fix */
              .timeline-card { margin-left: 0 !important; padding: 1rem !important; }
              
              /* Registration Mobile Fix */
              .reg-card { padding: 1.25rem !important; }
              .reg-card-flex { flex-direction: column; align-items: stretch !important; gap: 1rem; }
              .reg-btn { width: 100% !important; justify-content: center !important; }
            }
          `}</style>

          {/* LEFT COLUMN */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Event Poster */}
            <motion.div 
              className="event-poster"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ background: '#111', borderRadius: '16px', overflow: 'hidden', height: '420px', position: 'relative', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}
            >
              <img src={currentEvent.img} alt={currentEvent.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>

            {/* Eligibility Card */}
            {(rawEvent?.eligibility || (rawEvent?.participantType === 'team' && (rawEvent?.teamMin || rawEvent?.teamMax))) && (
              <div className="info-box">
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>Eligibility</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', listStyle: 'none', padding: 0, margin: 0 }}>
                  {rawEvent?.eligibility && rawEvent.eligibility.split('\n').map((line: string, i: number) => (
                     <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                       <div style={{ background: '#fdf2f8', color: '#db2777', padding: '0.4rem', borderRadius: '8px' }}>
                         <GraduationCap size={16} />
                       </div>
                       <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500, lineHeight: 1.4, alignSelf: 'center' }}>
                         {line}
                       </div>
                     </li>
                  ))}
                  {rawEvent?.participantType === 'team' && (rawEvent?.teamMin || rawEvent?.teamMax) && (
                     <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                       <div style={{ background: '#f3e8ff', color: '#9333ea', padding: '0.4rem', borderRadius: '8px' }}>
                         <Users size={16} />
                       </div>
                       <div style={{ fontSize: '0.85rem', color: '#334155', fontWeight: 500, lineHeight: 1.4, alignSelf: 'center' }}>
                         Min {rawEvent.teamMin || 1} • Max {rawEvent.teamMax || 1} members per team
                       </div>
                     </li>
                  )}
                </ul>
              </div>
            )}

            {/* Organized by Card */}
            <div className="info-box">
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Organized by</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingBottom: '1rem', borderBottom: (rawEvent?.contacts && rawEvent.contacts.length > 0) ? '1px solid #f1f5f9' : 'none' }}>
                <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${currentEvent.organizer}`} alt="Organizer" style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#111' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>{currentEvent.organizer}</h4>
              </div>
              {rawEvent?.contacts && rawEvent.contacts.length > 0 && (
                <div style={{ paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600, marginBottom: '0.5rem' }}>Contact details:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {rawEvent.contacts.map((contact: any, idx: number) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {idx > 0 && <div style={{ borderTop: '1px solid #f1f5f9', margin: '0.5rem 0' }}></div>}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ background: '#fdf2f8', padding: '4px', borderRadius: '4px' }}><User size={12} color="#db2777" /></div>
                          <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>Coordinator: {contact.name || 'N/A'}</span>
                        </div>
                        {contact.phone && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ background: '#eff6ff', padding: '4px', borderRadius: '4px' }}><Phone size={12} color="#2563eb" /></div>
                            <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>{contact.phone}</span>
                          </div>
                        )}
                        {contact.email && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ background: '#f3e8ff', padding: '4px', borderRadius: '4px' }}><Mail size={12} color="#9333ea" /></div>
                            <span style={{ fontSize: '0.8rem', color: '#334155', fontWeight: 500 }}>{contact.email}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
             {/* More / Rules */}
             {rawEvent?.rules && (
               <div style={{ marginTop: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>More</h3>
                  <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                    <button onClick={() => setShowRules(!showRules)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={16} color="#475569" />
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>Rules and Regulations</span>
                      </div>
                      {showRules ? <ChevronUp size={16} color="#94a3b8" /> : <ChevronRight size={16} color="#94a3b8" />}
                    </button>
                    {showRules && (
                      <div style={{ padding: '0 1rem 1rem 1rem', fontSize: '0.8rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                        {rawEvent.rules}
                      </div>
                    )}
                  </div>
               </div>
             )}

             {/* Announcements */}
            {rawEvent?.announcements && rawEvent.announcements.length > 0 && (
              <div style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={18} color="#0f172a" /> Announcements
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {rawEvent.announcements.map((ann: any, idx: number) => (
                    <div key={idx} style={{ background: '#fff', borderRadius: '8px', border: '1px solid #f1f5f9', padding: '1rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{ann.title || 'Announcement'}</h4>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>{new Date(ann.date).toLocaleDateString()}</span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {ann.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              <span style={{ display: 'inline-block', background: '#f3e8ff', color: '#a855f7', border: '1px solid #e9d5ff', padding: '0.25rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, marginBottom: '1rem' }}>{currentEvent.category}</span>
              <h1 className="event-title" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '1.5rem' }}>
                {currentEvent.title}
              </h1>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Date & Time */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: '#fff', border: '1px solid #ec4899', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <div style={{ background: '#ec4899', width: '100%', textAlign: 'center', color: '#fff', fontSize: '0.5rem', fontWeight: 800, padding: '0.1rem 0' }}>{new Date(currentEvent.startDate || currentEvent.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111', lineHeight: 1.2, marginTop: '1px' }}>{new Date(currentEvent.startDate || currentEvent.date).getDate() || '📅'}</div>
                  </div>
                  <div>
                    {currentEvent.startDate ? (
                      <>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{new Date(currentEvent.startDate).toLocaleString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                          {new Date(currentEvent.startDate).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })} 
                          {currentEvent.endDate ? ` - ${new Date(currentEvent.endDate).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit' })}` : ''}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.date?.split('•')[0] || currentEvent.date?.split(' - ')[0] || currentEvent.date}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{currentEvent.date?.split('•')[1] || currentEvent.date?.split(' - ')[1] || ''}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ background: '#eff6ff', color: '#3b82f6', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    {currentEvent.location ? (
                      <>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.location?.split(',')[0] || currentEvent.location}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                          {currentEvent.location?.split(',').slice(1).join(',').trim() || currentEvent.mode}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.venue?.split(',')[0] || currentEvent.venue?.split(' | ')[1] || currentEvent.venue}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>{currentEvent.venue?.split(',')[1] || currentEvent.venue?.split(' | ')[0] || ''}</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Team Size */}
                {rawEvent?.participantType === 'team' && (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ background: '#f3e8ff', color: '#a855f7', borderRadius: '8px', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>Team Size</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
                        {rawEvent?.teamMin && rawEvent?.teamMax 
                            ? `${rawEvent.teamMin} - ${rawEvent.teamMax} Members / Team` 
                            : 'Team'}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Registration Card */}
            <div className="reg-card" style={{ background: '#f8fafc', borderRadius: '12px', padding: '1.5rem', marginBottom: '2.5rem', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '1rem' }}>
                Registration closes on {new Date(rawEvent?.registrationDeadline || currentEvent.startDate || currentEvent.date).toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })}
              </div>
              <div className="reg-card-flex" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500, marginBottom: '0.1rem' }}>Ticket Price</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>
                    {rawEvent?.tickets && rawEvent.tickets.length > 0 ? rawEvent.tickets[0].price : currentEvent.price}
                  </div>
                </div>
                <button 
                  className="reg-btn"
                  onClick={() => {
                    if (!isLoggedIn) {
                      window.location.hash = '#signin';
                      return;
                    }
                    if (!currentEvent.isRegistered) setShowRegister(true);
                  }}
                  style={{ background: currentEvent.isRegistered ? '#10b981' : '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 2.5rem', fontSize: '0.9rem', fontWeight: 700, cursor: currentEvent.isRegistered ? 'default' : 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
                >
                  {currentEvent.isRegistered ? 'Registered' : 'Register Now'}
                </button>
              </div>
              <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginTop: '1.25rem' }}>
                Limited slots available, Register now to confirm your spot!
              </div>
            </div>

            {/* About Section */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', color: '#0f172a' }}>About</h2>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6, fontWeight: 500, whiteSpace: 'pre-wrap' }}>
                {currentEvent.description}
              </p>
            </div>

            {/* Stages & Timeline */}
            {(rawEvent?.timeline && rawEvent.timeline.length > 0) && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>Stages & Timeline</h2>
                <div className="timeline-container">
                   {rawEvent.timeline.map((item: any, i: number) => (
                     <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: i === rawEvent.timeline.length - 1 ? 0 : '1.5rem', position: 'relative' }}>
                        {i !== rawEvent.timeline.length - 1 && (
                          <div style={{ position: 'absolute', left: '21px', top: '36px', bottom: '-24px', borderLeft: '2px dotted #cbd5e1', zIndex: 0 }} />
                        )}
                        <div className="timeline-date-label" style={{ width: '45px', flexShrink: 0, textAlign: 'center', fontSize: '0.95rem', fontWeight: 800, color: i % 2 === 0 ? '#ec4899' : '#3b82f6', lineHeight: 1.1, paddingTop: '0.2rem', zIndex: 1, background: '#fafafa' }}>
                          {new Date(item.startDate?.split(',')[0] || item.date).getDate() || item.date?.split(' ')[0]}<br/>
                          <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>{new Date(item.startDate?.split(',')[0] || item.date).toLocaleString('en-US', { month: 'short' }).toUpperCase()}</span>
                        </div>
                        <div className="timeline-card" style={{ flex: 1, background: '#fff', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '1.25rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                           <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                             {item.startDate} <span style={{ color: '#94a3b8' }}>→</span> {item.endDate}
                           </div>
                           <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>{item.title}</h4>
                           <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, margin: 0 }}>{item.desc}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* Prizes and Rewards */}
            {(rawEvent?.prizes && rawEvent.prizes.length > 0) && (
              <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0f172a' }}>Prize and Rewards</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {rawEvent.prizes.slice(0, 3).map((prize: any, i: number) => {
                     const isFirst = prize.position?.includes('1');
                     const isSecond = prize.position?.includes('2');
                     const colorClass = isFirst ? 'pos-1' : (isSecond ? 'pos-2' : 'pos-3');
                     const iconColor = isFirst ? '#eab308' : (isSecond ? '#94a3b8' : '#d97706');
                     return (
                        <div key={i} className={`prize-card ${colorClass}`}>
                          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>{prize.amount || prize.rewardType}</div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, marginBottom: '1rem' }}>with Certificate</div>
                          <div style={{ marginTop: 'auto', marginBottom: '0.5rem' }}>
                            <Trophy size={48} color={iconColor} strokeWidth={1.5} />
                          </div>
                        </div>
                     )
                  })}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.8rem', fontWeight: 600, color: '#0f172a' }}>
                  Certificates will be given to all the participants.
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
      )}
      
      <Footer />
    </div>
  );
};

export default EventDetail;
