import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, Heart, Share2, Ticket, Sparkles, Users, CheckCircle, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

// ─── Shared Event Detail View ───────────────────────────────────────────────────────────
import { useLikedEvents } from '../hooks/useLikedEvents';

export const EventDetail = ({ event, onBack, onRegister }: { event: any, onBack: () => void, onRegister: () => void }) => {
  const { isLiked: _isLiked, toggleLike } = useLikedEvents();
  const eventId = event?.id ? String(event.id) : null;
  const isLiked = eventId ? _isLiked(eventId) : false;

  const [isShared, setIsShared] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="event-detail-wrapper sv-padding"
      style={{
         padding: '6rem 1.5rem 4rem 1.5rem', 
         maxWidth: '1000px', 
         margin: '0 auto', 
         width: '100%',
         position: 'relative'
      }}
    >
      {/* Background Decorative Blur */}
      <div style={{
          position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          pointerEvents: 'none', zIndex: -1, filter: 'blur(80px)'
      }} />

      {/* Navigation */}
      <motion.div
        onClick={onBack}
        whileHover={{ scale: 1.05, background: 'var(--border-color)' }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: '45px', height: '45px',
          background: 'var(--border-subtle)', borderRadius: '50%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          cursor: 'pointer', marginBottom: '2rem',
          border: '1px solid var(--border-color)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}
      >
        <ArrowLeft size={22} color='var(--text-primary)' />
      </motion.div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sv-hero-container"
        style={{
          width: '100%', borderRadius: '24px', overflow: 'hidden',
          marginBottom: '3rem', position: 'relative',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6)',
          border: '1px solid var(--border-color)',
          background: 'var(--bg-primary)',
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 450px) 1fr',
          gap: '2rem'
        }}
      >
        <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>
          <img
            className="sv-hero-image"
            src={event?.image || '/event1.png'}
            alt={event?.title || 'Event'}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.9)' }}
          />
          
          {/* Floating Actions */}
          <div style={{
            position: 'absolute', top: '1.5rem', right: '1.5rem',
            display: 'flex', gap: '0.75rem'
          }}>
            <motion.button onClick={() => { if (eventId) toggleLike(eventId); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              style={{
                width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(12px)', color: isLiked ? '#ef4444' : 'var(--text-primary)'
              }}>
              <Heart size={20} fill={isLiked ? '#ef4444' : 'none'} />
            </motion.button>
            <motion.button onClick={() => { setIsShared(true); setTimeout(() => setIsShared(false), 2000); }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              style={{
                width: '45px', height: '45px', borderRadius: '50%', background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', backdropFilter: 'blur(12px)', color: 'var(--text-primary)'
              }}>
              {isShared ? <CheckCircle size={20} color="#34d399" /> : <Share2 size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Hero Content (Right Side) */}
        <div className="sv-hero-content" style={{
           padding: '3rem 3rem 3rem 0',
           display: 'flex', flexDirection: 'column', gap: '1rem',
           justifyContent: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
             <span style={{
                background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', color: '#ffffff',
                padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(139,92,246,0.4)'
             }}>
               {event?.category || 'Special'}
             </span>
             {(event?.tag === 'Trending' || event?.tag === 'Hot') && (
               <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontSize: '0.85rem', fontWeight: 600 }}>
                 <Sparkles size={16} /> Trending
               </span>
             )}
          </div>
          
          <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 800, lineHeight: 1.15 }}>
            {event?.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <img src={`https://ui-avatars.com/api/?name=${event?.organizer || 'A'}&background=random&color=fff`} alt="Organizer" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>By <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{event?.organizer || 'Unknown Organizer'}</span></p>
          </div>
        </div>
      </motion.div>

      {/* Meta Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem',
          marginBottom: '3rem'
        }}
      >
        <div style={{
          background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', borderRadius: '20px',
          padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <div style={{ background: 'rgba(139,92,246,0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.2)' }}>
            <Calendar size={24} color="#a78bfa" />
          </div>
          <div>
            <p style={{ fontSize: '0.95rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '6px' }}>Date & Time</p>
            <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>{event?.date || event?.startDate || 'TBD'}</p>
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', borderRadius: '20px',
          padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
        }}>
          <div style={{ background: 'rgba(56,189,248,0.1)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(56,189,248,0.2)' }}>
            <MapPin size={24} color="#38bdf8" />
          </div>
          <div>
            <p style={{ fontSize: '0.95rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '6px' }}>Location</p>
            <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600, lineHeight: 1.3 }}>{event?.venue?.split(',')[0] || 'TBD'}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>{event?.venue?.split(',')[1] || ''}</p>
          </div>
        </div>
      </motion.div>

      {/* Main Content & Sidebar CTA */}
      <div className="sv-main-content-gap" style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
         <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} style={{ flex: '1 1 500px', minWidth: 0 }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
               <div style={{ width: '4px', height: '24px', background: '#8B5CF6', borderRadius: '4px' }} />
               About This Event
            </h3>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
               <p style={{ marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                 {event?.description || `Prepare to elevate your experience! Join us for a breathtaking immersion into ${event?.category?.toLowerCase() || 'this field'}, brought to you by ${event?.organizer || 'the best'}. Expect dynamic showcases, brilliant insights, and networking that fuels innovation.`}
               </p>
               <div style={{ background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', padding: '1.5rem', borderRadius: '16px', marginBottom: '2rem' }}>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>🌟 Event Highlights</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Sparkles size={16} color="#fbbf24" style={{flexShrink: 0}} /> Exclusive interactive sessions and keynotes.</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={16} color="#38bdf8" style={{flexShrink: 0}} /> Connect with highly influential professionals.</li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Ticket size={16} color="#e879f9" style={{flexShrink: 0}} /> Incredible giveaways and priority seating.</li>
                  </ul>
               </div>
            </div>
         </motion.div>

         {/* Fixed/Sticky CTA Card */}
         <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} style={{ flex: '1 1 300px', maxWidth: '400px', width: '100%' }}>
            <div className="sv-cta-card" style={{
               background: 'linear-gradient(180deg, rgba(30,30,35,0.8), rgba(20,20,25,0.8))',
               border: '1px solid var(--border-color)',
               borderRadius: '24px', padding: '2rem',
               backdropFilter: 'blur(16px)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
               position: 'sticky', top: '100px'
            }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '4px' }}>Ticket Price</p>
                    <p style={{ color: (event?.pricing?.isPaid ? 'var(--text-primary)' : '#34d399'), fontSize: '2rem', fontWeight: 800, lineHeight: 1 }}>
                       {event?.pricing?.isPaid ? `₹${event.pricing.ticketPrice}` : 'Free'}
                    </p>
                  </div>
                  {(event?.pricing?.ticketCapacity || event?.seats) && (
                     <div style={{ textAlign: 'right' }}>
                        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '4px' }}>Capacity</p>
                        <p style={{ color: '#f59e0b', fontSize: '1.1rem', fontWeight: 700 }}>
                           {event?.pricing?.ticketCapacity || event.seats}
                        </p>
                     </div>
                  )}
               </div>

               {event?.pricing?.isPaid && (
                 <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8', fontSize: '0.85rem' }}>
                     <CheckCircle size={14} color={event.pricing.isRefundable ? '#34d399' : '#ef4444'} />
                     {event.pricing.isRefundable ? 'Refundable Policy Applied' : 'Non-Refundable Ticket'}
                   </div>
                   {event.pricing.paymentDescription && (
                     <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                       <strong style={{ color: 'var(--text-primary)' }}>Includes:</strong> {event.pricing.paymentDescription}
                     </p>
                   )}
                   {event.pricing.entryConditions && (
                     <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.4 }}>
                       <strong style={{ color: 'var(--text-primary)' }}>Note:</strong> {event.pricing.entryConditions}
                     </p>
                   )}
                 </div>
               )}

               <motion.button
                  onClick={event.isRegistered ? undefined : onRegister}
                  whileHover={!event.isRegistered ? { scale: 1.03, boxShadow: '0 8px 30px rgba(139,92,246,0.4)' } : {}}
                  whileTap={!event.isRegistered ? { scale: 0.97 } : {}}
                  style={{
                     width: '100%', 
                     background: event.isRegistered ? '#10b981' : 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                     color: '#ffffff', border: 'none', padding: '1rem', borderRadius: '14px',
                     fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                     cursor: event.isRegistered ? 'default' : 'pointer', fontFamily: "'Outfit', sans-serif"
                  }}
               >
                  {event.isRegistered ? (
                    <>
                      <CheckCircle size={20} /> Already Registered
                    </>
                  ) : (
                    <>
                      <Ticket size={20} /> Secure Your Spot
                    </>
                  )}
               </motion.button>

               <p style={{ color: '#64748b', fontSize: '0.95rem', textAlign: 'center', marginTop: '1rem', fontWeight: 500 }}>
                  Limited slots available. Register now to confirm!
               </p>
            </div>
         </motion.div>
      </div>
    </motion.div>
  );
};

