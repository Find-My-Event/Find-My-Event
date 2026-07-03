import { useState, useRef } from 'react';
import { LayoutGrid, Plus, Bell, Search, Image as ImageIcon, MapPin, ChevronDown, CheckCircle, Users, Trophy, ArrowRight, Edit2, Check, Trash2, Download, Lock, Link as LinkIcon, Send, User, Mail, Phone } from 'lucide-react';
import darkLogo from '../logo/dark logo.png';
import Footer from '../components/Footer';

// -------------------------------------------------------------
// OVERVIEW TAB
// -------------------------------------------------------------
const MOCK_LOCATIONS = [
  { id: '1', title: 'JECRC University Campus', subtitle: 'Plot No.IS-2036 to 2039, Ramchandrapura Industrial Area, Vidhani, Rajasthan 303905' },
  { id: '2', title: 'Jaipur Exhibition & Convention Centre (JECC)', subtitle: 'RIICO Industrial Area, Sitapura, Jaipur, Rajasthan 302022' },
  { id: '3', title: 'Rajasthan International Centre', subtitle: 'Jhalana Doongri, Jaipur, Rajasthan 302004' },
  { id: '4', title: 'Birla Auditorium', subtitle: 'Statue Circle, C Scheme, Rambagh, Jaipur, Rajasthan 302005' },
  { id: '5', title: 'Clarks Amer', subtitle: 'Jawahar Lal Nehru Marg, Lal Bahadur Nagar, Chandrakala Colony, Jaipur, Rajasthan 302018' },
];

