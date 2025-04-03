const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('./'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('Created data directory');
}

// Create empty JSON files if they don't exist
const createEmptyJsonFile = (filename) => {
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([], null, 2));
        console.log(`Created empty JSON file: ${filename}`);
    }
};

createEmptyJsonFile('students.json');
createEmptyJsonFile('teachers.json');
createEmptyJsonFile('settings.json');

// Route to save file
app.post('/save-file', (req, res) => {
    const { path: filePath, content } = req.body;
    
    try {
        // Make sure the file path is within our data directory (security check)
        const normalizedPath = path.normalize(filePath);
        const resolvedPath = path.resolve(__dirname, normalizedPath);
        
        // Make sure we don't write outside the application directory
        if (!resolvedPath.startsWith(path.resolve(__dirname))) {
            return res.status(403).json({ error: 'Forbidden path' });
        }
        
        // Ensure the directory exists
        const fileDir = path.dirname(resolvedPath);
        if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, { recursive: true });
        }
        
        // Write the file
        fs.writeFileSync(resolvedPath, content);
        console.log(`File saved: ${normalizedPath}`);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving file:', error);
        res.status(500).json({ error: 'Failed to save file' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`School Management System server running on http://localhost:${port}`);
    console.log('Data directory:', dataDir);
});
