import sys

file_path = "client/src/pages/AdminDashboard.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace state definition
old_state = """  const [eventFormData, setEventFormData] = useState({
    title: '', description: '', organizer: '', date: '', venue: '', 
    category: 'Tech', price: 'Free', seats: 'Limited', tag: ''
  });"""

new_state = """  const [eventFormData, setEventFormData] = useState({
    title: '', description: '', organizer: '', category: 'Tech', tag: '',
    startDate: '', endDate: '', mode: '', location: '', capacity: '',
    isPaid: false, ticketPrice: '', ticketCapacity: '', maxTicketsPerUser: '1',
    isRefundable: false, paymentDescription: '', entryConditions: ''
  });"""

content = content.replace(old_state, new_state)

# Replace handleEventSubmit
old_submit = """  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    Object.entries(eventFormData).forEach(([key, value]) => formData.append(key, value));
    if (eventImage) formData.append('image', eventImage);

    try {
      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, formData);
      } else {
        await api.post('/admin/events', formData);
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
      setEventFormData({ title: '', description: '', organizer: '', date: '', venue: '', category: 'Tech', price: 'Free', seats: 'Limited', tag: '' });
      setEventImage(null);
      fetchInitialData();
    } catch (err) {
      console.error('Event submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };"""

new_submit = """  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    
    const mappedDate = eventFormData.endDate ? `${eventFormData.startDate} - ${eventFormData.endDate}` : eventFormData.startDate;
    const mappedVenue = eventFormData.mode ? `${eventFormData.mode} | ${eventFormData.location}` : eventFormData.location;
    
    formData.append('title', eventFormData.title);
    formData.append('description', eventFormData.description);
    formData.append('organizer', eventFormData.organizer);
    formData.append('category', eventFormData.category);
    formData.append('date', mappedDate);
    formData.append('venue', mappedVenue);
    formData.append('seats', eventFormData.capacity || 'Limited');
    formData.append('price', eventFormData.isPaid ? eventFormData.ticketPrice : 'Free');
    formData.append('tag', eventFormData.tag || '');
    
    formData.append('isPaid', eventFormData.isPaid.toString());
    if (eventFormData.isPaid) {
      formData.append('ticketPrice', eventFormData.ticketPrice);
      formData.append('ticketCapacity', eventFormData.ticketCapacity);
      formData.append('maxTicketsPerUser', eventFormData.maxTicketsPerUser);
      formData.append('isRefundable', eventFormData.isRefundable.toString());
      formData.append('paymentDescription', eventFormData.paymentDescription);
      formData.append('entryConditions', eventFormData.entryConditions);
    }

    if (eventImage) formData.append('image', eventImage);

    try {
      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, formData);
      } else {
        await api.post('/admin/events', formData);
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
      setEventFormData({ title: '', description: '', organizer: '', category: 'Tech', tag: '', startDate: '', endDate: '', mode: '', location: '', capacity: '', isPaid: false, ticketPrice: '', ticketCapacity: '', maxTicketsPerUser: '1', isRefundable: false, paymentDescription: '', entryConditions: '' });
      setEventImage(null);
      fetchInitialData();
    } catch (err) {
      console.error('Event submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };"""

content = content.replace(old_submit, new_submit)

# Replace Create Event Button reset
old_create_reset = """onClick={() => { setEditingEvent(null); setEventFormData({ title: '', description: '', organizer: '', date: '', venue: '', category: 'Tech', price: 'Free', seats: 'Limited', tag: '' }); setIsEventModalOpen(true); }}"""
new_create_reset = """onClick={() => { setEditingEvent(null); setEventFormData({ title: '', description: '', organizer: '', category: 'Tech', tag: '', startDate: '', endDate: '', mode: '', location: '', capacity: '', isPaid: false, ticketPrice: '', ticketCapacity: '', maxTicketsPerUser: '1', isRefundable: false, paymentDescription: '', entryConditions: '' }); setIsEventModalOpen(true); }}"""

content = content.replace(old_create_reset, new_create_reset)

# Replace Edit Event Mapping
old_edit_reset = """onClick={() => { setEditingEvent(event); setEventFormData({ ...event }); setIsEventModalOpen(true); }}"""
new_edit_reset = """onClick={() => { 
                      setEditingEvent(event); 
                      let sDate = event.date || ''; let eDate = '';
                      if(sDate.includes(' - ')) { const parts = sDate.split(' - '); sDate = parts[0]; eDate = parts[1]; }
                      let sMode = ''; let sLoc = event.venue || '';
                      if(sLoc.includes(' | ')) { const parts = sLoc.split(' | '); sMode = parts[0]; sLoc = parts[1]; }
                      setEventFormData({ 
                        title: event.title || '', description: event.description || '', organizer: event.organizer || '',
                        category: event.category || 'Tech', tag: event.tag || '',
                        startDate: sDate, endDate: eDate, mode: sMode, location: sLoc, capacity: event.seats || '',
                        isPaid: false, ticketPrice: '', ticketCapacity: '', maxTicketsPerUser: '1', isRefundable: false, paymentDescription: '', entryConditions: ''
                      }); 
                      setIsEventModalOpen(true); 
                    }}"""

content = content.replace(old_edit_reset, new_edit_reset)


