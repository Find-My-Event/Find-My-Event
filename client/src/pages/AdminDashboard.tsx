import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Bell, Plus, Trash2, Edit2, 
  X, Loader2, TrendingUp, Shield, Check,
  Image as ImageIcon, Eye, Info, AlertTriangle, CheckCircle 
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'overview' | 'events' | 'pending' | 'users' | 'notifications';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, activeNotifications: 0 });

  // Event Form State
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '', description: '', organizer: '', date: '', venue: '', 
    category: 'Tech', price: 'Free', seats: 'Limited', tag: ''
  });
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration View State
  const [selectedEventForReg, setSelectedEventForReg] = useState<any>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loadingReg, setLoadingReg] = useState(false);

  // Notification Form State
  const [notifFormData, setNotifFormData] = useState({ title: '', message: '', type: 'info' });

  // Pending Approvals State
  const [pendingList, setPendingList] = useState<any[]>([]);
  const [loadingPending, setLoadingPending] = useState(false);
  const [pendingErr, setPendingErr] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'pending') {
      loadPending();
    }
  }, [activeTab]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, notifsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/events'),
        api.get('/notifications')
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setNotifications(notifsRes.data);
      setStats({
        totalUsers: usersRes.data.length,
        totalEvents: eventsRes.data.length,
        activeNotifications: notifsRes.data.length
      });
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadPending = async () => {
    setLoadingPending(true);
    setPendingErr('');
    try {
      const { data } = await api.get('/events/admin/pending');
      setPendingList(data);
    } catch (e: any) {
      const status = e?.response?.status || 0;
      setPendingErr(status === 403 ? 'Admin access only. Set ADMIN_EMAIL in server .env to your account email.' : 'Could not load queue');
      setPendingList([]);
    } finally {
      setLoadingPending(false);
    }
  };

  const approvePending = async (id: string) => {
    setActing(id);
    try {
      await api.patch(`/events/${id}/approve`);
      setPendingList((prev) => prev.filter((x) => x._id !== id));
      fetchInitialData();
    } catch {
      setPendingErr('Approve failed');
    } finally {
      setActing(null);
    }
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(eventFormData).forEach(([key, value]) => formData.append(key, value));
    if (eventImage) formData.append('image', eventImage);

    try {
      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, formData);
      } else {
        await api.post('/admin/events', formData);
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
      setEventFormData({ title: '', description: '', organizer: '', date: '', venue: '', category: 'Tech', price: 'Free', seats: 'Limited', tag: '' });
      setEventImage(null);
      fetchInitialData();
    } catch (err) {
      console.error('Event submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/admin/events/${id}`);
      fetchInitialData();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const viewRegistrations = async (event: any) => {
    setSelectedEventForReg(event);
    setLoadingReg(true);
    try {
      const res = await api.get(`/admin/events/${event._id}/registrations`);
      setRegistrations(res.data);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    } finally {
      setLoadingReg(false);
    }
  };

  const handleSendNotif = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/admin/notifications', notifFormData);
      setNotifFormData({ title: '', message: '', type: 'info' });
      fetchInitialData();
    } catch (err) {
      console.error('Notification failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#fff' }}>
        <Loader2 className="spin" size={48} color="#ff6f3f" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', borderRight: '1px solid rgba(255,255,255,0.05)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', background: '#ff6f3f', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={24} color="#fff" />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>Admin Panel</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'events', label: 'Manage Events', icon: Calendar },
            { id: 'pending', label: 'Pending Approvals', icon: Shield },
            { id: 'users', label: 'Manage Users', icon: Users },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px',
                background: activeTab === item.id ? 'rgba(255,111,63,0.1)' : 'transparent',
                color: activeTab === item.id ? '#ff6f3f' : 'rgba(255,255,255,0.5)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, textAlign: 'left'
              }}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '3rem', overflowY: 'auto', maxHeight: '100vh' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{activeTab === 'pending' ? 'Pending Approvals' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p style={{ opacity: 0.5 }}>Control and manage everything from here.</p>
          </div>
          {activeTab === 'events' && (
            <button
              onClick={() => { setEditingEvent(null); setEventFormData({ title: '', description: '', organizer: '', date: '', venue: '', category: 'Tech', price: 'Free', seats: 'Limited', tag: '' }); setIsEventModalOpen(true); }}
              style={{ background: '#ff6f3f', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <Plus size={20} /> Create Event
            </button>
          )}
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6' },
              { label: 'Active Events', value: stats.totalEvents, icon: Calendar, color: '#ff6f3f' },
              { label: 'Global Alerts', value: stats.activeNotifications, icon: Bell, color: '#facc15' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
              >
                <div style={{ background: `${stat.color}15`, padding: '1rem', borderRadius: '16px', color: stat.color }}>
                  <stat.icon size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stat.value}</div>
                  <div style={{ opacity: 0.5, fontSize: '0.9rem' }}>{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {events.map((event) => (
              <motion.div
                key={event._id}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '20px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}
              >
                <img src={event.image} alt="" style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{event.title}</h3>
                  <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>{event.venue} • {event.date}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button onClick={() => viewRegistrations(event)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><Eye size={18} /></button>
                  <button onClick={() => { setEditingEvent(event); setEventFormData({ ...event }); setIsEventModalOpen(true); }} style={{ background: 'rgba(59,130,246,0.1)', border: 'none', color: '#3b82f6', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><Edit2 size={18} /></button>
                  <button onClick={() => deleteEvent(event._id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingErr && <p style={{ color: '#f87171', marginBottom: '1rem' }}>{pendingErr}</p>}
            {loadingPending ? (
               <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="spin" /></div>
            ) : pendingList.length === 0 ? (
               <p style={{ color: '#52525b', padding: '3rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>No pending events</p>
            ) : (
              pendingList.map((row, i) => (
                <motion.div
                  key={row._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.35rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <h3 style={{ color: '#fafafa', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{row.title}</h3>
                      <p style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{row.description}</p>
                      <p style={{ color: '#71717a', fontSize: '0.8rem' }}>
                        {row.mode} · {row.location} · {row.startDate} → {row.endDate}
                        {row.organizer?.name && ` · by ${row.organizer.name}`}
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={acting === row._id}
                      onClick={() => approvePending(row._id)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: '#22c55e', color: '#052e16', border: 'none', padding: '0.65rem 1.25rem',
                        borderRadius: 12, fontWeight: 800, cursor: acting === row._id ? 'wait' : 'pointer', alignSelf: 'flex-start',
                      }}
                    >
                      <Check size={18} /> Approve
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', background: 'rgba(255,255,255,0.03)' }}>
                  <th style={{ padding: '1.5rem' }}>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} alt="" style={{ width: '36px', height: '36px', borderRadius: '50%' }} />
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{u.email}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '99px', background: u.role === 'admin' ? '#ff6f3f33' : 'rgba(255,255,255,0.05)', color: u.role === 'admin' ? '#ff6f3f' : 'inherit' }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.75rem', color: u.isVerified ? '#34d399' : '#94a3b8' }}>
                         {u.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td style={{ opacity: 0.5, fontSize: '0.9rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 450px) 1fr', gap: '3rem' }}>
            <form onSubmit={handleSendNotif} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Send Global Notification</h3>
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Title</label>
                  <input required placeholder="Notification Title" value={notifFormData.title} onChange={e => setNotifFormData({...notifFormData, title: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff' }} />
               </div>
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Message</label>
                  <textarea required placeholder="Write your message here..." value={notifFormData.message} onChange={e => setNotifFormData({...notifFormData, message: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff', minHeight: '100px' }} />
               </div>
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Type</label>
                  <select value={notifFormData.type} onChange={e => setNotifFormData({...notifFormData, type: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '12px', color: '#fff' }}>
                     <option value="info">Info (Blue)</option>
                     <option value="warning">Warning (Yellow)</option>
                     <option value="success">Success (Green)</option>
                     <option value="error">Error (Red)</option>
                  </select>
               </div>
               <button type="submit" disabled={isSubmitting} style={{ background: '#ff6f3f', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  {isSubmitting ? <Loader2 className="spin" size={20} /> : 'Post Notification'}
               </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Active Alerts</h3>
               {notifications.map(n => (
                 <div key={n._id} style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem' }}>
                       {n.type === 'info' && <Info size={16} color="#3b82f6" />}
                       {n.type === 'warning' && <AlertTriangle size={16} color="#facc15" />}
                       {n.type === 'success' && <CheckCircle size={16} color="#34d399" />}
                       <span style={{ fontWeight: 700 }}>{n.title}</span>
                    </div>
                    <p style={{ opacity: 0.5, fontSize: '0.9rem' }}>{n.message}</p>
                 </div>
               ))}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Event Modal */}
      <AnimatePresence>
        {isEventModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#18181b', width: '100%', maxWidth: '800px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
                <button onClick={() => setIsEventModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={32} /></button>
              </div>

              <form onSubmit={handleEventSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Event Title</label>
                  <input required placeholder="E.g. National Hackathon" value={eventFormData.title} onChange={e => setEventFormData({...eventFormData, title: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: '#fff' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Description</label>
                  <textarea required placeholder="Detail about the event..." value={eventFormData.description} onChange={e => setEventFormData({...eventFormData, description: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: '#fff', minHeight: '120px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Organizer</label>
                  <input required placeholder="Club/College Name" value={eventFormData.organizer} onChange={e => setEventFormData({...eventFormData, organizer: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Category</label>
                  <select value={eventFormData.category} onChange={e => setEventFormData({...eventFormData, category: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: '#fff' }}>
                    {['Tech', 'Music', 'Gaming', 'Dance', 'Culture', 'Academics', 'Workshops'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Date & Time String</label>
                  <input required placeholder="E.g. Oct 12, 10:00 AM" value={eventFormData.date} onChange={e => setEventFormData({...eventFormData, date: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: '#fff' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Venue</label>
                  <input required placeholder="Location" value={eventFormData.venue} onChange={e => setEventFormData({...eventFormData, venue: e.target.value})} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: '#fff' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Event Poster (Cloudinary)</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                     <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', background: 'rgba(255,255,255,0.05)', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', cursor: 'pointer' }}>
                        <ImageIcon size={20} />
                        <span>{eventImage ? eventImage.name : 'Click to upload image'}</span>
                        <input type="file" hidden accept="image/*" onChange={e => setEventImage(e.target.files ? e.target.files[0] : null)} />
                     </label>
                     {editingEvent?.image && !eventImage && <img src={editingEvent.image} style={{ width: '54px', height: '54px', borderRadius: '8px' }} />}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <button type="submit" disabled={isSubmitting} style={{ width: '100%', background: '#ff6f3f', color: '#fff', border: 'none', padding: '18px', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
                    {isSubmitting ? <Loader2 className="spin" size={24} /> : (editingEvent ? 'Update Event' : 'Create Event')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Registrations Modal */}
      <AnimatePresence>
        {selectedEventForReg && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: '#18181b', width: '100%', maxWidth: '600px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                   <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Registered Users</h2>
                   <p style={{ opacity: 0.5 }}>For {selectedEventForReg.title}</p>
                </div>
                <button onClick={() => setSelectedEventForReg(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={32} /></button>
              </div>

              {loadingReg ? <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="spin" /></div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '50vh', overflowY: 'auto' }}>
                  {registrations.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5 }}>No one has registered yet.</p> : registrations.map(reg => (
                    <div key={reg._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px' }}>
                       <img src={reg.avatar || `https://ui-avatars.com/api/?name=${reg.name}`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                       <div>
                          <div style={{ fontWeight: 600 }}>{reg.name}</div>
                          <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{reg.email}</div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
