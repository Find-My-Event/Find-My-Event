import sys
import re

file_path = "client/src/pages/EventDetail.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Update setCurrentEvent call
old_set_current = """          price: data.pricing?.isPaid ? `₹${data.pricing.ticketPrice}` : (data.price || 'Free'),
          seats: data.pricing?.ticketCapacity || data.capacity || data.seats || 'Limited',
          isRegistered: data.isRegistered
        });"""
new_set_current = """          price: data.pricing?.isPaid ? `₹${data.pricing.ticketPrice}` : (data.price || 'Free'),
          seats: data.pricing?.ticketCapacity || data.capacity || data.seats || 'Limited',
          isRegistered: data.isRegistered,
          startDate: data.startDate,
          endDate: data.endDate,
          mode: data.mode,
          location: data.location
        });"""
content = content.replace(old_set_current, new_set_current)

# Helper function to format date if it includes 'T'
format_helper = """
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    if (dateStr.includes('T')) {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? dateStr : d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }
    return dateStr;
  };
"""
# Insert helper function inside the component, before return (e.g. before `if (loading)`)
content = content.replace("  if (loading) {", format_helper + "\n  if (loading) {")


# Update UI for Date block (Lines 207-210 approx)
old_date_ui = """                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.date.split('•')[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{currentEvent.date.split('•')[1] || currentEvent.date}</div>
                  </div>"""
new_date_ui = """                  <div>
                    {currentEvent.startDate ? (
                      <>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{formatDate(currentEvent.startDate)}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                          {currentEvent.endDate ? `to ${formatDate(currentEvent.endDate)}` : ''}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.date?.split('•')[0] || currentEvent.date?.split(' - ')[0]}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{currentEvent.date?.split('•')[1] || currentEvent.date?.split(' - ')[1] || ''}</div>
                      </>
                    )}
                  </div>"""
content = content.replace(old_date_ui, new_date_ui)

# Update UI for Location block
old_loc_ui = """                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.venue.split(',')[0]}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{currentEvent.venue.split(',')[1] || currentEvent.venue}</div>
                  </div>"""
new_loc_ui = """                  <div>
                    {currentEvent.location ? (
                      <>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.location}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                          {currentEvent.mode ? `Mode: ${currentEvent.mode}` : ''}
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{currentEvent.venue?.split(',')[0] || currentEvent.venue?.split(' | ')[1] || currentEvent.venue}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>{currentEvent.venue?.split(',')[1] || currentEvent.venue?.split(' | ')[0] || ''}</div>
                      </>
                    )}
                  </div>"""
content = content.replace(old_loc_ui, new_loc_ui)


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Updated EventDetail.tsx")