function OverviewTab() {
  const [poster, setPoster] = useState<string | null>('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80');
  
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [startDate, setStartDate] = useState('2026-06-18');
  const [startTime, setStartTime] = useState('00:30');
  const [endDate, setEndDate] = useState('2026-06-19');
  const [endTime, setEndTime] = useState('00:30');
  
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [selectedMockLocation, setSelectedMockLocation] = useState<any>(MOCK_LOCATIONS[0]);
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  
  const [participantType, setParticipantType] = useState<'individual' | 'team'>('team');
  const [teamMin, setTeamMin] = useState(2);
  const [teamMax, setTeamMax] = useState(4);
  
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState('Participants will work on the problem statement on AI for Public Good...');
  
  const [isEditingElig, setIsEditingElig] = useState(false);
  const [eligYears, setEligYears] = useState('Engineering students only\nAllowed Years: 1, 2, 3, 4');
  
  const [timeline, setTimeline] = useState([
    { id: 1, date: '16 Jun', startDate: '23 Jun 26, 12:00 AM IST', endDate: '27 Jun 26, 11:59 PM IST', title: 'Upload Detailed Solution Document', desc: 'Participants will work on the problem statement...' },
    { id: 2, date: '16 Jun', startDate: '23 Jun 26, 12:00 AM IST', endDate: '27 Jun 26, 11:59 PM IST', title: 'Final', desc: 'Finalist teams will present their solutions...' }
  ]);
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [newTimeline, setNewTimeline] = useState({ title: '', desc: '', start: '', end: '' });

  const [isEditingRules, setIsEditingRules] = useState(false);
  const [rules, setRules] = useState('1. Respect everyone.\n2. Submit on time.');

  const [contacts, setContacts] = useState([
    { id: 1, name: 'Chirag Sharma', email: 'chirag@eventum.com', phone: '+91 98765-12345', isEditing: false }
  ]);
  
  const [isAddingPrize, setIsAddingPrize] = useState(false);
  
  const handleAddTimeline = () => {
    if(!newTimeline.title) return;
    setTimeline([...timeline, { id: Date.now(), date: 'New', startDate: newTimeline.start, endDate: newTimeline.end, title: newTimeline.title, desc: newTimeline.desc }]);
    setShowAddTimeline(false);
    setNewTimeline({ title: '', desc: '', start: '', end: '' });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {/* 1. Poster & Dates/Location */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr', gap: '2.5rem', marginBottom: '2rem' }}>
        
        {/* Left Column - Poster (A4 size ratio) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ 
            aspectRatio: '1 / 1.414', 
            background: '#222', 
            borderRadius: '16px', 
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}>
            {poster ? (
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
                <img src={poster} alt="Blur" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(30px)', opacity: 0.6, transform: 'scale(1.2)' }} />
                <img src={poster} alt="Preview" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', zIndex: 1 }} />
              </div>
            ) : (
              <>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <h3 style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, textAlign: 'center', zIndex: 2, lineHeight: 1.2 }}>upload<br/>your image</h3>
                <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: '#fff', borderRadius: '8px', padding: '8px', display: 'flex' }}>
                  <ImageIcon size={20} color="#7c3aed" />
                </div>
              </>
            )}
            
            <input type="file" ref={fileInputRef} onChange={(e) => {
              if(e.target.files && e.target.files[0]) {
                 const url = URL.createObjectURL(e.target.files[0]);
                 setPoster(url);
              }
            }} style={{ display: 'none' }} accept="image/*" />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={() => fileInputRef.current?.click()} style={{ flex: 1, background: '#eaeaea', color: '#555', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              Change Poster
            </button>
            {poster && (
              <button onClick={() => setPoster(null)} style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Right Column - Dates & Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* Dates */}
          <div style={{ background: '#eaeaea', padding: '20px', borderRadius: '12px', position: 'relative' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111' }}>Event Timeline</h4>
                <button onClick={() => setIsEditingDates(!isEditingDates)} style={{ background: isEditingDates ? '#111' : '#d1d5db', color: isEditingDates ? '#fff' : '#4b5563', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {isEditingDates ? <><Check size={14} /> Save</> : <><Edit2 size={14} /> Edit</>}
                </button>
             </div>
             
             <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '6px' }}>
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#111' }} />
                 <div style={{ width: '2px', flex: 1, borderLeft: '2px dotted #888', margin: '6px 0' }} />
                 <div style={{ width: '8px', height: '8px', borderRadius: '50%', border: '2px solid #111', background: 'transparent' }} />
               </div>
               <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>Start</div>
                   {isEditingDates ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                         <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fff', outline: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#555' }} />
                         <input type="time" value={startTime} onChange={e=>setStartTime(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fff', outline: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#555' }} />
                      </div>
                   ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ background: '#dcdcdc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{startDate}</div>
                        <div style={{ background: '#dcdcdc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{startTime}</div>
                      </div>
                   )}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                   <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>End</div>
                   {isEditingDates ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                         <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fff', outline: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#555' }} />
                         <input type="time" value={endTime} onChange={e=>setEndTime(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fff', outline: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#555' }} />
                      </div>
                   ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ background: '#dcdcdc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{endDate}</div>
                        <div style={{ background: '#dcdcdc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{endTime}</div>
                      </div>
                   )}
                 </div>
               </div>
             </div>
          </div>

          {/* Location */}
          <div style={{ background: '#eaeaea', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111' }}>Location</h4>
               <button onClick={() => setIsEditingLocation(!isEditingLocation)} style={{ background: isEditingLocation ? '#111' : '#d1d5db', color: isEditingLocation ? '#fff' : '#4b5563', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                 {isEditingLocation ? <><Check size={14} /> Done</> : <><Edit2 size={14} /> Edit</>}
               </button>
            </div>
            
            <div 
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: isEditingLocation && !selectedMockLocation ? 'pointer' : 'default', background: '#fff', padding: '12px', borderRadius: '8px' }}
              onClick={() => {
                if (isEditingLocation && !selectedMockLocation) setIsLocationExpanded(true);
              }}
            >
              <MapPin size={20} color="#888" />
              <div style={{ flex: 1 }}>
                {selectedMockLocation ? (
                  <>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>{selectedMockLocation.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedMockLocation.subtitle}</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#555' }}>Add Event Location</div>
                    <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>Offline location or virtual link</div>
                  </>
                )}
              </div>
              {isEditingLocation && selectedMockLocation && (
                 <button 
                   onClick={(e) => {
                     e.stopPropagation();
                     setSelectedMockLocation(null);
                     setLocationSearchTerm('');
                     setIsLocationExpanded(true);
                   }} 
                   style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                 >
                   <Trash2 size={16} />
                 </button>
              )}
            </div>

            {/* Expanded Search State (Only shows in edit mode) */}
            {isEditingLocation && !selectedMockLocation && isLocationExpanded && (
              <div style={{ marginTop: '0.5rem', background: '#fff', padding: '1rem', borderRadius: '8px' }}>
                <input 
                  autoFocus
                  placeholder="Enter location or virtual link"
                  value={locationSearchTerm}
                  onChange={e => setLocationSearchTerm(e.target.value)}
                  style={{ width: '100%', background: 'transparent', borderBottom: '1px solid rgba(0,0,0,0.1)', borderTop: 'none', borderLeft: 'none', borderRight: 'none', padding: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 600, color: '#555', outline: 'none' }}
                />
                
                {/* Mock Search Results */}
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {locationSearchTerm.trim() !== '' && (
                    <div 
                      onClick={() => {
                        setSelectedMockLocation({ id: 'custom', title: locationSearchTerm, subtitle: 'Manual Location' });
                        setIsLocationExpanded(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '8px', cursor: 'pointer', borderRadius: '8px', background: 'rgba(0,0,0,0.05)' }}
                    >
                      <MapPin size={16} color="#888" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#555' }}>Use "{locationSearchTerm}"</div>
                        <div style={{ fontSize: '0.75rem', color: '#888' }}>Add location manually</div>
                      </div>
                    </div>
                  )}
                  
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#888', marginTop: locationSearchTerm.trim() !== '' ? '0.5rem' : '0' }}>Recent Locations</div>
                  {MOCK_LOCATIONS.filter(loc => loc.title.toLowerCase().includes(locationSearchTerm.toLowerCase())).map(loc => (
                    <div 
                      key={loc.id} 
                      onClick={() => {
                        setSelectedMockLocation(loc);
                        setIsLocationExpanded(false);
                      }}
                      style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '8px', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.2s' }}
                    >
                      <MapPin size={16} color="#888" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#555' }}>{loc.title}</div>
                        <div style={{ fontSize: '0.75rem', color: '#888', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loc.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map Preview */}
            {selectedMockLocation && (
              <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', marginTop: '0.5rem', background: '#ccc' }}>
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0 }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedMockLocation.title)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* Participant Type */}
          <div style={{ background: '#eaeaea', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>Participant type</div>
               <select value={participantType} onChange={e => setParticipantType(e.target.value as 'individual' | 'team')} style={{ background: 'transparent', border: 'none', fontSize: '0.9rem', fontWeight: 700, color: '#111', outline: 'none', cursor: 'pointer' }}>
                  <option value="individual">Individual</option>
                  <option value="team">Team</option>
               </select>
            </div>
            
            {participantType === 'team' && (
              <div style={{ borderTop: '1px solid #dcdcdc', paddingTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                 <span>Min</span>
                 <input type="number" value={teamMin} onChange={e=>setTeamMin(Number(e.target.value))} style={{ width: '60px', background: '#dcdcdc', border: 'none', borderRadius: '4px', padding: '4px', textAlign: 'center' }} />
                 <input type="range" min={1} max={10} value={teamMax} onChange={e=>setTeamMax(Number(e.target.value))} style={{ flex: 1 }} />
                 <span>Max</span>
                 <input type="number" value={teamMax} onChange={e=>setTeamMax(Number(e.target.value))} style={{ width: '60px', background: '#dcdcdc', border: 'none', borderRadius: '4px', padding: '4px', textAlign: 'center' }} />
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Description Card */}
      <div className="card-container">
        <div className="card-header">
          <h3 className="card-title">Description</h3>
          <button className="add-btn" onClick={() => setIsEditingDesc(!isEditingDesc)}>
             {isEditingDesc ? <><Check size={14}/> Save</> : <><Edit2 size={14}/> Edit</>}
          </button>
        </div>
        {isEditingDesc ? (
           <textarea value={description} onChange={e=>setDescription(e.target.value)} style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem' }} />
        ) : (
           <div style={{ fontSize: '0.9rem', color: '#555', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{description}</div>
        )}
      </div>

      {/* Eligibility Card */}
      <div className="card-container">
        <div className="card-header">
          <h3 className="card-title">Eligibility</h3>
          <button className="add-btn" onClick={() => setIsEditingElig(!isEditingElig)}>
             {isEditingElig ? <><Check size={14}/> Save</> : <><Edit2 size={14}/> Edit</>}
          </button>
        </div>
        {isEditingElig ? (
           <textarea value={eligYears} onChange={e=>setEligYears(e.target.value)} style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem' }} />
        ) : (
           <div style={{ fontSize: '0.9rem', color: '#555', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{eligYears}</div>
        )}
      </div>

      {/* Timeline Card */}
      <div className="card-container">
        <div className="card-header">
          <h3 className="card-title">Stages & Timeline</h3>
          <button className="add-btn" onClick={() => setShowAddTimeline(!showAddTimeline)}><Plus size={14}/> Add Timeline</button>
        </div>
        
        {showAddTimeline && (
           <div style={{ background: '#fafafa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', border: '1px solid #eaeaea' }}>
              <input placeholder="Stage Title (e.g. Registration Opens)" value={newTimeline.title} onChange={e=>setNewTimeline({...newTimeline, title: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                 <input type="date" value={newTimeline.start} onChange={e=>setNewTimeline({...newTimeline, start: e.target.value})} style={{ flex: 1, minWidth: '150px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                 <input type="date" value={newTimeline.end} onChange={e=>setNewTimeline({...newTimeline, end: e.target.value})} style={{ flex: 1, minWidth: '150px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>
              <textarea placeholder="Description" value={newTimeline.desc} onChange={e=>setNewTimeline({...newTimeline, desc: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', minHeight: '60px' }} />
              <button onClick={handleAddTimeline} style={{ background: '#111', color: '#fff', padding: '8px', borderRadius: '6px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Save Stage</button>
           </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingLeft: '14px' }}>
          {timeline.map((item, i) => (
             <div key={item.id} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
               {i !== timeline.length - 1 && <div style={{ position: 'absolute', left: '16px', top: '30px', bottom: '-20px', borderLeft: '2px dotted #ccc' }} />}
               <div style={{ zIndex: 1, background: i % 2 === 0 ? '#fdf2f8' : '#eff6ff', border: `1px solid ${i % 2 === 0 ? '#fbcfe8' : '#bfdbfe'}`, borderRadius: '8px', padding: '4px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px' }}>
                  <div style={{ fontSize: '0.55rem', fontWeight: 800, color: i % 2 === 0 ? '#ec4899' : '#3b82f6', textTransform: 'uppercase' }}>Date</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#111', lineHeight: '1' }}>{item.date.split(' ')[0]}</div>
               </div>
               <div style={{ flex: 1, paddingBottom: '1rem' }}>
                 <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <span style={{ color: '#111' }}>{item.startDate}</span>
                   <span style={{ color: '#888' }}>→</span>
                   <span style={{ color: '#888' }}>{item.endDate}</span>
                 </div>
                 <div style={{ background: '#fafafa', border: '1px solid #eaeaea', borderRadius: '12px', padding: '1rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.5rem 0', wordBreak: 'break-word' }}>{item.title}</h4>
                      <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setTimeline(timeline.filter(t => t.id !== item.id))} />
                   </div>
                   <p style={{ fontSize: '0.85rem', color: '#666', margin: 0, lineHeight: 1.5 }}>{item.desc}</p>
                 </div>
               </div>
             </div>
          ))}
        </div>
      </div>

      {/* Rules Card */}
      <div className="card-container">
        <div className="card-header">
          <h3 className="card-title">Rules & Instructions</h3>
          <button className="add-btn" onClick={() => setIsEditingRules(!isEditingRules)}>
             {isEditingRules ? <><Check size={14}/> Save</> : <><Edit2 size={14}/> Edit</>}
          </button>
        </div>
        {isEditingRules ? (
           <textarea value={rules} onChange={e=>setRules(e.target.value)} style={{ width: '100%', minHeight: '100px', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '0.9rem' }} />
        ) : (
           <div style={{ fontSize: '0.9rem', color: '#555', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{rules}</div>
        )}
      </div>

      {/* Contact Info */}
      <div className="card-container">
        <div className="card-header">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h3 className="card-title">Contact Information</h3>
            <div style={{ fontSize: '0.8rem', color: '#555', marginTop: '4px' }}>Contact details:</div>
          </div>
          <button style={{ background: '#eaeaea', color: '#555', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, border: 'none', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => setContacts([...contacts, { id: Date.now(), name: '', email: '', phone: '', isEditing: true }])}>
            Add Coordinator <ChevronDown size={14} />
          </button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
           {contacts.map((c, idx) => (
              <div key={c.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
                 {idx > 0 && <div style={{ borderTop: '1px solid #eaeaea', marginBottom: '0.5rem' }}></div>}
                 
                 <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button onClick={() => { const nc = [...contacts]; const f = nc.find(x=>x.id===c.id); if(f) f.isEditing = !f.isEditing; setContacts(nc); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {c.isEditing ? <><Check size={14}/> Save</> : <><Edit2 size={14}/> Edit</>}
                    </button>
                    <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => setContacts(contacts.filter(con => con.id !== c.id))} />
                 </div>

                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '28px', height: '28px', background: '#fdf2f8', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><User size={16} color="#ec4899" /></div>
                   {c.isEditing ? <input placeholder="Name" value={c.name} onChange={e => { const nc = [...contacts]; const f = nc.find(x=>x.id===c.id); if(f) f.name = e.target.value; setContacts(nc); }} style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }} /> : <span style={{ fontSize: '0.9rem', color: '#111' }}>{c.name || 'Name'}</span>}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '28px', height: '28px', background: '#eff6ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={16} color="#3b82f6" /></div>
                   {c.isEditing ? <input placeholder="Phone" value={c.phone} onChange={e => { const nc = [...contacts]; const f = nc.find(x=>x.id===c.id); if(f) f.phone = e.target.value; setContacts(nc); }} style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }} /> : <span style={{ fontSize: '0.9rem', color: '#111' }}>{c.phone || 'Phone'}</span>}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                   <div style={{ width: '28px', height: '28px', background: '#f3e8ff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={16} color="#9333ea" /></div>
                   {c.isEditing ? <input placeholder="Email" value={c.email} onChange={e => { const nc = [...contacts]; const f = nc.find(x=>x.id===c.id); if(f) f.email = e.target.value; setContacts(nc); }} style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px', flex: 1 }} /> : <span style={{ fontSize: '0.9rem', color: '#111' }}>{c.email || 'Email'}</span>}
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Prize Distribution */}
      <div className="card-container">
         <div className="card-header">
            <h3 className="card-title">Prize and Rewards Detail</h3>
            <button className="add-btn" onClick={() => setIsAddingPrize(!isAddingPrize)} style={{ background: '#eaeaea', color: '#555', border: 'none', padding: '8px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
               Add Prize <ChevronDown size={14} />
            </button>
         </div>

         {!isAddingPrize ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Trophy size={18} color="#ec4899" />
                  <span style={{ fontSize: '0.9rem', color: '#111' }}>First Prize: ₹50,000 + Certificate + Trophy</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Trophy size={18} color="#3b82f6" />
                  <span style={{ fontSize: '0.9rem', color: '#111' }}>Second Prize: ₹25,000 + Certificate</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Trophy size={18} color="#9333ea" />
                  <span style={{ fontSize: '0.9rem', color: '#111' }}>Third Prize: ₹15,000 + Certificate</span>
               </div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Trophy size={18} color="#888" />
                  <span style={{ fontSize: '0.9rem', color: '#111' }}>All Participants: Certificate</span>
               </div>
            </div>
         ) : (
            <div style={{ background: '#dcdcdc', padding: '2rem', borderRadius: '12px', marginTop: '1rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                     <Trophy size={32} color="#fff" />
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111', margin: '0 0 0.5rem 0' }}>Prize Distribution</h2>
                  <div style={{ color: '#888', fontSize: '0.9rem', fontWeight: 600 }}>Please Sign In or Sign up below</div>
               </div>
               
               <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                     <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '6px', display: 'block' }}>Reward Type</label>
                     <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', background: '#eaeaea', fontWeight: 600, color: '#555' }}>
                        <option>Select reward type</option>
                        <option>Cash Prize</option>
                        <option>Goodies</option>
                     </select>
                  </div>
                  <div>
                     <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '6px', display: 'block' }}>For Position</label>
                     <select style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', background: '#eaeaea', fontWeight: 600, color: '#555' }}>
                        <option>Position</option>
                        <option>1st Place</option>
                        <option>2nd Place</option>
                        <option>3rd Place</option>
                     </select>
                  </div>
                  <div>
                     <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '6px', display: 'block' }}>Amount</label>
                     <input placeholder="Example: 50,000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', background: '#eaeaea', fontWeight: 600, color: '#555' }} />
                  </div>
                  <button onClick={() => setIsAddingPrize(false)} style={{ background: '#1a1a1a', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', marginTop: '0.5rem' }}>Add Reward</button>
               </div>
            </div>
         )}
      </div>

    </div>
  );
}

// -------------------------------------------------------------
// REGISTRATION TAB
// -------------------------------------------------------------
function RegistrationTab() {
  const [capacity] = useState('100');
  const [partType] = useState('Team');

  const [tickets, setTickets] = useState([{ id: 1, category: 'General Pass', price: 'Free' }]);
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ category: '', price: '' });

  const [personalInfo, setPersonalInfo] = useState([
    { id: 1, name: 'Name', required: 'Required' },
    { id: 2, name: 'Email', required: 'Required' },
    { id: 3, name: 'Mobile Number', required: 'Optional' }
  ]);
  const [isAddingPersonal, setIsAddingPersonal] = useState(false);
  const [newPersonalField, setNewPersonalField] = useState('');

  const [eduInfo, setEduInfo] = useState([
    { id: 1, name: 'Roll Number', required: 'Optional' },
    { id: 2, name: 'Course', required: 'Optional' },
    { id: 3, name: 'Branch', required: 'Optional' },
    { id: 4, name: 'Year', required: 'Off' }
  ]);
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [newEduField, setNewEduField] = useState('');

  const [customQuestions, setCustomQuestions] = useState([
    { id: 1, question: 'Why do you want to join?', type: 'Text', required: 'Required' },
    { id: 2, question: 'Do you need accommodation?', type: 'Checkbox', required: 'Optional' }
  ]);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({ question: '', type: 'Text', required: 'Optional' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       {/* Top Metrics */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: '40px', height: '40px', background: '#fdf2f8', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={20} color="#ec4899" /></div>
             <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Registration Window</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>Open</div>
             </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="#3b82f6" /></div>
             <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Event Capacity</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{capacity}</div>
             </div>
          </div>
          <div style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Users size={20} color="#a855f7" /></div>
             <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Participation type</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{partType}</div>
             </div>
          </div>
       </div>

       {/* Tickets */}
       <div>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: '#111' }}>Tickets</h3>
            <button onClick={() => setIsAddingTicket(!isAddingTicket)} style={{ background: '#eaeaea', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Plus size={14}/> Add Ticket</button>
         </div>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {tickets.map(t => (
               <div key={t.id} style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 600, color: '#111', fontSize: '0.95rem' }}>{t.category}</div>
                  <div style={{ color: '#666', fontSize: '0.9rem' }}>{t.price}</div>
               </div>
            ))}
            
            {isAddingTicket && (
               <div style={{ background: '#fff', border: '1px dashed #ccc', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Category Name" value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <input type="text" placeholder="Price (e.g. Free, $10)" value={newTicket.price} onChange={e => setNewTicket({...newTicket, price: e.target.value})} style={{ width: '150px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <button onClick={() => {
                     if(newTicket.category) {
                        setTickets([...tickets, { id: Date.now(), ...newTicket }]);
                        setNewTicket({ category: '', price: '' });
                        setIsAddingTicket(false);
                     }
                  }} style={{ background: '#111', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Save</button>
               </div>
            )}
         </div>
       </div>

       {/* Registration Questions */}
       <div>
         <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#111' }}>Registration Questions</h3>
         <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 1.5rem 0' }}>We will ask guests the following questions when they register for the event.</p>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Personal Info */}
            <div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>
                    <User size={16} color="#ec4899" /> Personal Information
                  </div>
                  <button onClick={() => setIsAddingPersonal(!isAddingPersonal)} className="add-btn"><Plus size={14}/> Add Field</button>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {personalInfo.map(info => (
                     <div key={info.id} style={{ border: '1px solid #eaeaea', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{info.name}</span>
                       <select value={info.required} onChange={e => setPersonalInfo(personalInfo.map(i => i.id === info.id ? {...i, required: e.target.value} : i))} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', color: '#888', cursor: 'pointer' }}>
                          <option value="Required">Required</option>
                          <option value="Optional">Optional</option>
                          <option value="Off">Off</option>
                       </select>
                     </div>
                  ))}
                  
                  {isAddingPersonal && (
                     <div style={{ border: '1px dashed #ccc', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="text" placeholder="Field name" value={newPersonalField} onChange={e => setNewPersonalField(e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', outline: 'none', fontSize: '0.9rem' }} autoFocus />
                        <button onClick={() => {
                           if(newPersonalField) {
                              setPersonalInfo([...personalInfo, { id: Date.now(), name: newPersonalField, required: 'Optional' }]);
                              setNewPersonalField('');
                              setIsAddingPersonal(false);
                           }
                        }} style={{ background: '#111', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                     </div>
                  )}
               </div>
            </div>

            {/* Educational Info */}
            <div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>
                    <CheckCircle size={16} color="#3b82f6" /> Educational Information
                  </div>
                  <button onClick={() => setIsAddingEdu(!isAddingEdu)} className="add-btn"><Plus size={14}/> Add Field</button>
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {eduInfo.map(info => (
                     <div key={info.id} style={{ border: '1px solid #eaeaea', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{info.name}</span>
                       <select value={info.required} onChange={e => setEduInfo(eduInfo.map(i => i.id === info.id ? {...i, required: e.target.value} : i))} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', color: '#888', cursor: 'pointer' }}>
                          <option value="Required">Required</option>
                          <option value="Optional">Optional</option>
                          <option value="Off">Off</option>
                       </select>
                     </div>
                  ))}
                  
                  {isAddingEdu && (
                     <div style={{ border: '1px dashed #ccc', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="text" placeholder="Field name" value={newEduField} onChange={e => setNewEduField(e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', outline: 'none', fontSize: '0.9rem' }} autoFocus />
                        <button onClick={() => {
                           if(newEduField) {
                              setEduInfo([...eduInfo, { id: Date.now(), name: newEduField, required: 'Optional' }]);
                              setNewEduField('');
                              setIsAddingEdu(false);
                           }
                        }} style={{ background: '#111', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Add</button>
                     </div>
                  )}
               </div>
            </div>
            
            {/* Custom Questions */}
            <div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 700, color: '#111', marginBottom: '1rem' }}>
                 <Edit2 size={16} color="#a855f7" /> Custom Questions
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {customQuestions.map(q => (
                     <div key={q.id} style={{ border: '1px solid #eaeaea', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                           <LayoutGrid size={16} color="#888" />
                           <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>{q.question}</div>
                              <div style={{ fontSize: '0.75rem', color: '#888' }}>{q.type} | {q.required}</div>
                           </div>
                        </div>
                        <Trash2 onClick={() => setCustomQuestions(customQuestions.filter(c => c.id !== q.id))} size={16} color="#888" style={{ cursor: 'pointer' }} />
                     </div>
                  ))}
                  
                  {isAddingQuestion && (
                     <div style={{ border: '1px dashed #ccc', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" placeholder="Type your question here" value={newQuestion.question} onChange={e => setNewQuestion({...newQuestion, question: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                           <select value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 }}>
                              <option value="Text">Text</option>
                              <option value="Checkbox">Checkbox</option>
                              <option value="Dropdown">Dropdown</option>
                              <option value="File Upload">File Upload</option>
                           </select>
                           <select value={newQuestion.required} onChange={e => setNewQuestion({...newQuestion, required: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 }}>
                              <option value="Required">Required</option>
                              <option value="Optional">Optional</option>
                           </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                           <button onClick={() => setIsAddingQuestion(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                           <button onClick={() => {
                              if(newQuestion.question) {
                                 setCustomQuestions([...customQuestions, { id: Date.now(), ...newQuestion }]);
                                 setNewQuestion({ question: '', type: 'Text', required: 'Optional' });
                                 setIsAddingQuestion(false);
                              }
                           }} style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Save Question</button>
                        </div>
                     </div>
                  )}
               </div>
               
               {!isAddingQuestion && (
                  <button onClick={() => setIsAddingQuestion(true)} style={{ marginTop: '1rem', background: '#eaeaea', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Plus size={14}/> Add Question</button>
               )}
            </div>

         </div>
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// PARTICIPANTS TAB
// -------------------------------------------------------------
function ParticipantsTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       {/* Actions */}
       <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <button style={{ flex: 1, minWidth: '150px', background: '#fdf2f8', color: '#ec4899', border: '1px solid #fbcfe8', padding: '12px', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Mail size={16} /> Invite Participants
          </button>
          <button style={{ flex: 1, minWidth: '150px', background: '#eff6ff', color: '#3b82f6', border: '1px solid #bfdbfe', padding: '12px', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <Users size={16} /> Check In Participants
          </button>
          <button style={{ flex: 1, minWidth: '150px', background: '#f3e8ff', color: '#a855f7', border: '1px solid #e9d5ff', padding: '12px', borderRadius: '12px', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <LinkIcon size={16} /> Share Event
          </button>
       </div>

       {/* Analytics Placeholder */}
       <div style={{ border: '1px solid #eaeaea', borderRadius: '12px', padding: '1.5rem', background: '#fff' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Page Views</h3>
             <select style={{ background: '#eaeaea', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, outline: 'none' }}><option>Last 7 Days</option></select>
          </div>
          {/* Mock Bar Chart */}
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', borderBottom: '1px solid #eaeaea', paddingBottom: '1rem' }}>
             <div style={{ width: '4px', height: '0%', background: '#ec4899' }} />
             <div style={{ width: '4px', height: '0%', background: '#ec4899' }} />
             <div style={{ width: '4px', height: '60%', background: '#ec4899' }} />
             <div style={{ width: '4px', height: '90%', background: '#ec4899' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem', color: '#888', fontSize: '0.8rem', fontWeight: 600 }}>
             <span>13 June</span>
             <span>14 June</span>
             <span>15 June</span>
          </div>
       </div>

       {/* Total Registrations */}
       <div>
         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Total Registrations</h3>
         <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ width: '20%', background: '#f97316' }} />
            <div style={{ width: '20%', background: '#22c55e' }} />
            <div style={{ width: '10%', background: '#888' }} />
            <div style={{ width: '50%', background: '#ec4899' }} />
         </div>
         <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', fontWeight: 700, flexWrap: 'wrap' }}>
            <span style={{ color: '#f97316' }}>• 2 Pending Approval</span>
            <span style={{ color: '#22c55e' }}>• 2 Confirmed</span>
            <span style={{ color: '#888' }}>• 1 Rejected</span>
            <span style={{ color: '#ec4899' }}>• 10 Total Registrations</span>
         </div>
       </div>

       {/* Participants Details */}
       <div>
         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Participants Details</h3>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '1px solid #eaeaea', padding: '12px', borderRadius: '8px' }}>
               <Search size={18} color="#888" style={{ marginRight: '12px' }} />
               <input placeholder="Search" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.95rem', width: '100%' }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
               <button style={{ background: '#fff', border: '1px solid #eaeaea', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <LayoutGrid size={14} /> All Participants
               </button>
               <button style={{ background: '#fff', border: '1px solid #eaeaea', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                 <Download size={14} /> Download Data
               </button>
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               {[
                 { name: 'Ninja Hatori', status: 'Approved', actions: false },
                 { name: 'Ninja Hatori', status: 'Pending', actions: true },
                 { name: 'Ninja Hatori', status: 'Rejected', actions: false }
               ].map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '12px 1rem', borderRadius: '8px', border: '1px solid #eaeaea', flexWrap: 'wrap', gap: '1rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ninja" alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #ccc' }} />
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</span>
                     </div>
                     <div style={{ fontSize: '0.85rem', color: '#666', minWidth: '150px' }}>user@example.edu.in</div>
                     <div style={{ fontSize: '0.85rem', color: '#666' }}>98765-12345</div>
                     
                     <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                        {p.actions ? (
                           <div style={{ display: 'flex', gap: '8px' }}>
                              <button style={{ background: 'transparent', border: 'none', color: '#22c55e', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Approve</button>
                              <button style={{ background: 'transparent', border: 'none', color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Decline</button>
                           </div>
                        ) : (
                           <span style={{ fontWeight: 700, fontSize: '0.85rem', color: p.status === 'Approved' ? '#22c55e' : '#888' }}>{p.status}</span>
                        )}
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888' }}>⋮</button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// ANNOUNCEMENT TAB
// -------------------------------------------------------------
function AnnouncementTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       <div>
         <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#111' }}>Announcement</h3>
         <div style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer" alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #ccc' }} />
               <textarea placeholder="Send an Announcement..." style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', minHeight: '80px', resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
               <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ background: '#eaeaea', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                     Recipient <span style={{ color: '#888' }}>All</span> <ChevronDown size={14}/>
                  </div>
                  <div style={{ background: '#eaeaea', padding: '8px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', color: '#555' }}>
                     Schedule
                  </div>
               </div>
               <button style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                 <Send size={14} /> Send
               </button>
            </div>
         </div>
       </div>

       <div>
         <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#111' }}>Announcement History</h3>
         <div style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1.5rem', borderRadius: '12px', display: 'flex', gap: '1rem' }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer" alt="" style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid #ccc' }} />
            <div>
               <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111', marginBottom: '0.5rem' }}>Name</div>
               <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>Message</div>
               <div style={{ fontSize: '0.75rem', color: '#888' }}>Sended to Approved Participants</div>
            </div>
         </div>
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// SETTINGS TAB
// -------------------------------------------------------------
function SettingsTab() {
  const [visibility, setVisibility] = useState('Public');
  const [regControl, setRegControl] = useState('Require Approval');

  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Ninja Hatori', email: 'user@example.edu.in', phone: '98765-12345', role: 'Admin', color: '#ec4899' }
  ]);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', role: 'Coordinator' });

  const handleCancelEvent = () => {
    if(window.confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      alert('Event Cancelled Successfully');
    }
  };

  const getRoleColor = (role: string) => {
    if(role === 'Admin') return '#ec4899';
    if(role === 'Coordinator') return '#3b82f6';
    return '#a855f7';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       {/* Visibility */}
       <div>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#111' }}>Visibility</h3>
         </div>
         <div style={{ border: '1px solid #eaeaea', padding: '12px 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>Visibility</span>
            <select value={visibility} onChange={e => setVisibility(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: '#888', cursor: 'pointer' }}>
               <option value="Public">Public</option>
               <option value="Private">Private</option>
               <option value="Unlisted">Unlisted</option>
            </select>
         </div>
       </div>

       {/* Team Management */}
       <div>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
               <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#111' }}>Team Management</h3>
               <p style={{ margin: 0, fontSize: '0.85rem', color: '#666' }}>Invite your organizing team</p>
            </div>
            <button onClick={() => setIsAddingMember(!isAddingMember)} style={{ background: '#eaeaea', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}><Plus size={14}/> Add Team Member</button>
         </div>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {teamMembers.map((m) => (
               <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '12px 1rem', borderRadius: '8px', border: '1px solid #eaeaea', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '150px' }}>
                     <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.name}`} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '1px solid #ccc' }} />
                     <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{m.name}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', minWidth: '150px' }}>{m.email}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{m.phone}</div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                     <span style={{ fontWeight: 700, fontSize: '0.85rem', color: m.color }}>{m.role}</span>
                     <button onClick={() => setTeamMembers(teamMembers.filter(t => t.id !== m.id))} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
                  </div>
               </div>
            ))}
            
            {isAddingMember && (
               <div style={{ background: '#fff', border: '1px dashed #ccc', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <input type="email" placeholder="Email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <input type="text" placeholder="Phone" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} style={{ width: '120px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <select value={newMember.role} onChange={e => setNewMember({...newMember, role: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                     <option value="Admin">Admin</option>
                     <option value="Coordinator">Coordinator</option>
                     <option value="Volunteer">Volunteer</option>
                  </select>
                  <button onClick={() => {
                     if(newMember.name) {
                        setTeamMembers([...teamMembers, { id: Date.now(), ...newMember, color: getRoleColor(newMember.role) }]);
                        setNewMember({ name: '', email: '', phone: '', role: 'Coordinator' });
                        setIsAddingMember(false);
                     }
                  }} style={{ background: '#111', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Invite</button>
               </div>
            )}
         </div>
       </div>

       {/* Registration Control */}
       <div>
         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#111' }}>Registration Control</h3>
         <div style={{ border: '1px solid #eaeaea', padding: '12px 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>Registration Control</span>
            <select value={regControl} onChange={e => setRegControl(e.target.value)} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: '#888', cursor: 'pointer' }}>
               <option value="Require Approval">Require Approval</option>
               <option value="Auto Approve">Auto Approve</option>
            </select>
         </div>
       </div>

       {/* Cancel Event */}
       <div>
         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: '#111' }}>Cancel Event</h3>
         <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: '#666' }}>Delete this event permanently. All the registered participants will be informed.</p>
         <button onClick={handleCancelEvent} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
           <Trash2 size={16} /> Cancel Event
         </button>
       </div>
    </div>
  );
}


// -------------------------------------------------------------
// MAIN EXPORT
// -------------------------------------------------------------
export default function ManageEvent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'registration' | 'participants' | 'announcement' | 'settings'>('overview');

  const navigateTo = (tab: 'events' | 'create') => {
    window.location.hash = tab === 'events' ? '#organizer-dashboard/my-events' : '#organizer-dashboard/create-event';
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#111', display: 'flex', flexDirection: 'column' }}>
      <style>{`
        input, textarea, select { font-family: 'Inter', sans-serif !important; }
        ::placeholder { font-family: 'Inter', sans-serif !important; opacity: 0.6; }
        .tab-btn {
          background: none; border: none; cursor: pointer; padding: 0.5rem 1rem;
          font-weight: 600; font-size: 0.95rem; color: #888; transition: all 0.2s;
          border-bottom: 2px solid transparent;
        }
        .tab-btn.active { color: #111; border-bottom: 2px solid #111; font-weight: 700; }
        .card-container {
          background: #fff; border-radius: 12px; padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #eaeaea;
          margin-bottom: 1.5rem;
        }
        .card-header {
          display: flex; justify-content: space-between; alignItems: center; margin-bottom: 1.5rem;
        }
        .card-title { font-size: 1.1rem; font-weight: 800; color: #111; margin: 0; }
        .add-btn {
          background: #eaeaea; border: none; padding: 8px 12px; border-radius: 8px;
          font-size: 0.8rem; font-weight: 700; color: #555; cursor: pointer;
          display: flex; alignItems: center; gap: 4px;
        }
      `}</style>

      {/* Background Gradient overlay for Navbar */}
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '180px',
        zIndex: 0, pointerEvents: 'none',
        background: 'linear-gradient(180deg, rgba(233,213,255,0.7) 0%, rgba(233,213,255,0) 100%)',
      }} />

      {/* ─── NAVBAR ─── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, width: '100%', padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        zIndex: 101, background: 'transparent'
      }}>
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => window.location.hash = '#home'}>
          <img src={darkLogo} alt="Eventum" style={{ height: '28px' }} />
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#111' }}>Eventum<span style={{ color: '#ec4899' }}>.</span></span>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <div className="mobile-nav-hide" style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <button onClick={() => navigateTo('events')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', color: '#111' }}>
            <LayoutGrid size={18} /> My Events
          </button>
          <button onClick={() => navigateTo('create')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem', color: 'rgba(0,0,0,0.5)' }}>
            <Plus size={18} /> Create Event
          </button>
        </div>

        {/* Right: Icons (Desktop) */}
        <div className="mobile-nav-hide" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', display: 'flex' }}><Search size={20} /></button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111', display: 'flex' }}><Bell size={20} /></button>
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', cursor: 'pointer' }}>
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer" alt="Profile" style={{ width: '100%', height: '100%' }} />
          </div>
        </div>
      </nav>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, padding: '6rem 2rem 3rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        
        {/* Header & Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>Event Name<span style={{ color: '#ec4899' }}>.</span></h1>
          <button style={{ 
            background: '#7c3aed', color: '#fff', border: 'none', padding: '10px 20px', 
            borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            View Event <ArrowRight size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #eaeaea', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {['overview', 'registration', 'participants', 'announcement', 'settings'].map((tab) => (
            <button 
              key={tab} 
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab as any)}
              style={{ textTransform: 'capitalize', whiteSpace: 'nowrap' }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content Rendering */}
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'registration' && <RegistrationTab />}
        {activeTab === 'participants' && <ParticipantsTab />}
        {activeTab === 'announcement' && <AnnouncementTab />}
        {activeTab === 'settings' && <SettingsTab />}
        
      </main>
      
      <Footer />
    </div>
  );
}
