import sys
import re

file_path = "client/src/pages/AdminDashboard.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace Edit Event onClick
old_edit_btn = """onClick={() => { 
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
new_edit_btn = """onClick={() => { window.location.hash = `#admin-edit-event=${event._id}`; }}"""

content = content.replace(old_edit_btn, new_edit_btn)

# Replace Create Event onClick
old_create_btn = """onClick={() => { setEditingEvent(null); setEventFormData({ title: '', description: '', organizer: '', category: 'Tech', tag: '', startDate: '', endDate: '', mode: '', location: '', capacity: '', isPaid: false, ticketPrice: '', ticketCapacity: '', maxTicketsPerUser: '1', isRefundable: false, paymentDescription: '', entryConditions: '' }); setIsEventModalOpen(true); }}"""
new_create_btn = """onClick={() => { window.location.hash = '#admin-create-event'; }}"""
content = content.replace(old_create_btn, new_create_btn)


# Remove the whole event modal
# It starts with:
#       {/* Create/Edit Event Modal */}
#       <AnimatePresence>
#         {isEventModalOpen && (
# ...
#         )}
#       </AnimatePresence>

# We can use regex to remove it
pattern = r'\{\/\* Create\/Edit Event Modal \*\/\}.*?<\/AnimatePresence>'
content = re.sub(pattern, '', content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated AdminDashboard.tsx")
