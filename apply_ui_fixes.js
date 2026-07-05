const fs = require('fs');

// 1. Update App.css
const cssFile = 'client/src/App.css';
let css = fs.readFileSync(cssFile, 'utf8');

const oldCssHover = `.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-left 0.2s ease;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-left: 4px solid var(--accent, #a855f7);
}`;

const newCssHover = `.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-left 0.2s ease;
  border: 1px solid #eaeaea !important;
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  border-left: 4px solid var(--accent, #a855f7) !important;
}`;

if (css.includes(oldCssHover)) {
    css = css.replace(oldCssHover, newCssHover);
    fs.writeFileSync(cssFile, css);
    console.log('[OK] Updated App.css for card-hover');
} else {
    // maybe already updated or different formatting
    console.log('[SKIP] App.css not strictly matching oldCssHover');
    // let's try a simpler replace
    if (!css.includes('!important')) {
        css = css.replace(/border-left: 4px solid var\(--accent, #a855f7\);/g, 'border-left: 4px solid var(--accent, #a855f7) !important;');
        css = css.replace(/\.card-hover \{/g, '.card-hover {\n  border: 1px solid #eaeaea !important;');
        fs.writeFileSync(cssFile, css);
        console.log('[OK] Updated App.css with fuzzy match');
    }
}

// 2. Update ManageEvent.tsx
const tsxFile = 'client/src/pages/ManageEvent.tsx';
let tsx = fs.readFileSync(tsxFile, 'utf8');
const originalEnding = tsx.includes('\r\n') ? '\r\n' : '\n';
tsx = tsx.replace(/\r\n/g, '\n');

// A. Registration Control removal from SettingsTab
const regControlRegex = /\{\/\* Registration Control \*\/\}\n\s*<div>\n\s*<h3[^>]*>Registration Control<\/h3>\n\s*<div[^>]*>\n\s*<span[^>]*>Registration Control<\/span>\n\s*<select[^>]*onChange=\{async e => \{[^}]*\}\}[^>]*>\n\s*<option[^>]*>Require Approval<\/option>\n\s*<option[^>]*>Auto Approve<\/option>\n\s*<\/select>\n\s*<\/div>\n\s*<\/div>\n\n\s*/g;
if (regControlRegex.test(tsx)) {
    tsx = tsx.replace(regControlRegex, '');
    console.log('[OK] Removed Registration Control from SettingsTab');
} else {
    console.log('[SKIP] Registration Control not found via Regex');
}

// B. Update RegistrationTab state
const oldState = `  const [capacity] = useState(event?.capacity?.toString() || '100');
  const [partType] = useState(event?.participantType === 'team' ? 'Team' : 'Individual');`;
const newState = `  const [capacity] = useState(event?.capacity?.toString() || '100');
  const [partType, setPartType] = useState(event?.participantType === 'team' ? 'Team' : 'Individual');
  const [regWindow, setRegWindow] = useState('Open');`;

if (tsx.includes(oldState)) {
    tsx = tsx.replace(oldState, newState);
    console.log('[OK] Updated RegistrationTab state');
} else {
    console.log('[SKIP] RegistrationTab state not found');
}

// C. Update Registration Window and Participation Type cards
const oldCards = `       {/* Top Metrics */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card-hover" style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={20} color="#3b82f6" /></div>
             <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Registration window</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>24 Mar - 01 Apr</div>
             </div>
          </div>
          <div className="card-hover" style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="#a855f7" /></div>
             <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Participation type</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{partType}</div>
             </div>
          </div>
       </div>`;

const newCards = `       {/* Top Metrics */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card-hover" style={{ background: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={20} color="#3b82f6" /></div>
                <div>
                   <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Registration window</div>
                   <div style={{ fontSize: '0.8rem', color: '#666' }}>{regWindow}</div>
                </div>
             </div>
             <select value={regWindow} onChange={async (e) => {
                setRegWindow(e.target.value);
                // Optionally saveEvent here if it maps to a backend field
             }} style={{ border: '1px solid #eaeaea', padding: '6px 12px', borderRadius: '6px', outline: 'none', fontSize: '0.8rem', color: '#111', cursor: 'pointer', background: '#f8fafc' }}>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
             </select>
          </div>
          <div className="card-hover" style={{ background: '#fff', border: 'none', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="#a855f7" /></div>
                <div>
                   <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Participation type</div>
                   <div style={{ fontSize: '0.8rem', color: '#666' }}>{partType}</div>
                </div>
             </div>
             <select value={partType} onChange={async (e) => {
                setPartType(e.target.value);
                await saveEvent({ participantType: e.target.value === 'Team' ? 'team' : 'individual' });
             }} style={{ border: '1px solid #eaeaea', padding: '6px 12px', borderRadius: '6px', outline: 'none', fontSize: '0.8rem', color: '#111', cursor: 'pointer', background: '#f8fafc' }}>
                <option value="Individual">Individual</option>
                <option value="Team">Team</option>
             </select>
          </div>
       </div>`;

if (tsx.includes(oldCards)) {
    tsx = tsx.replace(oldCards, newCards);
    console.log('[OK] Updated Registration Cards');
} else {
    console.log('[SKIP] Registration Cards not found');
}

// Restore line endings
if (originalEnding === '\r\n') {
    tsx = tsx.replace(/\n/g, '\r\n');
}
fs.writeFileSync(tsxFile, tsx);
console.log('\n[DONE] Finished updating files.');
