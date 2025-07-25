const fs = require('fs');
const path = require('path');

async function downloadFileFromLocal(filePath) {
    try {
        const fullPath = path.resolve(filePath);
        
        if (!fs.existsSync(fullPath)) {
            throw new Error(`File not found: ${fullPath}`);
        }
        
        const fileContent = fs.readFileSync(fullPath);
        return fileContent;
    } catch (error) {
        throw new Error(`Failed to read local file: ${error.message}`);
    }
}

module.exports = {
    downloadFileFromLocal
};
