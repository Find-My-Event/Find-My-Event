import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Compass, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { darkPageShell } from '../theme/darkShell';
import { fallbackClubs } from '../data/clubs';
import type { Club } from '../data/clubs';

export default function Clubs() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Initiative' | 'Organization' | 'Club'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get('/clubs')
      .then((res) => {
        if (active && Array.isArray(res.data)) {
          setClubs(res.data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch clubs from API, using fallback:', err);
        if (active) {
          setClubs(fallbackClubs);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredClubs = useMemo(() => {
    return clubs.filter((c) => {
      const matchType = selectedFilter === 'All' || c.type === selectedFilter;
      const matchQuery =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchType && matchQuery;
    });
  }, [clubs, selectedFilter, searchQuery]);

  return (
    <div style={{ ...darkPageShell }}>
      <div className="dot-grid" style={{ opacity: 0.1 }}></div>
      <div
        className="discover-padding"
        style={{
          position: 'relative',
          zIndex: 1,
          padding: '8rem 6rem 4rem 6rem',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '1400px',
          margin: '0 auto',
          minHeight: '100vh',
        }}
      >
        {/* Page Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            color: 'var(--text-primary)',
            fontSize: '3.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          Clubs & Initiatives
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.45, type: 'spring', stiffness: 200, damping: 10 }}
            style={{ color: '#ff4d00', fontSize: '4rem', lineHeight: '0', display: 'inline-block' }}
          >.</motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          style={{
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '1rem',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            marginLeft: 'auto',
            marginRight: 'auto',
            lineHeight: 1.5,
          }}
        >
          Explore college organizations, technical initiatives, and creative clubs driving campus engagement.
        </motion.p>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{ maxWidth: '560px', width: '100%', margin: '0 auto 2.5rem auto', position: 'relative' }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'var(--border-subtle)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '0.75rem 1.25rem',
            }}
          >
            <Search size={18} color="var(--text-muted)" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, description, tags..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '0.95rem',
                fontFamily: "'Outfit', sans-serif",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex' }}
              >
                <X size={16} color="var(--text-muted)" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter Tags */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: 'flex', gap: '0.6rem', marginBottom: '3rem', overflowX: 'auto', paddingBottom: '4px', justifyContent: 'center' }}
        >
          {(['All', 'Initiative', 'Organization', 'Club'] as const).map((filter) => {
            const active = selectedFilter === filter;
            const displayName = filter === 'All' ? 'All Portal' : filter + 's';
            return (
              <motion.button
                key={filter}
                type="button"
                onClick={() => setSelectedFilter(filter)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  flexShrink: 0,
                  background: active ? 'rgba(255,77,0,0.2)' : 'var(--border-color)',
                  color: active ? '#ff4d00' : 'var(--text-secondary)',
                  border: `1px solid ${active ? '#ff4d00' : 'var(--border-color)'}`,
                  padding: '0.5rem 1.25rem',
                  borderRadius: '10px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                {displayName}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Loading Spinner */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem' }}>
            <Loader2 className="spin" size={40} color="#ff4d00" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {filteredClubs.length > 0 ? (
              <motion.div
                layout
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  paddingBottom: '3rem',
                  width: '100%',
                }}
              >
                {filteredClubs.map((club, index) => (
                  <motion.div
                    key={club.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { window.location.hash = `#club-detail?id=${club.id}`; }}
                    className="club-card-container"
                    style={{
                      background: 'var(--bg-card)',
                      borderRadius: '20px',
                      border: '1px solid var(--border-subtle)',
                      padding: '1.25rem 1.5rem',
                      display: 'flex',
                      gap: '1.5rem',
                      alignItems: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                      position: 'relative',
                    }}
                  >
                    {/* Logo */}
                    <div
                      className="club-card-logo"
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        flexShrink: 0,
                        border: '1px solid var(--border-color)',
                        background: '#fff',
                      }}
                    >
                      <img src={club.logo} alt={club.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {club.name}
                        </h3>
                        <span
                          style={{
                            fontSize: '0.7rem',
                            padding: '3px 10px',
                            borderRadius: '20px',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            background: club.type === 'Club' ? 'rgba(59,130,246,0.15)' : club.type === 'Initiative' ? 'rgba(249,115,22,0.15)' : 'rgba(16,185,129,0.15)',
                            color: club.type === 'Club' ? '#3b82f6' : club.type === 'Initiative' ? '#f97316' : '#10b981',
                            flexShrink: 0
                          }}
                        >
                          {club.type}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                        {club.description}
                      </p>

                      {/* Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.6rem' }}>
                        {club.tags.map((tag) => (
                          <span
                            key={tag}
                            style={{
                              background: 'var(--border-subtle)',
                              color: 'var(--text-secondary)',
                              fontSize: '0.7rem',
                              padding: '2px 8px',
                              borderRadius: '6px',
                            }}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}
              >
                <Compass size={40} style={{ margin: '0 auto 1rem', opacity: 0.35, display: 'block' }} />
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No results found</p>
                <p style={{ fontSize: '0.9rem', marginTop: '0.35rem' }}>Try looking for another term or selecting a different category.</p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <style>{`
        .spin { animation: spin-anim 1s linear infinite; }
        @keyframes spin-anim { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .discover-padding { padding: 6rem 1rem 4rem 1rem !important; }
          .club-card-container {
            flex-direction: column !important;
            align-items: flex-start !important;
            padding: 1.25rem !important;
          }
          .club-card-logo {
            width: 60px !important;
            height: 60px !important;
          }
        }
      `}</style>
    </div>
  );
}
