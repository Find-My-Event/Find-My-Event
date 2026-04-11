import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User, Check, Loader2, Camera } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthProps {}

type AuthStep = 'login' | 'signup' | 'otp' | 'profile' | 'welcome';

const Auth: React.FC<AuthProps> = () => {
  const [step, setStep] = useState<AuthStep>('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '', otp: '' });
  const [profileData, setProfileData] = useState({ 
    bio: '', 
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    age: '',
    gender: '',
    interests: '',
    hobbies: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, verifyOtp, handleLogin, setupProfile } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      if (step === 'login') {
        await handleLogin(formData.email, formData.password);
        window.location.hash = '#home';
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

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await setupProfile({
        bio: profileData.bio,
        avatar: profileData.avatar,
        age: profileData.age ? parseInt(profileData.age as string) : undefined,
        gender: profileData.gender,
        interests: profileData.interests.split(',').map(i => i.trim()).filter(i => i !== ''),
        hobbies: profileData.hobbies.split(',').map(h => h.trim()).filter(h => h !== '')
      });
      setStep('welcome');
      setTimeout(() => {
        window.location.hash = '#home';
      }, 3000);
    } catch (err) {
      setError('Failed to setup profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const GoogleIcon = () => (
    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative dot grid */}
      <div className="dot-grid"></div>
      
      {/* Back to Home Button */}
      {step !== 'welcome' && (
        <motion.a 
          href="#home"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ position: 'absolute', top: '2rem', left: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--bg-card)', fontWeight: 500, zIndex: 100, background: 'rgba(255, 255, 255, 0.5)', padding: '0.5rem 1rem', borderRadius: '999px', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
          <ArrowLeft size={18} />
          Back
        </motion.a>
      )}

      {/* Left Section - Branding (Old UI style) */}
      <div 
        style={{ 
          flex: 1, 
          display: 'none', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: '4rem', 
          position: 'relative', 
          backgroundColor: '#0a0a0a', 
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white', 
          borderTopRightRadius: '3rem', 
          borderBottomRightRadius: '3rem' 
        }}
        className="auth-left-panel"
      >
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}>
          <h1 style={{ fontSize: 'clamp(3rem, 5vw, 4rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Discover the <br />
            <span className="serif-italic" style={{ color: '#ff6f3f' }}>best events</span> <br />
            on campus.
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, maxWidth: '400px', lineHeight: 1.6 }}>
            Join our community to explore, register, and experience unforgettable moments just one search away.
          </p>
        </motion.div>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,111,63,0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
      </div>

      {/* Right Section - Form (Reverted to old aesthetic but with new logic) */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          
          <AnimatePresence mode="wait">
            {step === 'welcome' ? (
              <motion.div key="welcome" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: 'center' }}>
                 <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }} style={{ width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 2rem', border: '4px solid #ff6f3f', padding: '5px', background: 'white', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                   <img src={profileData.avatar} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                 </motion.div>
                 <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Hello, {formData.name.split(' ')[0]}</h1>
                 <p style={{ opacity: 0.6, marginTop: '1rem', fontSize: '1.1rem', color: '#666' }}>Your account is ready. Redirecting you home...</p>
                 <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', color: '#ff6f3f' }}>
                    <Check size={24} />
                    <span style={{ fontWeight: 600 }}>Profile Created!</span>
                 </div>
              </motion.div>
            ) : (
              <motion.div 
                key={step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                    {step === 'login' && 'Welcome back'}
                    {step === 'signup' && 'Create an account'}
                    {step === 'otp' && 'Enter Code'}
                    {step === 'profile' && 'Set up Your Profile'}
                  </h2>
                  <p style={{ color: '#666', fontSize: '1rem' }}>
                    {step === 'login' && 'Enter your details to access your account'}
                    {step === 'signup' && 'Sign up to start discovering events'}
                    {step === 'otp' && `Please enter the 6-digit code we sent to ${formData.email}`}
                    {step === 'profile' && 'Tell us more about yourself'}
                  </p>
                </div>

                {error && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', padding: '0.875rem', borderRadius: '12px', fontSize: '0.875rem', marginBottom: '1.5rem', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    {error}
                  </motion.div>
                )}

                {(step === 'login' || step === 'signup') && (
                  <>
                    <button style={{ width: '100%', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: 'white', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', fontSize: '1rem', fontWeight: 500, color: 'var(--text-primary)', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }} onClick={() => {}}>
                      <GoogleIcon />
                      {step === 'login' ? 'Log in with Google' : 'Sign up with Google'}
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0' }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Or</span>
                      <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(0,0,0,0.1)' }}></div>
                    </div>

                    <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {step === 'signup' && (
                        <div>
                          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Full Name</label>
                          <div style={{ position: 'relative' }}>
                            <User size={18} color="#888" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                            <input name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required className="auth-input-old" />
                          </div>
                        </div>
                      )}
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={18} color="#888" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                          <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@university.edu" required className="auth-input-old" />
                        </div>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                          <Lock size={18} color="#888" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                          <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required className="auth-input-old" />
                        </div>
                      </div>
                      <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={isSubmitting} className="auth-btn-old">
                        {isSubmitting ? <Loader2 className="spin" size={20} /> : (step === 'login' ? 'Sign In' : 'Create Account')}
                      </motion.button>
                    </form>
                  </>
                )}

                {step === 'otp' && (
                  <form onSubmit={handleOtpVerify}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                      <input 
                        type="text" 
                        maxLength={6} 
                        value={formData.otp} 
                        onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                        placeholder="000000"
                        style={{ width: '100%', textAlign: 'center', letterSpacing: '0.8rem', fontSize: '1.5rem', background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.1)', color: 'var(--text-primary)', padding: '1rem', borderRadius: '12px', outline: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}
                      />
                    </div>
                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={isSubmitting} className="auth-btn-old">
                      {isSubmitting ? <Loader2 className="spin" size={20} /> : 'Verify Code'}
                    </motion.button>
                  </form>
                )}

                {step === 'profile' && (
                  <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '1rem' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '50%', border: '2px solid #ff6f3f', padding: '5px', background: 'white', position: 'relative', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
                        <img src={profileData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#ff6f3f', padding: '6px', borderRadius: '50%', border: '2px solid #fff', color: 'white' }}>
                          <Camera size={14} />
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                      {['Felix', 'Anya'].map((seed) => (
                        <div 
                          key={seed}
                          onClick={() => setProfileData({ ...profileData, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` })}
                          style={{ width: '50px', height: '50px', borderRadius: '50%', border: profileData.avatar.includes(seed) ? '2px solid #ff6f3f' : '2px solid transparent', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Age</label>
                        <input 
                          type="number"
                          value={profileData.age}
                          onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                          placeholder="20"
                          className="auth-input-old"
                          style={{ paddingLeft: '1rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Gender</label>
                        <select 
                          value={profileData.gender}
                          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                          className="auth-input-old"
                          style={{ paddingLeft: '1rem', appearance: 'none', background: 'white' }}
                        >
                          <option value="">Select</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Bio</label>
                      <textarea 
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="I love college festivals!"
                        style={{ width: '100%', minHeight: '80px', background: 'var(--text-primary)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', padding: '1rem', color: 'var(--bg-card)', resize: 'none', outline: 'none' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Interests (optional, comma separated)</label>
                      <input 
                        type="text"
                        value={profileData.interests}
                        onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                        placeholder="Music, Tech, Art"
                        className="auth-input-old"
                        style={{ paddingLeft: '1rem' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Hobbies (optional, comma separated)</label>
                      <input 
                        type="text"
                        value={profileData.hobbies}
                        onChange={(e) => setProfileData({ ...profileData, hobbies: e.target.value })}
                        placeholder="Reading, Gaming, Hiking"
                        className="auth-input-old"
                        style={{ paddingLeft: '1rem' }}
                      />
                    </div>

                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} disabled={isSubmitting} className="auth-btn-old">
                      {isSubmitting ? <Loader2 className="spin" size={20} /> : 'Let\'s GO'}
                    </motion.button>
                  </form>
                )}

                {(step === 'login' || step === 'signup') && (
                  <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{ color: '#666', fontSize: '0.95rem' }}>
                      {step === 'login' ? "Don't have an account? " : "Already have an account? "}
                      <button onClick={() => setStep(step === 'login' ? 'signup' : 'login')} style={{ background: 'none', border: 'none', color: '#ff6f3f', fontWeight: 600, cursor: 'pointer', fontSize: '0.95rem' }}>
                        {step === 'login' ? 'Sign up' : 'Log in'}
                      </button>
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      <style>{`
        .auth-input-old {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.75rem;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          background-color: rgba(255,255,255,0.8);
          font-size: 1rem;
          outline: none;
          transition: all 0.2s;
        }
        .auth-input-old:focus {
          border-color: #ff6f3f;
          box-shadow: 0 0 0 3px rgba(255,111,63,0.1);
        }
        .auth-btn-old {
          width: 100%;
          padding: 0.875rem;
          background-color: #ff6f3f;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          fontWeight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 14px rgba(255,111,63,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .auth-btn-old:hover {
          background-color: #e55a2b;
          transform: translateY(-1px);
        }
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (min-width: 1024px) {
          .auth-left-panel { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default Auth;
