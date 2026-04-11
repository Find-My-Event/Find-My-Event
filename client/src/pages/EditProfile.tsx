import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { darkPageShell } from '../theme/darkShell';

export default function EditProfile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  const save = async () => {
    if (!name.trim()) {
      setMsg('Name is required');
      return;
    }
    setSaving(true);
    setMsg('');
    try {
      await updateProfile({ name: name.trim(), bio, avatar });
      setMsg('Profile updated');
      setTimeout(() => setMsg(''), 2500);
    } catch {
      setMsg('Could not update');
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
          Edit profile<span style={{ color: '#3b82f6' }}>.</span>
        </motion.h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>Name, bio, and avatar URL sync to the database.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>Display name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)',
                borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', fontFamily: "'Outfit', sans-serif",
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              style={{
                width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)',
                borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', resize: 'vertical', fontFamily: "'Outfit', sans-serif",
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>Avatar URL</label>
            <input
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://…"
              style={{
                width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)',
                borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', fontFamily: "'Outfit', sans-serif",
              }}
            />
          </div>
          {avatar && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Preview</span>
              <img src={avatar} alt="" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          )}
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
          {saving ? 'Saving…' : 'Save profile'}
        </motion.button>
        {msg && <p style={{ marginTop: '1rem', color: msg.includes('updated') ? '#4ade80' : '#f87171', fontSize: '0.9rem', textAlign: 'center' }}>{msg}</p>}
      </div>
    </div>
  );
}