// ─── Shared Register View ───────────────────────────────────────────────────────────
export const RegisterView = ({ event, onBack }: { event: any, onBack: () => void }) => {
  const [step, setStep] = useState(1); // 1 = Form, 2 = Success/Ticket
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user } = useAuth();
  
  const isTeam = event?.participantType === 'team';
  const minTeam = event?.teamMin || 1;
  const maxTeam = event?.teamMax || 4;
  
  const [teamSize, setTeamSize] = useState(isTeam ? minTeam : 1);
  const [teamMembers, setTeamMembers] = useState([{ name: user?.name || '', email: user?.email || '', phone: (user as any)?.phone || '', customAnswers: [] as any[] }]);
  
  const [currentStep, setCurrentStep] = useState(0); // For multi-step team members
  const [selectedTicket, setSelectedTicket] = useState(event?.tickets?.[0]?.category || 'Free');

  const updateTeamSize = (size: number) => {
    let newSize = Math.max(isTeam ? minTeam : 1, Math.min(size, isTeam ? maxTeam : 1));
    setTeamSize(newSize);
    
    setTeamMembers(prev => {
        const newMembers = [...prev];
        while (newMembers.length < newSize) {
            newMembers.push({ name: '', email: '', phone: '', customAnswers: [] });
        }
        return newMembers.slice(0, newSize);
    });
    if (currentStep >= newSize) {
        setCurrentStep(newSize - 1);
    }
  };

  const updateMember = (field: string, value: string) => {
      setTeamMembers(prev => {
          const updated = [...prev];
          updated[currentStep] = { ...updated[currentStep], [field]: value };
          return updated;
      });
  };

  const renderTicket = (isAlreadyRegistered: boolean) => (
    <motion.div key={isAlreadyRegistered ? 'is-registered' : 'success'} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '1rem 0' }}>
      <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111', marginBottom: '1.5rem', marginTop: 0 }}>You're In</h2>
      
      <div style={{ background: '#8B5CF6', borderRadius: '16px', width: '100%', maxWidth: '350px', color: '#fff', position: 'relative', overflow: 'hidden', boxShadow: '0 20px 40px rgba(139, 92, 246, 0.3)' }}>
        <div style={{ padding: '2rem 1.5rem 1.5rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>🎉</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>Thank you!</h3>
          <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', margin: 0, lineHeight: 1.4 }}>{isAlreadyRegistered ? 'You are registered for this event.' : 'Your ticket has been issued successfully'}</p>
        </div>

        <div style={{ position: 'relative', height: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ position: 'absolute', left: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff' }} />
          <div style={{ width: '100%', borderTop: '2px dashed rgba(255,255,255,0.4)', margin: '0 15px' }} />
          <div style={{ position: 'absolute', right: '-10px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff' }} />
        </div>

        <div style={{ padding: '1.5rem', textAlign: 'left', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.2rem 0' }}>Participant</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{teamMembers[0]?.name || user?.name || 'Participant'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.2rem 0' }}>Pass Type</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{selectedTicket}</p>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.2rem 0' }}>Event Name</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{event?.title || 'Event'}</p>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.2rem 0' }}>Date & Time</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{event?.date || event?.startDate || 'TBA'}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px', marginBottom: '-10px' }}>
           {[1,2,3,4,5,6,7,8].map(i => (
             <div key={i} style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#fff' }} />
           ))}
        </div>
      </div>

      <motion.button onClick={() => { window.location.hash = '#registered-events'; window.location.reload(); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ background: '#2E1065', color: '#fff', border: 'none', padding: '0.85rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', marginTop: '2rem', width: '100%', maxWidth: '350px', fontSize: '1.05rem', boxShadow: '0 10px 20px rgba(46, 16, 101, 0.2)' }}>
         Go to My Events
      </motion.button>
    </motion.div>
  );

  const handleRazorpayPayment = async (orderData: any) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Find My Event',
      description: `Registration for ${event.title}`,
      order_id: orderData.orderId,
      handler: async (response: any) => {
        setLoading(true);
        try {
          const actualEventId = event._id || (String(event.id).startsWith('api-') ? event.id.replace('api-', '') : event.id);
          const actualModel = (event._id || String(event.id).startsWith('api-')) ? 'EventSubmission' : 'Event';

          await api.post('/payments/verify-payment', {
            ...response,
            eventId: actualEventId,
            eventModel: actualModel
          });
          setStep(2);
        } catch (err: any) {
          const errorMessage = err.response?.data?.details || err.response?.data?.message || 'Payment verification failed. Please contact support.';
          alert(errorMessage);
        } finally {
          setLoading(false);
        }
      },
      prefill: {
        name: teamMembers[0].name,
        email: teamMembers[0].email,
        contact: teamMembers[0].phone
      },
      theme: { color: '#8B5CF6' }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({});

  const handleMemberCustomAnswerChange = (question: string, answer: any) => {
    setTeamMembers(prev => {
      const updated = [...prev];
      const m = updated[currentStep];
      const existingAnsIdx = m.customAnswers?.findIndex(a => a.question === question) ?? -1;
      
      let newAnswers = m.customAnswers ? [...m.customAnswers] : [];
      if (existingAnsIdx >= 0) {
          newAnswers[existingAnsIdx].answer = answer;
      } else {
          newAnswers.push({ question, answer });
      }
      updated[currentStep] = { ...m, customAnswers: newAnswers };
      return updated;
    });
  };

  const handleFileUpload = async (question: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setIsUploading(prev => ({ ...prev, [question]: true }));
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const res = await api.post('/events/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      handleMemberCustomAnswerChange(question, res.data.url);
    } catch (err) {
      alert('Failed to upload file');
    } finally {
      setIsUploading(prev => ({ ...prev, [question]: false }));
    }
  };

  const validateCurrentStep = () => {
    const m = teamMembers[currentStep];
    if (!m.name || !m.email || !m.phone) return false;
    
    // Check Custom Questions
    if (event.customQuestions?.length > 0) {
      for (let q of event.customQuestions) {
        if (q.required === 'Required' || q.required === true) {
          const answered = m.customAnswers?.find(a => a.question === q.question);
          if (!answered || !answered.answer) return false;
        }
      }
    }
    
    // Check Edu Info
    const activeEduInfoVal = event.eduInfo?.length > 0 ? event.eduInfo : [
       { id: 1, name: 'Roll Number', required: 'Optional' },
       { id: 2, name: 'Course', required: 'Optional' },
       { id: 3, name: 'Branch', required: 'Optional' },
       { id: 4, name: 'Year', required: 'Off' }
    ];
    for (let eInfo of activeEduInfoVal) {
      if (eInfo.required === 'Required') {
        const answered = m.customAnswers?.find(a => a.question === eInfo.name);
        if (!answered || !answered.answer) return false;
      }
    }

    return true;
  };

  const isCurrentStepValid = validateCurrentStep();

  const handleSubmit = async (e: any) => {
     e.preventDefault();
     if (!isLoggedIn) {
       window.location.hash = '#signin';
       return;
     }

     if (!isCurrentStepValid) {
       alert("Please fill all required fields for the current member.");
       return;
     }

     if (currentStep < teamSize - 1) {
        setCurrentStep(prev => prev + 1);
        return;
     }

     setLoading(true);
     try {
       const actualEventId = event._id || (String(event.id).startsWith('api-') ? event.id.replace('api-', '') : event.id);
       const actualModel = (event._id || String(event.id).startsWith('api-')) ? 'EventSubmission' : 'Event';

       const ticketPriceStr = event.tickets?.find((t: any) => t.category === selectedTicket)?.price;
       const numericPrice = ticketPriceStr === 'Free' || ticketPriceStr === '0' ? 0 : Number(ticketPriceStr || event.pricing?.ticketPrice || 0);
       const isPaidTicket = numericPrice > 0;

       if (event.pricing?.isPaid || isPaidTicket) {
          const { data: orderData } = await api.post('/payments/create-order', {
            eventId: actualEventId,
            eventModel: actualModel,
            ticketsCount: teamSize,
            teamSize: teamSize,
            teamMembers: teamMembers,
            customAnswers: [] // Backend now reads from teamMembers[idx].customAnswers
          });
          
          await handleRazorpayPayment(orderData);
       } else {
          const payload = {
            ticketType: selectedTicket,
            teamSize: teamSize,
            teamMembers: teamMembers,
            customAnswers: []
          };
          await api.post(`/events/${actualEventId}/register`, payload);
          setStep(2);
       }
     } catch (err: any) {
       console.error('Registration error:', err);
       const detailedError = err.response?.data?.details || err.response?.data?.message || 'Failed to process registration. Please try again.';
       alert(detailedError);
     } finally {
       setLoading(false);
     }
  };

  let qNum = 1;
  const activeEduInfo = event.eduInfo?.length > 0 ? event.eduInfo : [
    { id: 1, name: 'Roll Number', required: 'Optional' },
    { id: 2, name: 'Course', required: 'Optional' },
    { id: 3, name: 'Branch', required: 'Optional' },
    { id: 4, name: 'Year', required: 'Off' }
  ];

  const ticketPriceStr = event.tickets?.find((t: any) => t.category === selectedTicket)?.price;
  const numericPrice = ticketPriceStr === 'Free' || ticketPriceStr === '0' ? 0 : Number(ticketPriceStr || event.pricing?.ticketPrice || 0);
  const totalAmount = numericPrice * teamSize;
  const currentMember = teamMembers[currentStep];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="sv-padding"
      style={{ padding: '6rem 1.5rem 4rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', position: 'relative' }}
    >
       <div style={{ position: 'absolute', top: '10%', left: '30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />
       <div style={{ position: 'absolute', bottom: '10%', right: '30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />

      <motion.div 
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
           width: '100%', maxWidth: '700px',
           padding: '2.5rem',
           position: 'relative',
           background: '#ffffff',
           borderRadius: '20px',
           boxShadow: '0 15px 40px rgba(139, 92, 246, 0.12)',
           border: '1px solid rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
           <h2 style={{ color: '#111827', fontSize: '2rem', fontWeight: 600, margin: 0 }}>
              Registration
           </h2>
           <button type="button" onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
             <X size={24} color="#6b7280" style={{ strokeWidth: 2.5 }} />
           </button>
        </div>

        <AnimatePresence mode="wait">
        {event.isRegistered ? renderTicket(true) : step === 1 ? (
        <motion.form key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
             
             {isTeam && currentStep === 0 && (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.5rem', padding: '1rem', background: '#F5F3FF', borderRadius: '12px', border: '1px dashed #8B5CF6' }}>
                 <label style={{ fontSize: '1.05rem', fontWeight: 700, color: '#4c1d95' }}>Configure Team Size</label>
                 <select
                   value={teamSize}
                   onChange={e => updateTeamSize(Number(e.target.value))}
                   style={{ width: '100%', padding: '0.85rem 1rem', background: '#ffffff', border: '1px solid #c4b5fd', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '1rem', fontFamily: 'inherit', cursor: 'pointer' }}
                 >
                   {Array.from({ length: maxTeam - minTeam + 1 }, (_, i) => minTeam + i).map(size => (
                     <option key={size} value={size}>{size} Members</option>
                   ))}
                 </select>
               </div>
             )}

             {isTeam && (
               <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1rem' }}>
                 {Array.from({ length: teamSize }).map((_, idx) => (
                    <div key={idx} style={{ flex: 1, height: '6px', borderRadius: '3px', background: idx <= currentStep ? '#8B5CF6' : '#E5E7EB', transition: 'all 0.3s' }} />
                 ))}
               </div>
             )}

             <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', color: '#334155', fontWeight: 800, display: 'flex', justifyContent: 'space-between' }}>
                        {isTeam ? `Member ${currentStep + 1} Details ${currentStep === 0 ? '👑 (Leader)' : ''}` : 'Participant Details'}
                        {isTeam && <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#8B5CF6' }}>{currentStep + 1} of {teamSize}</span>}
                    </h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>{qNum++}. Full Name *</label>
                        <input required type="text" value={currentMember.name} onChange={e => updateMember('name', e.target.value)}
                        style={{ width: '100%', padding: '0.85rem 1rem', background: currentMember.name ? '#ffffff' : '#F3F4F6', border: currentMember.name ? '1px solid #cbd5e1' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>{qNum++}. Mobile Number *</label>
                        <input required type="text" value={currentMember.phone} onChange={e => updateMember('phone', e.target.value)}
                        style={{ width: '100%', padding: '0.85rem 1rem', background: currentMember.phone ? '#ffffff' : '#F3F4F6', border: currentMember.phone ? '1px solid #cbd5e1' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>{qNum++}. Email Address *</label>
                        <input required type="email" value={currentMember.email} onChange={e => updateMember('email', e.target.value)}
                        style={{ width: '100%', padding: '0.85rem 1rem', background: currentMember.email ? '#ffffff' : '#F3F4F6', border: currentMember.email ? '1px solid #cbd5e1' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit' }} />
                    </div>

                    {/* Educational Info */}
                    {activeEduInfo?.filter((eInfo: any) => eInfo.required !== 'Off').map((eInfo: any, i: number) => {
                    const val = currentMember.customAnswers?.find(a => a.question === eInfo.name)?.answer || '';
                    const isReq = eInfo.required === 'Required';
                    return (
                        <div key={`edu-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>{qNum++}. {eInfo.name} {isReq && '*'}</label>
                            <input 
                            required={isReq} 
                            type="text" 
                            value={val} 
                            onChange={e => handleMemberCustomAnswerChange(eInfo.name, e.target.value)}
                            style={{ width: '100%', padding: '0.85rem 1rem', background: val ? '#ffffff' : '#F3F4F6', border: val ? '1px solid #cbd5e1' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s' }} 
                            />
                        </div>
                    );
                    })}

                    {/* Custom Questions */}
                    {event.customQuestions?.map((q: any, i: number) => {
                    const val = currentMember.customAnswers?.find(a => a.question === q.question)?.answer || '';
                    const isReq = q.required === 'Required' || q.required === true;
                    
                    if (q.type === 'Dropdown') {
                        return (
                        <div key={`custom-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>{qNum++}. {q.question} {isReq && '*'}</label>
                            <select 
                            required={isReq}
                            value={val}
                            onChange={e => handleMemberCustomAnswerChange(q.question, e.target.value)}
                            style={{ width: '100%', padding: '0.85rem 1rem', background: val ? '#ffffff' : '#F3F4F6', border: val ? '1px solid #cbd5e1' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', cursor: 'pointer', appearance: 'none' }}
                            >
                            <option value="" disabled>Select an option</option>
                            {q.options?.map((opt: string, idx: number) => (
                                <option key={idx} value={opt}>{opt}</option>
                            ))}
                            </select>
                        </div>
                        );
                    }
                    
                    if (q.type === 'Checkbox') {
                        const selectedOpts = Array.isArray(val) ? val : (val ? val.split(', ') : []);
                        return (
                        <div key={`custom-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>{qNum++}. {q.question} {isReq && '*'}</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '4px' }}>
                            {q.options?.map((opt: string, idx: number) => (
                                <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    checked={selectedOpts.includes(opt)}
                                    onChange={(e) => {
                                    let newOpts = [...selectedOpts];
                                    if (e.target.checked) newOpts.push(opt);
                                    else newOpts = newOpts.filter(o => o !== opt);
                                    handleMemberCustomAnswerChange(q.question, newOpts.join(', '));
                                    }}
                                    style={{ width: '16px', height: '16px', accentColor: '#8B5CF6', cursor: 'pointer' }}
                                />
                                {opt}
                                </label>
                            ))}
                            </div>
                        </div>
                        );
                    }
                    
                    if (q.type === 'File Upload') {
                        return (
                        <div key={`custom-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>{qNum++}. {q.question} {isReq && '*'}</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <input 
                                type="file" 
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={e => handleFileUpload(q.question, e)}
                                style={{ display: 'none' }}
                                id={`file-upload-${currentStep}-${i}-${q.question.replace(/\s+/g, '-')}`}
                            />
                            <label htmlFor={`file-upload-${currentStep}-${i}-${q.question.replace(/\s+/g, '-')}`} style={{ background: '#F3F4F6', color: '#4B5563', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, border: '1px dashed #9CA3AF' }}>
                                {isUploading[q.question] ? 'Uploading...' : 'Choose File'}
                            </label>
                            {val && <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>File Attached ✓</span>}
                            </div>
                        </div>
                        );
                    }

                    return (
                        <div key={`custom-${i}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569' }}>{qNum++}. {q.question} {isReq && '*'}</label>
                            <input 
                            required={isReq} 
                            type={q.type === 'Text' ? 'text' : 'text'} 
                            value={val} 
                            onChange={e => handleMemberCustomAnswerChange(q.question, e.target.value)}
                            style={{ width: '100%', padding: '0.85rem 1rem', background: val ? '#ffffff' : '#F3F4F6', border: val ? '1px solid #cbd5e1' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s' }} 
                            />
                        </div>
                    );
                    })}
                </div>
             </motion.div>

             {/* Tickets / Passes - Show only on last step or independently */}
             {currentStep === teamSize - 1 && event.tickets && event.tickets.length > 0 && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '1rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 800, color: '#111827' }}>Select Pass / Ticket</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {event.tickets.map((t: any, i: number) => (
                      <div 
                        key={i} 
                        onClick={() => setSelectedTicket(t.category)}
                        style={{ 
                          padding: '1rem', 
                          border: selectedTicket === t.category ? '2px solid #8B5CF6' : '1px solid #e2e8f0', 
                          borderRadius: '12px', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          background: selectedTicket === t.category ? '#F5F3FF' : '#fff'
                        }}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>{t.category}</p>
                        </div>
                        <div style={{ fontWeight: 800, color: '#8B5CF6' }}>
                           {t.price === 'Free' || t.price === '0' ? 'Free' : `₹${t.price}`}
                        </div>
                      </div>
                    ))}
                  </div>
               </motion.div>
             )}

             {/* Total Amount Counter */}
             {currentStep === teamSize - 1 && (
             <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: '#F5F3FF', border: '1px dashed #8B5CF6', borderRadius: '12px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#4c1d95' }}>Total Amount</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6d28d9' }}>₹{totalAmount}</span>
             </motion.div>
             )}

          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
             {currentStep > 0 && (
                <button
                   type="button"
                   onClick={() => setCurrentStep(prev => prev - 1)}
                   style={{ background: '#F3F4F6', color: '#4B5563', padding: '1rem', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', flex: 0.4, fontSize: '1.05rem', fontFamily: 'inherit' }}
                >
                   Back
                </button>
             )}
             
             <motion.button 
                type="submit"
                disabled={loading || !isCurrentStepValid}
                whileHover={{ scale: (isCurrentStepValid && !loading) ? 1.02 : 1 }} 
                whileTap={{ scale: (isCurrentStepValid && !loading) ? 0.98 : 1 }}
                style={{ 
                background: '#8B5CF6',
                color: '#ffffff',
                padding: '1rem', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: (isCurrentStepValid && !loading) ? 'pointer' : 'not-allowed',
                fontSize: '1.05rem', fontFamily: 'inherit',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                opacity: (isCurrentStepValid && !loading) ? 1 : 0.5,
                boxShadow: (isCurrentStepValid && !loading) ? '0 10px 25px rgba(139, 92, 246, 0.4)' : 'none',
                flex: 1
                }}>
                {loading ? <Loader2 size={24} className="spin" /> : (
                   currentStep < teamSize - 1 
                   ? `Next: Member ${currentStep + 2}` 
                   : (totalAmount > 0 ? `Pay Now (₹${totalAmount})` : 'Complete Registration')
                )}
             </motion.button>
          </div>
        </motion.form>
        ) : renderTicket(false)}
        </AnimatePresence>

      </motion.div>
      <style>{`
        @media (max-width: 900px) {
          .sv-hero-container { grid-template-columns: 1fr !important; }
          .sv-hero-content { padding: 2rem !important; }
        }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
};
