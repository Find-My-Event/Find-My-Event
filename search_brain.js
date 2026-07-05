const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\psvt2\\.gemini\\antigravity\\brain';
const dirs = fs.readdirSync(brainDir);
let foundPath = null;

for (const d of dirs) {
    const logPath = path.join(brainDir, d, '.system_generated', 'logs', 'overview.txt');
    if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf8');
        if (content.includes("router.get('/registered'") && content.includes('EventSubmission')) {
            console.log('Found in', logPath);
            foundPath = logPath;
        }
    }
}

if (foundPath) {
    // try to extract the file content from the log
    // The log usually contains File Path: ... and then the code
    const logStr = fs.readFileSync(foundPath, 'utf8');
    const idx = logStr.lastIndexOf('router.get(\'/registered\'');
    console.log('Index of route:', idx);
}
