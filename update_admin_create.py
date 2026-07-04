import sys
import re

file_path = "client/src/pages/AdminCreateEvent.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace component name
content = content.replace("export default function CreateEvent()", "export default function AdminCreateEvent({ eventId }: { eventId?: string })")

# Add organizer and category states
old_states = """  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');"""
new_states = """  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [category, setCategory] = useState('Tech');
  const [tag, setTag] = useState('');
  const [isEditing, setIsEditing] = useState(!!eventId);"""
content = content.replace(old_states, new_states)


# Add fetch effect if editing
fetch_effect = """
  useEffect(() => {
    if (eventId) {
      setIsEditing(true);
      const fetchEvent = async () => {
        try {
          const { data } = await api.get(`/events/${eventId}`);
          setTitle(data.title || '');
          setDescription(data.description || '');
          setOrganizer(data.organizer?.name || data.organizer || '');
          setCategory(data.category || 'Tech');
          setTag(data.tag || '');
          setStartDate(data.startDate || '');
          setEndDate(data.endDate || '');
          setMode(data.mode || '');
          setLocation(data.location || data.venue || '');
          setCapacity(data.capacity || data.seats || '');
          
          if(data.isPaid) {
            setIsPaid(true);
            setTicketPrice(data.price || '');
          }
          if(data.image || data.imageUrl) {
            setImagePreview(data.image || data.imageUrl);
          }
        } catch (e) {
          console.error('Failed to load event details');
        }
      };
      fetchEvent();
    }
  }, [eventId]);
"""
# Insert before handlePost
content = content.replace("  const handlePost = async () => {", fetch_effect + "\n  const handlePost = async () => {")

# Update handlePost logic
old_handle_post = """    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('mode', mode);
      formData.append('location', location);
      formData.append('capacity', capacity);
      
      formData.append('isPaid', isPaid.toString());
      if (isPaid) {
        formData.append('ticketPrice', ticketPrice);
        formData.append('ticketCapacity', ticketCapacity);
        formData.append('maxTicketsPerUser', maxTicketsPerUser);
        formData.append('isRefundable', isRefundable.toString());
        formData.append('paymentDescription', paymentDescription);
        formData.append('entryConditions', entryConditions);
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      const { data } = await api.post('/events/submit', formData);
      setSubmissionId(data.submissionId);
      setPendingSubmissionId(data.submissionId);
      setFlow('pending');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit event. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };"""

new_handle_post = """    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('organizer', organizer);
      formData.append('category', category);
      formData.append('tag', tag);
      
      const mappedDate = endDate ? `${startDate} - ${endDate}` : startDate;
      const mappedVenue = mode ? `${mode} | ${location}` : location;
      formData.append('date', mappedDate);
      formData.append('venue', mappedVenue);
      
      formData.append('startDate', startDate);
      formData.append('endDate', endDate);
      formData.append('mode', mode);
      formData.append('location', location);
      formData.append('capacity', capacity || '0');
      formData.append('seats', capacity || 'Limited');
      formData.append('price', isPaid ? ticketPrice : 'Free');
      
      formData.append('isPaid', isPaid.toString());
      if (isPaid) {
        formData.append('ticketPrice', ticketPrice);
        formData.append('ticketCapacity', ticketCapacity);
        formData.append('maxTicketsPerUser', maxTicketsPerUser);
        formData.append('isRefundable', isRefundable.toString());
        formData.append('paymentDescription', paymentDescription);
        formData.append('entryConditions', entryConditions);
      }

      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (isEditing) {
        await api.put(`/admin/events/${eventId}`, formData);
      } else {
        await api.post('/admin/events', formData);
      }
      
      // Navigate back to admin dashboard on success
      window.location.hash = '#admin';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit event. Try again later.');
    } finally {
      setSubmitting(false);
    }
  };"""
content = content.replace(old_handle_post, new_handle_post)

# Also remove the specific check for empty mode, location etc if we need, but wait, those are in `CreateEvent.tsx`.
# Let's add organizer to required validation
content = content.replace("!title.trim() || !description.trim() || !startDate || !endDate || !mode.trim() || !location.trim()", 
"!title.trim() || !description.trim() || !organizer.trim() || !startDate || !endDate || !mode.trim() || !location.trim()")

# UI updates for the new fields
# Insert Organizer and Category right before Start date
new_fields = """                <div>
                  <label style={labelStyle}>Organizer <span style={{ color: '#3b82f6' }}>*</span></label>
                  <input style={inputStyle} value={organizer} onChange={(e) => setOrganizer(e.target.value)} placeholder="Club/College Name" />
                </div>
                <div>
                  <label style={labelStyle}>Category <span style={{ color: '#3b82f6' }}>*</span></label>
                  <select style={inputStyle} value={category} onChange={(e) => setCategory(e.target.value)}>
                    {['Tech', 'Music', 'Gaming', 'Dance', 'Culture', 'Academics', 'Workshops'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="create-event-dates">"""

content = content.replace("""                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="create-event-dates">""", new_fields)


# Change "Create New Event" title to Edit/Create
content = content.replace("Create New Event", "{isEditing ? 'Edit Event' : 'Create New Event'}")
content = content.replace("Submit Event for Review", "{isEditing ? 'Update Event' : 'Create Event'}")
content = content.replace(">Post Event<", ">{isEditing ? 'Update Event' : 'Create Event'}<")
content = content.replace("window.location.hash = '#organizer-dashboard'", "window.location.hash = '#admin'")

# Remove flow logic for 'pending', 'approved', 'rejected' at the bottom of the render block
# since AdminCreateEvent directly redirects on success
# We can just remove it via regex
content = re.sub(r'if \(flow === \'pending\'\) \{.*?(?=\s+return \(\s+<div)', '', content, flags=re.DOTALL)
content = re.sub(r'if \(flow === \'approved\'\) \{.*?(?=\s+return \(\s+<div)', '', content, flags=re.DOTALL)
content = re.sub(r'if \(flow === \'rejected\'\) \{.*?(?=\s+return \(\s+<div)', '', content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated AdminCreateEvent.tsx")
