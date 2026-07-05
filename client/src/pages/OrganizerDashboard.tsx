import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Bell, Plus, LayoutGrid, Image as ImageIcon, MapPin, Ticket, Users, ChevronDown, X, Menu, User, Lock, UserCircle, LogOut } from 'lucide-react';
import darkLogo from '../logo/dark logo.png';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';
import ChangePasswordModal from '../components/ChangePasswordModal';
import { AnimatePresence } from 'framer-motion';

const MOCK_LOCATIONS = [
  { id: '1', title: 'Jaipur', subtitle: 'Rajasthan, India' },
  { id: '2', title: 'JECRC University', subtitle: 'Plot No. IS-2036 to IS-2039, Ramchandrapura, Sitapura Extension...' },
  { id: '3', title: 'Delhi', subtitle: 'National Capital Territory of Delhi, India' },
  { id: '4', title: 'Mumbai', subtitle: 'Maharashtra, India' },
  { id: '5', title: 'Bangalore', subtitle: 'Karnataka, India' },
];

export default function OrganizerDashboard() {
  const [activeTab, setActiveTab] = useState<'events' | 'create'>('events');
  const [eventFilter, setEventFilter] = useState<'upcoming' | 'past'>('upcoming');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
  const { user, logout } = useAuth();

  // Sync state with hash route
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#organizer-dashboard/create-event') {
        setActiveTab('create');
      } else {
        setActiveTab('events');
      }
    };

    handleHashChange(); // Run on initial mount
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (tab: 'events' | 'create') => {
    window.location.hash = tab === 'events' ? '#organizer-dashboard/my-events' : '#organizer-dashboard/create-event';
  };

  // --- Form State ---
  const [eventName, setEventName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  
  const [location, setLocation] = useState('');
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [selectedMockLocation, setSelectedMockLocation] = useState<any>(null);
  
  const [ticketType, setTicketType] = useState<'Free' | 'Paid'>('Free');
  const [ticketPrice, setTicketPrice] = useState('');
  const [maxTickets, setMaxTickets] = useState('');
  const [refundPolicy, setRefundPolicy] = useState('none');
  
  const [capacity, setCapacity] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [eventsList, setEventsList] = useState<any[]>([]); // Store created events

  // Fetch Events from API
  const fetchEvents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/organizer/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setEventsList(data);
      }
    } catch (err) {
      console.error('Error fetching events:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'events') {
      fetchEvents();
    }
  }, [activeTab]);

  const showError = (msg: string) => {
    setFormError(msg);
    setTimeout(() => setFormError(''), 4000);
  };

  const handleCreateEvent = async () => {
    if (isSubmitting) return;
    setFormError('');
    const finalLocation = selectedMockLocation ? selectedMockLocation.title : location;
    
    // Strict Validation
    if (!eventName.trim() || !category || (category === 'custom' && !customCategory.trim()) || 
        !startDate || !startTime || !endDate || !endTime || !finalLocation || !imageFile) {
      showError('Please fill in all required fields and upload an event poster.');
      return;
    }

    // Time Validation
    const startObj = parseEventDate(startDate, startTime);
    const endObj = parseEventDate(endDate, endTime);
    if (endObj <= startObj) {
      showError('End time must be strictly after the Start time.');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', eventName);
    formData.append('category', category === 'custom' ? customCategory : category);
    formData.append('description', description);
    formData.append('date', `${startDate} • ${startTime}`); // Combining to match schema
    formData.append('startDate', `${startDate}T${startTime}`);
    formData.append('endDate', `${endDate}T${endTime}`);
    // Since schema has mode and location, let's map venue/location
    formData.append('venue', finalLocation);
    formData.append('location', finalLocation);
    formData.append('capacity', capacity || '0');
    formData.append('ticketType', ticketType);
    formData.append('price', ticketType === 'Paid' ? ticketPrice : 'Free');
    formData.append('seats', maxTickets ? maxTickets : 'Limited');
    formData.append('rules', instructions);
    formData.append('image', imageFile);

    try {
      const res = await fetch('http://localhost:5000/api/organizer/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create event');
      }

      // Reset Form
      setEventName('');
      setCategory('');
      setCustomCategory('');
      setDescription('');
      setInstructions('');
      setStartDate('');
      setStartTime('');
      setEndDate('');
      setEndTime('');
      setLocation('');
      setTicketType('Free');
      setTicketPrice('');
      setMaxTickets('');
      setCapacity('');
      setImagePreview(null);
      setImageFile(null);
      setSelectedMockLocation(null);
      setLocationSearchTerm('');
      setIsLocationExpanded(false);

      // Redirect to Events list and fetch updated
      navigateTo('events');
      fetchEvents();
    } catch (err: any) {
      console.error(err);
      showError(err.message || 'An error occurred while creating the event.');
    } finally {
      setIsSubmitting(false);
    }
  };


  // --- Date Parsing and Sorting ---
  const parseEventDate = (dateStr: string, timeStr: string) => {
    if (!dateStr) return new Date();
    return new Date(`${dateStr}T${timeStr || '00:00'}`);
  };

  const formatEventDate = (dateObj: Date) => {
    return {
      dayStr: dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'long' }),
      weekdayStr: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
      monthShort: dateObj.toLocaleDateString('en-US', { month: 'short' }),
      dayNum: dateObj.getDate().toString(),
      timeStr: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };

  const now = new Date();
  const processedEvents = eventsList.map(ev => {
    // We stored date as "YYYY-MM-DD • HH:MM am/pm". We should parse intelligently.
    // Or just use createdAt if we don't have a reliable parser for custom date strings here.
    // Let's use the DB's startDate if available, else fallback
    const startObj = ev.startDate ? new Date(ev.startDate) : new Date(ev.createdAt);
    const endObj = ev.endDate ? new Date(ev.endDate) : startObj;
    
    return {
      ...ev,
      // Map API fields to UI expected fields
      name: ev.title,
      location: ev.venue || ev.location,
      imagePreview: ev.image,
      startObj,
      endObj,
      isPast: endObj < now
    };
  });

  const filteredEvents = processedEvents
    .filter(ev => eventFilter === 'upcoming' ? !ev.isPast : ev.isPast)
    .sort((a, b) => {
      if (eventFilter === 'upcoming') {
        return a.startObj.getTime() - b.startObj.getTime();
      } else {
        return b.startObj.getTime() - a.startObj.getTime();
      }
    });

  return (
    <div style={{ minHeight: '100vh', background: '#fff', color: '#111', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @media (max-width: 768px) {
          .mobile-main { padding: 6rem 1.25rem 3rem 1.25rem !important; }
          .mobile-nav-hide { display: none !important; }
          .mobile-nav-show { display: flex !important; }
          
          /* Events Tab */
          .mobile-header-row { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
          .mobile-header-title { font-size: 2rem !important; }
          
          .mobile-timeline-row { flex-direction: column !important; gap: 0.5rem !important; margin-left: 0.5rem !important; }
          .mobile-timeline-node { width: 100% !important; flex-direction: row !important; align-items: center !important; gap: 8px !important; padding-top: 0 !important; padding-left: 16px !important; }
          .mobile-timeline-dot { left: -5px !important; right: auto !important; top: 6px !important; }
          .mobile-timeline-line { left: 0px !important; top: 16px !important; bottom: -16px !important; }
          
          .mobile-event-card { flex-direction: row-reverse !important; padding: 1rem !important; gap: 0.75rem !important; margin-left: 12px !important; }
          .mobile-card-img { width: 70px !important; height: 70px !important; border-radius: 8px !important; }
          .mobile-card-title { font-size: 1.1rem !important; margin-bottom: 0 !important; }
          .mobile-card-location { margin-bottom: 0.5rem !important; }
          
          /* Create Event Tab */
          .mobile-create-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .mobile-create-img { aspect-ratio: 4/3 !important; border-radius: 12px !important; }
          
          .mobile-form-row { flex-direction: column !important; gap: 0.5rem !important; align-items: flex-start !important; }
          .mobile-form-col { width: 100% !important; }
        }

        /* Set global font for inputs and placeholders */
        input, textarea, select {
          font-family: 'Inter', sans-serif !important;
        }
        ::placeholder {
          font-family: 'Inter', sans-serif !important;
          opacity: 0.6;
        }
      `}</style>
      
      {/* Background Gradient overlay for Navbar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '140px',
        zIndex: 100,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, #E9D5FF 0%, rgba(233,213,255,0) 100%)',
      }} />

      {/* Navbar Content */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        padding: '0 2rem',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 101,
        pointerEvents: 'auto'
      }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.location.hash = '#home'}>
          <img src={darkLogo} alt="Eventum" style={{ height: '28px' }} />
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111' }}>Eventum<span style={{ color: '#ec4899' }}>.</span></span>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="mobile-nav-hide" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <button 
            onClick={() => navigateTo('events')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.95rem',
              color: activeTab === 'events' ? '#111' : 'rgba(0,0,0,0.5)',
              transition: 'color 0.2s'
            }}
          >
            <LayoutGrid size={18} /> My Events
          </button>
          
          <button 
            onClick={() => navigateTo('create')}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              background: 'none', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '0.95rem',
              color: activeTab === 'create' ? '#111' : 'rgba(0,0,0,0.5)',
              transition: 'color 0.2s'
            }}
          >
            <Plus size={18} /> Create Event
          </button>
        </div>

        {/* Right: Icons (Desktop) */}
        <div className="mobile-nav-hide" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', display: 'flex' }}>
            <Search size={20} />
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', display: 'flex' }}>
            <Bell size={20} />
          </button>
          <div 
            style={{ position: 'relative' }} 
            onMouseEnter={() => setIsProfileOpen(true)}
            onMouseLeave={() => setIsProfileOpen(false)}
          >
            <div 
              style={{ 
                width: '32px', height: '32px', borderRadius: '12px', 
                background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(0,0,0,0.1)'
              }}>
              <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  style={{
                    position: 'absolute', top: '120%', right: 0,
                    background: '#fff',
                    borderRadius: '14px', boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(0,0,0,0.06)', padding: '0.5rem',
                    minWidth: '200px', zIndex: 2000,
                  }}
                >
                  <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid rgba(0,0,0,0.05)', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#111' }}>{user?.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#888' }}>{user?.email}</div>
                  </div>
                  <button type="button" className="dropdown-item" onClick={() => { setIsProfileOpen(false); window.location.hash = '#organizer-setup'; }}>
                    <User size={15} /> <span>Edit Profile</span>
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { setIsProfileOpen(false); setIsPasswordModalOpen(true); }}>
                    <Lock size={15} /> <span>Change Password</span>
                  </button>
                  <button type="button" className="dropdown-item" onClick={() => { setIsProfileOpen(false); window.location.hash = '#home'; }}>
                    <UserCircle size={15} /> <span>User Dashboard</span>
                  </button>
                  <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', margin: '0.4rem 0' }} />
                  <button type="button" className="dropdown-item logout" onClick={logout}>
                    <LogOut size={15} /> <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Hamburger Icon (Mobile Only) */}
        <div className="mobile-nav-show" style={{ display: 'none', alignItems: 'center' }}>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', display: 'flex' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-show" style={{
          display: 'none', flexDirection: 'column', position: 'fixed', top: '64px', left: 0, width: '100%',
          background: '#fff', borderBottom: '1px solid #eaeaea', boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
          padding: '1.5rem', zIndex: 100, gap: '1.5rem'
        }}>
          {/* Profile Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #eaeaea' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#111', overflow: 'hidden' }}>
              <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#111' }}>{user?.name || 'Organizer'}</div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{user?.email || 'organizer@eventum.com'}</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, padding: '0.5rem 0', color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => { setIsMobileMenuOpen(false); window.location.hash = '#organizer-setup'; }}>
              <User size={18} /> Edit Profile
            </button>
            <button style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, padding: '0.5rem 0', color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => { setIsMobileMenuOpen(false); setIsPasswordModalOpen(true); }}>
              <Lock size={18} /> Change Password
            </button>
            <button style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, padding: '0.5rem 0', color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => { setIsMobileMenuOpen(false); window.location.hash = '#home'; }}>
              <UserCircle size={18} /> User Dashboard
            </button>
            <button style={{ background: 'none', border: 'none', textAlign: 'left', fontWeight: 600, padding: '0.5rem 0', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem' }}
              onClick={logout}>
              <LogOut size={18} /> Sign Out
            </button>
          </div>

          {/* Nav Links */}
          <button 
            onClick={() => { navigateTo('events'); setIsMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', color: activeTab === 'events' ? '#ec4899' : '#111' }}
          >
            <LayoutGrid size={20} /> My Events
          </button>
          
          <button 
            onClick={() => { navigateTo('create'); setIsMobileMenuOpen(false); }}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '1.1rem', color: activeTab === 'create' ? '#ec4899' : '#111' }}
          >
            <Plus size={20} /> Create Event
          </button>

          {/* Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', paddingTop: '1rem', borderTop: '1px solid #eaeaea' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#555' }}>
              <Search size={20} /> Search
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, color: '#555' }}>
              <Bell size={20} /> Notifications
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="mobile-main" style={{ flex: 1, padding: '8rem 2rem 3rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        {activeTab === 'events' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             
             {/* Header with Filter Toggle */}
             <div className="mobile-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                  <h1 className="mobile-header-title" style={{ fontSize: '2.5rem', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>My Events<span style={{ color: '#ec4899' }}>.</span></h1>
                </div>
                
                <div style={{ display: 'flex', background: '#eaeaea', borderRadius: '8px', padding: '4px' }}>
                  <button 
                    onClick={() => setEventFilter('upcoming')}
                    style={{ 
                      background: eventFilter === 'upcoming' ? '#fff' : 'transparent', 
                      color: eventFilter === 'upcoming' ? '#111' : '#888',
                      border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                      boxShadow: eventFilter === 'upcoming' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s'
                    }}
                  >
                    Upcoming
                  </button>
                  <button 
                    onClick={() => setEventFilter('past')}
                    style={{ 
                      background: eventFilter === 'past' ? '#fff' : 'transparent', 
                      color: eventFilter === 'past' ? '#111' : '#888',
                      border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                      boxShadow: eventFilter === 'past' ? '0 2px 8px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s'
                    }}
                  >
                    Past
                  </button>
                </div>
             </div>
             
             {eventsList.length === 0 ? (
               <div style={{ padding: '4rem', textAlign: 'center', border: '1px dashed #ccc', borderRadius: '16px' }}>
                  <p style={{ color: '#888', fontWeight: 500 }}>No events created yet.</p>
                  <button 
                    onClick={() => navigateTo('create')}
                    style={{ marginTop: '1rem', background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Create your first event
                  </button>
               </div>
             ) : filteredEvents.length === 0 ? (
               <div style={{ padding: '4rem', textAlign: 'center', color: '#888', fontWeight: 500 }}>
                  No {eventFilter} events found.
               </div>
             ) : (
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                 {filteredEvents.map((ev, index) => {
                   const formatted = formatEventDate(new Date(ev.startObj));
                   const endFormatted = formatEventDate(new Date(ev.endObj));
                   const timeRange = ev.endDate && ev.endTime ? `${formatted.timeStr} - ${endFormatted.timeStr}` : formatted.timeStr;
                   
                   return (
                     <div className="mobile-timeline-row" key={ev._id} style={{ display: 'flex', gap: '2rem', position: 'relative' }}>
                       
                       {/* Left Column: Timeline Node */}
                       <div className="mobile-timeline-node" style={{ width: '120px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingTop: '1rem', position: 'relative' }}>
                         <div style={{ fontSize: '1rem', fontWeight: 800, color: '#111', whiteSpace: 'nowrap' }}>{formatted.dayStr}</div>
                         <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 600 }}>{formatted.weekdayStr}</div>
                         
                         {/* Node Dot */}
                         <div className="mobile-timeline-dot" style={{ position: 'absolute', right: '-12px', top: '22px', width: '10px', height: '10px', borderRadius: '50%', background: '#888', zIndex: 2 }} />
                       </div>
                       
                       {/* Timeline Line */}
                       {index !== filteredEvents.length - 1 && (
                         <div className="mobile-timeline-line" style={{ position: 'absolute', left: '126px', top: '38px', bottom: '-24px', width: '2px', borderLeft: '2px dotted #ccc', zIndex: 1 }} />
                       )}

                       {/* Right Column: Event Card */}
                       <div className="mobile-event-card" style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '1.25rem', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
                         
                         {/* Card Details */}
                         <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 0 }}>
                           <h2 className="mobile-card-title" style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0 0 4px 0', color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.name}</h2>
                           <div style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500, marginBottom: '1.5rem' }}>Organized by <span style={{ color: '#111', fontWeight: 700 }}>Eventum Org</span></div>
                           
                           {/* Calendar Badge & Time */}
                           <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                              <div style={{ background: '#fdf2f8', border: '1px solid #fbcfe8', borderRadius: '8px', padding: '4px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: '40px' }}>
                                <div style={{ fontSize: '0.55rem', fontWeight: 800, color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{formatted.monthShort}</div>
                                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#111', lineHeight: '1' }}>{formatted.dayNum}</div>
                              </div>
                              <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatted.weekdayStr}, {formatted.dayStr}</div>
                                <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>{timeRange}</div>
                              </div>
                           </div>

                           {/* Location */}
                           <div className="mobile-card-location" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <MapPin size={18} color="#3b82f6" />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ev.location || 'Virtual / TBA'}</div>
                                {ev.location && <div style={{ fontSize: '0.8rem', color: '#888', fontWeight: 500 }}>Location Details</div>}
                              </div>
                           </div>

                           {/* Manage Event Button */}
                           <div>
                             <button 
                               onClick={() => window.location.hash = `#edit-event?id=${ev._id}`}
                               style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s' }} 
                               onMouseOver={e=>e.currentTarget.style.opacity='0.8'} 
                               onMouseOut={e=>e.currentTarget.style.opacity='1'}
                             >
                               Manage Event <span style={{ fontSize: '1.1rem' }}>→</span>
                             </button>
                           </div>
                         </div>

                         {/* Image */}
                         <div className="mobile-card-img" style={{ width: '200px', height: '200px', borderRadius: '12px', background: '#222', overflow: 'hidden', flexShrink: 0 }}>
                            {ev.imagePreview ? (
                              <img src={ev.imagePreview} alt={ev.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666' }}>
                                <ImageIcon size={32} />
                              </div>
                            )}
                         </div>

                       </div>
                     </div>
                   );
                 })}
               </div>
             )}
           </motion.div>
        )}

        {activeTab === 'create' && (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Create Event<span style={{ color: '#ec4899' }}>.</span></h1>
             
             <div className="mobile-create-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr', gap: '3rem', alignItems: 'start' }}>
                
                {/* Left Column - Image Upload Placeholder (A4 Size = 1:1.414) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label className="mobile-create-img" style={{ 
                    aspectRatio: '1 / 1.414', 
                    background: '#222', 
                    borderRadius: '16px', 
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}>
                    <input id="image-upload" type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setImageFile(file);
                        const reader = new FileReader();
                        reader.onload = (e) => setImagePreview(e.target?.result as string);
                        reader.readAsDataURL(file);
                      }
                    }} />

                    {imagePreview ? (
                      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                        {/* Blurred Background */}
                        <img src={imagePreview} alt="Blur" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(30px)', opacity: 0.6, transform: 'scale(1.2)' }} />
                        {/* Foreground Image */}
                        <img src={imagePreview} alt="Preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} />
                      </div>
                    ) : (
                      <>
                        {/* Subtle grid pattern background for the placeholder */}
                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                        
                        <h3 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', zIndex: 2, lineHeight: 1.2 }}>upload<br/>your image</h3>
                        
                        {/* Decorative Icon */}
                        <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: '#fff', borderRadius: '8px', padding: '8px', display: 'flex' }}>
                          <ImageIcon size={20} color="#7c3aed" />
                        </div>
                      </>
                    )}
                  </label>

                  {/* Image Controls */}
                  {imagePreview && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                      <label style={{ flex: 1, background: '#eaeaea', color: '#555', padding: '12px', borderRadius: '8px', textAlign: 'center', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                        Upload Again
                        <input id="image-reupload" type="file" style={{ display: 'none' }} accept="image/*" onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const reader = new FileReader();
                            reader.onload = (e) => setImagePreview(e.target?.result as string);
                            reader.readAsDataURL(e.target.files[0]);
                          }
                        }} />
                      </label>
                      <button 
                        onClick={() => {
                          setImagePreview(null);
                          const mainInput = document.getElementById('image-upload') as HTMLInputElement;
                          if (mainInput) mainInput.value = '';
                          const reInput = document.getElementById('image-reupload') as HTMLInputElement;
                          if (reInput) reInput.value = '';
                        }}
                        style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}
                      >
                        Delete Poster
                      </button>
                    </div>
                  )}
                </div>

                {/* Right Column - Form Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   
                   {/* Event Name */}
                   <input 
                     placeholder="Event Name" 
                     value={eventName}
                     onChange={e => setEventName(e.target.value)}
                     style={{ 
                       width: '100%', background: 'transparent', border: 'none', 
                       fontSize: '2.5rem', fontWeight: 700, color: '#111',
                       padding: '0 0 1rem 0', outline: 'none', fontFamily: 'Inter, sans-serif'
                     }} 
                   />

                   {/* Event Category */}
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                     <div style={{ position: 'relative' }}>
                       <select 
                         value={category}
                         onChange={e => setCategory(e.target.value)}
                         style={{ 
                           width: '100%', background: '#eaeaea', border: 'none', padding: '16px 20px', 
                           borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, color: '#555',
                           appearance: 'none', outline: 'none', cursor: 'pointer'
                         }}
                       >
                         <option value="" disabled>Event Category</option>
                         <option value="tech">Technology</option>
                         <option value="music">Music</option>
                         <option value="art">Art & Design</option>
                         <option value="sports">Sports</option>
                         <option value="workshop">Workshop</option>
                         <option value="custom">Add your category...</option>
                       </select>
                       <ChevronDown size={20} color="#111" style={{ position: 'absolute', right: '16px', top: '16px', pointerEvents: 'none' }} />
                     </div>
                     {category === 'custom' && (
                        <input 
                          placeholder="Enter your custom category" 
                          value={customCategory}
                          onChange={e => setCustomCategory(e.target.value)}
                          style={{ 
                            width: '100%', background: '#eaeaea', border: 'none', padding: '16px 20px', 
                            borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, color: '#555',
                            outline: 'none'
                          }} 
                        />
                     )}
                   </div>

                   {/* Add Description */}
                   <textarea 
                     placeholder="Add Description" 
                     value={description}
                     onChange={e => setDescription(e.target.value)}
                     style={{ 
                       width: '100%', background: '#eaeaea', border: 'none', padding: '16px 20px', 
                       borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, color: '#555',
                       outline: 'none', minHeight: '100px', resize: 'vertical'
                     }} 
                   />

                   {/* Start / End Date Time Picker Block */}
                   <div style={{ display: 'flex', gap: '1rem', background: '#eaeaea', padding: '20px', borderRadius: '12px' }}>
                     {/* Left Timeline */}
                     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '6px' }}>
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#111' }} />
                       <div style={{ width: '2px', flex: 1, borderLeft: '2px dotted #888', margin: '6px 0' }} />
                       <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #111', background: 'transparent' }} />
                     </div>
                     
                     {/* Right Content */}
                     <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                       {/* Start block */}
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                         <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>Start</div>
                         <div className="mobile-form-row" style={{ display: 'flex', gap: '8px' }}>
                            <input className="mobile-form-col" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ background: '#dcdcdc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#555', border: 'none', outline: 'none', flex: 1 }} />
                            <input className="mobile-form-col" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} style={{ background: '#dcdcdc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#555', border: 'none', outline: 'none', width: '130px' }} />
                         </div>
                       </div>
                       {/* End block */}
                       <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                         <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>End</div>
                         <div className="mobile-form-row" style={{ display: 'flex', gap: '8px' }}>
                            <input className="mobile-form-col" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ background: '#dcdcdc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#555', border: 'none', outline: 'none', flex: 1 }} />
                            <input className="mobile-form-col" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} style={{ background: '#dcdcdc', padding: '8px 12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#555', border: 'none', outline: 'none', width: '130px' }} />
                         </div>
                       </div>
                     </div>
                   </div>

                   {/* Location */}
                   <div style={{ background: '#eaeaea', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflow: 'hidden' }}>
                      <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}
                        onClick={() => {
                          if (!selectedMockLocation) setIsLocationExpanded(true);
                        }}
                      >
                        <MapPin size={20} color="#888" />
                        <div style={{ flex: 1 }}>
                          {selectedMockLocation ? (
                            <>
                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>{selectedMockLocation.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedMockLocation.subtitle}</div>
                            </>
                          ) : (
                            <>
                              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>Add Event Location</div>
                              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>Offline location or virtual link</div>
                            </>
                          )}
                        </div>
                        {selectedMockLocation && (
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               setSelectedMockLocation(null);
                               setLocationSearchTerm('');
                               setLocation('');
                               setIsLocationExpanded(true);
                             }} 
                             style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                           >
                             <X size={18} />
                           </button>
                        )}
                      </div>

                      {/* Expanded Search State */}
                      {!selectedMockLocation && isLocationExpanded && (
                        <div style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                          <input 
                            autoFocus
                            placeholder="Enter location or virtual link"
                            value={locationSearchTerm}
                            onChange={e => setLocationSearchTerm(e.target.value)}
                            style={{ width: '100%', background: 'transparent', borderBottom: '1px solid rgba(0,0,0,0.1)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 600, color: '#555', outline: 'none' }}
                          />
                          
                          {/* Mock Search Results */}
                          <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {locationSearchTerm.trim() !== '' && (
                              <div 
                                onClick={() => {
                                  setSelectedMockLocation({ id: 'custom', title: locationSearchTerm, subtitle: 'Manual Location' });
                                  setLocation(locationSearchTerm);
                                  setIsLocationExpanded(false);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '8px', cursor: 'pointer', borderRadius: '8px', background: 'rgba(0,0,0,0.05)' }}
                              >
                                <MapPin size={16} color="#888" />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#555' }}>Use "{locationSearchTerm}"</div>
                                  <div style={{ fontSize: '0.75rem', color: '#888' }}>Add location manually</div>
                                </div>
                              </div>
                            )}
                            
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', marginTop: locationSearchTerm.trim() !== '' ? '0.5rem' : '0' }}>Recent Locations</div>
                            {MOCK_LOCATIONS.filter(loc => loc.title.toLowerCase().includes(locationSearchTerm.toLowerCase())).map(loc => (
                              <div 
                                key={loc.id} 
                                onClick={() => {
                                  setSelectedMockLocation(loc);
                                  setLocation(loc.title);
                                  setIsLocationExpanded(false);
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '8px', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }}
                                onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                              >
                                <MapPin size={16} color="#888" />
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#555' }}>{loc.title}</div>
                                  <div style={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loc.subtitle}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Map Preview (Uses Free iframe embed trick) */}
                      {selectedMockLocation && (
                        <div style={{ width: '100%', height: '220px', borderRadius: '8px', overflow: 'hidden', marginTop: '0.5rem', background: '#ccc' }}>
                          <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedMockLocation.title)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                            allowFullScreen
                          ></iframe>
                        </div>
                      )}
                   </div>

                   {/* Add Instructions */}
                   <textarea 
                     placeholder="Add Instructions for attendees (e.g., Gate number, Dress code)" 
                     value={instructions}
                     onChange={e => setInstructions(e.target.value)}
                     style={{ 
                       width: '100%', background: '#eaeaea', border: 'none', padding: '16px 20px', 
                       borderRadius: '12px', fontSize: '0.95rem', fontWeight: 600, color: '#555',
                       outline: 'none', minHeight: '80px', resize: 'vertical'
                     }} 
                   />

                   {/* Ticket Price */}
                   <div style={{ background: '#eaeaea', borderRadius: '12px', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Ticket size={20} color="#888" />
                        <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>Ticket Price</div>
                        <select 
                          value={ticketType} 
                          onChange={e => setTicketType(e.target.value as 'Free' | 'Paid')}
                          style={{ background: 'transparent', border: 'none', fontWeight: 700, color: '#555', outline: 'none', cursor: 'pointer', textAlign: 'right' }}
                        >
                          <option value="Free">Free</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>

                      {/* Expanded Paid Fields */}
                      {ticketType === 'Paid' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '1rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Price (₹)</span>
                            <input type="number" placeholder="0" value={ticketPrice} onChange={e => setTicketPrice(e.target.value)} style={{ width: '100px', background: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', textAlign: 'right', fontWeight: 600, outline: 'none' }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Max tickets per user</span>
                            <input type="number" placeholder="e.g. 2" value={maxTickets} onChange={e => setMaxTickets(e.target.value)} style={{ width: '100px', background: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', textAlign: 'right', fontWeight: 600, outline: 'none' }} />
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#555' }}>Refund Policy</span>
                            <select value={refundPolicy} onChange={e => setRefundPolicy(e.target.value)} style={{ background: '#fff', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}>
                              <option value="none">No Refunds</option>
                              <option value="1day">1 Day Before</option>
                              <option value="3days">3 Days Before</option>
                            </select>
                          </div>
                        </div>
                      )}
                   </div>

                   {/* Capacity */}
                   <div style={{ background: '#eaeaea', borderRadius: '12px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <Users size={20} color="#888" />
                      <div style={{ flex: 1, fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>Capacity</div>
                      <input 
                        placeholder="Unlimited" 
                        value={capacity}
                        onChange={e => setCapacity(e.target.value)}
                        style={{ background: 'transparent', border: 'none', textAlign: 'right', fontWeight: 700, color: '#555', width: '100px', outline: 'none' }} 
                      />
                   </div>

                   {/* Action Buttons */}
                   <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {formError && (
                        <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, border: '1px solid #fca5a5' }}>
                          {formError}
                        </div>
                      )}
                      <button 
                        onClick={handleCreateEvent}
                        disabled={isSubmitting}
                        style={{ width: '100%', background: isSubmitting ? '#555' : '#111', color: '#fff', border: 'none', padding: '18px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 800, cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'background 0.2s' }}
                        onMouseOver={e=> { if (!isSubmitting) e.currentTarget.style.background='#000'; }} 
                        onMouseOut={e=> { if (!isSubmitting) e.currentTarget.style.background='#111'; }}
                      >
                        {isSubmitting ? 'Creating Event...' : 'Create Event'}
                      </button>
                   </div>
                </div>
             </div>
           </motion.div>
        )}
      </main>

      <Footer />
      {/* Modals */}
      <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
    </div>
  );
}
