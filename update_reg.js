const fs = require('fs');
const file = 'client/src/pages/ManageEvent.tsx';
let c = fs.readFileSync(file, 'utf8');
const originalEnding = c.includes('\r\n') ? '\r\n' : '\n';
c = c.replace(/\r\n/g, '\n');

// 1. Revert Top Metrics Cards and add inline select
const oldCards = `       {/* Top Metrics */}
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

const newCards = `       {/* Top Metrics */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card-hover" style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={20} color="#3b82f6" /></div>
             <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Registration window</div>
                <select value={regWindow} onChange={(e) => setRegWindow(e.target.value)} style={{ fontSize: '0.8rem', color: '#666', border: 'none', background: 'transparent', outline: 'none', padding: 0, margin: 0, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}>
                   <option value="Open">Open</option>
                   <option value="Closed">Closed</option>
                   <option value="Draft">Draft</option>
                </select>
             </div>
          </div>
          <div className="card-hover" style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="#a855f7" /></div>
             <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Participation type</div>
                <select value={partType} onChange={(e) => setPartType(e.target.value)} style={{ fontSize: '0.8rem', color: '#666', border: 'none', background: 'transparent', outline: 'none', padding: 0, margin: 0, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}>
                   <option value="Individual">Individual</option>
                   <option value="Team">Team</option>
                </select>
             </div>
          </div>
       </div>`;

if (c.includes(oldCards)) {
    c = c.replace(oldCards, newCards);
    console.log('[OK] Updated cards');
}

// 2. Ticket INR symbol mapping
const oldTicketPrice = `<div style={{ color: '#666', fontSize: '0.9rem' }}>{t.price}</div>`;
const newTicketPrice = `<div style={{ color: '#666', fontSize: '0.9rem' }}>{t.price === 'Free' || t.price.toLowerCase() === 'free' ? 'Free' : (t.price.includes('₹') ? t.price : '₹' + t.price)}</div>`;
if (c.includes(oldTicketPrice)) {
    c = c.replace(oldTicketPrice, newTicketPrice);
    console.log('[OK] Updated ticket price display to use INR');
}

const oldTicketInput = `<input type="text" placeholder="Price (e.g. Free, $10)" value={newTicket.price} onChange={e => setNewTicket({...newTicket, price: e.target.value})} style={{ width: '150px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />`;
const newTicketInput = `<div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#111' }}>₹</span>
                    <input type="text" placeholder="Price (in INR)" value={newTicket.price} onChange={e => setNewTicket({...newTicket, price: e.target.value})} style={{ width: '150px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>`;
if (c.includes(oldTicketInput)) {
    c = c.replace(oldTicketInput, newTicketInput);
    console.log('[OK] Updated ticket input with INR symbol');
}

// 3. Save Registration Details button
const endOfTab = `             </div>

          </div>
       </div>
    </div>
  );
}`;

const newEndOfTab = `             </div>

          </div>
       </div>

       <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #eaeaea', paddingTop: '1.5rem' }}>
          <button onClick={async () => {
             await saveEvent({ participantType: partType === 'Team' ? 'team' : 'individual' });
             alert('Registration details saved successfully!');
          }} style={{ background: '#7c3aed', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}>
              Save Registration Details
          </button>
       </div>
    </div>
  );
}`;
if (c.includes(endOfTab)) {
    c = c.replace(endOfTab, newEndOfTab);
    console.log('[OK] Added Save Registration Details button');
} else {
    // try a more generic replace
    c = c.replace(/<\/div>\n    <\/div>\n  \);\n\}/, `       <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #eaeaea', paddingTop: '1.5rem' }}>\n          <button onClick={async () => {\n             await saveEvent({ participantType: partType === 'Team' ? 'team' : 'individual' });\n             alert('Registration details saved successfully!');\n          }} style={{ background: '#7c3aed', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}>\n              Save Registration Details\n          </button>\n       </div>\n    </div>\n  );\n}`);
}

if (originalEnding === '\r\n') {
    c = c.replace(/\n/g, '\r\n');
}
fs.writeFileSync(file, c);
console.log('Done');
