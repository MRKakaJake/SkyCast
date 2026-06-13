# ☁ SkyCast - Weather App

A beautiful, modern weather application with user authentication and real-time weather data from AccuWeather.

## Features

- 🔐 **User Authentication** - Sign up with email/password or Google account
- 🌍 **Real-time Weather** - Current conditions, hourly and 5-day forecasts
- 📍 **Geolocation** - Auto-detect your location for instant weather
- 🌡️ **Celsius/Fahrenheit** - Toggle between temperature units
- 🎨 **Beautiful UI** - Dark mode with smooth animations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Setup Instructions

### 1. Get AccuWeather API Key

1. Go to [AccuWeather Developer Portal](https://developer.accuweather.com/)
2. Sign up for a free account
3. Create a new app and get your API key
4. Copy your API key

### 2. Install Dependencies

```bash
cd WeatherForcast
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ACCUWEATHER_API_KEY=your-accuweather-api-key-here
```

Replace `your-accuweather-api-key-here` with your actual API key from step 1.

### 4. Start the Server

```bash
npm start
```

The server will run on `http://localhost:5000`

### 5. Open in Browser

Open `http://localhost:5000` in your browser

## Usage

1. **Sign Up** - Create a new account with email and password, or use Google
2. **Allow Location** - Grant permission to access your location (optional)
3. **View Weather** - See current conditions and forecast
4. **Search** - Search for any city worldwide
5. **Customize** - Toggle between °C and °F

## Authentication

### Email/Password Login
- Create a new account or log in with existing credentials
- Password must be at least 6 characters
- Session stored locally for 30 days

### Google Login
- Click "Continue with Google" to sign in instantly
- Account is automatically created on first login
- No password needed

## API Endpoints

All endpoints require JWT authentication (except `/api/auth/*`)

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Login with Google

### Weather
- `GET /api/weather/search?q={query}` - Search locations
- `GET /api/weather/geosearch?lat={lat}&lon={lon}` - Search by coordinates
- `GET /api/weather/current/{key}` - Current conditions
- `GET /api/weather/hourly/{key}` - 12-hour forecast
- `GET /api/weather/daily/{key}` - 5-day forecast

## Project Structure

```
WeatherForcast/
├── index.html          # Frontend (single-file app)
├── server.js           # Express backend
├── package.json        # Dependencies
├── .env               # Environment variables
└── README.md          # This file
```

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express
- **Database**: SQLite3
- **Authentication**: JWT (JSON Web Tokens)
- **Weather API**: AccuWeather

## Security Notes

- ⚠️ Never commit `.env` file with real API keys
- API keys are stored on backend - never exposed to frontend
- Passwords are hashed with bcryptjs
- JWT tokens expire after 30 days
- All weather API calls go through authenticated backend

## Troubleshooting

### "Cannot connect to server"
- Make sure server is running: `npm start`
- Check that port 5000 is not in use
- Try `http://localhost:5000` in browser

### "Invalid API key"
- Copy correct key from AccuWeather Developer Portal
- Update `.env` file
- Restart server: `npm start`

### "CORS errors"
- Ensure backend is running on `http://localhost:5000`
- Check that CORS is enabled in server.js

### Location not detected
- Allow location access when browser prompts
- Or manually search for your city

## Future Enhancements

- [ ] Complete Google OAuth integration
- [ ] Save favorite locations
- [ ] Weather alerts
- [ ] Detailed charts and statistics
- [ ] Mobile app versions
- [ ] Dark/Light theme toggle

## License

MIT - Feel free to use and modify

## Support

Need help? Check the console (F12) for error messages or contact support.
