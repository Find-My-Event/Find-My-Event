import type { CSSProperties } from 'react';

export const darkPageShell: CSSProperties = {
  minHeight: '100vh',
  backgroundColor: 'var(--bg-primary)',
  backgroundImage: `
    radial-gradient(circle at top right, rgba(138, 43, 226, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(255, 60, 150, 0.08) 0%, transparent 50%),
    radial-gradient(circle at top center, rgba(30, 60, 150, 0.1) 0%, transparent 60%)
  `,
  fontFamily: "'Outfit', sans-serif",
  overflowX: 'hidden',
};
