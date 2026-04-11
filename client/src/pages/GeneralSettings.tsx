import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { darkPageShell } from '../theme/darkShell';

export default function GeneralSettings() {
  const { user, updateSettings } = useAuth();
  const [notifyEmail, setNotifyEmail] = useState(user?.notifyEmail !== false);
  const [publicProfile, setPublicProfile] = useState(user?.publicProfile !== false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (!user) return;
    setNotifyEmail(user.notifyEmail !== false);
    setPublicProfile(user.publicProfile !== false);
  }, [user]);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      await updateSettings({ notifyEmail, publicProfile });
      setMsg('Saved');
      setTimeout(() => setMsg(''), 2500);
    } catch {
      setMsg('Could not save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={darkPageShell}>
      <div className="page-padding" style={{ position: 'relative', zIndex: 1, maxWidth: 560, margin: '0 auto' }}>
        <button
          type="button"
          onClick={() => { window.history.back(); }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '2rem',
            background: 'var(--border-subtle)', border: '1px solid var(--border-color)',
            color: 'var(--text-primary)', padding: '0.5rem 1rem', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ color: 'var(--text-primary)', fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          General settings<span style={{ color: '#3b82f6' }}>.</span>
        </motion.h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>These preferences are stored on your account.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.35rem', background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 16, cursor: 'pointer',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)', fontWeight: 600 }}>
              <Bell size={20} color="#a78bfa" /> Email notifications
            </span>
            <input type="checkbox" checked={notifyEmail} onChange={(e) => setNotifyEmail(e.target.checked)} style={{ width: 20, height: 20, accentColor: '#8b5cf6' }} />
          </label>

          <label style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '1.25rem 1.35rem', background: 'var(--border-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 16, cursor: 'pointer',
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-primary)', fontWeight: 600 }}>
              <Eye size={20} color="#a78bfa" /> Public profile
            </span>
            <input type="checkbox" checked={publicProfile} onChange={(e) => setPublicProfile(e.target.checked)} style={{ width: 20, height: 20, accentColor: '#8b5cf6' }} />
          </label>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={save}
          disabled={saving}
          style={{
            marginTop: '2rem', width: '100%', background: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none',
            padding: '1rem', borderRadius: 14, fontWeight: 800, cursor: saving ? 'wait' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </motion.button>
        {msg && <p style={{ marginTop: '1rem', color: msg === 'Saved' ? '#4ade80' : '#f87171', fontSize: '0.9rem', textAlign: 'center' }}>{msg}</p>}
      </div>
    </div>
  );
}
