import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Loader2, Plus, GraduationCap, UserIcon, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import api from '../api/axios';

type AuthStep = 'email' | 'login' | 'signup' | 'otp' | 'profile' | 'welcome' | 'forgot_password_otp' | 'forgot_password_reset';

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

const Auth: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('email');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
  const [profileData, setProfileData] = useState({
    name: formData.name || '',
    bio: '',
    avatar: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Alexander',
    phone: '',
    age: '',
    gender: '',
    interests: '',
    hobbies: '',
    education: {
      collegeName: '',
      department: '',
      course: '',
      year: ''
    }
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { register, verifyOtp, handleLogin, setupProfile, uploadAvatar, user, isLoggedIn } = useAuth();

  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  const handleForgotSendOtp = async () => {
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password-send-otp', { email: formData.email });
      setStep('forgot_password_otp');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.otp) return;
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/forgot-password-verify-otp', { email: formData.email, otp: formData.otp });
      setStep('forgot_password_reset');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotNewPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (forgotNewPassword !== forgotConfirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/reset-password-otp', { email: formData.email, otp: formData.otp, newPassword: forgotNewPassword });
      setStep('login');
      setFormData({ ...formData, password: '', otp: '' });
      setForgotNewPassword('');
      setForgotConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  React.useEffect(() => {
    if (isLoggedIn && user) {
      setProfileData(prev => ({
        ...prev,
        name: prev.name || user.name || formData.name || '',
        bio: user.bio || prev.bio,
        avatar: user.avatar || prev.avatar,
        phone: user.phone || prev.phone,
        age: user.age !== undefined && user.age !== null ? user.age.toString() : prev.age,
        gender: user.gender || prev.gender,
        education: {
          collegeName: user.education?.collegeName || prev.education.collegeName,
          department: user.education?.department || prev.education.department,
          course: user.education?.course || prev.education.course,
          year: user.education?.year || prev.education.year,
        }
      }));
      if (!user.hasCompletedProfile) {
        setStep('profile');
      }
    }
  }, [isLoggedIn, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setStep('login'); 
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (step === 'login') {
        sessionStorage.setItem('loggingIn', 'true');
        const result = await handleLogin(formData.email, formData.password);
        if (result.user?.role === 'admin') {
          window.location.hash = '#admin';
        } else if (result.user?.role === 'organizer') {
          window.location.hash = '#organizer-dashboard';
        } else if (!result.user?.hasCompletedProfile) {
          setStep('profile');
        } else {
          window.location.hash = '#home';
        }
        setTimeout(() => sessionStorage.removeItem('loggingIn'), 1000);
      } else if (step === 'signup') {
        await register(formData.name, formData.email, formData.password);
        setStep('otp');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      sessionStorage.removeItem('loggingIn');
      await verifyOtp(formData.email, formData.otp);
      setStep('profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError('');
    try {
      const url = await uploadAvatar(file);
      setProfileData({ ...profileData, avatar: url });
    } catch (err: any) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setupProfile({
        name: profileData.name,
        bio: profileData.bio,
        avatar: profileData.avatar,
        phone: profileData.phone,
        age: profileData.age ? parseInt(profileData.age as string) : undefined,
        gender: profileData.gender,
        education: profileData.education,
        interests: profileData.interests.split(',').map(i => i.trim()).filter(i => i !== ''),
        hobbies: profileData.hobbies.split(',').map(h => h.trim()).filter(h => h !== '')
      });
      setStep('welcome');
      sessionStorage.setItem('loggingIn', 'true');
      setTimeout(() => { window.location.hash = '#home'; }, 3000);
    } catch { setError('Failed to setup profile'); }
    finally { setIsSubmitting(false); }
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
  );

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '0.875rem 1rem', borderRadius: '10px',
    border: '1px solid #ddd', background: '#fff', fontSize: '0.95rem',
    outline: 'none', transition: 'border 0.2s', color: '#111', fontFamily: 'Inter, sans-serif',
  };

  const btnPrimary: React.CSSProperties = {
    width: '100%', padding: '0.875rem', borderRadius: '10px', border: 'none',
    background: '#e5e5e5', color: '#333', fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s',
  };

  const btnDark: React.CSSProperties = {
    width: '100%', padding: '0.875rem', borderRadius: '10px', border: 'none',
    background: '#111', color: '#fff', fontSize: '0.95rem', fontWeight: 600,
    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
  };

  const renderStep = () => {
    if (step === 'welcome') {
      return (
        <motion.div key="welcome" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} style={{ width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 1.5rem', border: '3px solid #7c3aed', padding: '4px', background: 'white' }}>
            <img src={profileData.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          </motion.div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111' }}>Hello, {user?.name ? user.name.split(' ')[0] : 'there'}</h1>
          <p style={{ color: '#888', marginTop: '0.75rem' }}>Your profile has been created successfully. Redirecting...</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#7c3aed' }}>
            <Check size={20} /><span style={{ fontWeight: 600 }}>Profile Complete!</span>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div key={step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
        {step !== 'email' && step !== 'profile' && (
          <button onClick={() => setStep(step === 'login' || step === 'signup' ? 'email' : step === 'otp' ? 'signup' : step === 'forgot_password_otp' || step === 'forgot_password_reset' ? 'login' : 'email')}
            style={{ background: '#ccc', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '1.5rem', color: '#555' }}>
            <ArrowLeft size={18} />
          </button>
        )}

        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#111', marginBottom: '0.3rem', fontFamily: 'Inter, sans-serif' }}>
          {step === 'email' && 'Good to see you'}
          {step === 'login' && 'Sign In'}
          {step === 'signup' && 'Create Account'}
          {step === 'otp' && 'Enter Code'}
          {step === 'profile' && 'Set up Profile'}
          {step === 'forgot_password_otp' && 'Reset Password'}
          {step === 'forgot_password_reset' && 'Create New Password'}
        </h2>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          {step === 'email' && 'Sign in or create an account to get started'}
          {step === 'login' && 'Enter your password to sign in'}
          {step === 'signup' && 'Enter your details to create an account'}
          {step === 'otp' && `We sent a 6-digit code to ${formData.email}`}
          {step === 'profile' && 'Tell us more about yourself and your academic background'}
          {step === 'forgot_password_otp' && `We sent a 6-digit reset code to ${formData.email}`}
          {step === 'forgot_password_reset' && 'Enter your new password below'}
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '0.75rem 1rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1.25rem', border: '1px solid #fca5a5' }}>{error}</div>
        )}

        {step === 'email' && (
          <>
            <form onSubmit={handleEmailContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Email Address</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@gmail.com" required style={inputStyle} />
              </div>
              <button type="submit" style={btnPrimary}>Continue with Email</button>
            </form>
            <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
              <span style={{ margin: '0 1rem', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
            </div>
            <motion.button whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }} whileTap={{ scale: 0.98 }} type="button" onClick={() => { const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:5000'; window.location.href = `${baseUrl}/auth/google`; }} style={btnDark}>
              <GoogleIcon /> Sign In with Google
            </motion.button>
          </>
        )}

        {step === 'login' && (
          <>
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} style={{ ...inputStyle, background: '#f5f5f5' }} readOnly />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required style={inputStyle} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.5rem' }}>
                <button type="button" onClick={handleForgotSendOtp} style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', padding: 0 }}>Forgot Password?</button>
              </div>
              <motion.button whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" style={{ ...btnDark, background: '#7c3aed' }}>
                {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Sign In'}
              </motion.button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#888', fontSize: '0.9rem' }}>
              Don't have an account?{' '}
              <button onClick={() => setStep('signup')} style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Sign up</button>
            </p>
          </>
        )}

        {step === 'signup' && (
          <>
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} style={{ ...inputStyle, background: '#f5f5f5' }} readOnly />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Password</label>
                <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required style={inputStyle} />
              </div>
              <motion.button whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" style={{ ...btnDark, background: '#7c3aed' }}>
                {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Create Account'}
              </motion.button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#888', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <button onClick={() => setStep('login')} style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Log in</button>
            </p>
          </>
        )}

        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <form onSubmit={handleOtpVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <input type="text" maxLength={6} value={formData.otp} onChange={(e) => setFormData({ ...formData, otp: e.target.value })} placeholder="000000" style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.6rem', fontSize: '1.4rem' }} />
              <motion.button whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" style={{ ...btnDark, background: '#7c3aed' }}>
                {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Verify Code'}
              </motion.button>
            </form>
          </div>
        )}

        {step === 'forgot_password_otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <form onSubmit={handleForgotVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <input type="text" maxLength={6} value={formData.otp} onChange={(e) => setFormData({ ...formData, otp: e.target.value })} placeholder="000000" required style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.6rem', fontSize: '1.4rem' }} />
              <motion.button whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" style={{ ...btnDark, background: '#7c3aed' }}>
                {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Verify Code'}
              </motion.button>
            </form>
          </div>
        )}

        {step === 'forgot_password_reset' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <form onSubmit={handleForgotResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>New Password</label>
                <input type="password" value={forgotNewPassword} onChange={(e) => setForgotNewPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Confirm New Password</label>
                <input type="password" value={forgotConfirmPassword} onChange={(e) => setForgotConfirmPassword(e.target.value)} placeholder="••••••••" required style={inputStyle} />
              </div>
              <motion.button whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" style={{ ...btnDark, background: '#7c3aed' }}>
                {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Save New Password'}
              </motion.button>
            </form>
          </div>
        )}

        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '0.75rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #7c3aed', padding: '3px', background: 'white', position: 'relative' }}>
                  <img src={profileData.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  {isUploading && (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', borderRadius: '50%' }}>
                      <Loader2 className="spin" size={20} color="#7c3aed" />
                    </div>
                  )}
                  <label style={{ position: 'absolute', bottom: -5, right: -5, background: '#7c3aed', padding: '6px', borderRadius: '50%', border: '2px solid #fff', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Plus size={14} />
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={isUploading} />
                  </label>
                </div>
              </div>
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', margin: '0 0 0.5rem 0', fontWeight: 600 }}>Choose an AI Avatar or upload your photo</p>
              <div className="avatar-grid-responsive">
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
                    onClick={() => setProfileData({ ...profileData, avatar: avatarUrl })}
                    className={`avatar-item-preset ${profileData.avatar === avatarUrl ? 'active' : ''}`}
                  >
                    <img src={avatarUrl} alt="Avatar Preset" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserIcon size={16} color="#7c3aed" /> General Profile
              </h3>
              
              <div className="responsive-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Full Name *</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Email Address (Locked)</label>
                  <input
                    type="email"
                    value={user?.email || formData.email || ''}
                    disabled
                    readOnly
                    style={{ ...inputStyle, background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div className="responsive-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Age</label>
                  <input type="number" value={profileData.age} onChange={(e) => setProfileData({ ...profileData, age: e.target.value })} placeholder="20" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Gender</label>
                  <select value={profileData.gender} onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Phone Number</label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '10px', overflow: 'hidden', background: '#fff' }}>
                  <span style={{ padding: '0.875rem 1rem', background: '#f8fafc', borderRight: '1px solid #ddd', color: '#334155', fontWeight: 700, fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', userSelect: 'none' }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={profileData.phone ? profileData.phone.replace(/^\+91\s?/, '') : ''}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, '');
                      setProfileData({ ...profileData, phone: digits ? `+91 ${digits}` : '' });
                    }}
                    placeholder="Enter 10-digit phone number"
                    style={{ ...inputStyle, border: 'none', borderRadius: 0, flex: 1, padding: '0.875rem 1rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Bio</label>
                <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  style={{ ...inputStyle, fontFamily: 'Inter, sans-serif', minHeight: '80px', resize: 'vertical' as any }}
                />
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GraduationCap size={16} color="#7c3aed" /> Educational Details
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>College / University Name</label>
                  <input value={profileData.education.collegeName} onChange={(e) => setProfileData({ ...profileData, education: { ...profileData.education, collegeName: e.target.value } })} placeholder="e.g. JECRC University, Jaipur" style={inputStyle} />
                </div>

                <div className="responsive-grid">
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Department / School</label>
                    <select value={profileData.education.department} onChange={(e) => { const newDept = e.target.value; setProfileData(prev => ({ ...prev, education: { ...prev.education, department: newDept, course: (ACADEMIC_PROGRAMS[newDept] && ACADEMIC_PROGRAMS[newDept].includes(prev.education.course)) ? prev.education.course : '' } })); }} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select Department / School</option>
                      {Object.keys(ACADEMIC_PROGRAMS).map(dept => (<option key={dept} value={dept}>{dept}</option>))}
                      <option value="Other">Other / Custom Department</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Course / Program</label>
                    <select value={profileData.education.course} onChange={(e) => setProfileData({ ...profileData, education: { ...profileData.education, course: e.target.value } })} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Select Course / Program</option>
                      {profileData.education.department && ACADEMIC_PROGRAMS[profileData.education.department] ? (
                        ACADEMIC_PROGRAMS[profileData.education.department].map(c => (<option key={c} value={c}>{c}</option>))
                      ) : (
                        Object.entries(ACADEMIC_PROGRAMS).map(([dept, courses]) => (
                          <optgroup key={dept} label={dept}>
                            {courses.map(c => (<option key={c} value={c}>{c}</option>))}
                          </optgroup>
                        ))
                      )}
                      <option value="Other">Other / Custom Course</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Year of Study</label>
                  <select value={profileData.education.year} onChange={(e) => setProfileData({ ...profileData, education: { ...profileData.education, year: e.target.value } })} style={{ ...inputStyle, cursor: 'pointer' }}>
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option><option value="2nd Year">2nd Year</option><option value="3rd Year">3rd Year</option><option value="4th Year">4th Year</option>
                    <option value="5th Year / Dual Degree">5th Year / Dual Degree</option><option value="Postgraduate">Postgraduate</option>
                    <option value="Alumni / Graduated">Alumni / Graduated</option><option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BookOpen size={16} color="#7c3aed" /> Interests & Hobbies
              </h3>
              <div className="responsive-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Interests (comma separated)</label>
                  <input type="text" value={profileData.interests} onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })} placeholder="Music, Tech, Art" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.3rem', color: '#475569' }}>Hobbies (comma separated)</label>
                  <input type="text" value={profileData.hobbies} onChange={(e) => setProfileData({ ...profileData, hobbies: e.target.value })} placeholder="Reading, Gaming" style={inputStyle} />
                </div>
              </div>
            </div>

            <motion.button whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" style={{ ...btnDark, background: '#7c3aed', padding: '0.95rem', fontSize: '1rem', marginTop: '0.5rem' }}>
              {isSubmitting ? <Loader2 className="spin" size={18} /> : "Complete Setup & Launch"}
            </motion.button>
          </form>
        )}
      </motion.div>
    );
  };

  return (
    <div
      className="auth-wrapper-container"
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#ffffff',
        padding: '2rem', paddingTop: step === 'profile' ? '2rem' : '100px', fontFamily: 'Inter, sans-serif',
      }}
    >
      <div
        className="auth-card-box"
        style={{
          width: '100%', maxWidth: step === 'profile' ? '620px' : '400px', background: '#fff',
          borderRadius: '20px', padding: '2.5rem', minHeight: '500px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px dashed #ddd',
          transition: 'max-width 0.3s ease'
        }}
      >
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      <style>{`
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .avatar-grid-responsive {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .avatar-item-preset {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: 2px solid transparent;
          padding: 2px;
          background: #fff;
          cursor: pointer;
          transition: transform 0.15s ease, border-color 0.15s ease;
        }

        .avatar-item-preset:hover {
          transform: scale(1.08);
        }

        .avatar-item-preset.active {
          border-color: #7c3aed !important;
          transform: scale(1.05);
        }

        .responsive-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }
        
        @media (max-width: 640px) {
          .auth-wrapper-container {
            padding: 1rem !important;
            padding-top: 80px !important;
          }
          .auth-card-box {
            padding: 1.25rem 1rem !important;
            border-radius: 16px !important;
          }
          .avatar-grid-responsive {
            gap: 0.5rem;
          }
          .avatar-item-preset {
            width: 44px;
            height: 44px;
          }
          .responsive-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Auth;
