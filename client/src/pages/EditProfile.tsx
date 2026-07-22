import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, Ticket, Target, Settings, HelpCircle, LogOut, Camera, Loader2, Save, GraduationCap, Menu, X, Plus, Lock, Check, Trash2, AlertTriangle, Mail } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

const TABS = [
  { id: 'profile', label: 'My Profile', icon: UserIcon },
  { id: 'education', label: 'Educational Details', icon: GraduationCap },
  { id: 'registrations', label: 'My Registrations', icon: Ticket },
  { id: 'interests', label: 'Interests & Hobbies', icon: Target },
  { id: 'settings', label: 'Settings & Privacy', icon: Settings },
  { id: 'support', label: 'Help & Support', icon: HelpCircle },
];

const INTEREST_OPTIONS = ['Tech', 'Music', 'Sports', 'Gaming', 'Dance', 'Drama', 'Art', 'Literature', 'Photography', 'Business'];

const ACADEMIC_PROGRAMS: Record<string, string[]> = {
  'School of Engineering and Technology': [
    'B.Tech - Computer Science and Engineering',
    'B.Tech - CSE: Artificial Intelligence & Data Science',
    'B.Tech - Cloud Computing (Microsoft / AWS)',
    'B.Tech - Artificial Intelligence & Machine Learning (Xebia / IBM / Samatrix)',
    'B.Tech - Full Stack Web Design & Development (Xebia)',
    'B.Tech - Cyber Security (EC Council, USA)',
    'B.Tech - Data Science & Data Analytics (Samatrix)',
    'B.Tech - Computer Science & Business Systems (TCS - CSBS)',
    'B.Tech - Generative AI (L&T EduTech)',
    'B.Tech - Gaming Technology',
    'B.Tech - AI DevOps & Cloud Automation',
    'B.Tech - CSE: Software Product Engineering (Kalvium)',
    'B.Tech - Civil Engineering (with L&T EduTech)',
    'B.Tech - Electronics & Communication Engineering',
    'B.Tech - Mechanical Engineering',
    'B.Tech (Lateral Entry) - Computer Science / Civil / ECE / Mechanical',
    'M.Tech - Civil (Structural / Transportation / Environmental / Construction)',
    'M.Tech - CSE (Artificial Intelligence / Data Analytics / Cyber Security / Cloud Computing)',
    'M.Tech - ECE (VLSI & Embedded Systems / Digital Communication)',
    'M.Tech - Mechanical (CAD/CAM / Thermal / Production / Design)',
    'M.Tech - Electrical (Power System & Automation / EV Engineering / Renewable Energy)'
  ],
  'School of Computer Applications': [
    'BCA - Bachelor of Computer Applications',
    'BCA - Artificial Intelligence and Data Science',
    'BCA - Health Informatics',
    'BCA (Industry Spec.) - Cyber Security (EC Council, USA)',
    'BCA (Industry Spec.) - Data Science & Data Analytics (Samatrix)',
    'BCA (Industry Spec.) - Cloud Computing & Full Stack Development (IBM)',
    'BCA (Industry Spec.) - Artificial Intelligence & Machine Learning (IBM)',
    'BCA (Industry Spec.) - Cloud Computing (Amazon-AWS)',
    'BCA (Industry Spec.) - Full Stack Web Design & Development (Xebia)',
    'BCA (Industry Spec.) - AI DevOps & Cloud Automation',
    'MCA - Master of Computer Applications',
    'MCA - Artificial Intelligence and Data Science',
    'MCA (Industry Spec.) - Cyber Security (EC Council, USA)',
    'MCA (Industry Spec.) - Artificial Intelligence & Machine Learning (Samatrix)',
    'MCA (Industry Spec.) - Data Science & Data Analytics (Samatrix)',
    'MCA (Industry Spec.) - Cloud Computing & Full Stack Development (IBM)'
  ],
  'School of Business': [
    'BBA - HR / IT / Finance / Marketing / IB / BA',
    'BBA - Banking Financial Service & Insurance',
    'BBA - New Age Digital Marketing',
    'BBA (Industry Spec.) - Data Analytics & Data Visualization (Samatrix)',
    'BBA (Industry Spec.) - Fintech (Zell Education & Deloitte)',
    'B.Com - ABST / EAFM / BADM',
    'B.Com - Capital Market',
    'MBA (Dual) - Human Resource / Marketing / Finance / IT / Operations',
    'MBA - Entrepreneurship & Family Business Management',
    'MBA (Industry Spec.) - Data Analytics & Data Visualization (Samatrix)',
    'MBA (Industry Spec.) - Artificial Intelligence (Samatrix)',
    'MBA (Industry Spec.) - Fintech (Imarticus)',
    'MBA (Industry Spec.) - Global Finance & AI (Imarticus)',
    'MBA (Industry Spec.) - Applied Finance (Deloitte & Zell)'
  ],
  'School of Design': [
    'Bachelor of Design (B.Des) - Interior Design / Jewellery Design',
    'Bachelor of Design (B.Des) - Game Arts & Animation',
    'Bachelor of Design (B.Des) - Fashion Design',
    'Bachelor of Visual Arts (BVA) - Graphic Design / Painting Design',
    'Master of Design (M.Des) - Interior Design',
    'Master of Design (M.Des) - Fashion Design',
    'Masters of Visual Arts (MVA) - Graphic Design',
    'M.Sc. Design - Interior / Jewellery / Graphic / Fashion Design'
  ],
  'School of Humanities and Social Sciences': [
    'BA (Hons.) - English | Psychology | Political Science',
    'BA (Hons.) - Liberal Studies',
    'MA - English | International Relations | Psychology',
    'MA - Political Science | Public Policy & Governance'
  ],
  'School of Economics': [
    'BA (Hons.) - Economics',
    'MA - Economics'
  ],
  'School of Law': [
    'Integrated Law - BA LLB (Hons.)',
    'Integrated Law - B.Sc. LLB (Hons.)',
    'Integrated Law - BBA LLB (Hons.) - Corporate / Criminal Law',
    'LLM - Intellectual Property Rights / Corporate Law / Personal Law'
  ],
  'School of Sciences': [
    'B.Sc. (Hons.) - Microbiology',
    'B.Sc. (Hons.) - Biotechnology',
    'B.Sc. (Hons.) - Forensic Science',
    'M.Sc. - Microbiology',
    'M.Sc. - Biotechnology',
    'M.Sc. - Forensic Science / Digital Forensic',
    'M.Sc. - Material Chemistry / Physics / Chemistry',
    'M.Sc. - Mathematics / Botany / Zoology'
  ],
  'School of Hospitality': [
    'B.Sc. in HHM - Hospitality and Hotel Management'
  ],
  'School of Mass Communications': [
    'BA-JMC - Journalism & Mass Communication',
    'MA-JMC - Journalism & Mass Communication',
    'MA-JMC - Film Making'
  ]
};

