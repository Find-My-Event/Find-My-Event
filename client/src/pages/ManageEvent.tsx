import { useState, useEffect, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, Edit2, Users, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { api } from '../lib/api';
import { darkPageShell } from '../theme/darkShell';

interface Participant {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  age?: number;
  gender?: string;
}

interface EventData {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: string;
  location: string;
  capacity?: number;
  imageUrl?: string;
  status: string;
  withdrawalStatus: 'none' | 'pending' | 'approved';
}

const inputStyle: CSSProperties = {
  width: '100%',
  background: 'var(--border-subtle)',
  border: '1px solid var(--border-color)',
  borderRadius: 14,
  padding: '0.9rem 1rem',
  color: 'var(--text-primary)',
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

type Tab = 'edit' | 'registrations' | 'actions';

export default function ManageEvent() {
  const [activeTab, setActiveTab] = useState<Tab>('edit');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eventId, setEventId] = useState<string | null>(null);

  // Form State
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [registrations, setRegistrations] = useState<Participant[]>([]);
  const [loadingReg, setLoadingReg] = useState(false);

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const id = hashParams.get('id');
    
    if (id) {
      setEventId(id);
      fetchEvent(id);
    } else {
      setError('No event ID provided');
      setLoading(false);
    }
  }, []);

  const fetchEvent = async (id: string) => {
    try {
      const { data } = await api.get<EventData>(`/events/submission/${id}`);
      setEventData(data);
    } catch (e: any) {
      setError('Could not fetch event details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    if (!eventId) return;
    setLoadingReg(true);
    try {
      const { data } = await api.get<Participant[]>(`/events/submission/${eventId}/registrations`);
      setRegistrations(data);
    } catch (e) {
      console.error('Failed to fetch registrations');
    } finally {
      setLoadingReg(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'registrations' && registrations.length === 0) {
      fetchRegistrations();
    }
  }, [activeTab]);

  const handleUpdate = async () => {
    if (!eventData || !eventId) return;
    setError('');
    setSuccess('');
    
    setSubmitting(true);
    try {
      await api.put(`/events/submission/${eventId}`, eventData);
      setSuccess('Event updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!eventId || !window.confirm('Are you sure you want to withdraw this event? This requires admin approval.')) return;
    setSubmitting(true);
    try {
      await api.patch(`/events/submission/${eventId}/withdraw`);
      setSuccess('Withdrawal request sent to admin! Waiting for approval.');
      setEventData(prev => prev ? { ...prev, withdrawalStatus: 'pending' } : null);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ ...darkPageShell, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#ff4d00' }} />
      </div>
    );
  }

  if (!eventData) {
    return <div style={{ ...darkPageShell, color: 'var(--text-primary)', textAlign: 'center', paddingTop: '100px' }}>Event not found.</div>;
  }

  return (
    <div style={{ ...darkPageShell, minHeight: '100vh' }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, opacity: 0.15,
        backgroundImage: 'radial-gradient(circle at top right, rgba(255,77,0,0.1) 0%, transparent 40%)' }} />

      <div className="page-padding" style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}>
        <button
          onClick={() => { window.location.hash = '#your-events'; }}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}
        >
          <ArrowLeft size={16} /> Back to Your Events
        </button>

        <header style={{ marginBottom: '2.5rem' }}>
           <h1 style={{ color: 'var(--text-primary)', fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
             Manage Event<span style={{ color: '#ff4d00' }}>.</span>
           </h1>
           <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{eventData.title}</p>
        </header>

        {eventData.withdrawalStatus === 'pending' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{
            background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', padding: '1rem',
            borderRadius: '16px', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'
          }}>
            <AlertTriangle size={20} />
            <p style={{ fontWeight: 600 }}>Withdrawal request is pending admin approval. Most actions are restricted.</p>
          </motion.div>
        )}

        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
            background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '1rem',
            borderRadius: '16px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'
          }}>
            <CheckCircle size={20} />
            <p style={{ fontWeight: 600 }}>{success}</p>
          </motion.div>
        )}

        {error && (
          <div style={{ color: '#fca5a5', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: 16, border: '1px solid rgba(239,68,68,0.2)', marginBottom: '2rem' }}>{error}</div>
        )}

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
          {[
            { id: 'edit', label: 'Edit Details', icon: Edit2 },
            { id: 'registrations', label: `Registrations (${eventData.capacity || 'All'})`, icon: Users },
            { id: 'actions', label: 'Advanced Actions', icon: Trash2 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              style={{
                background: 'none', border: 'none', color: activeTab === tab.id ? '#ff4d00' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0',
                fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                borderBottom: activeTab === tab.id ? '2px solid #ff4d00' : '2px solid transparent',
                marginBottom: '-1.1rem'
              }}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'edit' && (
            <motion.div key="edit" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)', gap: '2.5rem' }} className="manage-grid">
              <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', height: 400 }}>
                <img src={eventData.imageUrl || '/event1.png'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div>
                  <label style={labelStyle}>Event Title</label>
                  <input style={inputStyle} value={eventData.title} onChange={e => setEventData({ ...eventData, title: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={eventData.description} onChange={e => setEventData({ ...eventData, description: e.target.value })} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Start Date</label>
                    <input style={inputStyle} value={eventData.startDate} onChange={e => setEventData({ ...eventData, startDate: e.target.value })} />
                  </div>
                  <div>
                    <label style={labelStyle}>End Date</label>
                    <input style={inputStyle} value={eventData.endDate} onChange={e => setEventData({ ...eventData, endDate: e.target.value })} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                   <div>
                    <label style={labelStyle}>Location</label>
                    <input style={inputStyle} value={eventData.location} onChange={e => setEventData({ ...eventData, location: e.target.value })} />
                   </div>
                   <div>
                    <label style={labelStyle}>Capacity</label>
                    <input style={inputStyle} type="number" value={eventData.capacity} onChange={e => setEventData({ ...eventData, capacity: parseInt(e.target.value) })} />
                   </div>
                </div>
                <button
                  onClick={handleUpdate}
                  disabled={submitting || eventData.withdrawalStatus === 'pending'}
                  style={{
                    background: '#ff4d00', color: '#ffffff', border: 'none', padding: '1rem', borderRadius: 14,
                    fontWeight: 800, cursor: 'pointer', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                  }}
                >
                  {submitting ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Update Details'}
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'registrations' && (
            <motion.div key="reg" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
               {loadingReg ? <div style={{ textAlign: 'center', padding: '3rem' }}><Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#ff4d00' }} /></div> : (
                 <div style={{ display: 'grid', gap: '1rem' }}>
                    {registrations.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5, border: '1px dashed var(--border-color)', borderRadius: 20 }}>No registrations yet.</div>
                    ) : registrations.map(reg => (
                      <div key={reg._id} style={{
                        background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)', borderRadius: '16px',
                        padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.5rem'
                      }}>
                         <img src={reg.avatar || `https://ui-avatars.com/api/?name=${reg.name}&background=random&color=fff`} style={{ width: 50, height: 50, borderRadius: '50%' }} />
                         <div style={{ flex: 1 }}>
                            <div style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.1rem' }}>{reg.name}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{reg.email}</div>
                         </div>
                         <div style={{ textAlign: 'right', display: 'flex', gap: '2rem' }}>
                            <div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Age</div>
                               <div style={{ color: 'var(--text-secondary)' }}>{reg.age || 'N/A'}</div>
                            </div>
                            <div>
                               <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gender</div>
                               <div style={{ color: 'var(--text-secondary)' }}>{reg.gender || 'N/A'}</div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </motion.div>
          )}

          {activeTab === 'actions' && (
             <motion.div key="actions" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}>
                <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '24px', padding: '2.5rem' }}>
                   <h3 style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Danger Zone</h3>
                   <p style={{ color: '#f87171', marginBottom: '2rem', opacity: 0.8 }}>Withdrawing an event will remove it from discovery and require admin review. This action cannot be easily undone.</p>
                   
                   <button
                    onClick={handleWithdraw}
                    disabled={submitting || eventData.withdrawalStatus !== 'none'}
                    style={{
                      background: eventData.withdrawalStatus === 'none' ? '#ef4444' : 'rgba(239,68,68,0.2)',
                      color: '#ffffff', border: 'none', padding: '1rem 2rem', borderRadius: 14,
                      fontWeight: 800, cursor: (submitting || eventData.withdrawalStatus !== 'none') ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '10px'
                    }}
                   >
                     {submitting ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : <><Trash2 size={20} /> Withdraw Event Request</>}
                   </button>
                   {eventData.withdrawalStatus === 'pending' && <p style={{ color: '#fbbf24', marginTop: '1rem', fontSize: '0.9rem' }}>A withdrawal request for this event is already pending.</p>}
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 800px) {
          .manage-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
