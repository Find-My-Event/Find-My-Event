const fs = require('fs');
let c = fs.readFileSync('backend/routes/events.js', 'utf8');

c = c.replace(
  /if \(!allParticipants\.find\(p => p\.id\.toString\(\) === r\.user\._id\.toString\(\)\)\) \{[\s\S]*?\}\s*\}\);/g,
  (match) => {
    if (match.includes("type: 'Paid'")) {
      return `const existing = allParticipants.find(p => p.id.toString() === r.user._id.toString());
        if (existing) {
          existing.answers = r.customAnswers || [];
          existing.type = 'Paid';
          existing.status = r.paymentStatus;
          existing.checkedIn = attendedSet.has(r.user._id.toString());
        } else {
          allParticipants.push({
            id: r.user._id,
            name: r.user.name,
            email: r.user.email,
            phone: r.user.phone,
            avatar: r.user.avatar,
            type: 'Paid',
            status: r.paymentStatus,
            answers: r.customAnswers || [],
            checkedIn: attendedSet.has(r.user._id.toString())
          });
        }
      });`;
    } else {
      return `const existing = allParticipants.find(p => p.id.toString() === r.user._id.toString());
        if (existing) {
          existing.answers = r.customAnswers || [];
          existing.type = r.ticketType || 'Free';
          existing.registrationId = r._id;
          existing.checkedIn = attendedSet.has(r.user._id.toString());
          if (r.status !== 'approved') existing.status = r.status === 'pending' ? 'Pending Approval' : r.status;
        } else {
          allParticipants.push({
            id: r.user._id,
            name: r.user.name,
            email: r.user.email,
            phone: r.user.phone,
            avatar: r.user.avatar,
            type: r.ticketType || 'Free',
            status: r.status === 'pending' ? 'Pending Approval' : (r.status === 'approved' ? 'Registered' : r.status),
            answers: r.customAnswers || [],
            checkedIn: attendedSet.has(r.user._id.toString()),
            registrationId: r._id
          });
        }
      });`;
    }
  }
);

fs.writeFileSync('backend/routes/events.js', c);
console.log('updated');
