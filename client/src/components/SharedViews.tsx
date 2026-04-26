import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, Heart, Share2, Ticket, Sparkles, User as UserIcon, Mail, Phone, Users, CheckCircle, Loader2 } from 'lucide-react';
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
                background: 'linear-gradient(135deg, #FF6F3F, #ff4c1a)', color: '#ffffff',
                padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '0.05em', boxShadow: '0 4px 15px rgba(255,111,63,0.4)'
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
            <p style={{ color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: 600 }}>{event?.date?.split('•')[0] || 'TBD'}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '2px' }}>{event?.date?.split('•')[1] || ''}</p>
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
               <div style={{ width: '4px', height: '24px', background: '#FF6F3F', borderRadius: '4px' }} />
               About This Event
            </h3>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.8 }}>
               <p style={{ marginBottom: '1.5rem' }}>
                 Prepare to elevate your experience! Join us for a breathtaking immersion into {event?.category?.toLowerCase() || 'this field'}, brought to you by {event?.organizer || 'the best'}. Expect dynamic showcases, brilliant insights, and networking that fuels innovation.
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
                  whileHover={!event.isRegistered ? { scale: 1.03, boxShadow: '0 8px 30px rgba(255,111,63,0.4)' } : {}}
                  whileTap={!event.isRegistered ? { scale: 0.97 } : {}}
                  style={{
                     width: '100%', 
                     background: event.isRegistered ? '#10b981' : 'linear-gradient(135deg, #FF6F3F, #dc5022)',
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
  const { isLoggedIn } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', team: '' });
  const [ticketsCount, setTicketsCount] = useState(1);

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
          const verifyData = {
            ...response,
            eventId: event._id || (event.id.startsWith('api-') ? event.id.replace('api-', '') : event.id),
            eventModel: event.id?.startsWith('api-') || event._id ? 'EventSubmission' : 'Event' // Adjust based on how IDs are mapped
          };
          
          // Re-evaluate eventModel logic based on Discover.tsx mapApprovedToCard
          // If id starts with 'api-', it's an EventSubmission
          const actualEventId = event._id || (String(event.id).startsWith('api-') ? event.id.replace('api-', '') : event.id);
          const actualModel = (event._id || String(event.id).startsWith('api-')) ? 'EventSubmission' : 'Event';

          await api.post('/payments/verify-payment', {
            ...response,
            eventId: actualEventId,
            eventModel: actualModel
          });
          setStep(2);
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
      theme: { color: "#FF6F3F" }
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
        className="sv-form-padding"
        style={{
           width: '100%', maxWidth: '600px', background: 'var(--bg-card)',
           backdropFilter: 'blur(20px)', border: '1px solid var(--border-subtle)',
           borderRadius: '24px', padding: '2.5rem', boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
           position: 'relative', overflow: 'hidden'
        }}
      >
        <motion.div
           onClick={onBack}
           whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
           style={{
             position: 'absolute', top: '2rem', left: '2rem',
             width: '40px', height: '40px', background: 'var(--border-subtle)', borderRadius: '50%',
             display: 'flex', justifyContent: 'center', alignItems: 'center',
             cursor: 'pointer', border: '1px solid var(--border-color)'
           }}
        >
          <ArrowLeft size={18} color='var(--text-primary)' />
        </motion.div>

        <div style={{ textAlign: 'center', marginTop: '1rem', marginBottom: '2.5rem', padding: '0 3rem' }}>
           <h2 style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '0.5rem' }}>
              {event.isRegistered ? 'Already Registered' : 'Reserve Your Seat'}
           </h2>
           <p style={{ color: '#94a3b8', fontSize: '1rem' }}>For <span style={{ color: '#FF6F3F', fontWeight: 600 }}>{event?.title}</span></p>
        </div>

        <AnimatePresence mode="wait">
        {event.isRegistered ? (
          <motion.div key="is-registered" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} style={{ width: '80px', height: '80px', background: 'rgba(52,211,153,0.2)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem auto' }}>
                <CheckCircle size={40} color="#34d399" />
             </motion.div>
             <h3 style={{ color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>You're in!</h3>
             <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem' }}>You have already registered for this event. Check your email for ticket details.</p>
             <motion.button onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: 'var(--border-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
                Back to Details
             </motion.button>
          </motion.div>
        ) : step === 1 ? (
        <motion.form key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
             {/* Name */}
             <div style={{ position: 'relative' }}>
                <UserIcon size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit', transition: 'border-color 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                  onFocus={e => (e.target.style.borderColor = '#FF6F3F')} onBlur={e => (e.target.style.borderColor = 'var(--border-color)')} />
             </div>

             {/* Email */}
             <div style={{ position: 'relative' }}>
                <Mail size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input required type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit', transition: 'border-color 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                  onFocus={e => (e.target.style.borderColor = '#FF6F3F')} onBlur={e => (e.target.style.borderColor = 'var(--border-color)')} />
             </div>

             {/* Phone */}
             <div style={{ position: 'relative' }}>
                <Phone size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input required type="text" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit', transition: 'border-color 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                  onFocus={e => (e.target.style.borderColor = '#FF6F3F')} onBlur={e => (e.target.style.borderColor = 'var(--border-color)')} />
             </div>

             {/* Team Name */}
             <div style={{ position: 'relative' }}>
                <Users size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                <input type="text" placeholder="Team Name (Optional)" value={formData.team} onChange={e => setFormData({...formData, team: e.target.value})}
                  style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', fontFamily: 'inherit', transition: 'border-color 0.2s', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}
                  onFocus={e => (e.target.style.borderColor = '#FF6F3F')} onBlur={e => (e.target.style.borderColor = 'var(--border-color)')} />
             </div>

             {/* Paid Event: Quantity Selector */}
             {event.pricing?.isPaid && (
               <div style={{ 
                 background: 'rgba(255,111,63,0.05)', padding: '1.25rem', borderRadius: '16px', 
                 border: '1px solid rgba(255,111,63,0.15)', marginTop: '0.5rem' 
               }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <p style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>Select Tickets</p>
                     <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Max {event.pricing.maxTicketsPerUser} per user</p>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-primary)', borderRadius: '10px', padding: '0.4rem 0.8rem', border: '1px solid var(--border-color)' }}>
                     <button 
                       type="button"
                       onClick={() => setTicketsCount(Math.max(1, ticketsCount - 1))}
                       style={{ background: 'none', border: 'none', color: '#FF6F3F', fontSize: '1.5rem', cursor: 'pointer', display: 'flex' }}
                     >−</button>
                     <span style={{ color: 'var(--text-primary)', fontWeight: 700, minWidth: '20px', textAlign: 'center' }}>{ticketsCount}</span>
                     <button 
                       type="button"
                       onClick={() => setTicketsCount(Math.min(event.pricing.maxTicketsPerUser, ticketsCount + 1))}
                       style={{ background: 'none', border: 'none', color: '#FF6F3F', fontSize: '1.2rem', cursor: 'pointer', display: 'flex' }}
                     >+</button>
                   </div>
                 </div>
                 <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px dashed rgba(255,111,63,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Total Amount</span>
                   <span style={{ color: '#FF6F3F', fontSize: '1.25rem', fontWeight: 800 }}>₹{event.pricing.ticketPrice * ticketsCount}</span>
                 </div>
               </div>
             )}
          </div>
          
          <motion.button 
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{ 
               background: isFormValid ? 'linear-gradient(135deg, #FF6F3F, #dc5022)' : 'var(--border-color)',
               color: isFormValid ? '#ffffff' : '#64748b',
               padding: '1.2rem', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: (isFormValid && !loading) ? 'pointer' : 'not-allowed',
               marginTop: '1rem', fontSize: '1.1rem', fontFamily: "'Outfit', sans-serif",
               transition: 'all 0.3s', boxShadow: isFormValid ? '0 8px 25px rgba(255,111,63,0.3)' : 'none',
               display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
            }}>
            {loading ? <Loader2 size={24} className="spin" /> : (event.pricing?.isPaid ? 'Pay & Register' : 'Confirm Registration')}
          </motion.button>
        </motion.form>
        ) : (
        <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center', padding: '2rem 0' }}>
           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.2 }} style={{ width: '80px', height: '80px', background: 'rgba(52,211,153,0.2)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem auto' }}>
              <CheckCircle size={40} color="#34d399" />
           </motion.div>
           <h3 style={{ color: 'var(--text-primary)', fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>Registration Successful!</h3>
           <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2rem' }}>We've sent the ticket details to your email.</p>
           <motion.button onClick={onBack} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} style={{ background: 'var(--border-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: "'Outfit', sans-serif" }}>
              Back to Events
           </motion.button>
        </motion.div>
        )}
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
