import { useState, useEffect, useRef } from 'react';
import { Camera, ArrowRight, X, Plus, Trash2, Upload, Users, Image as ImageIcon } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

export default function OrganizerSetup() {
  const { refreshUser } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  // Form State
  const [logo, setLogo] = useState('');
  const [description, setDescription] = useState('');
  const [detailedDescription, setDetailedDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [tags, setTags] = useState('');
  const [foundedOn, setFoundedOn] = useState('');
  const [eventsConducted, setEventsConducted] = useState<number | ''>('');
  const [presidentEmail, setPresidentEmail] = useState('');
  
  // Arrays
  const [glimpses, setGlimpses] = useState<string[]>([]);
  const [leadership, setLeadership] = useState<{name: string, position: string, photoUrl: string}[]>([]);

  // Fixed Info
  const [clubName, setClubName] = useState('');
  const [clubType, setClubType] = useState('');

  // Upload States
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingGlimpse, setUploadingGlimpse] = useState(false);
  const [uploadingLeader, setUploadingLeader] = useState<number | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const glimpseInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/organizer/club-profile');
      const data = res.data;
      
      setClubName(data.name || '');
      setClubType(data.type || 'Club');
      setLogo(data.logo || '');
      setDescription(data.description || '');
      setDetailedDescription(data.detailedDescription || '');
      setVenue(data.venue || '');
      setTags(data.tags ? data.tags.join(', ') : '');
      setEventsConducted(data.eventsConducted || '');
      setPresidentEmail(data.presidentEmail || '');
      setGlimpses(data.glimpses || []);
      setLeadership(data.leadership || []);
      
      if (data.foundedOn) {
        const dateObj = new Date(data.foundedOn);
        setFoundedOn(dateObj.toISOString().split('T')[0]);
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch profile.');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/organizer/upload', formData, { 
      headers: { 'Content-Type': 'multipart/form-data' } 
    });
    return res.data.url;
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setUploadingLogo(true);
      const url = await uploadFile(e.target.files[0]);
      setLogo(url);
    } catch (err: any) {
      setError('Failed to upload logo.');
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleGlimpseUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setUploadingGlimpse(true);
      const url = await uploadFile(e.target.files[0]);
      setGlimpses([...glimpses, url]);
    } catch (err: any) {
      setError('Failed to upload image.');
    } finally {
      setUploadingGlimpse(false);
    }
  };

  const handleLeaderUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    try {
      setUploadingLeader(index);
      const url = await uploadFile(e.target.files[0]);
      const newLeader = [...leadership];
      newLeader[index].photoUrl = url;
      setLeadership(newLeader);
    } catch (err: any) {
      setError('Failed to upload leader photo.');
    } finally {
      setUploadingLeader(null);
    }
  };

  const addLeader = () => {
    setLeadership([...leadership, { name: '', position: '', photoUrl: '' }]);
  };
  const removeLeader = (index: number) => {
    setLeadership(leadership.filter((_, i) => i !== index));
  };
  const removeGlimpse = (index: number) => {
    setGlimpses(glimpses.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    
    try {
      await api.put('/organizer/club-profile', {
        logo,
        description,
        detailedDescription,
        venue,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        foundedOn,
        eventsConducted: eventsConducted === '' ? 0 : Number(eventsConducted),
        presidentEmail,
        glimpses,
        leadership
      });
      
      await refreshUser();
      window.location.hash = '#organizer-dashboard';
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fafafa', fontFamily: "'Inter', sans-serif" }}>Loading profile...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAFA', color: '#111', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar Match */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '140px',
        zIndex: 10,
        pointerEvents: 'none',
        background: 'linear-gradient(180deg, #E9D5FF 0%, rgba(233,213,255,0) 100%)',
      }}>
        <nav style={{ 
          height: '64px',
          padding: '0 2.5rem', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          pointerEvents: 'auto'
        }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#111' }}>
            Eventum<span style={{ color: '#8B5CF6' }}>.</span>
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{ background: 'linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '99px', fontWeight: 600, fontSize: '0.95rem', cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)' }}
          >
            {saving ? 'Saving...' : 'Save & Enter Dashboard'} <ArrowRight size={18} />
          </button>
        </nav>
      </div>

      <main style={{ flex: 1, maxWidth: '900px', width: '100%', margin: '0 auto', padding: '100px 2rem 4rem 2rem', position: 'relative', zIndex: 1 }}>
        
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-1px', margin: '0 0 0.5rem 0' }}>Welcome, {clubName}</h2>
          <p style={{ color: '#666', fontSize: '1.15rem', margin: 0 }}>Review and complete your {clubType.toLowerCase()} profile to get started.</p>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '1rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{error}</span>
            <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#B91C1C', cursor: 'pointer' }}><X size={16} /></button>
          </div>
        )}

        <form onSubmit={handleSave} style={{ display: 'grid', gap: '2rem' }}>
          
          {/* Logo Section */}
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 1.5rem 0' }}>Club Logo</h3>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '24px', background: '#f4f4f5', border: '2px dashed #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
                {logo ? (
                  <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <Camera size={32} color="#aaa" />
                )}
                {uploadingLogo && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>Uploading...</div>}
              </div>
              <div>
                <input type="file" accept="image/*" ref={logoInputRef} onChange={handleLogoUpload} style={{ display: 'none' }} />
                <button type="button" onClick={() => logoInputRef.current?.click()} style={{ background: '#f4f4f5', border: '1px solid #ddd', padding: '10px 20px', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={18} /> Upload New Logo
                </button>
                <p style={{ fontSize: '0.85rem', color: '#888', margin: '0.5rem 0 0 0' }}>Recommended: Square image, max 2MB.</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.02)', display: 'grid', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0' }}>General Details</h3>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Short Description (Tagline)</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. The official cultural society of JECRC" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', outline: 'none' }} required maxLength={100} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Detailed Description</label>
              <textarea value={detailedDescription} onChange={(e) => setDetailedDescription(e.target.value)} placeholder="Tell us everything about what your club does, your achievements, etc..." style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: "'Inter', sans-serif", background: '#fafafa', outline: 'none', minHeight: '150px', resize: 'vertical' }} required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Venue / Location</label>
                <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="e.g. Block C, Room 102" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Events Conducted</label>
                <input type="number" value={eventsConducted} onChange={(e) => setEventsConducted(e.target.value ? Number(e.target.value) : '')} placeholder="0" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Founded On</label>
                <input type="date" value={foundedOn} onChange={(e) => setFoundedOn(e.target.value)} style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>Tags (Comma separated)</label>
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Technology, AI, Coding" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', outline: 'none' }} />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: '#333', marginBottom: '0.5rem' }}>President / Official Contact Email</label>
              <input type="email" value={presidentEmail} onChange={(e) => setPresidentEmail(e.target.value)} placeholder="president@club.com" style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem', background: '#fafafa', outline: 'none' }} required />
              <p style={{ fontSize: '0.85rem', color: '#888', margin: '0.5rem 0 0 0' }}>Used for security purposes (like OTP for password changes). Must be an active email address.</p>
            </div>
          </div>

          {/* Glimpses / Gallery Section */}
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><ImageIcon size={20} /> Event Highlights / Gallery</h3>
              <input type="file" accept="image/*" ref={glimpseInputRef} onChange={handleGlimpseUpload} style={{ display: 'none' }} />
              <button type="button" onClick={() => glimpseInputRef.current?.click()} style={{ background: '#f4f4f5', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <Plus size={16} /> Add Photo
              </button>
            </div>
            
            {glimpses.length === 0 && !uploadingGlimpse && (
              <div style={{ padding: '3rem', textAlign: 'center', background: '#fafafa', borderRadius: '16px', border: '2px dashed #ddd', color: '#888' }}>
                No photos added yet. Upload glimpses to attract users.
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {glimpses.map((url, i) => (
                <div key={i} style={{ width: '120px', height: '120px', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '1px solid #eee' }}>
                  <img src={url} alt={`Glimpse ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeGlimpse(i)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              {uploadingGlimpse && (
                <div style={{ width: '120px', height: '120px', borderRadius: '16px', background: '#f4f4f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontWeight: 600, fontSize: '0.85rem' }}>
                  Uploading...
                </div>
              )}
            </div>
          </div>

          {/* Leadership Section */}
          <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={20} /> Leadership & Core Team</h3>
              <button type="button" onClick={addLeader} style={{ background: '#f4f4f5', border: '1px solid #ddd', padding: '8px 16px', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                <Plus size={16} /> Add Leader
              </button>
            </div>

            {leadership.length === 0 && (
              <div style={{ padding: '3rem', textAlign: 'center', background: '#fafafa', borderRadius: '16px', border: '2px dashed #ddd', color: '#888' }}>
                No leaders added yet. Introduce your core team!
              </div>
            )}

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {leadership.map((leader, index) => (
                <div key={index} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: '#fafafa', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eee' }}>
                  
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '16px', background: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {leader.photoUrl ? (
                        <img src={leader.photoUrl} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Camera size={24} color="#aaa" />
                      )}
                      {uploadingLeader === index && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '10px', fontWeight: 600 }}>Up...</div>}
                    </div>
                    <input type="file" id={`leader-img-${index}`} accept="image/*" onChange={(e) => handleLeaderUpload(index, e)} style={{ display: 'none' }} />
                    <label htmlFor={`leader-img-${index}`} style={{ position: 'absolute', bottom: -5, right: -5, background: '#fff', border: '1px solid #ddd', padding: '4px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                      <Camera size={14} color="#555" />
                    </label>
                  </div>

                  <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="text" value={leader.name} onChange={(e) => { const l = [...leadership]; l[index].name = e.target.value; setLeadership(l); }} placeholder="Full Name" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.95rem' }} required />
                    <input type="text" value={leader.position} onChange={(e) => { const l = [...leadership]; l[index].position = e.target.value; setLeadership(l); }} placeholder="Position (e.g. President)" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '0.95rem' }} required />
                  </div>
                  
                  <button type="button" onClick={() => removeLeader(index)} style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#B91C1C', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </form>
      </main>
    </div>
  );
}
