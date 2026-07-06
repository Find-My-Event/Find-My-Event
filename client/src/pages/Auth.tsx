import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Loader2, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type AuthStep = 'email' | 'login' | 'signup' | 'otp' | 'profile' | 'welcome';

const Auth: React.FC = () => {
  const [step, setStep] = useState<AuthStep>('email');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
  const [profileData, setProfileData] = useState({
    bio: '', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    age: '', gender: '', interests: '', hobbies: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { register, verifyOtp, resendOtp, handleLogin, setupProfile, uploadAvatar } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setStep('login'); // Default to login after email
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (step === 'login') {
        const result = await handleLogin(formData.email, formData.password);
        if (result.user?.role === 'admin') {
          window.location.hash = '#admin';
        } else if (result.user?.role === 'organizer') {
          window.location.hash = '#organizer-dashboard';
        } else {
          window.location.hash = '#home';
        }
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
      await verifyOtp(formData.email, formData.otp);
      setStep('profile');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setIsSubmitting(true);
    try {
      await resendOtp(formData.email);
      setError('A new code has been sent to your email.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend code');
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
        bio: profileData.bio, avatar: profileData.avatar,
        age: profileData.age ? parseInt(profileData.age as string) : undefined,
        gender: profileData.gender,
        interests: profileData.interests.split(',').map(i => i.trim()).filter(i => i !== ''),
        hobbies: profileData.hobbies.split(',').map(h => h.trim()).filter(h => h !== '')
      });
      setStep('welcome');
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
    outline: 'none', transition: 'border 0.2s', color: '#111',
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
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#111' }}>Hello, {formData.name.split(' ')[0]}</h1>
          <p style={{ color: '#888', marginTop: '0.75rem' }}>Your account is ready. Redirecting...</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#7c3aed' }}>
            <Check size={20} /><span style={{ fontWeight: 600 }}>Profile Created!</span>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div key={step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.3 }}>
        {/* Back button */}
        {step !== 'email' && (
          <button onClick={() => setStep(step === 'login' || step === 'signup' ? 'email' : step === 'otp' ? 'signup' : 'email')}
            style={{ background: '#ccc', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: '1.5rem', color: '#555' }}>
            <ArrowLeft size={18} />
          </button>
        )}

        {/* Header */}
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#111', marginBottom: '0.3rem', fontFamily: 'Inter, sans-serif' }}>
          {step === 'email' && 'Good to see you'}
          {step === 'login' && 'Sign In'}
          {step === 'signup' && 'Create Account'}
          {step === 'otp' && 'Enter Code'}
          {step === 'profile' && 'Set up Profile'}
        </h2>
        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {step === 'email' && 'Please Sign In or Sign up below'}
          {step === 'login' && 'Enter your password to continue'}
          {step === 'signup' && 'Fill in your details to get started'}
          {step === 'otp' && `Enter the 6-digit code sent to ${formData.email}`}
          {step === 'profile' && 'Tell us more about yourself'}
        </p>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid #fecaca' }}>{error}</div>
        )}

        {/* ── EMAIL STEP ── */}
        {step === 'email' && (
          <>
            <form onSubmit={handleEmailContinue} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Email</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="your@gmail.com" required style={inputStyle} />
              </div>
              <button type="submit" style={btnPrimary}>Continue with Email</button>
            </form>
            <div style={{ height: '1px', background: '#eee', margin: '1.5rem 0' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button style={btnDark}><GoogleIcon /> Sign In with Google</button>
              <button style={btnDark}><span style={{ fontSize: '1.1rem' }}>&#63743;</span> Sign In with Apple</button>
            </div>
          </>
        )}

        {/* ── LOGIN STEP ── */}
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

        {/* ── SIGNUP STEP ── */}
        {step === 'signup' && (
          <>
            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Full Name</label>
                <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required style={inputStyle} />
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

        {/* ── OTP STEP ── */}
        {step === 'otp' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <form onSubmit={handleOtpVerify} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <input type="text" maxLength={6} value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })} placeholder="000000"
                style={{ ...inputStyle, textAlign: 'center', letterSpacing: '0.6rem', fontSize: '1.4rem' }} />
              <motion.button whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" style={{ ...btnDark, background: '#7c3aed' }}>
                {isSubmitting ? <Loader2 className="spin" size={18} /> : 'Verify Code'}
              </motion.button>
            </form>
            <p style={{ textAlign: 'center', color: '#888', fontSize: '0.9rem', margin: 0 }}>
              Didn't receive the code?{' '}
              <button 
                type="button"
                onClick={handleResendOtp}
                disabled={isSubmitting}
                style={{ background: 'none', border: 'none', color: '#7c3aed', fontWeight: 600, cursor: isSubmitting ? 'wait' : 'pointer', fontSize: '0.9rem' }}
              >
                Send again
              </button>
            </p>
          </div>
        )}

        {/* ── PROFILE STEP ── */}
        {step === 'profile' && (
          <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '0.5rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px solid #7c3aed', padding: '3px', background: 'white', position: 'relative' }}>
                <img src={profileData.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                {isUploading && (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', borderRadius: '50%' }}>
                    <Loader2 className="spin" size={20} color="#7c3aed" />
                  </div>
                )}
                <label style={{ position: 'absolute', bottom: -5, right: -5, background: '#7c3aed', padding: '6px', borderRadius: '50%', border: '2px solid #fff', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={14} />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} disabled={isUploading} />
                </label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              {['Felix', 'Anya', 'Jasper', 'Milo'].map(seed => (
                <div key={seed} onClick={() => setProfileData({ ...profileData, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` })}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: profileData.avatar.includes(seed) ? '2px solid #7c3aed' : '2px solid transparent', cursor: 'pointer' }}>
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Age</label>
                <input type="number" value={profileData.age} onChange={(e) => setProfileData({ ...profileData, age: e.target.value })} placeholder="20" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Gender</label>
                <select value={profileData.gender} onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                  style={{ ...inputStyle, appearance: 'none' as any }}>
                  <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Bio</label>
              <textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} placeholder="I love college festivals!"
                style={{ ...inputStyle, minHeight: '70px', resize: 'none' as any }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Interests (comma separated)</label>
              <input type="text" value={profileData.interests} onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })} placeholder="Music, Tech, Art" style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, marginBottom: '0.4rem', color: '#333' }}>Hobbies (comma separated)</label>
              <input type="text" value={profileData.hobbies} onChange={(e) => setProfileData({ ...profileData, hobbies: e.target.value })} placeholder="Reading, Gaming" style={inputStyle} />
            </div>
            <motion.button whileTap={{ scale: 0.98 }} disabled={isSubmitting} type="submit" style={{ ...btnDark, background: '#7c3aed' }}>
              {isSubmitting ? <Loader2 className="spin" size={18} /> : "Let's GO"}
            </motion.button>
          </form>
        )}
      </motion.div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#ffffff',
      padding: '2rem', paddingTop: '100px', fontFamily: 'Inter, sans-serif',
    }}>
      {/* Card */}
      <div style={{
        width: '100%', maxWidth: '400px', background: '#fff',
        borderRadius: '20px', padding: '2.5rem', minHeight: '500px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)', border: '1px dashed #ddd',
      }}>
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>

      <style>{`
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Auth;
