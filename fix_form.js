const fs = require('fs');
const file = 'client/src/components/SharedViews.tsx';
let c = fs.readFileSync(file, 'utf8');
const originalEnding = c.includes('\r\n') ? '\r\n' : '\n';
c = c.replace(/\r\n/g, '\n');

let changed = false;

// 1. Add qNum and activeEduInfo before return (
const returnStmt = '  return (\n    <motion.div ';
const addVars = `  let qNum = 1;
  const activeEduInfo = event.eduInfo?.length > 0 ? event.eduInfo : [
    { id: 1, name: 'Roll Number', required: 'Optional' },
    { id: 2, name: 'Course', required: 'Optional' },
    { id: 3, name: 'Branch', required: 'Optional' },
    { id: 4, name: 'Year', required: 'Off' }
  ];

  return (
    <motion.div `;
if (c.includes(returnStmt)) {
    c = c.replace(returnStmt, addVars);
    changed = true;
    console.log('[OK] Added qNum and activeEduInfo to render');
}

// 2. Fix validation in handleSubmit
const valOld = `     // Validate educational info if required
     if (event.eduInfo?.length > 0) {
       for (let eInfo of event.eduInfo) {`;
const valNew = `     // Validate educational info if required
     const activeEduInfoVal = event.eduInfo?.length > 0 ? event.eduInfo : [
        { id: 1, name: 'Roll Number', required: 'Optional' },
        { id: 2, name: 'Course', required: 'Optional' },
        { id: 3, name: 'Branch', required: 'Optional' },
        { id: 4, name: 'Year', required: 'Off' }
     ];
     if (activeEduInfoVal?.length > 0) {
       for (let eInfo of activeEduInfoVal) {`;
if (c.includes(valOld)) {
    c = c.replace(valOld, valNew);
    changed = true;
    console.log('[OK] Fixed educational info validation');
}

// 3. Update eduInfo mapping to use activeEduInfo
const eduMapOld = `{event.eduInfo?.filter((eInfo: any) => eInfo.required !== 'Off').map((eInfo: any, i: number) => {`;
const eduMapNew = `{activeEduInfo?.filter((eInfo: any) => eInfo.required !== 'Off').map((eInfo: any, i: number) => {`;
if (c.includes(eduMapOld)) {
    c = c.replace(eduMapOld, eduMapNew);
    changed = true;
    console.log('[OK] Updated eduInfo map to activeEduInfo');
}

// 4. Update labels
// Function to update label
function replaceLabel(oldStr, newStr) {
    if (c.includes(oldStr)) {
        c = c.replace(oldStr, newStr);
        console.log(`[OK] Replaced: ${oldStr.trim()} -> ${newStr.trim()}`);
        changed = true;
    }
}

replaceLabel(
    `<label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>Full Name *</label>`,
    `<label style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{qNum++}. Full Name *</label>`
);
replaceLabel(
    `<label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>Mobile Number *</label>`,
    `<label style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{qNum++}. Mobile Number *</label>`
);
replaceLabel(
    `<label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>Email Address *</label>`,
    `<label style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{qNum++}. Email Address *</label>`
);

// Edu info label
replaceLabel(
    `<label style={{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' }}>{eInfo.name} {isReq && '*'}</label>`,
    `<label style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{qNum++}. {eInfo.name} {isReq && '*'}</label>`
);

// Custom questions label - it occurs multiple times (Text, Dropdown, Checkbox, File Upload, etc.)
// We can use a regex to replace all of them
const customRegex = /<label style=\{\{ fontSize: '0.95rem', fontWeight: 600, color: '#111827' \}\}>\{q.question\} \{isReq && '\*'\}<\/label>/g;
if (customRegex.test(c)) {
    c = c.replace(customRegex, `<label style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{qNum++}. {q.question} {isReq && '*'}</label>`);
    console.log('[OK] Replaced custom question labels');
    changed = true;
}

if (changed) {
    if (originalEnding === '\r\n') {
        c = c.replace(/\n/g, '\r\n');
    }
    fs.writeFileSync(file, c);
    console.log('\n[DONE] All form fixes applied successfully!');
} else {
    console.log('\n[WARN] No changes applied.');
}