# Replace the form inputs UI part in modal
old_ui = """                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="admin-event-dates">
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Date & Time String <span style={{ color: '#3b82f6' }}>*</span></label>
                      <input required value={eventFormData.date} onChange={e => setEventFormData({...eventFormData, date: e.target.value})} placeholder="E.g. Oct 12, 10:00 AM" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Venue <span style={{ color: '#3b82f6' }}>*</span></label>
                      <input required value={eventFormData.venue} onChange={e => setEventFormData({...eventFormData, venue: e.target.value})} placeholder="Location" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Event Poster</label>
                    <input type="file" accept="image/*" onChange={e => setEventImage(e.target.files ? e.target.files[0] : null)} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', paddingTop: '11px', paddingBottom: '11px' }} />
                  </div>"""

new_ui = """                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="admin-event-dates">
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Start date <span style={{ color: '#3b82f6' }}>*</span></label>
                      <input required value={eventFormData.startDate} onChange={e => setEventFormData({...eventFormData, startDate: e.target.value})} placeholder="Sat, Feb 14 | 05:00 PM" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>End date <span style={{ color: '#3b82f6' }}>*</span></label>
                      <input required value={eventFormData.endDate} onChange={e => setEventFormData({...eventFormData, endDate: e.target.value})} placeholder="Sun, Feb 15 | 09:00 PM" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Event mode <span style={{ color: '#3b82f6' }}>*</span></label>
                    <input required value={eventFormData.mode} onChange={e => setEventFormData({...eventFormData, mode: e.target.value})} placeholder="Online / Offline" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Event location <span style={{ color: '#3b82f6' }}>*</span></label>
                    <input required value={eventFormData.location} onChange={e => setEventFormData({...eventFormData, location: e.target.value})} placeholder="Jaipur, Rajasthan" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Capacity</label>
                      <input type="number" min={0} value={eventFormData.capacity} onChange={e => setEventFormData({...eventFormData, capacity: e.target.value})} placeholder="3000" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Poster Image</label>
                      <input type="file" accept="image/*" onChange={e => setEventImage(e.target.files ? e.target.files[0] : null)} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', paddingTop: '11px', paddingBottom: '11px' }} />
                    </div>
                  </div>

                  {/* Paid Event Section */}
                  <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: 20, border: '1px solid var(--border-subtle)', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: eventFormData.isPaid ? '1.25rem' : '0' }}>
                      <div>
                        <h4 style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}>Paid Event</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>Enable ticket pricing and capacity limits</p>
                      </div>
                      <div 
                        onClick={() => setEventFormData({...eventFormData, isPaid: !eventFormData.isPaid})}
                        style={{ width: 50, height: 26, background: eventFormData.isPaid ? '#3b82f6' : 'var(--border-color)', borderRadius: 20, position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                      >
                        <div style={{ width: 20, height: 20, background: '#fff', borderRadius: '50%', position: 'absolute', top: 3, left: eventFormData.isPaid ? 27 : 3, transition: '0.3s' }} />
                      </div>
                    </div>

                    {eventFormData.isPaid && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Ticket Price (INR) <span style={{ color: '#3b82f6' }}>*</span></label>
                            <input type="number" required={eventFormData.isPaid} value={eventFormData.ticketPrice} onChange={(e) => setEventFormData({...eventFormData, ticketPrice: e.target.value})} placeholder="e.g. 499" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Ticket Capacity <span style={{ color: '#3b82f6' }}>*</span></label>
                            <input type="number" required={eventFormData.isPaid} value={eventFormData.ticketCapacity} onChange={(e) => setEventFormData({...eventFormData, ticketCapacity: e.target.value})} placeholder="Max seats" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Max Tickets Per User</label>
                            <input type="number" value={eventFormData.maxTicketsPerUser} onChange={(e) => setEventFormData({...eventFormData, maxTicketsPerUser: e.target.value})} style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                          </div>
                          <div>
                            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Refund Policy</label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button type="button" onClick={() => setEventFormData({...eventFormData, isRefundable: true})} style={{ background: eventFormData.isRefundable ? '#3b82f6' : 'var(--border-subtle)', border: 'none', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}>Refundable</button>
                              <button type="button" onClick={() => setEventFormData({...eventFormData, isRefundable: false})} style={{ background: !eventFormData.isRefundable ? '#ef4444' : 'var(--border-subtle)', border: 'none', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.8rem', cursor: 'pointer', flex: 1 }}>Non-Refundable</button>
                            </div>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Payment Description</label>
                          <input value={eventFormData.paymentDescription} onChange={(e) => setEventFormData({...eventFormData, paymentDescription: e.target.value})} placeholder="e.g. Includes workshop kit + lunch" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                        </div>

                        <div>
                          <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.45rem' }}>Entry Conditions</label>
                          <input value={eventFormData.entryConditions} onChange={(e) => setEventFormData({...eventFormData, entryConditions: e.target.value})} placeholder="e.g. College ID required at entry" style={{ width: '100%', background: 'var(--border-subtle)', border: '1px solid var(--border-color)', borderRadius: 14, padding: '0.9rem 1rem', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }} />
                        </div>
                      </motion.div>
                    )}
                  </div>"""

content = content.replace(old_ui, new_ui)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Update completed.")
