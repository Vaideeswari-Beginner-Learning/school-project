const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Serve frontend files
app.use(express.static(__dirname));

// Route for root to serve index.html explicitly
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Path to our mock database (JSON files)
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Helper to read/write JSON files
const getFilePath = (file) => path.join(DATA_DIR, `${file}.json`);

const readData = (file) => {
    const filePath = getFilePath(file);
    if (!fs.existsSync(filePath)) return [];
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        return [];
    }
};

const saveData = (file, data) => {
    fs.writeFileSync(getFilePath(file), JSON.stringify(data, null, 2));
};

// Auth Mock (Replacing the static check in frontend)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`[AUTH] Login attempt: Email="${email}", Password="${password}"`);
    
    if (email === 'admin@Richmaanschool.edu' && password === 'admin123') {
        res.json({ success: true, token: 'mock-jwt-token' });
    } else {
        console.warn(`[AUTH] Failed login for: ${email}`);
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Generic CRUD for our sections
const sections = ['gallery', 'news', 'academics', 'facilities', 'sports', 'achievements', 'messages'];

sections.forEach(section => {
    // Get all
    app.get(`/api/${section}`, (req, res) => {
        res.json(readData(section));
    });

    // Add new
    app.post(`/api/${section}`, (req, res) => {
        const items = readData(section);
        const newItem = { id: Date.now(), ...req.body };
        items.push(newItem);
        saveData(section, items);
        res.status(201).json(newItem);
    });

    // Delete item
    app.delete(`/api/${section}/:id`, (req, res) => {
        let items = readData(section);
        const id = parseInt(req.params.id);
        items = items.filter(item => item.id !== id);
        saveData(section, items);
        res.json({ success: true });
    });

    // Update item
    app.put(`/api/${section}/:id`, (req, res) => {
        let items = readData(section);
        const id = parseInt(req.params.id);
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
            items[index] = { ...items[index], ...req.body };
            saveData(section, items);
            res.json(items[index]);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    });
});

// Seed initial data if empty
const seedData = () => {
    if (readData('gallery').length === 0) {
        saveData('gallery', [
            { id: 1, img: 'assets/gallery_sports_day.png', title: 'Sports Day 2024', category: 'Sports' },
            { id: 2, img: 'assets/gallery_football_match.png', title: 'District Football Match', category: 'Sports' },
            { id: 3, img: 'assets/campus_classroom.png', title: 'Interactive Science Class', category: 'Academics' },
            { id: 4, img: 'assets/campus_graduation.png', title: 'Class of 2025 Graduation', category: 'Campus Life' }
        ]);
    }
    if (readData('news').length === 0) {
        saveData('news', [
            { id: 1, text: 'Annual Sports Day – May 10th. All students must participate.' },
            { id: 2, text: 'Final Term Exams begin on June 1st. Check portal for timetable.' }
        ]);
    }
    if (readData('messages').length === 0) {
        saveData('messages', [
            { id: 1, date: 'Oct 12', name: 'Sarah Jenkins', email: 'sarah@example.com', message: 'Admission inquiry for Grade 5.', status: 'unread' },
            { id: 2, date: 'Oct 11', name: 'Mike Ross', email: 'mike.r@example.com', message: 'Question about transport options.', status: 'unread' }
        ]);
    }
};
seedData();

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
