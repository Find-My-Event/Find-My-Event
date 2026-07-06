import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1: Request OTP, 2: Verify OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Reset state when closing
  const handleClose = () => {
    setStep(1);
    setLoading(false);
    setError('');
    setSuccess('');
    setOtp('');
    setNewPassword('');
    setMaskedEmail('');
    onClose();
  };

  const handleRequestOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/organizer/request-password-change');
      setMaskedEmail(res.data.email);
      setStep(2);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to request password change.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/organizer/verify-password-change', { otp, newPassword });
      setSuccess('Password updated successfully!');
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP or failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif" }}>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={handleClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} 
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }} 
            style={{ width: '90%', maxWidth: '440px', background: '#fff', borderRadius: '24px', padding: '2.5rem', position: 'relative', zIndex: 1, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
          >
            <button onClick={handleClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <X size={20} />
            </button>

            {success ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <ShieldCheck size={64} color="#10B981" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#111', margin: '0 0 0.5rem 0' }}>Success!</h3>
                <p style={{ color: '#666' }}>{success}</p>
              </div>
            ) : step === 1 ? (
              <div>
                <Lock size={48} color="#8B5CF6" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', margin: '0 0 0.5rem 0' }}>Secure Password Change</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                  To change your club's password, we need to verify your identity. We will send a One-Time Password (OTP) to the President's registered email address.
                </p>

                {error && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid #FCA5A5' }}>{error}</div>}

                <button 
                  onClick={handleRequestOtp} 
                  disabled={loading}
                  style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {loading ? 'Sending OTP...' : <><Mail size={18} /> Send OTP to President Email</>}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <Lock size={48} color="#8B5CF6" style={{ marginBottom: '1.5rem' }} />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#111', margin: '0 0 0.5rem 0' }}>Verify & Update</h3>
                <p style={{ color: '#666', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                  An OTP has been sent to <strong>{maskedEmail}</strong>. Please enter it below to set your new password.
                </p>

                {error && <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', marginBottom: '1.5rem', border: '1px solid #FCA5A5' }}>{error}</div>}

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>6-Digit OTP</label>
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} placeholder="Enter OTP" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', outline: 'none', letterSpacing: '2px' }} />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} placeholder="Enter new password" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', outline: 'none' }} />
                </div>

                <button 
                  type="submit"
                  disabled={loading || otp.length < 6 || newPassword.length < 6}
                  style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem', cursor: (loading || otp.length < 6 || newPassword.length < 6) ? 'not-allowed' : 'pointer' }}
                >
                  {loading ? 'Verifying...' : 'Update Password'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
