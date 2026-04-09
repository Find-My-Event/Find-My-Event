import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Shield } from 'lucide-react';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { darkPageShell } from '../theme/darkShell';

interface PendingRow {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  mode: string;
  location: string;
  capacity: number;
  organizer?: { name?: string; email?: string };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [list, setList] = useState<PendingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [acting, setActing] = useState<string | null>(null);

  const load = async () => {
    setErr('');
    try {
      const { data } = await api.get<PendingRow[]>('/events/admin/pending');
      setList(data);
    } catch (e: unknown) {
      const status = e && typeof e === 'object' && 'response' in e ? (e as { response?: { status?: number } }).response?.status : 0;
      setErr(status === 403 ? 'Admin access only. Set ADMIN_EMAIL in server .env to your account email.' : 'Could not load queue');
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') load();
    else setLoading(false);
  }, [user?.role]);

  const approve = async (id: string) => {
    setActing(id);
    try {
      await api.patch(`/events/${id}/approve`);
      setList((prev) => prev.filter((x) => x._id !== id));
    } catch {
      setErr('Approve failed');
    } finally {
      setActing(null);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div style={darkPageShell}>
        <div style={{ padding: '8rem 1.5rem', textAlign: 'center', color: '#a1a1aa', maxWidth: 480, margin: '0 auto' }}>
          <Shield size={48} style={{ marginBottom: '1rem', opacity: 0.5, margin: '0 auto 1rem', display: 'block' }} />
          <p style={{ fontSize: '1.1rem' }}>This area is for admins. Add your email to <code style={{ color: '#e4e4e7' }}>ADMIN_EMAIL</code> in the backend <code style={{ color: '#e4e4e7' }}>.env</code>, restart the server, then sign in again.</p>
          <button type="button" onClick={() => { window.location.hash = '#home'; }} style={{ marginTop: '2rem', background: '#fff', color: '#09090b', border: 'none', padding: '0.75rem 1.5rem', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>Go home</button>
        </div>
      </div>
    );
  }

  return (
    <div style={darkPageShell}>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '6.5rem 1.5rem 4rem' }}>
        <button
          type="button"
          onClick={() => { window.location.hash = '#home'; }}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '2rem',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            color: '#e4e4e7', padding: '0.5rem 1rem', borderRadius: 12, cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem',
          }}
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.5rem' }}>
          <Shield size={28} color="#a78bfa" />
          <h1 style={{ color: '#fff', fontSize: '2rem', fontWeight: 800 }}>Event approvals<span style={{ color: '#3b82f6' }}>.</span></h1>
        </div>
        <p style={{ color: '#71717a', marginBottom: '2rem' }}>Pending submissions from creators</p>

        {err && <p style={{ color: '#f87171', marginBottom: '1rem' }}>{err}</p>}
        {loading && <p style={{ color: '#71717a' }}>Loading…</p>}

        {!loading && list.length === 0 && !err && (
          <p style={{ color: '#52525b', padding: '3rem', textAlign: 'center', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: 16 }}>No pending events</p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {list.map((row, i) => (
            <motion.div
              key={row._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '1.35rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ color: '#fafafa', fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.35rem' }}>{row.title}</h3>
                  <p style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{row.description}</p>
                  <p style={{ color: '#71717a', fontSize: '0.8rem' }}>
                    {row.mode} · {row.location} · {row.startDate} → {row.endDate}
                    {row.organizer?.name && ` · by ${row.organizer.name}`}
                  </p>
                </div>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={acting === row._id}
                  onClick={() => approve(row._id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#22c55e', color: '#052e16', border: 'none', padding: '0.65rem 1.25rem',
                    borderRadius: 12, fontWeight: 800, cursor: acting === row._id ? 'wait' : 'pointer', alignSelf: 'flex-start',
                  }}
                >
                  <Check size={18} /> Approve
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