export default function EditProfile() {
  const { user, updateProfile, uploadAvatar, logout } = useAuth();
  const [activeTab, setActiveTab] = useState(() => {
    const hash = window.location.hash || '';
    if (hash.includes('tab=settings') || hash.includes('settings')) return 'settings';
    if (hash.includes('tab=education') || hash.includes('education')) return 'education';
    if (hash.includes('tab=interests') || hash.includes('interests')) return 'interests';
    if (hash.includes('tab=registrations') || hash.includes('registrations')) return 'registrations';
    return 'profile';
  });
  const [isMobileTabMenuOpen, setIsMobileTabMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash || '';
      if (hash.includes('tab=settings') || hash.includes('settings')) setActiveTab('settings');
      else if (hash.includes('tab=education') || hash.includes('education')) setActiveTab('education');
      else if (hash.includes('tab=interests') || hash.includes('interests')) setActiveTab('interests');
      else if (hash.includes('tab=registrations') || hash.includes('registrations')) setActiveTab('registrations');
      else if (hash.includes('tab=profile') || hash === '#edit-profile') setActiveTab('profile');
    };

    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  
  // Profile State
  const [profileData, setProfileData] = useState({
    name: '', bio: '', avatar: '', phone: '', age: '', gender: ''
  });
  const [uploading, setUploading] = useState(false);

  // Education State
  const [educationData, setEducationData] = useState({
    collegeName: '',
    department: '',
    course: '',
    year: ''
  });

  // Interests & Hobbies State
  const [interests, setInterests] = useState<string[]>([]);
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [hobbyInput, setHobbyInput] = useState('');

  // Settings State
  const [settings, setSettings] = useState({ notifyEmail: true, publicProfile: true });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [oldPasswordStatus, setOldPasswordStatus] = useState<'idle' | 'verifying' | 'valid' | 'invalid'>('idle');
  const [oldPasswordMsg, setOldPasswordMsg] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Forgot Password OTP State
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'idle' | 'otp' | 'reset'>('idle');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingForgotOtp, setVerifyingForgotOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  // Delete Account State
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Registrations State
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        phone: user.phone || '',
        age: user.age !== undefined && user.age !== null ? user.age.toString() : '',
        gender: user.gender || ''
      });
      setEducationData({
        collegeName: user.education?.collegeName || '',
        department: user.education?.department || '',
        course: user.education?.course || '',
        year: user.education?.year || ''
      });
      setInterests(user.interests || []);
      setHobbies(user.hobbies || []);
      setSettings({
        notifyEmail: user.notifyEmail ?? true,
        publicProfile: user.publicProfile ?? true
      });
    }
  }, [user]);

  const handleAddHobby = () => {
    const trimmed = hobbyInput.trim();
    if (trimmed && !hobbies.includes(trimmed)) {
      setHobbies([...hobbies, trimmed]);
      setHobbyInput('');
    }
  };

  const handleRemoveHobby = (hobbyToRemove: string) => {
    setHobbies(hobbies.filter(h => h !== hobbyToRemove));
  };

  // Automatically verify old password as user types (debounced)
  useEffect(() => {
    if (!passwords.currentPassword) {
      setOldPasswordStatus('idle');
      setOldPasswordMsg('');
      return;
    }

    setOldPasswordStatus('verifying');
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.post('/auth/verify-password', { currentPassword: passwords.currentPassword });
        if (data.valid) {
          setOldPasswordStatus('valid');
          setOldPasswordMsg('Current password verified!');
        } else {
          setOldPasswordStatus('invalid');
          setOldPasswordMsg('Incorrect current password!');
        }
      } catch {
        setOldPasswordStatus('invalid');
        setOldPasswordMsg('Incorrect current password!');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [passwords.currentPassword]);

  const handleChangePasswordSubmit = async () => {
    if (oldPasswordStatus !== 'valid') {
      return showMessage('error', 'Please verify your current password first');
    }
    if (!passwords.newPassword || passwords.newPassword.length < 6) {
      return showMessage('error', 'New password must be at least 6 characters');
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      return showMessage('error', 'New password and confirm password do not match');
    }

    setChangingPassword(true);
    try {
      await api.patch('/auth/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      showMessage('success', 'Password updated successfully! Next time sign in with your new password.');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setOldPasswordStatus('idle');
      setOldPasswordMsg('');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleSendForgotOtp = async () => {
    setSendingOtp(true);
    try {
      await api.post('/auth/forgot-password-send-otp', { email: user?.email });
      showMessage('success', `Verification code sent to ${user?.email}`);
      setForgotPasswordStep('otp');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyForgotOtp = async () => {
    if (!forgotOtp.trim()) return showMessage('error', 'Please enter the 6-digit OTP');
    setVerifyingForgotOtp(true);
    try {
      const { data } = await api.post('/auth/forgot-password-verify-otp', { email: user?.email, otp: forgotOtp.trim() });
      if (data.valid) {
        showMessage('success', 'OTP verified! Set your new password below.');
        setForgotPasswordStep('reset');
      } else {
        showMessage('error', data.message || 'Invalid or expired OTP');
      }
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Invalid or expired OTP');
    } finally {
      setVerifyingForgotOtp(false);
    }
  };

  const handleResetPasswordWithOtp = async () => {
    if (!forgotNewPassword || forgotNewPassword.length < 6) {
      return showMessage('error', 'New password must be at least 6 characters');
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      return showMessage('error', 'New passwords do not match');
    }
    setResettingPassword(true);
    try {
      await api.post('/auth/reset-password-otp', {
        email: user?.email,
        otp: forgotOtp.trim(),
        newPassword: forgotNewPassword
      });
      showMessage('success', 'Password reset successfully! Sign in with your new password.');
      setForgotPasswordStep('idle');
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    setDeletingAccount(true);
    try {
      await api.delete('/auth/account');
      showMessage('success', 'Your account has been deleted successfully');
      setTimeout(() => {
        logout();
        window.location.hash = '#home';
      }, 1000);
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Failed to delete account');
      setDeletingAccount(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegisteredEvents();
    }
  }, [activeTab]);

  const fetchRegisteredEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await api.get('/events/registered');
      setRegisteredEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEvents(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg({ type: '', text: '' }), 3000);
  };

  const handleSaveProfile = async () => {
    if (!profileData.name.trim()) return showMessage('error', 'Name is required');
    setSaving(true);
    try {
      await updateProfile({
        name: profileData.name.trim(),
        bio: profileData.bio,
        avatar: profileData.avatar,
        phone: profileData.phone,
        age: profileData.age !== '' ? Number(profileData.age) : undefined,
        gender: profileData.gender
      });
      showMessage('success', 'Profile updated successfully');
    } catch {
      showMessage('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveEducation = async () => {
    setSaving(true);
    try {
      await updateProfile({
        education: educationData
      });
      showMessage('success', 'Educational details updated successfully');
    } catch {
      showMessage('error', 'Failed to update educational details');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(file);
      setProfileData(p => ({ ...p, avatar: url }));
      showMessage('success', 'Image uploaded successfully');
    } catch {
      showMessage('error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveInterests = async () => {
    setSaving(true);
    try {
      await updateProfile({
        interests,
        hobbies
      });
      showMessage('success', 'Interests & Hobbies updated successfully');
    } catch {
      showMessage('error', 'Failed to update interests');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await api.patch('/auth/settings', settings);
      showMessage('success', 'Privacy & Notification settings updated successfully');
    } catch (err: any) {
      showMessage('error', err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const currentTabObj = TABS.find(t => t.id === activeTab);
  const ActiveTabIcon = currentTabObj?.icon;

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', paddingTop: '80px', paddingBottom: '40px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div className="edit-profile-container">
        
        {/* Desktop Sidebar */}
        <div className="edit-profile-sidebar">
          <div style={{ background: '#F8F9FA', borderRadius: '16px', padding: '24px 16px', border: '1px solid #EAEAEA', position: 'sticky', top: '100px' }}>
            
            {/* User Header in Sidebar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', padding: '0 8px' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#EAEAEA', overflow: 'hidden', flexShrink: 0 }}>
                {profileData.avatar ? (
                  <img src={profileData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <UserIcon size={24} color="#888" style={{ margin: '12px' }} />
                )}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Guest'}</h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #EAEAEA', margin: '0 0 16px 0' }} />

            {/* Navigation Tabs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {TABS.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                      background: isActive ? '#FEE2E2' : 'transparent',
                      color: isActive ? '#DC2626' : '#444',
                      border: 'none', borderRadius: '12px', cursor: 'pointer',
                      fontSize: '0.95rem', fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.2s', textAlign: 'left'
                    }}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
              
              <hr style={{ border: 'none', borderTop: '1px solid #EAEAEA', margin: '12px 0' }} />
              
              <button
                onClick={() => {
                  logout();
                  window.location.hash = '#home';
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                  background: 'transparent', color: '#DC2626', border: 'none', borderRadius: '12px',
                  cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, textAlign: 'left'
                }}
              >
                <LogOut size={20} />
                Log Out
              </button>
              
              <button
                onClick={() => setShowDeleteConfirmModal(true)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                  background: 'rgba(220,38,38,0.05)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)',
                  borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, textAlign: 'left',
                  marginTop: '8px'
                }}
              >
                <Trash2 size={20} />
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Header Bar & Hamburger Drawer */}
        <div className="mobile-tab-bar" style={{ width: '100%', display: 'none', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF', padding: '12px 16px', borderRadius: '12px', border: '1px solid #EAEAEA', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <button
              onClick={() => setIsMobileTabMenuOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#FEE2E2', color: '#DC2626', border: 'none', padding: '8px 14px', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
            >
              <Menu size={20} />
              <span>Menu</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#111', fontSize: '0.95rem' }}>
              {ActiveTabIcon && <ActiveTabIcon size={18} color="#DC2626" />}
              <span>{currentTabObj?.label}</span>
            </div>
          </div>
        </div>

        {/* Mobile Drawer Modal */}
        <AnimatePresence>
          {isMobileTabMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileTabMenuOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99999, display: 'flex', justifyContent: 'flex-start' }}
            >
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                onClick={e => e.stopPropagation()}
                style={{ width: '280px', height: '100%', background: '#FFF', padding: '24px 16px', display: 'flex', flexDirection: 'column', boxShadow: '4px 0 24px rgba(0,0,0,0.15)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#111' }}>Navigation Menu</h3>
                  <button onClick={() => setIsMobileTabMenuOpen(false)} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={18} color="#4B5563" />
                  </button>
                </div>

                {/* Mobile Drawer User Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '12px', background: '#F9FAFB', borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#EAEAEA', overflow: 'hidden', flexShrink: 0 }}>
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserIcon size={20} color="#888" style={{ margin: '11px' }} />
                    )}
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Guest'}</h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#666', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #EAEAEA', margin: '0 0 16px 0' }} />

                {/* Mobile Drawer Tabs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto' }}>
                  {TABS.map(tab => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileTabMenuOpen(false);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                          background: isActive ? '#FEE2E2' : 'transparent',
                          color: isActive ? '#DC2626' : '#444',
                          border: 'none', borderRadius: '12px', cursor: 'pointer',
                          fontSize: '0.95rem', fontWeight: isActive ? 700 : 500,
                          textAlign: 'left'
                        }}
                      >
                        <tab.icon size={20} />
                        {tab.label}
                      </button>
                    );
                  })}
                  
                  <hr style={{ border: 'none', borderTop: '1px solid #EAEAEA', margin: '12px 0' }} />
                  
                  <button
                    onClick={() => {
                      logout();
                      window.location.hash = '#home';
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                      background: 'transparent', color: '#DC2626', border: 'none', borderRadius: '12px',
                      cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, textAlign: 'left'
                    }}
                  >
                    <LogOut size={20} />
                    Log Out
                  </button>

                  <button
                    onClick={() => {
                      setIsMobileTabMenuOpen(false);
                      setShowDeleteConfirmModal(true);
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                      background: 'rgba(220,38,38,0.05)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.15)',
                      borderRadius: '12px', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, textAlign: 'left',
                      marginTop: '8px'
                    }}
                  >
                    <Trash2 size={20} />
                    Delete Account
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="edit-profile-content">
          
          {/* Header & Notifications */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <h2 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 800, color: '#111' }}>
              {currentTabObj?.label}
            </h2>
            <AnimatePresence>
              {msg.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600,
                    background: msg.type === 'success' ? '#DCFCE7' : '#FEE2E2',
                    color: msg.type === 'success' ? '#166534' : '#991B1B'
                  }}
                >
                  {msg.text}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Tab Contents */}
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Avatar Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: 100, height: 100, borderRadius: '50%', background: '#F3F4F6', overflow: 'hidden', border: '3px solid #FFF', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                    {profileData.avatar ? (
                      <img src={profileData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <UserIcon size={40} color="#9CA3AF" style={{ margin: '27px' }} />
                    )}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#111' }}>Profile Picture</h4>
                    <label style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: '#FEE2E2', color: '#DC2626', padding: '8px 16px', borderRadius: '8px',
                      cursor: uploading ? 'wait' : 'pointer', fontWeight: 600, fontSize: '0.9rem'
                    }}>
                      {uploading ? <Loader2 size={16} className="animate-spin" /> : <Camera size={16} />}
                      {uploading ? 'Uploading...' : 'Upload Custom Image'}
                      <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={uploading} />
                    </label>
                  </div>
                </div>

                <div>
                  <p style={{ margin: '8px 0 8px 0', fontSize: '0.85rem', fontWeight: 600, color: '#6B7280' }}>Or Choose an AI Avatar:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {[
                      'https://api.dicebear.com/7.x/lorelei/svg?seed=Alexander',
                      'https://api.dicebear.com/7.x/lorelei/svg?seed=Sophia',
                      'https://api.dicebear.com/7.x/lorelei/svg?seed=Leo',
                      'https://api.dicebear.com/7.x/lorelei/svg?seed=Mia',
                      'https://api.dicebear.com/7.x/notionists/svg?seed=Ethan',
                      'https://api.dicebear.com/7.x/notionists/svg?seed=Zoe',
                      'https://api.dicebear.com/7.x/micah/svg?seed=Lucas',
                      'https://api.dicebear.com/7.x/micah/svg?seed=Emma',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Aria',
                      'https://api.dicebear.com/7.x/adventurer/svg?seed=Jack',
                      'https://api.dicebear.com/7.x/bottts/svg?seed=CyberTech',
                      'https://api.dicebear.com/7.x/bottts/svg?seed=Pulse'
                    ].map((avatarUrl, idx) => (
                      <div
                        key={idx}
                        onClick={() => setProfileData(p => ({ ...p, avatar: avatarUrl }))}
                        style={{
                          width: '44px', height: '44px', borderRadius: '50%',
                          border: profileData.avatar === avatarUrl ? '3px solid #DC2626' : '1px solid #E5E7EB',
                          padding: '2px', background: '#FFF', cursor: 'pointer', transition: 'all 0.15s'
                        }}
                      >
                        <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Grid */}
              <div className="edit-profile-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>First & Last Name *</label>
                  <input
                    value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})}
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Email Address</label>
                  <input
                    value={user?.email || ''} disabled
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #E5E7EB', background: '#F3F4F6', color: '#6B7280', fontSize: '0.95rem', outline: 'none', cursor: 'not-allowed' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Phone Number</label>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #D1D5DB', borderRadius: '10px', overflow: 'hidden', background: '#FFF' }}>
                    <span style={{ padding: '12px 14px', background: '#F3F4F6', borderRight: '1px solid #D1D5DB', color: '#374151', fontWeight: 700, fontSize: '0.95rem', fontFamily: 'Inter, sans-serif', userSelect: 'none' }}>
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={profileData.phone ? profileData.phone.replace(/^\+91\s?/, '') : ''}
                      onChange={e => {
                        const digits = e.target.value.replace(/\D/g, '');
                        setProfileData({ ...profileData, phone: digits ? `+91 ${digits}` : '' });
                      }}
                      placeholder="Enter 10-digit phone number"
                      style={{ width: '100%', padding: '12px 16px', border: 'none', background: '#FFF', fontSize: '0.95rem', outline: 'none', fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>
                <div className="edit-profile-subgrid">
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Age</label>
                    <input
                      type="number" value={profileData.age} onChange={e => setProfileData({...profileData, age: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Gender</label>
                    <select
                      value={profileData.gender} onChange={e => setProfileData({...profileData, gender: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Bio</label>
                  <textarea
                    value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})}
                    rows={4} placeholder="Tell us about yourself..."
                    style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: 'Inter, sans-serif' }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSaveProfile} disabled={saving}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DC2626', color: '#FFF',
                    padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: saving ? 'wait' : 'pointer'
                  }}
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'education' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#111' }}>Academic & College Info</h3>
                <p style={{ margin: '0 0 20px 0', color: '#6B7280', fontSize: '0.9rem' }}>Keep your educational background up to date for event eligibility and team registrations.</p>
                
                <div className="edit-profile-grid">
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>College / University Name</label>
                    <input
                      value={educationData.collegeName} onChange={e => setEducationData({...educationData, collegeName: e.target.value})}
                      placeholder="e.g. JECRC University, Jaipur"
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.95rem', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Department / School</label>
                    <select
                      value={educationData.department}
                      onChange={e => {
                        const newDept = e.target.value;
                        setEducationData(prev => ({
                          ...prev,
                          department: newDept,
                          course: (ACADEMIC_PROGRAMS[newDept] && ACADEMIC_PROGRAMS[newDept].includes(prev.course)) ? prev.course : ''
                        }));
                      }}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Select Department / School</option>
                      {Object.keys(ACADEMIC_PROGRAMS).map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                      {educationData.department && !Object.keys(ACADEMIC_PROGRAMS).includes(educationData.department) && educationData.department !== 'Other' && (
                        <option value={educationData.department}>{educationData.department}</option>
                      )}
                      <option value="Other">Other / Custom Department</option>
                    </select>
                    {educationData.department === 'Other' && (
                      <input
                        placeholder="Type custom department name..."
                        onChange={e => setEducationData({...educationData, department: e.target.value})}
                        style={{ width: '100%', marginTop: '8px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.9rem', outline: 'none' }}
                      />
                    )}
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Course / Degree & Specialization</label>
                    <select
                      value={educationData.course}
                      onChange={e => setEducationData({...educationData, course: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Select Course / Program</option>
                      {educationData.department && ACADEMIC_PROGRAMS[educationData.department] ? (
                        ACADEMIC_PROGRAMS[educationData.department].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))
                      ) : (
                        Object.entries(ACADEMIC_PROGRAMS).map(([dept, courses]) => (
                          <optgroup key={dept} label={dept}>
                            {courses.map(c => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </optgroup>
                        ))
                      )}
                      {educationData.course && !Object.values(ACADEMIC_PROGRAMS).flat().includes(educationData.course) && educationData.course !== 'Other' && (
                        <option value={educationData.course}>{educationData.course}</option>
                      )}
                      <option value="Other">Other / Custom Course</option>
                    </select>
                    {educationData.course === 'Other' && (
                      <input
                        placeholder="Type custom course / degree..."
                        onChange={e => setEducationData({...educationData, course: e.target.value})}
                        style={{ width: '100%', marginTop: '8px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.9rem', outline: 'none' }}
                      />
                    )}
                  </div>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>Year of Study / Graduation Year</label>
                    <select
                      value={educationData.year} onChange={e => setEducationData({...educationData, year: e.target.value})}
                      style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.95rem', outline: 'none', cursor: 'pointer' }}
                    >
                      <option value="">Select Year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="5th Year / Dual Degree">5th Year / Dual Degree</option>
                      <option value="Postgraduate">Postgraduate</option>
                      <option value="Alumni / Graduated">Alumni / Graduated</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSaveEducation} disabled={saving}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DC2626', color: '#FFF',
                    padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: saving ? 'wait' : 'pointer'
                  }}
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Education Details
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'registrations' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {loadingEvents ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 size={32} className="animate-spin" color="#DC2626" /></div>
              ) : registeredEvents.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', background: '#FFF', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
                  <Ticket size={48} color="#D1D5DB" style={{ margin: '0 auto 16px' }} />
                  <h3 style={{ margin: '0 0 8px', color: '#111' }}>No Registrations Yet</h3>
                  <p style={{ margin: 0, color: '#6B7280' }}>You haven't registered for any events.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {registeredEvents.map(ev => (
                    <div key={ev._id} style={{ display: 'flex', gap: '20px', background: '#FFF', padding: '20px', borderRadius: '12px', border: '1px solid #EAEAEA', alignItems: 'center' }}>
                      <img src={ev.image || 'https://via.placeholder.com/100'} alt="" style={{ width: 80, height: 80, borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#111' }}>{ev.title}</h4>
                        <p style={{ margin: '0 0 8px 0', color: '#6B7280', fontSize: '0.9rem' }}>{ev.date || 'TBA'} • {ev.venue || 'TBA'}</p>
                        <span style={{ display: 'inline-block', background: '#DCFCE7', color: '#166534', padding: '4px 12px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700 }}>Registered</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'interests' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#111' }}>Event Categories</h3>
                <p style={{ margin: '0 0 20px 0', color: '#6B7280', fontSize: '0.9rem' }}>Select the types of events you want us to recommend.</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {INTEREST_OPTIONS.map(opt => {
                    const isSelected = interests.includes(opt);
                    return (
                      <button
                        key={opt} onClick={() => toggleInterest(opt)}
                        style={{
                          padding: '8px 16px', borderRadius: '99px', fontSize: '0.9rem', fontWeight: 600,
                          border: `1px solid ${isSelected ? '#DC2626' : '#D1D5DB'}`,
                          background: isSelected ? '#FEE2E2' : '#FFF',
                          color: isSelected ? '#DC2626' : '#4B5563',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', color: '#111' }}>Other Hobbies</h3>
                <p style={{ margin: '0 0 16px 0', color: '#6B7280', fontSize: '0.9rem' }}>Type a hobby and click <strong>Add</strong> to add it to your list.</p>
                
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    value={hobbyInput}
                    onChange={e => setHobbyInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHobby();
                      }
                    }}
                    placeholder="Enter a hobby (e.g. Reading, Chess, Traveling)..."
                    style={{ flex: 1, padding: '12px 16px', borderRadius: '10px', border: '1px solid #D1D5DB', background: '#FFF', fontSize: '0.95rem', outline: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={handleAddHobby}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      background: '#DC2626', color: '#FFF', padding: '12px 20px',
                      borderRadius: '10px', border: 'none', fontWeight: 700, fontSize: '0.9rem',
                      cursor: 'pointer', flexShrink: 0
                    }}
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>

                {hobbies.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                    {hobbies.map((hobby, idx) => (
                      <span
                        key={idx}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: '#FEE2E2', color: '#DC2626', padding: '6px 14px',
                          borderRadius: '99px', fontWeight: 600, fontSize: '0.9rem', border: '1px solid #FECACA'
                        }}
                      >
                        {hobby}
                        <X size={14} style={{ cursor: 'pointer' }} onClick={() => handleRemoveHobby(hobby)} />
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSaveInterests} disabled={saving}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DC2626', color: '#FFF',
                    padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: saving ? 'wait' : 'pointer'
                  }}
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Interests
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#111' }}>Privacy & Notifications</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #F3F4F6' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#111' }}>Public Profile</h4>
                    <p style={{ margin: 0, color: '#6B7280', fontSize: '0.85rem' }}>Allow others to see your basic profile details.</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                    <input type="checkbox" checked={settings.publicProfile} onChange={e => setSettings({...settings, publicProfile: e.target.checked})} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.publicProfile ? '#DC2626' : '#D1D5DB', transition: '.4s', borderRadius: '34px' }}>
                      <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: settings.publicProfile ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                    </span>
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#111' }}>Email Notifications</h4>
                    <p style={{ margin: 0, color: '#6B7280', fontSize: '0.85rem' }}>Receive updates about your registered events.</p>
                  </div>
                  <label style={{ position: 'relative', display: 'inline-block', width: '44px', height: '24px' }}>
                    <input type="checkbox" checked={settings.notifyEmail} onChange={e => setSettings({...settings, notifyEmail: e.target.checked})} style={{ opacity: 0, width: 0, height: 0 }} />
                    <span style={{ position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: settings.notifyEmail ? '#DC2626' : '#D1D5DB', transition: '.4s', borderRadius: '34px' }}>
                      <span style={{ position: 'absolute', content: '""', height: '18px', width: '18px', left: settings.notifyEmail ? '22px' : '3px', bottom: '3px', backgroundColor: 'white', transition: '.4s', borderRadius: '50%' }}></span>
                    </span>
                  </label>
                </div>
              </div>

              {user?.authProvider !== 'google' && (
                <div style={{ background: '#FFF', padding: '24px', borderRadius: '12px', border: '1px solid #EAEAEA', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem', color: '#111', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Lock size={18} color="#DC2626" /> Change Password
                    </h3>
                    <p style={{ margin: 0, color: '#6B7280', fontSize: '0.85rem' }}>
                      Enter your current password to verify your identity, then set your new password.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                    {/* 1. Current / Old Password Field */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>
                        Current (Old) Password *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="password"
                          value={passwords.currentPassword}
                          onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                          placeholder="Enter your current password..."
                          style={{
                            width: '100%', padding: '12px 42px 12px 16px', borderRadius: '10px',
                            border: `1px solid ${
                              oldPasswordStatus === 'valid' ? '#16A34A' :
                              oldPasswordStatus === 'invalid' ? '#DC2626' : '#D1D5DB'
                            }`,
                            background: '#FFF', fontSize: '0.95rem', outline: 'none'
                          }}
                        />
                        {oldPasswordStatus === 'verifying' && (
                          <div style={{ position: 'absolute', right: '14px', top: '12px' }}>
                            <Loader2 size={18} className="animate-spin" color="#7c3aed" />
                          </div>
                        )}
                        {oldPasswordStatus === 'valid' && (
                          <div style={{ position: 'absolute', right: '14px', top: '12px' }}>
                            <Check size={18} color="#16A34A" />
                          </div>
                        )}
                        {oldPasswordStatus === 'invalid' && (
                          <div style={{ position: 'absolute', right: '14px', top: '12px' }}>
                            <X size={18} color="#DC2626" />
                          </div>
                        )}
                      </div>

                      {/* Real-time status feedback for Old Password & Forgot Password button */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <div>
                          {oldPasswordStatus === 'valid' && (
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Check size={14} /> Current password verified!
                            </p>
                          )}
                          {oldPasswordStatus === 'invalid' && (
                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#991B1B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <X size={14} /> {oldPasswordMsg || 'Incorrect current password!'}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleSendForgotOtp}
                          disabled={sendingOtp}
                          style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', padding: 0, textDecoration: 'underline' }}
                        >
                          {sendingOtp ? 'Sending OTP...' : 'Forgot Password?'}
                        </button>
                      </div>
                    </div>

                    {/* Forgot Password OTP Verification Step */}
                    {forgotPasswordStep === 'otp' && (
                      <div style={{ background: '#FFF5F5', padding: '16px', borderRadius: '10px', border: '1px solid #FECACA', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Mail size={18} color="#DC2626" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#991B1B' }}>
                            We sent a 6-digit OTP to {user?.email}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input
                            type="text"
                            maxLength={6}
                            value={forgotOtp}
                            onChange={e => setForgotOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP..."
                            style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #FCA5A5', fontSize: '0.95rem', background: '#FFF', outline: 'none' }}
                          />
                          <button
                            type="button"
                            onClick={handleVerifyForgotOtp}
                            disabled={verifyingForgotOtp}
                            style={{ background: '#DC2626', color: '#FFF', padding: '10px 18px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            {verifyingForgotOtp ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            Verify OTP
                          </button>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <button
                            type="button"
                            onClick={handleSendForgotOtp}
                            style={{ background: 'none', border: 'none', color: '#7C3AED', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                          >
                            Resend OTP
                          </button>
                          <button
                            type="button"
                            onClick={() => setForgotPasswordStep('idle')}
                            style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Forgot Password Reset Form Step */}
                    {forgotPasswordStep === 'reset' && (
                      <div style={{ background: '#F0FDF4', padding: '16px', borderRadius: '10px', border: '1px solid #BBF7D0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Check size={18} color="#166534" />
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#166534' }}>
                            OTP Verified! Enter your new password below:
                          </span>
                        </div>
                        <input
                          type="password"
                          value={forgotNewPassword}
                          onChange={e => setForgotNewPassword(e.target.value)}
                          placeholder="Enter new password (min 6 chars)..."
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #86EFAC', fontSize: '0.95rem', background: '#FFF', outline: 'none' }}
                        />
                        <input
                          type="password"
                          value={forgotConfirmPassword}
                          onChange={e => setForgotConfirmPassword(e.target.value)}
                          placeholder="Confirm new password..."
                          style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #86EFAC', fontSize: '0.95rem', background: '#FFF', outline: 'none' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                          <button
                            type="button"
                            onClick={() => setForgotPasswordStep('idle')}
                            style={{ background: '#E5E7EB', color: '#374151', padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleResetPasswordWithOtp}
                            disabled={resettingPassword}
                            style={{ background: '#16A34A', color: '#FFF', padding: '8px 20px', borderRadius: '8px', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            {resettingPassword ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save New Password
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 2. New Password Field */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>
                        New Password * (Min 6 characters)
                      </label>
                      <input
                        type="password"
                        value={passwords.newPassword}
                        disabled={oldPasswordStatus !== 'valid'}
                        onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                        placeholder={oldPasswordStatus === 'valid' ? 'Enter new password...' : 'Verify current password first'}
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: '10px',
                          border: '1px solid #D1D5DB',
                          background: oldPasswordStatus === 'valid' ? '#FFF' : '#F9FAFB',
                          color: oldPasswordStatus === 'valid' ? '#111' : '#9CA3AF',
                          fontSize: '0.95rem', outline: 'none',
                          cursor: oldPasswordStatus === 'valid' ? 'text' : 'not-allowed'
                        }}
                      />
                    </div>

                    {/* 3. Confirm New Password Field */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#4B5563', marginBottom: '8px' }}>
                        Confirm New Password *
                      </label>
                      <input
                        type="password"
                        value={passwords.confirmPassword}
                        disabled={oldPasswordStatus !== 'valid'}
                        onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        placeholder={oldPasswordStatus === 'valid' ? 'Re-enter new password...' : 'Verify current password first'}
                        style={{
                          width: '100%', padding: '12px 16px', borderRadius: '10px',
                          border: `1px solid ${
                            passwords.confirmPassword.length > 0
                              ? (passwords.newPassword === passwords.confirmPassword ? '#16A34A' : '#DC2626')
                              : '#D1D5DB'
                          }`,
                          background: oldPasswordStatus === 'valid' ? '#FFF' : '#F9FAFB',
                          color: oldPasswordStatus === 'valid' ? '#111' : '#9CA3AF',
                          fontSize: '0.95rem', outline: 'none',
                          cursor: oldPasswordStatus === 'valid' ? 'text' : 'not-allowed'
                        }}
                      />
                      
                      {/* Real-time Match Feedback */}
                      {passwords.confirmPassword.length > 0 && passwords.newPassword === passwords.confirmPassword && (
                        <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Check size={14} /> New passwords match!
                        </p>
                      )}
                      {passwords.confirmPassword.length > 0 && passwords.newPassword !== passwords.confirmPassword && (
                        <p style={{ margin: '6px 0 0 0', fontSize: '0.8rem', color: '#991B1B', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <X size={14} /> Passwords do not match!
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Dedicated Save New Password Button */}
                  {oldPasswordStatus === 'valid' && passwords.newPassword.length >= 6 && passwords.newPassword === passwords.confirmPassword && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                      <button
                        onClick={handleChangePasswordSubmit}
                        disabled={changingPassword}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '8px',
                          background: '#DC2626', color: '#FFF', padding: '10px 22px',
                          borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem',
                          border: 'none', cursor: changingPassword ? 'wait' : 'pointer'
                        }}
                      >
                        {changingPassword ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                        Save New Password
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleSaveSettings} disabled={saving}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#DC2626', color: '#FFF',
                    padding: '12px 24px', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', border: 'none', cursor: saving ? 'wait' : 'pointer'
                  }}
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Settings
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 20px', background: '#FFF', borderRadius: '12px', border: '1px solid #EAEAEA' }}>
              <HelpCircle size={48} color="#DC2626" style={{ margin: '0 auto 20px' }} />
              <h2 style={{ margin: '0 0 12px 0', fontSize: '1.5rem', color: '#111' }}>Need Help?</h2>
              <p style={{ margin: '0 auto 24px', color: '#6B7280', fontSize: '1rem', maxWidth: '500px', lineHeight: 1.5 }}>
                If you encounter any issues, experience a bug, or require any assistance while using the website, please feel free to reach out to our support team at:
                <br /><br />
                <strong>findmyevent11@gmail.com</strong>
              </p>
              <a 
                href="mailto:findmyevent11@gmail.com"
                style={{
                  display: 'inline-block', background: '#FEE2E2', color: '#DC2626',
                  padding: '12px 32px', borderRadius: '99px', fontWeight: 700, textDecoration: 'none', fontSize: '1rem'
                }}
              >
                Send Email
              </a>
            </motion.div>
          )}

        </div>
      </div>

      {/* Delete Account Confirmation Warning Modal */}
      <AnimatePresence>
        {showDeleteConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirmModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '440px', background: '#FFF', borderRadius: '20px', padding: '28px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '1px solid #EAEAEA' }}
            >
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#FEE2E2', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <AlertTriangle size={30} color="#DC2626" />
                </div>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: '#111' }}>Delete Account?</h3>
                <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  Are you sure you want to delete your account? This action is permanent and will completely remove your profile, registered events, and all associated data. You will not be able to log in with this email again unless you create a new account.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirmModal(false)}
                  disabled={deletingAccount}
                  style={{ padding: '10px 18px', borderRadius: '10px', background: '#F3F4F6', color: '#4B5563', border: 'none', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccountConfirm}
                  disabled={deletingAccount}
                  style={{ padding: '10px 20px', borderRadius: '10px', background: '#DC2626', color: '#FFF', border: 'none', fontWeight: 700, fontSize: '0.9rem', cursor: deletingAccount ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {deletingAccount ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                  Yes, Delete My Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .edit-profile-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          gap: 30px;
        }

        .edit-profile-sidebar {
          width: 280px;
          flex-shrink: 0;
        }

        .edit-profile-content {
          flex: 1;
          background: #F8F9FA;
          border-radius: 16px;
          padding: 32px;
          border: 1px solid #EAEAEA;
          min-height: 600px;
        }

        .edit-profile-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .edit-profile-subgrid {
          display: flex;
          gap: 20px;
        }

        @media (max-width: 768px) {
          .edit-profile-container {
            flex-direction: column;
            padding: 0 12px;
            gap: 16px;
          }
          .edit-profile-sidebar {
            display: none !important;
          }
          .mobile-tab-bar {
            display: flex !important;
          }
          .edit-profile-content {
            padding: 20px 14px !important;
            border-radius: 12px !important;
          }
          .edit-profile-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .edit-profile-subgrid {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}
