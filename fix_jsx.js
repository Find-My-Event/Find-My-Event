const fs = require('fs');
const file = 'client/src/pages/ManageEvent.tsx';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/\r\n/g, '\n');

const brokenOld = `       {/* Top Metrics */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card-hover" style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>`;

const fixedNew = `       {/* Top Metrics */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card-hover" style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>`;

if (c.includes(brokenOld)) {
    c = c.replace(brokenOld, fixedNew);
    c = c.replace(/\n/g, '\r\n');
    fs.writeFileSync(file, c);
    console.log('[OK] Fixed JSX syntax error');
} else {
    console.log('[FAIL] Could not find the broken JSX block');
}
