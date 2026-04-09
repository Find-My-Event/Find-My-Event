import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

const STORAGE_KEY = 'pendingEventSubmissionId';

export function setPendingSubmissionId(id: string) {
  sessionStorage.setItem(STORAGE_KEY, id);
}

export function clearPendingSubmissionId() {
  sessionStorage.removeItem(STORAGE_KEY);
}

export default function PendingApprovalListener() {
  const { token, isLoggedIn } = useAuth();
  const [approvedTitle, setApprovedTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !token) return;

    let cancelled = false;

    const tick = async () => {
      const id = sessionStorage.getItem(STORAGE_KEY);
      if (!id || cancelled) return;
      try {
        const { data } = await api.get<{ status: string; title?: string }>(`/events/submission/${id}`);
        if (data.status === 'approved') {
          clearPendingSubmissionId();
          if (!cancelled) setApprovedTitle(data.title || 'Your event');
        }
        if (data.status === 'rejected') {
          clearPendingSubmissionId();
        }
      } catch {
        /* ignore */
      }
    };

    tick();
    const t = setInterval(tick, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, [isLoggedIn, token]);

  return (
    <AnimatePresence>
      {approvedTitle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            background: 'rgba(9,9,11,0.85)',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setApprovedTitle(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 420, width: '100%',
              background: 'linear-gradient(145deg, rgba(6,78,59,0.4) 0%, rgba(24,24,27,0.95) 50%)',
              border: '1px solid rgba(52,211,153,0.4)',
              borderRadius: 24,
              padding: '2rem 1.75rem',
              textAlign: 'center',
              boxShadow: '0 0 60px rgba(16,185,129,0.2)',
            }}
          >
            <div style={{
              width: 64, height: 64, margin: '0 auto 1rem', borderRadius: '50%',
              background: 'linear-gradient(135deg, #34d399, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.75rem', color: '#052e16', fontWeight: 800,
            }}>✓</div>
            <h2 style={{ color: '#ecfdf5', fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Approved</h2>
            <p style={{ color: '#a7f3d0', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              “{approvedTitle}” is live. Find it on Discover.
            </p>
            <button
              type="button"
              onClick={() => { setApprovedTitle(null); window.location.hash = '#discover'; }}
              style={{
                width: '100%', background: 'linear-gradient(135deg, #34d399, #059669)',
                color: '#052e16', border: 'none', padding: '0.95rem', borderRadius: 14, fontWeight: 800, cursor: 'pointer',
              }}
            >
              Open Discover
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
