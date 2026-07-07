import { useState, useRef, useEffect } from 'react';
import api from '../api/axios';
import { LayoutGrid, Plus, Bell, Search, Image as ImageIcon, MapPin, ChevronDown, CheckCircle, Users, Trophy, ArrowRight, Edit2, Check, Trash2, Download, Link as LinkIcon, Send, User, Mail, Phone, Calendar, X } from 'lucide-react';
import darkLogo from '../logo/dark logo.png';
import Footer from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

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

function OverviewTab({ event, saveEvent }: { event: any, saveEvent: any }) {
  const [poster, setPoster] = useState<string | null>(event?.image || event?.imageUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80');
  
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [startDate, setStartDate] = useState(event?.startDate ? event.startDate.split('T')[0] : '2026-06-18');
  const [startTime, setStartTime] = useState(event?.startDate && event.startDate.includes('T') ? event.startDate.split('T')[1] : '00:30');
  const [endDate, setEndDate] = useState(event?.endDate ? event.endDate.split('T')[0] : '2026-06-19');
  const [endTime, setEndTime] = useState(event?.endDate && event.endDate.includes('T') ? event.endDate.split('T')[1] : '00:30');
  
  const [regDeadlineDate, setRegDeadlineDate] = useState(event?.registrationDeadline ? event.registrationDeadline.split('T')[0] : '');
  const [regDeadlineTime, setRegDeadlineTime] = useState(event?.registrationDeadline && event.registrationDeadline.includes('T') ? event.registrationDeadline.split('T')[1] : '');
  
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [selectedMockLocation, setSelectedMockLocation] = useState<any>(
    event?.location ? { id: 'custom', title: event.location, subtitle: '' } : MOCK_LOCATIONS[0]
  );
  const [locationSearchTerm, setLocationSearchTerm] = useState('');
  const [isLocationExpanded, setIsLocationExpanded] = useState(false);
  
  const [participantType, setParticipantType] = useState<'individual' | 'team'>(event?.participantType || 'individual');
  const [teamMin, setTeamMin] = useState(event?.teamMin || '');
  const [teamMax, setTeamMax] = useState(event?.teamMax || '');
  
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [description, setDescription] = useState(event?.description || '');
  
  const [isEditingElig, setIsEditingElig] = useState(false);
  const [eligYears, setEligYears] = useState(event?.eligibility || '');
  
  const [timeline, setTimeline] = useState<any[]>(event?.timeline?.length > 0 ? event.timeline : []);
  const [showAddTimeline, setShowAddTimeline] = useState(false);
  const [newTimeline, setNewTimeline] = useState({ title: '', desc: '', start: '', end: '' });

  const [isEditingRules, setIsEditingRules] = useState(false);
  const [rules, setRules] = useState(event?.rules || '');

  const [contacts, setContacts] = useState<any[]>(event?.contacts?.length > 0 ? event.contacts : []);
  
  const [isAddingPrize, setIsAddingPrize] = useState(false);
  const [prizes, setPrizes] = useState<any[]>(event?.prizes?.length > 0 ? event.prizes : []);
  const [newPrize, setNewPrize] = useState({ rewardType: 'Cash Prize', position: '1st Place', amount: '' });
  
  const handleAddTimeline = async () => {
    if(!newTimeline.title) return;
    const updated = [...timeline, { id: Date.now(), date: newTimeline.start || 'New', startDate: newTimeline.start, endDate: newTimeline.end, title: newTimeline.title, desc: newTimeline.desc }];
    setTimeline(updated);
    await saveEvent({ timeline: updated });
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
            
            <input type="file" ref={fileInputRef} onChange={async (e) => {
              if(e.target.files && e.target.files[0]) {
                 const file = e.target.files[0];
                 const url = URL.createObjectURL(file);
                 setPoster(url);
                 const formData = new FormData();
                 formData.append('image', file);
                 await saveEvent(formData);
              }
            }} style={{ display: 'none' }} accept="image/*" />
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button onClick={() => fileInputRef.current?.click()} style={{ flex: 1, background: '#eaeaea', color: '#555', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
              Change Poster
            </button>
            {poster && (
              <button onClick={async () => { setPoster(null); await saveEvent({ imageUrl: null }); }} style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>
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
                <button onClick={async () => {
                  if (isEditingDates) {
                    const fullStart = `${startDate}T${startTime}`;
                    const fullEnd = `${endDate}T${endTime}`;
                    const fullReg = (regDeadlineDate && regDeadlineTime) ? `${regDeadlineDate}T${regDeadlineTime}` : '';
                    await saveEvent({ startDate: fullStart, endDate: fullEnd, registrationDeadline: fullReg });
                  }
                  setIsEditingDates(!isEditingDates)
                }} style={{ background: isEditingDates ? '#111' : '#d1d5db', color: isEditingDates ? '#fff' : '#4b5563', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #dcdcdc', paddingTop: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>Registration Deadline</div>
                    {isEditingDates ? (
                       <div style={{ display: 'flex', gap: '8px' }}>
                          <input type="date" value={regDeadlineDate} onChange={e=>setRegDeadlineDate(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fff', outline: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#555' }} />
                          <input type="time" value={regDeadlineTime} onChange={e=>setRegDeadlineTime(e.target.value)} style={{ padding: '6px', borderRadius: '6px', border: 'none', background: '#fff', outline: 'none', fontSize: '0.9rem', fontWeight: 600, color: '#555' }} />
                       </div>
                    ) : (
                       <div style={{ display: 'flex', gap: '8px' }}>
                         <div style={{ background: '#dcdcdc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{regDeadlineDate || 'None'}</div>
                         <div style={{ background: '#dcdcdc', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{regDeadlineTime || '--:--'}</div>
                       </div>
                    )}
                  </div>
               </div>
             </div>
          </div>

          {/* Location */}
          <div style={{ background: '#eaeaea', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111' }}>Location</h4>
                <button onClick={async () => {
                  if (isEditingLocation) {
                    await saveEvent({ location: selectedMockLocation?.title || '' });
                  }
                  setIsEditingLocation(!isEditingLocation)
                }} style={{ background: isEditingLocation ? '#111' : '#d1d5db', color: isEditingLocation ? '#fff' : '#4b5563', border: 'none', padding: '6px 12px', borderRadius: '6px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                 <select value={participantType} onChange={e => setParticipantType(e.target.value as 'individual' | 'team')} style={{ background: 'transparent', border: 'none', fontSize: '0.9rem', fontWeight: 700, color: '#111', outline: 'none', cursor: 'pointer' }}>
                    <option value="individual">Individual</option>
                    <option value="team">Team</option>
                 </select>
                 <button onClick={() => saveEvent({ participantType, teamMin, teamMax })} style={{ background: '#111', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}>Save</button>
               </div>
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
          <h3 className="card-title">About Event</h3>
          <button className="add-btn" onClick={async () => {
            if (isEditingDesc) await saveEvent({ description });
            setIsEditingDesc(!isEditingDesc);
          }}>
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
          <h3 className="card-title">Eligibility Criteria</h3>
          <button className="add-btn" onClick={async () => {
            if (isEditingElig) await saveEvent({ eligibility: eligYears });
            setIsEditingElig(!isEditingElig);
          }}>
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
               <div style={{ zIndex: 1, background: i % 2 === 0 ? '#fdf2f8' : '#eff6ff', border: `1px solid ${i % 2 === 0 ? '#fbcfe8' : '#bfdbfe'}`, borderRadius: '8px', padding: '4px 6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
                  <div style={{ fontSize: '0.55rem', fontWeight: 800, color: i % 2 === 0 ? '#ec4899' : '#3b82f6', textTransform: 'uppercase' }}>
                     {item.startDate ? new Date(item.startDate.split(',')[0]).toLocaleString('en-US', { month: 'short' }).toUpperCase() : 'DATE'}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#111', lineHeight: '1' }}>
                     {item.startDate ? new Date(item.startDate.split(',')[0]).getDate() || item.date?.split(' ')[0] : item.date?.split(' ')[0] || ''}
                  </div>
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
                      <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={async () => {
                         const updated = timeline.filter(t => t.id !== item.id);
                         setTimeline(updated);
                         await saveEvent({ timeline: updated });
                      }} />
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
          <h3 className="card-title">Rules</h3>
          <button className="add-btn" onClick={async () => {
            if (isEditingRules) await saveEvent({ rules });
            setIsEditingRules(!isEditingRules);
          }}>
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
                    <button onClick={async () => { 
                      const nc = [...contacts]; const f = nc.find(x=>x.id===c.id); 
                      if(f) f.isEditing = !f.isEditing; 
                      setContacts(nc); 
                      if (f && !f.isEditing) await saveEvent({ contacts: nc });
                    }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#888', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                      {c.isEditing ? <><Check size={14}/> Save</> : <><Edit2 size={14}/> Edit</>}
                    </button>
                    <Trash2 size={14} color="#ef4444" style={{ cursor: 'pointer' }} onClick={async () => {
                      const nc = contacts.filter(con => con.id !== c.id);
                      setContacts(nc);
                      await saveEvent({ contacts: nc });
                    }} />
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
               {prizes.length === 0 ? (
                 <div style={{ color: '#888', fontSize: '0.9rem' }}>No prizes added yet.</div>
               ) : (
                 prizes.map((p, i) => (
                   <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                       <Trophy size={18} color={p.position?.includes('1') ? '#ec4899' : p.position?.includes('2') ? '#3b82f6' : '#9333ea'} />
                       <span style={{ fontSize: '0.9rem', color: '#111', fontWeight: 600 }}>{p.position}: {p.rewardType} {p.amount ? `- ${p.amount}` : ''}</span>
                     </div>
                     <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={async () => {
                       const updated = prizes.filter((_, idx) => idx !== i);
                       setPrizes(updated);
                       await saveEvent({ prizes: updated });
                     }} />
                   </div>
                 ))
               )}
            </div>
         ) : (
            <div style={{ background: '#dcdcdc', padding: '2rem', borderRadius: '12px', marginTop: '1rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                     <Trophy size={32} color="#fff" />
                  </div>
                  <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111', margin: '0 0 0.5rem 0' }}>Add Prize</h2>
               </div>
               
               <div style={{ maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                     <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '6px', display: 'block' }}>Reward Type</label>
                     <select value={newPrize.rewardType} onChange={e => setNewPrize({...newPrize, rewardType: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', background: '#eaeaea', fontWeight: 600, color: '#555' }}>
                        <option value="Cash Prize">Cash Prize</option>
                        <option value="Goodies">Goodies</option>
                        <option value="Certificate">Certificate</option>
                     </select>
                  </div>
                  <div>
                     <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '6px', display: 'block' }}>For Position</label>
                     <select value={newPrize.position} onChange={e => setNewPrize({...newPrize, position: e.target.value})} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', background: '#eaeaea', fontWeight: 600, color: '#555' }}>
                        <option value="1st Place">1st Place</option>
                        <option value="2nd Place">2nd Place</option>
                        <option value="3rd Place">3rd Place</option>
                        <option value="Participation">Participation</option>
                     </select>
                  </div>
                  <div>
                     <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#555', marginBottom: '6px', display: 'block' }}>Amount / Details</label>
                     <input value={newPrize.amount} onChange={e => setNewPrize({...newPrize, amount: e.target.value})} placeholder="Example: ₹50,000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', background: '#eaeaea', fontWeight: 600, color: '#555' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button onClick={() => setIsAddingPrize(false)} style={{ flex: 1, background: 'transparent', color: '#111', border: '1px solid #ccc', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={async () => {
                      if(newPrize.rewardType && newPrize.position) {
                        const updated = [...prizes, newPrize];
                        setPrizes(updated);
                        await saveEvent({ prizes: updated });
                        setNewPrize({ rewardType: 'Cash Prize', position: '1st Place', amount: '' });
                        setIsAddingPrize(false);
                      }
                    }} style={{ flex: 1, background: '#1a1a1a', color: '#fff', border: 'none', padding: '14px', borderRadius: '8px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>Add Reward</button>
                  </div>
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
function RegistrationTab({ event, saveEvent }: { event: any, saveEvent: any }) {
  const [] = useState(event?.capacity?.toString() || '100');
  const [partType, setPartType] = useState(event?.participantType === 'team' ? 'Team' : 'Individual');
  const [teamMin, setTeamMin] = useState(event?.teamMin?.toString() || '1');
  const [teamMax, setTeamMax] = useState(event?.teamMax?.toString() || '4');
  const [regWindow, setRegWindow] = useState('Open');

  const [tickets, setTickets] = useState<any[]>(event?.tickets?.length > 0 ? event.tickets : [{ id: 1, category: 'General Pass', price: 'Free' }]);
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [newTicket, setNewTicket] = useState({ category: '', price: '' });

  const [personalInfo, setPersonalInfo] = useState<any[]>(event?.personalInfo?.length > 0 ? event.personalInfo : [
    { id: 1, name: 'Name', required: 'Required' },
    { id: 2, name: 'Email', required: 'Required' },
    { id: 3, name: 'Mobile Number', required: 'Optional' }
  ]);
  const [isAddingPersonal, setIsAddingPersonal] = useState(false);
  const [newPersonalField, setNewPersonalField] = useState('');

  const [eduInfo, setEduInfo] = useState<any[]>(event?.eduInfo?.length > 0 ? event.eduInfo : [
    { id: 1, name: 'Roll Number', required: 'Optional' },
    { id: 2, name: 'Course', required: 'Optional' },
    { id: 3, name: 'Branch', required: 'Optional' },
    { id: 4, name: 'Year', required: 'Off' }
  ]);
  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [newEduField, setNewEduField] = useState('');

  const [customQuestions, setCustomQuestions] = useState<any[]>(event?.customQuestions?.length > 0 ? event.customQuestions : []);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState<any>({ question: '', type: 'Text', required: 'Optional', options: [] });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       {/* Top Metrics */}
       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="card-hover" style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center' }}>
             <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Calendar size={20} color="#3b82f6" /></div>
             <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111' }}>Registration window</div>
                <select value={regWindow} onChange={(e) => setRegWindow(e.target.value)} style={{ fontSize: '0.8rem', color: '#111', border: '1px solid #eaeaea', background: '#f8fafc', outline: 'none', padding: '4px 8px', marginTop: '4px', cursor: 'pointer', borderRadius: '4px' }}>
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
                <select value={partType} onChange={(e) => setPartType(e.target.value)} style={{ fontSize: '0.8rem', color: '#111', border: '1px solid #eaeaea', background: '#f8fafc', outline: 'none', padding: '4px 8px', marginTop: '4px', cursor: 'pointer', borderRadius: '4px' }}>
                   <option value="Individual">Individual</option>
                   <option value="Team">Team</option>
                </select>
                {partType === 'Team' && (
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>Min:</span>
                       <input type="number" min="1" value={teamMin} onChange={e => setTeamMin(e.target.value)} style={{ width: '50px', padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                       <span style={{ fontSize: '0.75rem', color: '#666', fontWeight: 600 }}>Max:</span>
                       <input type="number" min="1" value={teamMax} onChange={e => setTeamMax(e.target.value)} style={{ width: '50px', padding: '4px', fontSize: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', outline: 'none' }} />
                    </div>
                  </div>
                )}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>{t.price === 'Free' || t.price.toLowerCase() === 'free' ? 'Free' : (t.price.includes('₹') ? t.price : '₹' + t.price)}</div>
                    <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={async () => {
                       const updated = tickets.filter(ticket => ticket.id !== t.id);
                       setTickets(updated);
                       await saveEvent({ tickets: updated });
                    }} />
                  </div>
               </div>
            ))}
            
            {isAddingTicket && (
               <div style={{ background: '#fff', border: '1px dashed #ccc', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input type="text" placeholder="Category Name" value={newTicket.category} onChange={e => setNewTicket({...newTicket, category: e.target.value})} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 600, color: '#111' }}>₹</span>
                    <input type="text" placeholder="Price (in INR)" value={newTicket.price} onChange={e => setNewTicket({...newTicket, price: e.target.value})} style={{ width: '150px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                  </div>
                  <button onClick={async () => {
                     if(newTicket.category) {
                        const updated = [...tickets, { id: Date.now(), ...newTicket }];
                        setTickets(updated);
                        await saveEvent({ tickets: updated });
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
                       <select value={info.required} onChange={async (e) => {
                          const updated = personalInfo.map(i => i.id === info.id ? {...i, required: e.target.value} : i);
                          setPersonalInfo(updated);
                          await saveEvent({ personalInfo: updated });
                       }} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', color: '#888', cursor: 'pointer' }}>
                          <option value="Required">Required</option>
                          <option value="Optional">Optional</option>
                          <option value="Off">Off</option>
                       </select>
                     </div>
                  ))}
                  
                  {isAddingPersonal && (
                     <div style={{ border: '1px dashed #ccc', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="text" placeholder="Field name" value={newPersonalField} onChange={e => setNewPersonalField(e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', outline: 'none', fontSize: '0.9rem' }} autoFocus />
                        <button onClick={async () => {
                           if(newPersonalField) {
                              const updated = [...personalInfo, { id: Date.now(), name: newPersonalField, required: 'Optional' }];
                              setPersonalInfo(updated);
                              await saveEvent({ personalInfo: updated });
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
                       <select value={info.required} onChange={async (e) => {
                          const updated = eduInfo.map(i => i.id === info.id ? {...i, required: e.target.value} : i);
                          setEduInfo(updated);
                          await saveEvent({ eduInfo: updated });
                       }} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem', color: '#888', cursor: 'pointer' }}>
                          <option value="Required">Required</option>
                          <option value="Optional">Optional</option>
                          <option value="Off">Off</option>
                       </select>
                     </div>
                  ))}
                  
                  {isAddingEdu && (
                     <div style={{ border: '1px dashed #ccc', padding: '12px', borderRadius: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input type="text" placeholder="Field name" value={newEduField} onChange={e => setNewEduField(e.target.value)} style={{ width: '100%', padding: '4px', border: 'none', outline: 'none', fontSize: '0.9rem' }} autoFocus />
                        <button onClick={async () => {
                           if(newEduField) {
                              const updated = [...eduInfo, { id: Date.now(), name: newEduField, required: 'Optional' }];
                              setEduInfo(updated);
                              await saveEvent({ eduInfo: updated });
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
                        <Trash2 onClick={async () => {
                           const updated = customQuestions.filter(c => c.id !== q.id);
                           setCustomQuestions(updated);
                           await saveEvent({ customQuestions: updated });
                        }} size={16} color="#ef4444" style={{ cursor: 'pointer' }} />
                     </div>
                  ))}
                  
                  {isAddingQuestion && (
                     <div style={{ border: '1px dashed #ccc', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <input type="text" placeholder="Type your question here" value={newQuestion.question} onChange={e => setNewQuestion({...newQuestion, question: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                           <select value={newQuestion.type} onChange={e => setNewQuestion({...newQuestion, type: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 }}>
                              <option value="Text">Text</option>
                              <option value="Dropdown">Dropdown</option>
                              <option value="Checkbox">Checkbox</option>
                              <option value="File Upload">File Upload</option>
                           </select>
                           <select value={newQuestion.required} onChange={e => setNewQuestion({...newQuestion, required: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', flex: 1 }}>
                              <option value="Required">Required</option>
                              <option value="Optional">Optional</option>
                           </select>
                        </div>
                        
                        {(newQuestion.type === 'Checkbox' || newQuestion.type === 'Dropdown') && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                             <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Options</div>
                             <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                               {(newQuestion.options || []).map((opt: string, idx: number) => (
                                 <div key={idx} style={{ background: '#f3e8ff', color: '#9333ea', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                   {opt} <X size={12} style={{ cursor: 'pointer' }} onClick={() => setNewQuestion({...newQuestion, options: (newQuestion.options || []).filter((_: any, i: number) => i !== idx)})} />
                                 </div>
                               ))}
                             </div>
                             <div style={{ display: 'flex', gap: '8px' }}>
                               <input type="text" placeholder="Add option" id="new-option-input" style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', flex: 1 }} />
                               <button type="button" onClick={() => {
                                 const input = document.getElementById('new-option-input') as HTMLInputElement;
                                 if (input && input.value.trim()) {
                                   const currentOptions = newQuestion.options || [];
                                   setNewQuestion({...newQuestion, options: [...currentOptions, input.value.trim()]});
                                   input.value = '';
                                 }
                               }} style={{ background: '#111', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Add Option</button>
                             </div>
                          </div>
                        )}
                        
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                           <button onClick={() => setIsAddingQuestion(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                           <button onClick={async () => {
                              if(newQuestion.question) {
                                 const updated = [...customQuestions, { id: Date.now(), ...newQuestion }];
                                 setCustomQuestions(updated);
                                 await saveEvent({ customQuestions: updated });
                                 setNewQuestion({ question: '', type: 'Text', required: 'Optional', options: [] });
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
       <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid #eaeaea', paddingTop: '1.5rem' }}>
          <button onClick={async () => {
             const updatePayload: any = { participantType: partType === 'Team' ? 'team' : 'individual' };
             if (partType === 'Team') {
                updatePayload.teamMin = parseInt(teamMin) || 1;
                updatePayload.teamMax = parseInt(teamMax) || 4;
             }
             await saveEvent(updatePayload);
             alert('Registration details saved successfully!');
          }} style={{ background: '#7c3aed', color: '#fff', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}>
              Save Registration Details
          </button>
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// PARTICIPANTS TAB
// -------------------------------------------------------------
function ParticipantsTab({ event }: { event: any }) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'detailed'>('list');
  const [expandedTeams, setExpandedTeams] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let interval: any;
    const fetchParticipants = async () => {
      try {
        const { data } = await api.get(`/events/${event._id || event.id}/participants`);
        setParticipants(data);
      } catch (err) {
        console.error('Failed to load participants', err);
      } finally {
        setLoading(false);
      }
    };
    if (event) {
      fetchParticipants();
      interval = setInterval(fetchParticipants, 5000);
    }
    return () => clearInterval(interval);
  }, [event]);

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
             <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>Registration Analytics</h3>
          </div>
          {/* Real Bar Chart */}
          {(() => {
            const total = Math.max(participants.length, 1);
            const checkedIn = participants.filter(p => p.checkedIn).length;
            const paid = participants.filter(p => p.type !== 'Free').length;
            const free = participants.filter(p => p.type === 'Free').length;

            return (
              <>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', borderBottom: '1px solid #eaeaea', paddingBottom: '1rem' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end', width: '20%' }}>
                      <div style={{ fontWeight: 800, color: '#ec4899', fontSize: '1rem' }}>{participants.length}</div>
                      <div style={{ width: '100%', maxWidth: '40px', height: `${(participants.length / total) * 100}%`, background: '#ec4899', borderRadius: '4px 4px 0 0', minHeight: '4px' }} title="Total Registrations" />
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end', width: '20%' }}>
                      <div style={{ fontWeight: 800, color: '#22c55e', fontSize: '1rem' }}>{checkedIn}</div>
                      <div style={{ width: '100%', maxWidth: '40px', height: `${(checkedIn / total) * 100}%`, background: '#22c55e', borderRadius: '4px 4px 0 0', minHeight: '4px' }} title="Checked In" />
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end', width: '20%' }}>
                      <div style={{ fontWeight: 800, color: '#3b82f6', fontSize: '1rem' }}>{paid}</div>
                      <div style={{ width: '100%', maxWidth: '40px', height: `${(paid / total) * 100}%`, background: '#3b82f6', borderRadius: '4px 4px 0 0', minHeight: '4px' }} title="Paid Tickets" />
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end', width: '20%' }}>
                      <div style={{ fontWeight: 800, color: '#8b5cf6', fontSize: '1rem' }}>{free}</div>
                      <div style={{ width: '100%', maxWidth: '40px', height: `${(free / total) * 100}%`, background: '#8b5cf6', borderRadius: '4px 4px 0 0', minHeight: '4px' }} title="Free Tickets" />
                   </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1rem', color: '#888', fontSize: '0.8rem', fontWeight: 600 }}>
                   <span style={{ width: '20%', textAlign: 'center' }}>Total</span>
                   <span style={{ width: '20%', textAlign: 'center' }}>Checked In</span>
                   <span style={{ width: '20%', textAlign: 'center' }}>Paid</span>
                   <span style={{ width: '20%', textAlign: 'center' }}>Free</span>
                </div>
              </>
            );
          })()}
       </div>

       {/* Total Registrations */}
       <div>
         <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1rem 0' }}>Total Registrations</h3>
         
         {participants.length > 0 ? (() => {
           const total = participants.length;
           const checkedIn = participants.filter(p => p.checkedIn).length;
           const checkedInPct = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
           
           return (
             <>
               <div style={{ display: 'flex', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem', background: '#fbcfe8' }}>
                  <div style={{ width: `${checkedInPct}%`, background: '#22c55e' }} title={`Checked In: ${checkedInPct}%`} />
               </div>
               <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', fontWeight: 700, flexWrap: 'wrap' }}>
                  <span style={{ color: '#22c55e' }}>• {checkedIn} Checked In</span>
                  <span style={{ color: '#ec4899' }}>• {total} Total Registrations</span>
               </div>
             </>
           );
         })() : (
           <div style={{ fontSize: '0.85rem', color: '#666', fontWeight: 500 }}>No registrations yet.</div>
         )}
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
               <button onClick={() => setViewMode('list')} style={{ background: viewMode === 'list' ? '#111' : '#fff', color: viewMode === 'list' ? '#fff' : '#111', border: '1px solid #eaeaea', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                 <LayoutGrid size={14} /> All Participants
               </button>
               <div style={{ display: 'flex', gap: '1rem' }}>
                 <button onClick={() => setViewMode('detailed')} style={{ background: viewMode === 'detailed' ? '#111' : '#fff', color: viewMode === 'detailed' ? '#fff' : '#111', border: '1px solid #eaeaea', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                   <LayoutGrid size={14} /> View Data
                 </button>
                 <button style={{ background: '#fff', border: '1px solid #eaeaea', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Download size={14} /> Download Data
                 </button>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
               {loading ? (
                 <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>Loading participants...</div>
               ) : participants.length === 0 ? (
                 <div style={{ padding: '1rem', textAlign: 'center', color: '#666' }}>No participants registered yet.</div>
               ) : viewMode === 'list' ? (
                 participants.map((p, i) => (
                    <div key={p.id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '12px 1rem', borderRadius: '8px', border: '1px solid #eaeaea', flexWrap: 'wrap', gap: '1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: '200px' }}>
                          <img src={p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} alt="" style={{ width: 36, height: 36, borderRadius: '50%', border: '1px solid #ccc' }} />
                          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{p.name}</span>
                       </div>
                       <div style={{ fontSize: '0.85rem', color: '#666', minWidth: '150px' }}>{p.email}</div>
                       <div style={{ fontSize: '0.85rem', color: '#666' }}>{p.phone || 'N/A'}</div>
                       
                       <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginLeft: 'auto' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#22c55e' }}>{p.status}</span>
                          {p.checkedIn && (
                            <span style={{ fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', background: '#dcfce7', color: '#166534', fontWeight: 600 }}>
                              Checked In
                            </span>
                          )}
                          <button onClick={async () => {
                            if(window.confirm('Are you sure you want to deregister this participant?')) {
                              try {
                                await api.delete(`/events/${event._id || event.id}/participants/${p.id}`);
                                alert('Participant deregistered successfully!');
                                window.location.reload();
                              } catch(err) { alert('Failed to deregister'); }
                            }
                          }} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }} title="Deregister">
                            Deregister
                          </button>
                       </div>
                    </div>
                 ))
               ) : (
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                   {participants.map((p, i) => (
                     <div key={p.id || i} style={{ background: '#fff', border: '1px solid #eaeaea', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
                       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                           <img src={p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} alt="" style={{ width: 48, height: 48, borderRadius: '50%', border: '1px solid #eaeaea' }} />
                           <div>
                             <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#111', display: 'flex', alignItems: 'center', gap: '6px' }}>{p.name} {p.isTeam && <span style={{fontSize: '0.75rem', background: '#FEF3C7', color: '#D97706', padding: '2px 6px', borderRadius: '4px'}}>👑 Leader</span>}</h4>
                             <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '2px' }}>{p.email}</div>
                             <div style={{ fontSize: '0.8rem', color: '#666' }}>{p.phone || 'No phone'}</div>
                           </div>
                         </div>
                         <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                           <span style={{ background: '#f3e8ff', color: '#9333ea', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                             {p.type} Pass
                           </span>
                           <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 700 }}>
                             {p.status}
                           </span>
                         </div>
                       </div>
                       <div style={{ borderTop: '1px dashed #eaeaea', paddingTop: '1rem', marginTop: '0.5rem' }}>
                         <h5 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#111', fontWeight: 800 }}>Registration Data</h5>
                         {p.answers && p.answers.length > 0 ? (
                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                             {p.answers.map((ans: any, idx: number) => {
                               const isLink = ans.answer && typeof ans.answer === 'string' && (ans.answer.startsWith('http') || ans.answer.startsWith('blob:'));
                               return (
                                 <div key={idx} style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                                   <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginBottom: '4px' }}>{ans.question}</div>
                                   {isLink ? (
                                     <a href={ans.answer} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#3b82f6', textDecoration: 'none', background: '#eff6ff', padding: '4px 10px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                                       <Download size={14} /> View File
                                     </a>
                                   ) : (
                                     <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 600, wordBreak: 'break-word' }}>
                                       {ans.answer || <span style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 400 }}>N/A</span>}
                                     </div>
                                   )}
                                 </div>
                               );
                             })}
                           </div>
                         ) : (
                           <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#64748b', fontSize: '0.85rem', textAlign: 'center', fontWeight: 500 }}>
                             No extra registration data provided.
                           </div>
                         )}

                         {p.isTeam && p.teamMembers && p.teamMembers.length > 1 && (
                            <div style={{ marginTop: '1rem', borderTop: '1px solid #eaeaea', paddingTop: '1rem' }}>
                               <button 
                                 onClick={() => setExpandedTeams(prev => ({...prev, [p.id]: !prev[p.id]}))}
                                 style={{ width: '100%', background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#475569', fontSize: '0.85rem' }}
                               >
                                 {expandedTeams[p.id] ? 'Hide Team Members ↑' : `View All Team Members (${p.teamMembers.length - 1}) ↓`}
                               </button>
                               
                               {expandedTeams[p.id] && (
                                 <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {p.teamMembers.slice(1).map((m: any, mIdx: number) => (
                                      <div key={mIdx} style={{ background: '#F1F5F9', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1E293B', display: 'flex', justifyContent: 'space-between' }}>
                                           <span>{m.name}</span>
                                           <span style={{ fontSize: '0.75rem', color: '#64748B' }}>Member {mIdx + 2}</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748B', margin: '2px 0 8px 0' }}>{m.email} • {m.phone || 'N/A'}</div>
                                        
                                        {m.customAnswers && m.customAnswers.length > 0 && (
                                           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                                             {m.customAnswers.map((ans: any, aIdx: number) => (
                                               <div key={aIdx} style={{ background: '#ffffff', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                                                  <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>{ans.question}</span>
                                                  <span style={{ fontSize: '0.85rem', color: '#0F172A', fontWeight: 500 }}>{ans.answer || 'N/A'}</span>
                                               </div>
                                             ))}
                                           </div>
                                        )}
                                      </div>
                                    ))}
                                 </div>
                               )}
                            </div>
                         )}
                       </div>
                       <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #eaeaea' }}>
                          <button onClick={async () => {
                            if(window.confirm('Are you sure you want to deregister this participant?')) {
                              try {
                                await api.delete(`/events/${event._id || event.id}/participants/${p.id}`);
                                alert('Participant deregistered successfully!');
                                window.location.reload();
                              } catch(err) { alert('Failed to deregister'); }
                            }
                          }} style={{ flex: 1, background: '#fee2e2', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                            Deregister
                          </button>
                       </div>
                     </div>
                   ))}
                 </div>
               )}
            </div>
         </div>
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// ANNOUNCEMENT TAB
// -------------------------------------------------------------
function AnnouncementTab({ event, saveEvent }: { event: any, saveEvent: any }) {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>(event?.announcements || []);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  
  const handleSend = async () => {
    if (!newAnnouncement.trim()) return;
    const updated = [...announcements, { title: 'Announcement', content: newAnnouncement, date: new Date() }];
    setAnnouncements(updated);
    await saveEvent({ announcements: updated });
    setNewAnnouncement('');
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
       <div>
         <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#111' }}>Announcement</h3>
         <div style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
               <img src={user?.avatar || darkLogo} alt="Club Logo" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
               <textarea value={newAnnouncement} onChange={e => setNewAnnouncement(e.target.value)} placeholder="Send an Announcement..." style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '1rem', minHeight: '80px', resize: 'none' }} />
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
               <button onClick={handleSend} style={{ background: '#111', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                 <Send size={14} /> Send
               </button>
            </div>
         </div>
       </div>

       <div>
         <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 1rem 0', color: '#111' }}>Announcement History</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.length === 0 ? (
               <div style={{ color: '#888', fontSize: '0.9rem' }}>No announcements yet.</div>
            ) : announcements.map((ann, idx) => (
               <div key={idx} style={{ background: '#fff', border: '1px solid #eaeaea', padding: '1.5rem', borderRadius: '12px', display: 'flex', gap: '1rem' }}>
                  <img src={user?.avatar || darkLogo} alt="Club Logo" style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                  <div>
                     <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111', marginBottom: '0.5rem' }}>{ann.title || 'Announcement'} <span style={{ fontSize: '0.75rem', color: '#888', fontWeight: 'normal', marginLeft: '8px' }}>{new Date(ann.date).toLocaleDateString()}</span></div>
                     <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{ann.content}</div>
                     <div style={{ fontSize: '0.75rem', color: '#888' }}>Sent to All Participants</div>
                  </div>
               </div>
            ))}
         </div>
       </div>
    </div>
  );
}

// -------------------------------------------------------------
// SETTINGS TAB
// -------------------------------------------------------------
function SettingsTab({ event, saveEvent }: { event: any, saveEvent: any }) {
  const [visibility, setVisibility] = useState(event?.visibility || 'Public');
  const [generateQRCode, setGenerateQRCode] = useState(event?.generateQRCode || false);
  const [] = useState(event?.registrationControl || 'Require Approval');

  const [teamMembers, setTeamMembers] = useState<any[]>(event?.organizingTeam?.length > 0 ? event.organizingTeam : []);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', role: 'Coordinator' });

  const handleCancelEvent = async () => {
    if(window.confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      try {
         await api.delete(`/events/submission/${event._id || event.id}`);
         alert('Event Cancelled Successfully');
         window.location.hash = '#organizer-dashboard/my-events';
      } catch (err) {
         console.error(err);
         alert('Failed to cancel event.');
      }
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
            <select value={visibility} onChange={async e => {
               setVisibility(e.target.value);
               await saveEvent({ visibility: e.target.value });
            }} style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.85rem', color: '#888', cursor: 'pointer' }}>
               <option value="Public">Public</option>
               <option value="Private">Private</option>
               <option value="Unlisted">Unlisted</option>
            </select>
         </div>
       </div>

       {/* QR Code Generation */}
       <div>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#111' }}>QR Code Ticketing</h3>
         </div>
         <div style={{ border: '1px solid #eaeaea', padding: '12px 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111' }}>Generate QR Code for Attendees</span>
            <div 
              onClick={async () => {
                const newVal = !generateQRCode;
                setGenerateQRCode(newVal);
                await saveEvent({ generateQRCode: newVal });
              }}
              style={{ width: '40px', height: '24px', background: generateQRCode ? '#8B5CF6' : '#ccc', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: '0.2s' }}
            >
              <div style={{ width: '18px', height: '18px', background: '#fff', borderRadius: '50%', position: 'absolute', top: '3px', left: generateQRCode ? '19px' : '3px', transition: '0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
            </div>
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
                     <button onClick={async () => {
                        const updated = teamMembers.filter(t => t.id !== m.id);
                        setTeamMembers(updated);
                        await saveEvent({ organizingTeam: updated });
                     }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={16} /></button>
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
                  <button onClick={async () => {
                     if(newMember.name) {
                        const updated = [...teamMembers, { id: Date.now(), ...newMember, color: getRoleColor(newMember.role) }];
                        setTeamMembers(updated);
                        await saveEvent({ organizingTeam: updated });
                        setNewMember({ name: '', email: '', phone: '', role: 'Coordinator' });
                        setIsAddingMember(false);
                     }
                  }} style={{ background: '#111', color: '#fff', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Invite</button>
               </div>
            )}
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
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const hash = window.location.hash;
        let id = '';
        if (hash.includes('?id=')) {
          id = hash.split('?id=')[1];
        } else if (hash.includes('=')) {
          id = hash.split('=')[1];
        }
        if (!id) throw new Error('No event ID provided');
        
        const { data } = await api.get(`/events/${id}`);
        setEventData(data);
        setEditedTitle(data.title);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to load event');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, []);

  const saveEvent = async (updates: any) => {
    try {
      try {
        const res = await api.put(`/events/submission/${eventData._id || eventData.id}`, updates);
        setEventData((prev: any) => ({ ...prev, ...res.data.submission }));
        return true;
      } catch (err: any) {
        if (err.response?.status === 403 || err.response?.status === 404) {
          const res = await api.put(`/admin/events/${eventData._id || eventData.id}`, updates);
          setEventData((prev: any) => ({ ...prev, ...res.data }));
          return true;
        }
        throw err;
      }
    } catch (err) {
      console.error('Failed to save', err);
      alert('Failed to save changes');
      return false;
    }
  };

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
        {user?.role !== 'admin' && (
          <>
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
                <img src={user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Organizer"} alt="Profile" style={{ width: '100%', height: '100%' }} />
              </div>
            </div>
          </>
        )}
      </nav>

      {/* ─── MAIN CONTENT ─── */}
      <main style={{ flex: 1, padding: '6rem 2rem 3rem 2rem', maxWidth: '1000px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        
        {/* Header & Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          {isEditingTitle ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input 
                autoFocus
                value={editedTitle} 
                onChange={(e) => setEditedTitle(e.target.value)}
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const success = await saveEvent({ title: editedTitle });
                    if (success) setIsEditingTitle(false);
                  } else if (e.key === 'Escape') {
                    setIsEditingTitle(false);
                    setEditedTitle(eventData?.title || '');
                  }
                }}
                onBlur={() => {
                  setIsEditingTitle(false);
                  setEditedTitle(eventData?.title || '');
                }}
                style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, padding: '0 8px', border: '2px solid #7c3aed', borderRadius: '8px', outline: 'none', background: '#fff', color: '#111' }}
              />
              <button onClick={async () => {
                const success = await saveEvent({ title: editedTitle });
                if (success) setIsEditingTitle(false);
              }} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontWeight: 700 }}>Save</button>
            </div>
          ) : (
            <h1 onClick={() => setIsEditingTitle(true)} style={{ fontSize: '2.2rem', fontWeight: 800, margin: 0, cursor: 'pointer' }} title="Click to edit">
              {eventData?.title || 'Event Name'}<span style={{ color: '#ec4899' }}>.</span>
            </h1>
          )}
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
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Loading...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#ef4444' }}>{error}</div>
        ) : eventData ? (
          <>
            {activeTab === 'overview' && <OverviewTab event={eventData} saveEvent={saveEvent} />}
            {activeTab === 'registration' && <RegistrationTab event={eventData} saveEvent={saveEvent} />}
            {activeTab === 'participants' && <ParticipantsTab event={eventData} />}
            {activeTab === 'announcement' && <AnnouncementTab event={eventData} saveEvent={saveEvent} />}
            {activeTab === 'settings' && <SettingsTab event={eventData} saveEvent={saveEvent} />}
          </>
        ) : null}
        
      </main>
      
      <Footer />
    </div>
  );
}
