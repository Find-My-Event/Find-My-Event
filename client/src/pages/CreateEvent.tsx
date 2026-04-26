import { useState, useEffect, useCallback, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { darkPageShell } from '../theme/darkShell';
import { setPendingSubmissionId, clearPendingSubmissionId } from '../components/PendingApprovalListener';

type Flow = 'form' | 'pending' | 'approved' | 'rejected';

interface Submission {
  _id: string;
  title: string;
  status: string;
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'var(--border-subtle)',
  border: '1px solid var(--border-color)',
  borderRadius: 14,
  padding: '0.9rem 1rem',
  color: '#f4f4f5',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: "'Outfit', sans-serif",
};

const labelStyle: CSSProperties = {
  display: 'block',
  color: 'var(--text-secondary)',
  fontSize: '0.82rem',
  fontWeight: 600,
  marginBottom: '0.45rem',
};

export default function CreateEvent() {
  const { user } = useAuth();
  const [flow, setFlow] = useState<Flow>('form');
  const [submitting, setSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [mode, setMode] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('/event1.png');

  // Paid Event Fields
  const [isPaid, setIsPaid] = useState(false);
  const [ticketPrice, setTicketPrice] = useState('');
  const [ticketCapacity, setTicketCapacity] = useState('');
  const [maxTicketsPerUser, setMaxTicketsPerUser] = useState('1');
  const [isRefundable, setIsRefundable] = useState(false);
  const [paymentDescription, setPaymentDescription] = useState('');
  const [entryConditions, setEntryConditions] = useState('');

  const pollStatus = useCallback(async () => {
    if (!submissionId) return;
    try {
      const { data } = await api.get<Submission>(`/events/submission/${submissionId}`);
      if (data.status === 'approved') {
        clearPendingSubmissionId();
        setFlow('approved');
      } else if (data.status === 'rejected') {
        clearPendingSubmissionId();
        setFlow('rejected');
      }
    } catch {
      /* ignore */
    }
  }, [submissionId]);

  useEffect(() => {
    if (flow !== 'pending' || !submissionId) return;
    pollStatus();
    const t = setInterval(pollStatus, 4000);
    return () => clearInterval(t);
  }, [flow, submissionId, pollStatus]);

  const handlePost = async () => {
    setError('');
    if (!title.trim() || !description.trim() || !startDate || !endDate || !mode.trim() || !location.trim()) {
      setError('Please fill all required fields.');
      return;
    }

    if (isPaid && (!ticketPrice || !ticketCapacity)) {
      setError('Please set price and capacity for the paid event.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('mode', mode.trim());
      formData.append('location', location.trim());
      formData.append('capacity', capacity ? capacity.toString() : '0');
      
      // Paid Fields
      formData.append('isPaid', isPaid.toString());
      if (isPaid) {
        formData.append('ticketPrice', ticketPrice);
        formData.append('ticketCapacity', ticketCapacity);
        formData.append('maxTicketsPerUser', maxTicketsPerUser);
        formData.append('isRefundable', isRefundable.toString());
        formData.append('paymentDescription', paymentDescription);
        formData.append('entryConditions', entryConditions);
      }

      if (imageFile) {
        formData.append('image', imageFile);
      } else {
        formData.append('imageUrl', imagePreview);
      }

      const { data } = await api.post<{ submission: Submission }>('/events', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSubmissionId(data.submission._id);
      setPendingSubmissionId(data.submission._id);
      setFlow('pending');
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      setError(msg || 'Could not submit. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <div style={darkPageShell}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.4,
        backgroundImage: 'radial-gradient(circle at 100% 0%, rgba(236,72,153,0.12) 0%, transparent 45%)' }} />

      <AnimatePresence mode="wait">
        {flow === 'form' && (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="page-padding" style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2.25rem' }}
            >
              Create Event<span style={{ color: '#3b82f6' }}>.</span>
            </motion.h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.15fr)', gap: '2.5rem', alignItems: 'start' }}
              className="create-event-grid"
            >
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                style={{
                  borderRadius: 20,
                  overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--bg-card)',
                  aspectRatio: '1',
                  maxHeight: 420,
                }}
              >
                <img src={imagePreview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).src = '/event1.png'; }} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {error && (
                  <div style={{ color: '#fca5a5', fontSize: '0.9rem', padding: '0.65rem 1rem', background: 'rgba(239,68,68,0.12)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)' }}>{error}</div>
                )}

                <div>
                  <label style={labelStyle}>Event name <span style={{ color: '#3b82f6' }}>*</span></label>
                  <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="My Event" />
                </div>
                <div>
                  <label style={labelStyle}>Description <span style={{ color: '#3b82f6' }}>*</span></label>
                  <textarea style={{ ...inputStyle, minHeight: 100, resize: 'vertical' }} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What the event is about" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="create-event-dates">
                  <div>
                    <label style={labelStyle}>Start date <span style={{ color: '#3b82f6' }}>*</span></label>
                    <input style={inputStyle} value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Sat, Feb 14 | 05:00 PM" />
                  </div>
                  <div>
                    <label style={labelStyle}>End date <span style={{ color: '#3b82f6' }}>*</span></label>
                    <input style={inputStyle} value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Sun, Feb 15 | 09:00 PM" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Event mode <span style={{ color: '#3b82f6' }}>*</span></label>
                  <input style={inputStyle} value={mode} onChange={(e) => setMode(e.target.value)} placeholder="Online / Offline" />
                </div>
                <div>
                  <label style={labelStyle}>Event location <span style={{ color: '#3b82f6' }}>*</span></label>
                  <input style={inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Jaipur, Rajasthan" />
                </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={labelStyle}>Capacity</label>
                      <input style={inputStyle} type="number" min={0} value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="3000" />
                    </div>
                    <div>
                      <label style={labelStyle}>Poster Image</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }} 
                        style={{ ...inputStyle, cursor: 'pointer', paddingTop: '11px', paddingBottom: '11px' }} 
                      />
                    </div>
                  </div>

                  {/* Paid Event Section */}
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid var(--border-subtle)', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isPaid ? '1.25rem' : '0' }}>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>Paid Event</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Enable ticket pricing and capacity limits</p>
                      </div>
                      <div 
                        onClick={() => setIsPaid(!isPaid)}
                        style={{ 
                          width: 50, height: 26, background: isPaid ? '#3b82f6' : 'var(--border-color)', 
                          borderRadius: 20, position: 'relative', cursor: 'pointer', transition: '0.3s' 
                        }}
                      >
                        <div style={{ 
                          width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', 
                          top: 3, left: isPaid ? 27 : 3, transition: '0.3s' 
                        }} />
                      </div>
                    </div>

                    {isPaid && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={labelStyle}>Ticket Price (INR) <span style={{ color: '#3b82f6' }}>*</span></label>
                            <input style={inputStyle} type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} placeholder="e.g. 499" />
                          </div>
                          <div>
                            <label style={labelStyle}>Ticket Capacity <span style={{ color: '#3b82f6' }}>*</span></label>
                            <input style={inputStyle} type="number" value={ticketCapacity} onChange={(e) => setTicketCapacity(e.target.value)} placeholder="Max seats" />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={labelStyle}>Max Tickets Per User</label>
                            <input style={inputStyle} type="number" value={maxTicketsPerUser} onChange={(e) => setMaxTicketsPerUser(e.target.value)} />
                          </div>
                          <div>
                            <label style={labelStyle}>Refund Policy</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button 
                                type="button"
                                onClick={() => setIsRefundable(true)}
                                style={{ ...inputStyle, background: isRefundable ? '#3b82f6' : 'var(--border-subtle)', border: 'none', cursor: 'pointer', flex: 1, fontSize: '0.8rem' }}
                              >Refundable</button>
                              <button 
                                type="button"
                                onClick={() => setIsRefundable(false)}
                                style={{ ...inputStyle, background: !isRefundable ? '#ef4444' : 'var(--border-subtle)', border: 'none', cursor: 'pointer', flex: 1, fontSize: '0.8rem' }}
                              >Non-Refundable</button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label style={labelStyle}>Payment Description</label>
                          <input style={inputStyle} value={paymentDescription} onChange={(e) => setPaymentDescription(e.target.value)} placeholder="e.g. Includes workshop kit + lunch" />
                        </div>

                        <div>
                          <label style={labelStyle}>Entry Conditions</label>
                          <input style={inputStyle} value={entryConditions} onChange={(e) => setEntryConditions(e.target.value)} placeholder="e.g. College ID required at entry" />
                        </div>
                      </motion.div>
                    )}
                  </div>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={submitting}
                  onClick={handlePost}
                  style={{
                    marginTop: '0.5rem',
                    width: '100%',
                    background: 'var(--text-primary)',
                    color: 'var(--bg-primary)',
                    border: 'none',
                    padding: '1rem 1.5rem',
                    borderRadius: 14,
                    fontWeight: 800,
                    fontSize: '1rem',
                    cursor: submitting ? 'wait' : 'pointer',
                    opacity: submitting ? 0.85 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {submitting ? <><Loader2 size={20} style={{ animation: 'spin 0.8s linear infinite' }} /> Posting…</> : 'Post Event'}
                </motion.button>
              </motion.div>
            </div>
            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
              @media (max-width: 900px) {
                .create-event-grid { grid-template-columns: 1fr !important; }
                .create-event-dates { grid-template-columns: 1fr !important; }
              }
            `}</style>
          </motion.div>
        )}

        {(flow === 'pending' || flow === 'approved' || flow === 'rejected') && (
          <motion.div
            key={flow}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1.5rem',
              background: 'linear-gradient(160deg, rgba(9,9,11,0.97) 0%, rgba(15,10,25,0.98) 50%, rgba(9,9,11,0.97) 100%)',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'radial-gradient(circle at 100% 0%, rgba(168,85,247,0.2) 0%, transparent 42%), radial-gradient(circle at 0% 100%, rgba(59,130,246,0.08) 0%, transparent 40%)' }} />

            {flow === 'pending' && (
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', damping: 24, stiffness: 280 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 400,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 20,
                  padding: '1.75rem 1.5rem 1.5rem',
                  backdropFilter: 'blur(16px)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.55)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <button
                    type="button"
                    onClick={() => { setFlow('form'); setSubmissionId(null); }}
                    style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)', background: 'var(--border-subtle)', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <img src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'} alt="" style={{ width: 44, height: 44, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', objectFit: 'cover' }} />
                </div>
                <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  Hey {firstName}<span style={{ color: '#3b82f6' }}>.</span>
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '1.75rem' }}>
                  Your event is with our team for a quick review. We will notify you as soon as it is approved and live on Discover.
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { window.location.hash = '#discover'; }}
                  style={{ width: '100%', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '0.95rem', borderRadius: 14, fontWeight: 800, cursor: 'pointer' }}
                >
                  Got it
                </motion.button>
              </motion.div>
            )}

            {flow === 'approved' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: 420,
                  background: 'linear-gradient(145deg, rgba(6,78,59,0.35) 0%, rgba(24,24,27,0.92) 45%, rgba(24,24,27,0.95) 100%)',
                  border: '1px solid rgba(52,211,153,0.35)',
                  borderRadius: 24,
                  padding: '2rem 1.75rem 1.75rem',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 0 1px rgba(16,185,129,0.15), 0 32px 90px rgba(0,0,0,0.5), 0 0 80px rgba(16,185,129,0.12)',
                  textAlign: 'center',
                }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 12 }}
                  style={{
                    width: 72, height: 72, margin: '0 auto 1.25rem', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #34d399, #10b981)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', boxShadow: '0 12px 40px rgba(16,185,129,0.45)',
                  }}
                >
                  ✓
                </motion.div>
                <h2 style={{ color: '#ecfdf5', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                  You are live
                </h2>
                <p style={{ color: '#a7f3d0', fontSize: '0.95rem', lineHeight: 1.55, marginBottom: '1.75rem', opacity: 0.95 }}>
                  {title ? `“${title}”` : 'Your event'} is approved. Students can now find it on Discover and Events.
                </p>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { window.location.hash = '#discover'; }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #34d399, #059669)',
                    color: '#052e16',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  View Discover
                </motion.button>
              </motion.div>
            )}

            {flow === 'rejected' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  position: 'relative', maxWidth: 400, width: '100%',
                  background: 'var(--bg-card)', border: '1px solid rgba(248,113,113,0.25)', borderRadius: 20, padding: '2rem 1.5rem', textAlign: 'center',
                }}
              >
                <p style={{ color: '#fecaca', fontWeight: 700, marginBottom: '0.5rem' }}>Not published</p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>This submission was not approved. You can create a new event anytime.</p>
                <button
                  type="button"
                  onClick={() => { setFlow('form'); setSubmissionId(null); }}
                  style={{ width: '100%', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', padding: '0.9rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
                >
                  Back to form
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
