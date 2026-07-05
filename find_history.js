const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');
let found = null;
let maxLen = 0;

function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchDir(fullPath);
        } else if (stat.isFile()) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                // The old file must have had '/registered' and EventSubmission
                if (content.includes("router.get('/registered'") && content.includes("EventSubmission")) {
                    console.log(`Found in ${fullPath} (${stat.size} bytes)`);
                    if (content.length > maxLen) {
                        maxLen = content.length;
                        found = fullPath;
                    }
                }
            } catch(e) {}
        }
    }
}

searchDir(historyDir);
if (found) {
    fs.copyFileSync(found, 'backend/routes/events.js');
    console.log(`Restored from ${found}`);
} else {
    console.log('Not found anywhere');
}
