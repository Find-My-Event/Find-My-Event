import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, Heart, Share2, Ticket, Sparkles, User as UserIcon, Mail, Phone, Users, CheckCircle, Loader2, X, ChevronDown } from 'lucide-react';
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
            <p style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '6px' }}>Date & Time</p>
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
            <p style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, marginBottom: '6px' }}>Location</p>
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
                        <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '4px' }}>Capacity</p>
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

               <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem', fontWeight: 500 }}>
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
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, user } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', team: '' });
  const [ticketsCount, setTicketsCount] = useState(1);

  const renderTicket = (isAlreadyRegistered: boolean) => (
    <motion.div key={isAlreadyRegistered ? "is-registered" : "success"} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '1rem 0' }}>
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
            <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{formData?.name || user?.name || 'Participant'}</p>
          </div>
          <div>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: '0 0 0.2rem 0' }}>Team Name</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>{formData?.team || 'N/A'}</p>
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

  const isFormValid = formData.name && formData.email && formData.phone;

  const handleRazorpayPayment = async (orderData: any) => {
    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Find My Event",
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
        name: formData.name,
        email: formData.email,
        contact: formData.phone
      },
      theme: { color: "#8B5CF6" }
    };

    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };

  const handleSubmit = async (e: any) => {
     e.preventDefault();
     if (!isLoggedIn) {
       window.location.hash = '#signin';
       return;
     }
     if (!isFormValid) return;

     setLoading(true);
     try {
       const actualEventId = event._id || (String(event.id).startsWith('api-') ? event.id.replace('api-', '') : event.id);
       const actualModel = (event._id || String(event.id).startsWith('api-')) ? 'EventSubmission' : 'Event';

       if (event.pricing?.isPaid) {
          // 1. Create Order
          const { data: orderData } = await api.post('/payments/create-order', {
            eventId: actualEventId,
            eventModel: actualModel,
            ticketsCount
          });
          
          // 2. Open Razorpay
          await handleRazorpayPayment(orderData);
       } else {
          // Free Registration
          await api.post(`/events/${actualEventId}/register`);
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="sv-padding"
      style={{ padding: '6rem 1.5rem 4rem 1.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', position: 'relative' }}
    >
       {/* Blobs */}
       <div style={{ position: 'absolute', top: '10%', left: '30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />
       <div style={{ position: 'absolute', bottom: '10%', right: '30%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(56,189,248,0.1) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: -1 }} />

      <motion.div 
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{
           width: '100%', maxWidth: '500px',
           padding: '2.5rem',
           position: 'relative',
           background: '#ffffff',
           borderRadius: '20px',
           boxShadow: '0 15px 40px rgba(139, 92, 246, 0.12)',
           border: '1px solid rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <h2 style={{ color: '#2E1065', fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>
              Registration form
           </h2>
           <button type="button" onClick={onBack} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}>
             <X size={24} color="#6b7280" style={{ strokeWidth: 2.5 }} />
           </button>
        </div>

        <AnimatePresence mode="wait">
        {event.isRegistered ? renderTicket(true) : step === 1 ? (
        <motion.form key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
             {/* Name */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6D28D9' }}>Full Name</label>
                <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: formData.name ? '#ffffff' : '#F5F3FF', border: formData.name ? '1px solid #8B5CF6' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s' }} />
             </div>

             {/* Phone */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6D28D9' }}>Mobile Number</label>
                <input required type="text" placeholder="+91 98765-12345" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: formData.phone ? '#ffffff' : '#F5F3FF', border: formData.phone ? '1px solid #8B5CF6' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s' }} />
             </div>

             {/* Email */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6D28D9' }}>Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: formData.email ? '#ffffff' : '#F5F3FF', border: formData.email ? '1px solid #8B5CF6' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s' }} />
             </div>

             {/* Course */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6D28D9' }}>Course</label>
                <select value={(formData as any).course || ''} onChange={e => setFormData({...formData, course: e.target.value} as any)}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: (formData as any).course ? '#ffffff' : '#F5F3FF', border: (formData as any).course ? '1px solid #8B5CF6' : '1px solid transparent', borderRadius: '8px', color: (formData as any).course ? '#111' : '#8B5CF6', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s', appearance: 'none' }}>
                  <option value="" disabled>Select an option</option>
                  <option value="btech">B.Tech</option>
                  <option value="bca">BCA</option>
                  <option value="mca">MCA</option>
                </select>
                <ChevronDown size={16} color="#8B5CF6" style={{ position: 'absolute', right: '1rem', top: '2.4rem', pointerEvents: 'none' }} />
             </div>

             {/* Invite Team Member */}
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'relative' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6D28D9' }}>Invite Team Member</label>
                <input type="email" placeholder="Team Member Email Address" value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})}
                  style={{ width: '100%', padding: '0.85rem 1rem', background: formData.team ? '#ffffff' : '#F5F3FF', border: formData.team ? '1px solid #8B5CF6' : '1px solid transparent', borderRadius: '8px', color: '#111', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', transition: 'all 0.2s' }} />
                <ChevronDown size={16} color="#6b7280" style={{ position: 'absolute', right: '1rem', top: '2.4rem', pointerEvents: 'none' }} />
             </div>

             {/* Paid Event: Quantity Selector */}
             {event.pricing?.isPaid && (
               <div style={{ 
                 background: '#F5F3FF', padding: '1.25rem', borderRadius: '12px', 
                 border: '1px solid rgba(139, 92, 246, 0.2)', marginTop: '0.5rem' 
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <p style={{ color: '#2E1065', fontWeight: 700, fontSize: '0.95rem', margin: 0 }}>Select Tickets</p>
                     <p style={{ color: '#6b7280', fontSize: '0.8rem', margin: '0.2rem 0 0 0' }}>Max {event.pricing?.maxTicketsPerUser || 10} per user</p>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#111', borderRadius: '10px', padding: '0.4rem 1rem' }}>
                     <button 
                       type="button"
                       onClick={() => setTicketsCount(Math.max(1, ticketsCount - 1))}
                       style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', padding: 0 }}
                     >-</button>
                     <span style={{ color: '#ffffff', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{ticketsCount}</span>
                     <button 
                       type="button"
                       onClick={() => setTicketsCount(Math.min(event.pricing?.maxTicketsPerUser || 10, ticketsCount + 1))}
                       style={{ background: 'none', border: 'none', color: '#8B5CF6', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', padding: 0 }}
                     >+</button>
                   </div>
                 </div>
                 <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px dashed rgba(139, 92, 246, 0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ color: '#6D28D9', fontSize: '0.9rem', fontWeight: 600 }}>Total Amount</span>
                   <span style={{ color: '#8B5CF6', fontSize: '1.25rem', fontWeight: 800 }}>₹{event.pricing.ticketPrice * ticketsCount}</span>
                 </div>
               </div>
             )}
          </div>
          
          <motion.button 
            type="submit"
            disabled={loading || !isFormValid}
            whileHover={{ scale: (isFormValid && !loading) ? 1.02 : 1 }} 
            whileTap={{ scale: (isFormValid && !loading) ? 0.98 : 1 }}
            style={{ 
               background: '#8B5CF6',
               color: '#ffffff',
               padding: '1rem', borderRadius: '12px', fontWeight: 600, border: 'none', cursor: (isFormValid && !loading) ? 'pointer' : 'not-allowed',
               marginTop: '1.5rem', fontSize: '1.05rem', fontFamily: 'inherit',
               transition: 'all 0.3s',
               display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
               opacity: (isFormValid && !loading) ? 1 : 0.5,
               boxShadow: (isFormValid && !loading) ? '0 10px 25px rgba(139, 92, 246, 0.4)' : 'none'
            }}>
            {loading ? <Loader2 size={24} className="spin" /> : 'Pay Now / Register'}
          </motion.button>
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
