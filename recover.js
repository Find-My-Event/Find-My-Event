const fs = require('fs');
const path = require('path');

const historyDir = path.join(process.env.APPDATA, 'Code', 'User', 'History');

function searchDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            searchDir(fullPath);
        } else if (stat.isFile() && stat.size > 35000 && stat.size < 37000) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                if (content.includes("router.get('/registered'")) {
                    console.log(`Found match in: ${fullPath}, length: ${content.length}`);
                    fs.writeFileSync('restored_events.js', content);
                }
            } catch (e) {}
        }
    }
}

try {
    searchDir(historyDir);
    console.log("Search complete.");
} catch (e) {
    console.error(e);
}
