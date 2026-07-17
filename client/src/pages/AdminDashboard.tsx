import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Calendar, Bell, Plus, Trash2, Edit2, 
  X, Loader2, TrendingUp, Shield, Check,
  Image as ImageIcon, Eye, Info, AlertTriangle, CheckCircle,
  ChevronLeft, ChevronRight, LayoutGrid, Scan, Menu, LogOut
} from 'lucide-react';
import api from '../api/axios';
import TicketScanner from '../components/TicketScanner';
import { useAuth } from '../contexts/AuthContext';

const toast = {
  success: (msg: string) => alert(msg),
  error: (msg: string) => alert(msg)
};

type Tab = 'overview' | 'events' | 'clubs' | 'pending' | 'withdrawals' | 'users' | 'notifications' | 'scan';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 900);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 900);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [activeTab, setActiveTab] = useState<Tab>(() => {
    return (localStorage.getItem('adminActiveTab') as Tab) || 'overview';
  });

  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const [loading, setLoading] = useState(true);
  
  // New UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeEventTab, setActiveEventTab] = useState<'admin' | 'clubs'>(() => {
    return (localStorage.getItem('adminActiveEventTab') as 'admin' | 'clubs') || 'clubs';
  });

  useEffect(() => {
    localStorage.setItem('adminActiveEventTab', activeEventTab);
  }, [activeEventTab]);

  const [activeUserTab, setActiveUserTab] = useState<'users' | 'clubs' | 'initiatives'>('users');
  
  // Data States
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, totalClubs: 0, activeNotifications: 0 });
  const [magicLink, setMagicLink] = useState('');
  const [generatingLink, setGeneratingLink] = useState(false);
  const [activeLinks, setActiveLinks] = useState<any[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Club Form State
  const [isClubModalOpen, setIsClubModalOpen] = useState(false);
  const [editingClub, setEditingClub] = useState<any>(null);
  const [clubFormData, setClubFormData] = useState({
    name: '', type: 'Club', description: '', aboutUs: '', tags: '', foundedOn: '', venue: '', eventsConducted: '', detailedDescription: '', organizerEmail: '', organizerPassword: ''
  });
  const [clubLeadership, setClubLeadership] = useState<any[]>([]);
  const [clubImage, setClubImage] = useState<File | null>(null);

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

  // Withdrawal Approvals State
  const [withdrawalList, setWithdrawalList] = useState<any[]>([]);
  const [loadingWith, setLoadingWith] = useState(false);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    let interval: any;
    if (selectedEventForReg) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/admin/events/${selectedEventForReg._id}/registrations`);
          setRegistrations(res.data);
        } catch (e) {
          // ignore
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedEventForReg]);

  useEffect(() => {
    if (activeTab === 'pending') {
      loadPending();
    } else if (activeTab === 'withdrawals') {
      loadWithdrawals();
    } else if (activeTab === 'scan') {
      loadLinks();
    }
  }, [activeTab]);

  const loadLinks = async () => {
    try {
      const res = await api.get('/events/scanner-links');
      setActiveLinks(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, approvedRes, notifsRes, clubsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/events'),
        api.get('/events/approved'),
        api.get('/notifications'),
        api.get('/admin/clubs')
      ]);
      setUsers(usersRes.data);
      
      const mappedApproved = approvedRes.data.map((s: any) => ({
        _id: s._id,
        id: s._id,
        title: s.title,
        description: s.description,
        date: s.startDate,
        venue: s.location,
        image: s.imageUrl || '/event1.png',
        organizer: s.organizer?.name || 'Unknown',
        organizerId: s.organizer?._id || s.organizer,
        category: s.category || 'Workshops',
        price: 'Free',
        seats: s.capacity || 'Limited',
        tag: '',
        isUserSubmission: true
      }));

      setEvents([...mappedApproved, ...eventsRes.data]);
      setNotifications(notifsRes.data);
      setClubs(clubsRes.data || []);
      
      setStats({
        totalUsers: usersRes.data.length,
        totalEvents: eventsRes.data.length + mappedApproved.length,
        totalClubs: clubsRes.data?.length || 0,
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

  const loadWithdrawals = async () => {
    setLoadingWith(true);
    try {
      const { data } = await api.get('/events/admin/withdrawals');
      setWithdrawalList(data);
    } catch (e) {
      console.error('Failed to load withdrawals');
    } finally {
      setLoadingWith(false);
    }
  };

  const handleWithdrawalAction = async (id: string, action: 'approve' | 'reject') => {
    setActing(id);
    try {
      await api.patch(`/events/admin/withdrawals/${id}/${action}`);
      setWithdrawalList(prev => prev.filter(x => x._id !== id));
      if (action === 'approve') fetchInitialData(); 
    } catch (err) {
      console.error('Withdrawal action failed');
    } finally {
      setActing(null);
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

  const handleClubSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(clubFormData).forEach(([key, value]) => formData.append(key, value));
    if (clubImage) formData.append('logo', clubImage);

    const leadershipToSend = clubLeadership.map(l => ({ name: l.name, position: l.position, photoUrl: l.photoUrl || '' }));
    formData.append('leadership', JSON.stringify(leadershipToSend));
    
    clubLeadership.forEach((l, idx) => {
      if (l.photoFile) {
        formData.append(`teamPhoto_${idx}`, l.photoFile);
      }
    });

    try {
      if (editingClub) {
        await api.put(`/admin/clubs/${editingClub._id}`, formData);
      } else {
        await api.post('/admin/clubs', formData);
      }
      setIsClubModalOpen(false);
      setEditingClub(null);
      setClubFormData({ name: '', type: 'Club', description: '', aboutUs: '', tags: '', foundedOn: '', venue: '', eventsConducted: '', detailedDescription: '', organizerEmail: '', organizerPassword: '' });
      setClubLeadership([]);
      setClubImage(null);
      fetchInitialData();
    } catch (err) {
      console.error('Club submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteClub = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this club?')) return;
    try {
      await api.delete(`/admin/clubs/${id}`);
      fetchInitialData();
    } catch (err) {
      console.error('Club delete failed:', err);
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

  const removeUserFromEvent = async (userId: string) => {
    if (!selectedEventForReg) return;
    if (!window.confirm('Are you sure you want to remove this user from the event?')) return;
    try {
      await api.delete(`/admin/events/${selectedEventForReg._id}/registrations/${userId}`);
      setRegistrations(prev => prev.filter(r => r._id !== userId));
      toast.success('User removed from event successfully');
    } catch (err) {
      console.error('Failed to remove user:', err);
      toast.error('Failed to remove user');
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

  const handleDeleteNotif = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      await api.delete(`/admin/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch (err) {
      console.error('Delete notification failed:', err);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
        <Loader2 className="spin" size={48} color="#8B5CF6" />
      </div>
    );
  }

  return (
    <div className="admin-layout" style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', fontFamily: 'Inter, sans-serif' }}>
      {/* Sidebar */}
      <div className="admin-sidebar mobile-hidden" style={{ 
        width: isSidebarCollapsed ? '80px' : '280px', 
        borderRight: '1px solid var(--border-subtle)', 
        padding: isSidebarCollapsed ? '2rem 1rem' : '2rem 1.5rem', 
        display: 'flex', flexDirection: 'column', gap: '2rem',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem', justifyContent: isSidebarCollapsed ? 'center' : 'flex-start' }}>
          <div style={{ width: '40px', height: '40px', background: '#8B5CF6', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <TrendingUp size={24} color='#fff' />
          </div>
          {!isSidebarCollapsed && <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>Admin Portal</span>}
        </div>

        <nav className="admin-nav" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'scan', label: 'Scan Tickets', icon: Scan },
            { id: 'events', label: 'Manage Events', icon: Calendar },
            { id: 'pending', label: 'Pending Approvals', icon: Shield },
            { id: 'withdrawals', label: 'Withdraw Requests', icon: Trash2 },
            { id: 'users', label: 'Manage Users', icon: Users },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              title={isSidebarCollapsed ? item.label : ''}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px',
                background: activeTab === item.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                color: activeTab === item.id ? '#8B5CF6' : 'var(--text-secondary)',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, textAlign: 'left',
                justifyContent: isSidebarCollapsed ? 'center' : 'flex-start'
              }}
            >
              <item.icon size={20} style={{ flexShrink: 0 }} />
              {!isSidebarCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
            </button>
          ))}
        </nav>
        
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px',
            borderRadius: '12px', transition: 'all 0.2s'
          }}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
           {isSidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Mobile Header (Mobile Only) */}
      {isMobile && (
        <nav style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '64px',
          background: '#fff', borderBottom: '1px solid #eaeaea',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.5rem', zIndex: 100
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '1.1rem', color: '#111' }}>
            <div style={{ width: '32px', height: '32px', background: '#8B5CF6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#fff" />
            </div>
            <span>Admin Portal</span>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', display: 'flex', padding: '6px' }}
              >
                <Bell size={22} />
                {notifications.length > 0 && (
                  <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }} />
                )}
              </button>
              
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      position: 'fixed', top: '64px', right: '12px',
                      width: 'calc(100vw - 24px)', maxWidth: '300px',
                      background: '#fff',
                      borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                      border: '1px solid rgba(0,0,0,0.06)', padding: '1rem',
                      zIndex: 2000,
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '0.5rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#111', textAlign: 'left' }}>
                        System Notifications
                      </div>
                      <button onClick={() => setIsNotificationsOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex' }}><X size={16} /></button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '250px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ fontSize: '0.8rem', color: '#888', textAlign: 'center', padding: '1rem 0' }}>No new system alerts</div>
                      ) : (
                        notifications.map(n => (
                          <div key={n._id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem', textAlign: 'left', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ color: '#111', fontWeight: 700 }}>{n.title}</div>
                            <div style={{ color: '#555', marginTop: '2px' }}>{n.message}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', display: 'flex' }}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      )}

      {/* Mobile Drawer (Mobile Only) */}
      {isMobile && isMobileMenuOpen && (
        <div style={{
          position: 'fixed', top: '64px', left: 0, width: '100%', height: 'calc(100vh - 64px)',
          background: '#fff', zIndex: 99, display: 'flex', flexDirection: 'column',
          padding: '1.5rem', gap: '1.5rem', overflowY: 'auto'
        }}>
          {/* Profile card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eaeaea' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#111', overflow: 'hidden' }}>
              <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontWeight: 800, color: '#111' }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{user?.email || 'admin@eventum.com'}</div>
            </div>
          </div>

          {/* Navigation Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'scan', label: 'Scan Tickets', icon: Scan },
              { id: 'events', label: 'Manage Events', icon: Calendar },
              { id: 'pending', label: 'Pending Approvals', icon: Shield },
              { id: 'withdrawals', label: 'Withdraw Requests', icon: Trash2 },
              { id: 'users', label: 'Manage Users', icon: Users },
              { id: 'notifications', label: 'Notifications', icon: Bell },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as Tab); setIsMobileMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '12px',
                  background: activeTab === item.id ? 'rgba(139, 92, 246, 0.1)' : 'transparent',
                  color: activeTab === item.id ? '#8B5CF6' : '#555',
                  border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '1rem', textAlign: 'left'
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid #eaeaea', paddingTop: '1.5rem' }}>
            <button
              onClick={() => { setIsMobileMenuOpen(false); window.location.hash = '#home'; }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#555', padding: '8px 0', fontSize: '0.95rem' }}
            >
              <LayoutGrid size={18} /> User Dashboard
            </button>
            <button
              onClick={() => { logout(); setIsMobileMenuOpen(false); }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#ef4444', padding: '8px 0', fontSize: '0.95rem', marginTop: '0.5rem' }}
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="admin-main" style={{ flex: 1, padding: isMobile ? '6rem 1.25rem 3rem 1.25rem' : '3rem', overflowY: 'auto', maxHeight: '100vh' }}>
        <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>{activeTab === 'pending' ? 'Pending Approvals' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p style={{ opacity: 0.5 }}>Control and manage everything from here.</p>
          </div>
          {activeTab === 'events' && activeEventTab === 'admin' && (
            <button
              onClick={() => { window.location.hash = '#admin-create-event'; }}
              style={{ background: '#8B5CF6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}
            >
              <Plus size={20} /> Create Event
            </button>
          )}
          {(activeTab === 'users' && (activeUserTab === 'clubs' || activeUserTab === 'initiatives')) && (
            <button
              onClick={() => { 
                setEditingClub(null); 
                setClubFormData({ name: '', type: activeUserTab === 'initiatives' ? 'Initiative' : 'Club', description: '', aboutUs: '', tags: '', foundedOn: '', venue: '', eventsConducted: '', detailedDescription: '', organizerEmail: '', organizerPassword: '' }); 
                setClubLeadership([]);
                setIsClubModalOpen(true); 
              }}
              style={{ background: '#8B5CF6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)' }}
            >
              <Plus size={20} /> Create {activeUserTab === 'initiatives' ? 'Initiative' : 'Club'}
            </button>
          )}
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: '#3b82f6', trend: '+12% this month' },
                { label: 'Active Events', value: stats.totalEvents, icon: Calendar, color: '#8B5CF6', trend: '+5 new events' },
                { label: 'Clubs & Orgs', value: stats.totalClubs, icon: LayoutGrid, color: '#ec4899', trend: 'Steady growth' },
                { label: 'System Alerts', value: stats.activeNotifications, icon: Bell, color: '#facc15', trend: 'Requires attention' },
                { label: 'Pending Approvals', value: pendingList.length || 0, icon: Shield, color: '#10b981', trend: 'In Queue' },
                { label: 'System Health', value: '99.9%', icon: CheckCircle, color: '#14b8a6', trend: 'Optimal' },
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ background: `${stat.color}15`, padding: '12px', borderRadius: '16px', color: stat.color }}>
                      <stat.icon size={24} />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', background: '#f5f5f5', padding: '4px 8px', borderRadius: '8px' }}>
                      {stat.trend}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111' }}>{stat.value}</div>
                    <div style={{ opacity: 0.6, fontSize: '0.95rem', fontWeight: 600, marginTop: '4px' }}>{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
               <button 
                 onClick={() => setActiveEventTab('clubs')}
                 style={{ background: activeEventTab === 'clubs' ? '#111' : 'transparent', color: activeEventTab === 'clubs' ? '#fff' : '#666', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
               >
                 Club & Org Events
               </button>
               <button 
                 onClick={() => setActiveEventTab('admin')}
                 style={{ background: activeEventTab === 'admin' ? '#111' : 'transparent', color: activeEventTab === 'admin' ? '#fff' : '#666', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
               >
                 Admin Events
               </button>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {events.filter(e => activeEventTab === 'admin' ? e.isAdminEvent : !e.isAdminEvent).length === 0 && (
                <p style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 16 }}>No events found for this category.</p>
              )}
              {events.filter(e => activeEventTab === 'admin' ? e.isAdminEvent : !e.isAdminEvent).map((event) => (
                <motion.div
                  key={event._id}
                  className="admin-item-row"
                  style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
                >
                  <img src={event.image} alt="" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111' }}>{event.title}</h3>
                    <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px' }}>{event.venue} • {new Date(event.date).toLocaleDateString()}</p>
                    <span style={{ display: 'inline-block', marginTop: '8px', padding: '4px 10px', background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                       By: {event.organizer}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                    <button onClick={() => { window.location.hash = `#edit-event?id=${event._id || event.id}`; }} style={{ background: '#111', border: 'none', color: '#fff', padding: '10px 16px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: 600, fontSize: '0.85rem' }}>Manage</button>
                    <button onClick={() => viewRegistrations(event)} style={{ background: '#f5f5f5', border: 'none', color: '#111', padding: '12px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} title="View Registrations"><Eye size={18} /></button>
                    <button onClick={() => { window.location.hash = `#admin-edit-event=${event._id || event.id}`; }} style={{ background: 'rgba(59,130,246,0.1)', border: 'none', color: '#3b82f6', padding: '12px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} title="Edit Event Details"><Edit2 size={18} /></button>
                    <button onClick={() => deleteEvent(event._id || event.id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '12px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} title="Delete Event"><Trash2 size={18} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Pending Approvals Tab */}
        {activeTab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pendingErr && <p style={{ color: '#f87171', marginBottom: '1rem' }}>{pendingErr}</p>}
            {loadingPending ? (
               <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="spin" /></div>
            ) : pendingList.length === 0 ? (
               <p style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 16 }}>No pending events</p>
            ) : (
              pendingList.map((row, i) => (
                <motion.div
                  key={row._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.35rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: '1.25rem', alignItems: isMobile ? 'stretch' : 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: isMobile ? 'auto' : 200 }}>
                      <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{row.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{row.description}</p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
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
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: '#22c55e', color: '#052e16', border: 'none', padding: '0.65rem 1.25rem',
                        borderRadius: 12, fontWeight: 800, cursor: acting === row._id ? 'wait' : 'pointer', alignSelf: isMobile ? 'stretch' : 'flex-start',
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

        {/* Withdraw Requests Tab */}
        {activeTab === 'withdrawals' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loadingWith ? (
               <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="spin" /></div>
            ) : withdrawalList.length === 0 ? (
               <p style={{ color: 'var(--text-muted)', padding: '3rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: 16 }}>No withdrawal requests</p>
            ) : (
              withdrawalList.map((row, i) => (
                <motion.div
                  key={row._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.1)', borderRadius: 16, padding: '1.5rem',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: '1.25rem', alignItems: isMobile ? 'stretch' : 'center' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'var(--text-primary)', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{row.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Requested by: <span style={{ color: 'var(--text-primary)' }}>{row.organizer?.name}</span> ({row.organizer?.email})</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', width: isMobile ? '100%' : 'auto', flexDirection: isMobile ? 'column' : 'row' }}>
                      <button
                        onClick={() => handleWithdrawalAction(row._id, 'approve')}
                        disabled={acting === row._id}
                        style={{ background: '#ef4444', color: 'var(--text-primary)', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer', flex: 1 }}
                      >
                        Approve Withdrawal
                      </button>
                      <button
                        onClick={() => handleWithdrawalAction(row._id, 'reject')}
                        disabled={acting === row._id}
                        style={{ background: 'var(--border-subtle)', color: 'var(--text-primary)', border: 'none', padding: '0.6rem 1.2rem', borderRadius: 10, fontWeight: 700, cursor: 'pointer', flex: 1 }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
               <button 
                 onClick={() => setActiveUserTab('users')}
                 style={{ background: activeUserTab === 'users' ? '#111' : 'transparent', color: activeUserTab === 'users' ? '#fff' : '#666', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
               >
                 Registered Users
               </button>
               <button 
                 onClick={() => setActiveUserTab('clubs')}
                 style={{ background: activeUserTab === 'clubs' ? '#111' : 'transparent', color: activeUserTab === 'clubs' ? '#fff' : '#666', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
               >
                 Clubs
               </button>
               <button 
                 onClick={() => setActiveUserTab('initiatives')}
                 style={{ background: activeUserTab === 'initiatives' ? '#111' : 'transparent', color: activeUserTab === 'initiatives' ? '#fff' : '#666', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
               >
                 Initiatives
               </button>
            </div>

            {activeUserTab === 'users' ? (
              <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '24px', overflowX: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ textAlign: 'left', background: '#f9f9f9', borderBottom: '1px solid var(--border-subtle)' }}>
                      <th style={{ padding: '1.5rem', color: '#111', fontWeight: 700 }}>User</th>
                      <th style={{ color: '#111', fontWeight: 700 }}>Role</th>
                      <th style={{ color: '#111', fontWeight: 700 }}>Status</th>
                      <th style={{ color: '#111', fontWeight: 700 }}>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                          <div>
                            <div style={{ fontWeight: 700, color: '#111', fontSize: '0.95rem' }}>{u.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>{u.email}</div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', padding: '6px 12px', borderRadius: '99px', background: u.role === 'admin' ? '#8B5CF622' : '#f1f5f9', color: u.role === 'admin' ? '#8B5CF6' : '#64748b', fontWeight: 700 }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.75rem', color: u.isVerified ? '#10b981' : '#94a3b8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                             {u.isVerified && <CheckCircle size={14} />} {u.isVerified ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td style={{ color: '#666', fontSize: '0.9rem', fontWeight: 600 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (activeUserTab === 'clubs' || activeUserTab === 'initiatives') && (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {(activeUserTab === 'clubs' ? clubs.filter(c => c.type !== 'Initiative') : clubs.filter(c => c.type === 'Initiative')).length === 0 && <p style={{ color: '#888', padding: '3rem', textAlign: 'center', border: '1px dashed var(--border-subtle)', borderRadius: 16 }}>No {activeUserTab === 'clubs' ? 'clubs' : 'initiatives'} found.</p>}
                {(activeUserTab === 'clubs' ? clubs.filter(c => c.type !== 'Initiative') : clubs.filter(c => c.type === 'Initiative')).map((club) => (
                  <motion.div
                    key={club._id}
                    className="admin-item-row"
                    style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '20px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
                  >
                    <img src={club.logo} alt="" style={{ width: '80px', height: '80px', borderRadius: '16px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111' }}>{club.name}</h3>
                      <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '4px' }}>{club.type} • {club.id}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button onClick={() => { 
                        setEditingClub(club); 
                        setClubFormData({ 
                          name: club.name, type: club.type, description: club.description, aboutUs: club.aboutUs, tags: (club.tags || []).join(', '),
                          foundedOn: club.foundedOn ? new Date(club.foundedOn).toISOString().substring(0, 7) : '',
                          venue: club.venue || '',
                          eventsConducted: club.eventsConducted !== undefined ? club.eventsConducted.toString() : '',
                          detailedDescription: club.detailedDescription || '',
                          organizerEmail: club.organizerAccount?.email || '', 
                          organizerPassword: '' // Clear them when editing, usually we don't fetch password
                        }); 
                        setClubLeadership(club.leadership || []);
                        setIsClubModalOpen(true); 
                      }} style={{ background: 'rgba(59,130,246,0.1)', border: 'none', color: '#3b82f6', padding: '12px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}><Edit2 size={18} /></button>
                      <button onClick={() => deleteClub(club._id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '12px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }}><Trash2 size={18} /></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scan Tickets Tab */}
        {activeTab === 'scan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Volunteer Scanner</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '400px' }}>
                  Generate a Magic Link and send it to your volunteers. They can open it on their phones to scan tickets securely without a password.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
                <button
                  onClick={async () => {
                    setGeneratingLink(true);
                    try {
                      const res = await api.post('/events/generate-scanner-link');
                      setMagicLink(`${window.location.origin}/#scanner=${res.data.link.token}`);
                      loadLinks();
                    } catch (error) {
                      toast.error("Failed to generate link");
                    } finally {
                      setGeneratingLink(false);
                    }
                  }}
                  disabled={generatingLink}
                  className="btn"
                  style={{ background: '#8b5cf6', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  {generatingLink ? "Generating..." : "Generate Magic Link"}
                </button>
                {magicLink && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--bg-app)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <input 
                      readOnly 
                      value={magicLink} 
                      style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', width: '250px', outline: 'none' }} 
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(magicLink);
                        toast.success("Copied to clipboard!");
                      }}
                      style={{ background: 'var(--border-subtle)', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                    >
                      Copy
                    </button>
                  </div>
                )}
              </div>
            </div>

            {activeLinks.length > 0 && (
              <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem' }}>Active Links</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {activeLinks.map((link) => (
                    <div key={link._id} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '1rem' : '1.5rem', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', background: 'var(--bg-app)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontFamily: 'monospace', color: '#8b5cf6' }}>...{link.token.slice(-10)}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          Expires: {new Date(link.expiresAt).toLocaleString()}
                        </div>
                        {link.lockedDeviceId && (
                          <div style={{ fontSize: '0.8rem', color: '#10b981', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} /> Locked to a device
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/#scanner=${link.token}`);
                            toast.success("Copied to clipboard!");
                          }}
                          style={{ background: 'var(--bg-card-hover)', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                          Copy
                        </button>
                        <button 
                          onClick={async () => {
                            try {
                              await api.delete(`/events/scanner-link/${link._id}`);
                              toast.success("Link Revoked");
                              loadLinks();
                            } catch (e) {
                              toast.error("Failed to revoke link");
                            }
                          }}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                        >
                          Revoke
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
              <TicketScanner />
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="admin-notif-grid" style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'minmax(300px, 450px) 1fr', gap: isMobile ? '2rem' : '3rem' }}>
            <form onSubmit={handleSendNotif} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-card-hover)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Send Global Notification</h3>
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Title</label>
                  <input required placeholder="Notification Title" value={notifFormData.title} onChange={e => setNotifFormData({...notifFormData, title: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)' }} />
               </div>
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Message</label>
                  <textarea required placeholder="Write your message here..." value={notifFormData.message} onChange={e => setNotifFormData({...notifFormData, message: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)', minHeight: '100px' }} />
               </div>
               <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Type</label>
                  <select value={notifFormData.type} onChange={e => setNotifFormData({...notifFormData, type: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: '12px', color: 'var(--text-primary)' }}>
                     <option value="info">Info (Blue)</option>
                     <option value="warning">Warning (Yellow)</option>
                     <option value="success">Success (Green)</option>
                     <option value="error">Error (Red)</option>
                  </select>
               </div>
               <button type="submit" disabled={isSubmitting} style={{ background: '#8B5CF6', color: 'var(--text-primary)', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  {isSubmitting ? <Loader2 className="spin" size={20} /> : 'Post Notification'}
               </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Active Alerts</h3>
               {notifications.map(n => (
                  <div key={n._id} style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-card-hover)', border: '1px solid var(--border-subtle)', position: 'relative' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', paddingRight: '2rem' }}>
                        {n.type === 'info' && <Info size={16} color="#3b82f6" />}
                        {n.type === 'warning' && <AlertTriangle size={16} color="#facc15" />}
                        {n.type === 'success' && <CheckCircle size={16} color="#34d399" />}
                        <span style={{ fontWeight: 700 }}>{n.title}</span>
                     </div>
                     <p style={{ opacity: 0.5, fontSize: '0.9rem', paddingRight: '2rem' }}>{n.message}</p>
                     <button
                       onClick={() => handleDeleteNotif(n._id)}
                       style={{
                         position: 'absolute', top: '1.25rem', right: '1.25rem',
                         background: 'none', border: 'none', color: '#ef4444',
                         cursor: 'pointer', display: 'flex', padding: '4px',
                         borderRadius: '50%'
                       }}
                       title="Delete Notification"
                     >
                       <Trash2 size={16} />
                     </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      

      {/* Create/Edit Club Modal */}
      <AnimatePresence>
        {isClubModalOpen && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '1rem 0.5rem' : '2rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '800px', borderRadius: '24px', border: '1px solid var(--border-color)', padding: isMobile ? '1.5rem' : '2.5rem', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>{editingClub ? 'Edit Club' : 'Create New Club'}</h2>
                <button onClick={() => setIsClubModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><X size={32} /></button>
              </div>

              <form className="admin-form-grid" onSubmit={handleClubSubmit} style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Club Name</label>
                  <input required placeholder="E.g. JIG" value={clubFormData.name} onChange={e => setClubFormData({...clubFormData, name: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Type</label>
                  <select value={clubFormData.type} onChange={e => setClubFormData({...clubFormData, type: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)' }}>
                    {['Club', 'Organization', 'Initiative'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                  <>
                    <div style={{ gridColumn: '1 / -1', background: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem' }}>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={{ fontWeight: 600, color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Shield size={16} /> Organizer Login Credentials
                        </label>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Provide these details to create or update a dedicated dashboard account for this club's organizer.</p>
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5, fontSize: '0.9rem' }}>Organizer Email</label>
                        <input type="email" placeholder="club@eventum.com" value={clubFormData.organizerEmail} onChange={e => setClubFormData({...clubFormData, organizerEmail: e.target.value})} style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5, fontSize: '0.9rem' }}>Organizer Password</label>
                        <input type="text" placeholder={editingClub ? "Leave blank to keep current" : "Set a strong password"} value={clubFormData.organizerPassword} onChange={e => setClubFormData({...clubFormData, organizerPassword: e.target.value})} style={{ width: '100%', background: 'var(--bg-primary)', border: '1px solid rgba(0,0,0,0.1)', padding: '12px', borderRadius: '8px', color: 'var(--text-primary)' }} />
                      </div>
                    </div>
                  </>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Founded On</label>
                  <input type="month" value={clubFormData.foundedOn} onChange={e => setClubFormData({...clubFormData, foundedOn: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Venue</label>
                  <input placeholder="E.g. Room 402, Block A" value={clubFormData.venue} onChange={e => setClubFormData({...clubFormData, venue: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Events Conducted</label>
                  <input type="number" placeholder="E.g. 15" value={clubFormData.eventsConducted} onChange={e => setClubFormData({...clubFormData, eventsConducted: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Short Description</label>
                  <input required placeholder="Brief one-liner" value={clubFormData.description} onChange={e => setClubFormData({...clubFormData, description: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)' }} />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Detailed Description</label>
                  <textarea placeholder="Extensive details about the club, activities, and achievements..." value={clubFormData.detailedDescription} onChange={e => setClubFormData({...clubFormData, detailedDescription: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)', minHeight: '120px' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Tags (comma separated)</label>
                  <input placeholder="Technology, Design, Open Source" value={clubFormData.tags} onChange={e => setClubFormData({...clubFormData, tags: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '14px', borderRadius: '12px', color: 'var(--text-primary)' }} />
                </div>

                <div style={{ gridColumn: '1 / -1', padding: '1rem', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label style={{ opacity: 0.7, fontWeight: 600 }}>Leadership & Team</label>
                    <button type="button" onClick={() => setClubLeadership([...clubLeadership, { name: '', position: '', photoUrl: '', photoFile: null }])} style={{ background: '#8B5CF6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Member</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {clubLeadership.map((member, idx) => (
                      <div key={idx} style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', alignItems: isMobile ? 'stretch' : 'center', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px' }}>
                        <input placeholder="Name" value={member.name} onChange={e => { const newL = [...clubLeadership]; newL[idx].name = e.target.value; setClubLeadership(newL); }} style={{ flex: 1, background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)' }} />
                        <input placeholder="Position" value={member.position} onChange={e => { const newL = [...clubLeadership]; newL[idx].position = e.target.value; setClubLeadership(newL); }} style={{ flex: 1, background: 'var(--border-subtle)', border: '1px solid rgba(0,0,0,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-primary)' }} />
                        <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'var(--border-subtle)', border: '1px dashed var(--border-color)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                          <ImageIcon size={16} /> {member.photoFile ? 'File selected' : (member.photoUrl ? 'Photo uploaded' : 'Upload')}
                          <input type="file" hidden accept="image/*" onChange={e => {
                            if (e.target.files && e.target.files[0]) {
                              const newL = [...clubLeadership];
                              newL[idx].photoFile = e.target.files[0];
                              setClubLeadership(newL);
                            }
                          }} />
                        </label>
                        <button type="button" onClick={() => { const newL = [...clubLeadership]; newL.splice(idx, 1); setClubLeadership(newL); }} style={{ background: isMobile ? 'rgba(239,68,68,0.1)' : 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: isMobile ? '10px' : '0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trash2 size={18} /> {isMobile && <span style={{ marginLeft: '8px', fontWeight: 600 }}>Remove Member</span>}
                        </button>
                      </div>
                    ))}
                    {clubLeadership.length === 0 && <p style={{ fontSize: '0.85rem', color: '#888', textAlign: 'center', margin: '0' }}>No members added yet.</p>}
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.5 }}>Club Logo (Cloudinary)</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                     <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', background: 'var(--border-subtle)', border: '2px dashed var(--border-color)', borderRadius: '12px', cursor: 'pointer' }}>
                        <ImageIcon size={20} />
                        <span>{clubImage ? clubImage.name : 'Click to upload logo'}</span>
                        <input type="file" hidden accept="image/*" onChange={e => setClubImage(e.target.files ? e.target.files[0] : null)} />
                     </label>
                     {editingClub?.logo && !clubImage && <img src={editingClub.logo} style={{ width: '54px', height: '54px', borderRadius: '8px' }} />}
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <button type="submit" disabled={isSubmitting} style={{ width: '100%', background: '#8B5CF6', color: 'var(--text-primary)', border: 'none', padding: '18px', borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer' }}>
                    {isSubmitting ? <Loader2 className="spin" size={24} /> : (editingClub ? 'Update Club' : 'Create Club')}
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
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '1rem 0.5rem' : '2rem' }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: 'var(--bg-card)', width: '100%', maxWidth: '600px', borderRadius: '24px', border: '1px solid var(--border-color)', padding: isMobile ? '1.5rem' : '2.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                   <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Registered Users</h2>
                   <p style={{ opacity: 0.5 }}>For {selectedEventForReg.title}</p>
                </div>
                <button onClick={() => setSelectedEventForReg(null)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}><X size={32} /></button>
              </div>

              {loadingReg ? <div style={{ textAlign: 'center', padding: '2rem' }}><Loader2 className="spin" /></div> : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '50vh', overflowY: 'auto' }}>
                  {registrations.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5 }}>No one has registered yet.</p> : registrations.map(reg => (
                    <div key={reg._id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--border-subtle)', padding: '1rem', borderRadius: '12px' }}>
                       <img src={reg.avatar || `https://ui-avatars.com/api/?name=${reg.name}`} style={{ width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0 }} />
                       <div style={{ flex: 1, display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>{reg.name}</div>
                            <div style={{ fontSize: '0.8rem', opacity: 0.5, wordBreak: 'break-all' }}>{reg.email}</div>
                          </div>
                          <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: reg.checkedIn ? '#dcfce7' : '#f1f5f9', color: reg.checkedIn ? '#166534' : '#475569', fontWeight: 600, alignSelf: isMobile ? 'flex-start' : 'center' }}>
                            {reg.checkedIn ? 'Checked In' : 'Pending'}
                          </span>
                       </div>
                       <button onClick={() => removeUserFromEvent(reg._id)} style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#ef4444', padding: '8px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }} title="Remove User">
                         <Trash2 size={16} />
                       </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        input, textarea, select, button, label { font-family: 'Inter', sans-serif !important; }
        ::placeholder { font-family: 'Inter', sans-serif !important; opacity: 0.6; }
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .mobile-hidden {
          display: flex;
        }

        @media (max-width: 900px) {
          .admin-layout { flex-direction: column !important; }
          .mobile-hidden { display: none !important; }
          .mobile-nav-show { display: flex !important; }
          .admin-main { padding: 1.5rem !important; }
          .admin-header { margin-bottom: 2rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
          .admin-item-row { flex-direction: column !important; align-items: flex-start !important; gap: 1.25rem !important; padding: 1.25rem !important; }
          .admin-item-row img { width: 60px !important; height: 60px !important; border-radius: 12px !important; }
          .admin-item-row div { width: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
