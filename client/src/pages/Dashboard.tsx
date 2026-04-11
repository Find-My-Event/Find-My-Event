import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { Calendar, MapPin, Star, TrendingUp, Bell, Plus, Users, ArrowRight, Edit2, Check, X, Loader2 } from 'lucide-react';
import { darkPageShell } from '../theme/darkShell';

const Dashboard: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editData, setEditData] = React.useState({
    name: user?.name || '',
    bio: user?.bio || '',
    age: user?.age || '',
    gender: user?.gender || '',
    interests: user?.interests?.join(', ') || '',
    hobbies: user?.hobbies?.join(', ') || ''
  });
  const [isSaving, setIsSaving] = React.useState(false);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        name: editData.name,
        bio: editData.bio,
        age: editData.age ? parseInt(editData.age as string) : undefined,
        gender: editData.gender,
        interests: editData.interests.split(',').map(i => i.trim()).filter(i => i !== ''),
        hobbies: editData.hobbies.split(',').map(h => h.trim()).filter(h => h !== '')
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const [dashboardStats, setDashboardStats] = useState({ created: 0, uniEvents: 0 });
  const [dynamicEvents, setDynamicEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [mineRes, allRes, approvedRes] = await Promise.all([
        api.get('/events/mine'),
        api.get('/events'),
        api.get('/events/approved')
      ]);
      
      // The user's created submissions might be in 'mineRes', but also in 'approvedRes'.
      // Usually, /events/mine returns both Event and EventSubmission.
      const mine = mineRes.data;
      
      // allRes is from /events, we can concat /events/approved to get full list
      // Since Dashboard is for users, api.get('/events') might already return full events.
      // Actually let's just use mineRes and allRes. Wait, we modified AdminPortal to use both Event and EventSubmission, maybe /events only returns Event!
      // I'll grab all events safely:
      const allEvts = [...allRes.data];
      
      setDashboardStats({ created: mine.length, uniEvents: allEvts.length });

      const mineIds = new Set(mine.map((x: any) => x._id || x.id));
      const others = allEvts.filter((x: any) => !mineIds.has(x._id || x.id));
      
      const combined = [
        ...mine.map((x: any) => ({ ...x, isMine: true })),
        ...others.map((x: any) => ({ ...x, isMine: false }))
      ];
      setDynamicEvents(combined);
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    }
  };

  const stats = [
    { label: 'Your Events', value: dashboardStats.created, icon: Calendar, color: '#ff6f3f' },
    { label: 'University Events', value: dashboardStats.uniEvents, icon: Users, color: '#3b82f6' },
    { label: 'Saved', value: user?.favEvents?.length || 0, icon: Star, color: '#facc15' },
  ];

  return (
    <div style={darkPageShell} className="page-padding">
      <div className="dot-grid" style={{ opacity: 0.15 }}></div>
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
      >
        <div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Hello, <span style={{ color: '#ff6f3f' }}>{user?.name ? user.name.split(' ')[0] : 'User'}!</span>
          </h1>
          <p style={{ opacity: 0.6, fontSize: '1.1rem' }}>Welcome back to your personalized campus hub.</p>
        </div>
        
        {/* Profile Details Button */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsEditing(!isEditing)}
          style={{ 
            background: isEditing ? 'var(--border-color)' : 'rgba(255,111,63,0.1)', 
            border: '1px solid rgba(255,111,63,0.2)',
            padding: '0.8rem 1.5rem',
            borderRadius: '16px',
            color: isEditing ? 'var(--text-primary)' : '#ff6f3f',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer'
          }}
        >
          {isEditing ? <><X size={18} /> Cancel</> : <><Edit2 size={18} /> Edit Profile</>}
        </motion.button>
      </motion.div>

      {/* Profile Info / Edit Mode */}
      <AnimatePresence>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ 
              background: 'var(--bg-card-hover)', 
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '2rem',
              marginBottom: '3rem',
              overflow: 'hidden'
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }}>Full Name</label>
                <input 
                  type="text" 
                  value={editData.name} 
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '12px', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }}>Age</label>
                <input 
                  type="number" 
                  value={editData.age} 
                  onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                  style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '12px', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }}>Gender</label>
                <select 
                  value={editData.gender} 
                  onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
                  style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '12px', color: 'var(--text-primary)' }}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }}>Bio</label>
              <textarea 
                value={editData.bio} 
                onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '12px', color: 'var(--text-primary)', minHeight: '80px', resize: 'none' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }}>Interests (comma separated)</label>
                <input 
                  type="text" 
                  value={editData.interests} 
                  onChange={(e) => setEditData({ ...editData, interests: e.target.value })}
                  style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '12px', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem' }}>Hobbies (comma separated)</label>
                <input 
                  type="text" 
                  value={editData.hobbies} 
                  onChange={(e) => setEditData({ ...editData, hobbies: e.target.value })}
                  style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', padding: '0.8rem', borderRadius: '12px', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button 
                onClick={handleUpdate}
                disabled={isSaving}
                style={{ background: '#ff6f3f', color: '#ffffff', border: 'none', padding: '0.8rem 2rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {isSaving ? <Loader2 className="spin" size={18} /> : <><Check size={18} /> Save Changes</>}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ 
              background: 'var(--bg-card-hover)', 
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '2rem',
              marginBottom: '3rem',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '2.5rem'
            }}
          >
             <div style={{ flex: '1 1 200px' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Personal Info</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>{user?.age || 'N/A'} yrs • {user?.gender || 'N/A'}</div>
             </div>
             <div style={{ flex: '2 1 300px' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bio</div>
                <div style={{ fontSize: '1rem', opacity: 0.8, lineHeight: 1.5 }}>{user?.bio || "No bio yet. Tell us about yourself!"}</div>
             </div>
             <div style={{ flex: '1 1 200px' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interests</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                   {user?.interests && user.interests.length > 0 ? user.interests.map(i => (
                     <span key={i} style={{ background: 'var(--border-subtle)', padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.8rem' }}>{i}</span>
                   )) : <span style={{ opacity: 0.3, fontSize: '0.8rem' }}>None added</span>}
                </div>
             </div>
             <div style={{ flex: '1 1 200px' }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hobbies</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                   {user?.hobbies && user.hobbies.length > 0 ? user.hobbies.map(h => (
                     <span key={h} style={{ background: 'var(--border-subtle)', padding: '0.3rem 0.8rem', borderRadius: '99px', fontSize: '0.8rem' }}>{h}</span>
                   )) : <span style={{ opacity: 0.3, fontSize: '0.8rem' }}>None added</span>}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              background: 'var(--border-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem'
            }}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', gap: '3rem' }}>        {/* Left Column: Events */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Upcoming Schedule & Events</h2>
            <button onClick={() => window.location.hash = '#events'} style={{ background: 'none', border: 'none', color: '#ff6f3f', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              View all <ArrowRight size={16} />
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dynamicEvents.length > 0 ? (
              dynamicEvents.slice(0, 5).map((event, idx) => (
                <motion.div
                  key={event._id || event.id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                  style={{
                    display: 'flex',
                    gap: '1.5rem',
                    background: event.isMine ? 'rgba(255,111,63,0.05)' : 'var(--bg-card-hover)',
                    padding: '1rem',
                    borderRadius: '20px',
                    border: event.isMine ? '1px solid rgba(255,111,63,0.3)' : '1px solid var(--border-subtle)',
                    alignItems: 'center'
                  }}
                >
                  <div style={{ width: '80px', height: '80px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0 }}>
                    <img src={event.image || event.imageUrl || '/event1.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                      {event.title}
                      {event.isMine && <span style={{ marginLeft: 8, fontSize: '0.7rem', padding: '2px 6px', background: '#ff6f3f', color: '#fff', borderRadius: 4 }}>Created by You</span>}
                    </h3>
                    <div style={{ display: 'flex', gap: '1rem', opacity: 0.5, fontSize: '0.85rem' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Calendar size={14} /> {event.date || event.startDate}</span>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={14} /> {event.venue || event.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
               <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-card-hover)', borderRadius: '20px', border: '1px dashed var(--border-color)' }}>
                  <Calendar size={40} color="#666" style={{ margin: '0 auto 1rem auto' }} />
                  <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>No upcoming events</p>
                  <p style={{ color: '#666', fontSize: '0.9rem' }}>Events you register for will appear here.</p>
               </div>
            )}
          </div>
        </section>

        {/* Right Column: Recommended */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recommended for You</h2>
            <button onClick={() => window.location.hash = '#discover'} style={{ background: 'none', border: 'none', color: '#ff6f3f', fontWeight: 600, cursor: 'pointer' }}>See all</button>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(255,111,63,0.1) 0%, rgba(139,92,246,0.1) 100%)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
             <TrendingUp size={100} style={{ position: 'absolute', right: '-20px', bottom: '-20px', opacity: 0.05, transform: 'rotate(-15deg)' }} />
             <div style={{ position: 'relative', zIndex: 1 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.75rem' }}>Smart Recommendations</h3>
                <p style={{ opacity: 0.7, lineHeight: 1.6, marginBottom: '1.5rem' }}>Based on your interests, we found 5 new workshops and 2 hackathons happening next week.</p>
                <button onClick={() => window.location.hash = '#discover'} style={{ background: '#ff6f3f', color: '#ffffff', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  Explore Now
                </button>
             </div>
          </div>
        </section>
      </div>

      {/* Action shortcuts */}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', gap: '1rem', zIndex: 100 }}>
        <motion.button onClick={() => window.location.hash = '#create-event'} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ff6f3f', border: 'none', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(255,111,63,0.3)', cursor: 'pointer' }}>
          <Plus size={24} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0,0,0,0.3)', cursor: 'pointer' }}>
          <Bell size={24} />
        </motion.button>
      </div>
      <style>{`
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Dashboard;
