# Quick Start Guide

## 5-Minute Setup

### Step 1: Get API Key (2 minutes)
1. Go to https://developer.accuweather.com/
2. Click "Get Free Account"
3. Sign up and verify email
4. Click "My Apps" → Create new app
5. Copy your API Key

### Step 2: Configure App (1 minute)
1. Open `.env` file in the project folder
2. Find: `ACCUWEATHER_API_KEY=your-accuweather-api-key-here`
3. Replace `your-accuweather-api-key-here` with your API key
4. Save the file

### Step 3: Install & Start (2 minutes)

Open PowerShell in the WeatherForcast folder:

```powershell
npm install
npm start
```

Wait for: `✅ Server running on http://localhost:5000`

### Step 4: Open in Browser

Go to: `http://localhost:5000`

## First Time Use

1. **Sign Up** - Create account with:
   - Full Name: (any name)
   - Email: (any email)
   - Password: (min 6 characters)

2. **Allow Location** - Click "📍" to find your weather

3. **Done!** - You're all set 🎉

## Commands

```powershell
npm start      # Start server (default port 5000)
npm run dev    # Start with auto-reload (requires nodemon)
```

## Troubleshooting

**Q: "Cannot find module"**
A: Run `npm install` again

**Q: "Invalid API key"**
A: Check `.env` file - paste API key from AccuWeather

**Q: "Port 5000 in use"**
A: Change PORT in `.env` file to different number (e.g., 5001)

**Q: "CORS errors"**
A: Make sure backend is running (`npm start`)

**Q: "Still stuck at loading"**
A: Open browser console (F12) → Console tab → check for errors

---

Happy weather tracking! ⛅
