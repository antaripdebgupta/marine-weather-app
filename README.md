# Marine Conditions Forecast App

A web application that displays real-time marine weather conditions including wave height, sea temperature, and ocean currents based on user location or custom coordinates.

## Features

- 🌊 **Current Marine Conditions**: Wave height, direction, sea temperature, and currents
- ⏱️ **Hourly Forecast**: 12-hour marine weather forecast
- 📅 **Daily Summary**: Maximum wave heights and dominant wave directions
- 📍 **Location-based**: Automatically detects your location
- 🔍 **Custom Search**: Search by latitude/longitude coordinates
- 📱 **Responsive Design**: Works on mobile, tablet, and desktop

## How to Use

1. **Automatic Location**:
   - Allow location access when prompted
   - View conditions for your current location

2. **Custom Location**:
   - Enter latitude (-90 to 90) and longitude (-180 to 180)
   - Click "Get Conditions"
   - View marine data for your specified coordinates

## Technologies Used

- **Frontend**: React, Next.js, Tailwind CSS
- **API**: Marine Weather [Open-Meteo](https://open-meteo.com/en/docs/marine-weather-api) API 

## SEO Optimization

This app is optimized for search engines with:
- Semantic HTML structure
- Responsive meta tags
- Fast loading performance
- Accessible design

## Installation

#### Clone the repository
```bash
git clone https://github.com/antaripdebgupta/marine-weather-app.git
```
#### Install dependencies
```bash
npm install
```

#### Set up environment variables
Create a `.env.local` file in the root directory and add your environment variables. You can use `.env.example` as a reference if available.

#### Run development server
```bash
npm run dev
```