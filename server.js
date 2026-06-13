const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Database setup
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    googleId TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY || 'your-api-key-here';
const ACCUWEATHER_BASE = 'https://dataservice.accuweather.com';

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  });
};

// ── AUTH ENDPOINTS ──────────────────────────────────────────────────────────

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
      [name, email, hashedPassword], 
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Email already exists' });
        }
        
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: this.lastID, name, email } });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    try {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// Google Login (simplified - in production use google-auth-library)
app.post('/api/auth/google', (req, res) => {
  const { email, name, googleId } = req.body;
  
  if (!email || !googleId) {
    return res.status(400).json({ error: 'Missing email or googleId' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (user) {
      // User exists, just log them in
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' });
      return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    }

    // New user, create account
    db.run('INSERT INTO users (name, email, googleId) VALUES (?, ?, ?)', 
      [name, email, googleId], 
      function(err) {
        if (err) {
          return res.status(400).json({ error: 'Failed to create user' });
        }
        
        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET, { expiresIn: '30d' });
        res.json({ token, user: { id: this.lastID, name, email } });
      }
    );
  });
});

// ── WEATHER API ENDPOINTS ──────────────────────────────────────────────────

// Search locations
app.get('/api/weather/search', verifyToken, async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Query required' });

  try {
    const response = await axios.get(`${ACCUWEATHER_BASE}/locations/v1/cities/autocomplete?q=${encodeURIComponent(q)}&language=en-us&apikey=${ACCUWEATHER_API_KEY}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Geo search
app.get('/api/weather/geosearch', verifyToken, async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Latitude and longitude required' });

  try {
    const response = await axios.get(`${ACCUWEATHER_BASE}/locations/v1/cities/geoposition/search?q=${lat},${lon}&language=en-us&apikey=${ACCUWEATHER_API_KEY}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Current conditions
app.get('/api/weather/current/:key', verifyToken, async (req, res) => {
  const { key } = req.params;
  
  try {
    const response = await axios.get(`${ACCUWEATHER_BASE}/currentconditions/v1/${key}?details=true&apikey=${ACCUWEATHER_API_KEY}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Hourly forecast
app.get('/api/weather/hourly/:key', verifyToken, async (req, res) => {
  const { key } = req.params;
  
  try {
    const response = await axios.get(`${ACCUWEATHER_BASE}/forecasts/v1/hourly/12hour/${key}?metric=true&details=true&language=en-us&apikey=${ACCUWEATHER_API_KEY}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Daily forecast
app.get('/api/weather/daily/:key', verifyToken, async (req, res) => {
  const { key } = req.params;
  
  try {
    const response = await axios.get(`${ACCUWEATHER_BASE}/forecasts/v1/daily/5day/${key}?metric=true&details=true&language=en-us&apikey=${ACCUWEATHER_API_KEY}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify token endpoint
app.post('/api/auth/verify', verifyToken, (req, res) => {
  res.json({ valid: true });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`📝 Make sure to set ACCUWEATHER_API_KEY in .env file`);
});
