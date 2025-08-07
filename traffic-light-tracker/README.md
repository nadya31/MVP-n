# Traffic Light Tracker

A real-time traffic light tracking application that provides timing information and warnings for nearby traffic lights, designed as a Google Maps-style overlay for drivers.

## Features

### 🚦 Real-Time Traffic Light Tracking
- Live countdown timers for traffic light phases
- Displays current light status (Red, Yellow, Green)
- Shows time remaining in current phase
- Progress bar indicating cycle completion

### 📍 Location-Aware
- Uses device GPS for precise location tracking
- Automatically detects nearest traffic light in your direction of travel
- Updates display as you move past traffic lights
- Works like a Google Maps overlay

### ⚠️ Smart Warning System
- **5-second warning** when green light is about to turn red
- Subtle, non-distracting visual alerts
- Warning pulses appear when approaching red transition

### 🗺️ Interactive Map
- Real-time map view with your location
- Visual markers for all nearby traffic lights
- Color-coded markers showing current light phase
- Popup information for each traffic light

### 📱 Mobile-Friendly Design
- Responsive design works on all devices
- Clean, minimal interface that doesn't distract while driving
- Dark mode support for night driving
- Optimized for mobile browsers

## How It Works

1. **Location Access**: Grant location permission when prompted
2. **Auto-Detection**: The app finds traffic lights within 500m of your location
3. **Direction Filtering**: Only shows lights in your direction of travel
4. **Live Updates**: Timer updates every second with real-time information
5. **Warnings**: Get subtle alerts 5 seconds before green turns red

## Key Components

### Traffic Light Timer
- **Position**: Fixed overlay in top-right corner
- **Information**: Current phase, countdown, intersection name
- **Warning State**: Gentle pulse animation for red light warnings

### Map View
- **Base Map**: OpenStreetMap tiles for free usage
- **Your Location**: Blue marker with pulsing animation
- **Traffic Lights**: Colored markers (red/yellow/green) based on current phase
- **Nearest Light**: Highlighted with larger, pulsing marker

### Location Status
- **Bottom-left indicator**: Shows live location is active
- **Speed Display**: Current speed when moving (km/h)
- **Connection Status**: Green dot indicates GPS is working

## Installation & Setup

```bash
# Clone the project
cd traffic-light-tracker

# Install dependencies
npm install

# Start development server
npm start
```

The app will open in your browser at `http://localhost:3000`

## Technical Features

### Real-Time Synchronization
- Traffic light phases calculated based on timing patterns
- Updates every second for accurate countdowns
- Simulates real traffic light cycles

### Geolocation Integration
- High-accuracy GPS tracking
- Heading detection for directional filtering
- Speed calculation for enhanced context

### Performance Optimized
- Efficient re-rendering with React hooks
- Smooth animations and transitions
- Lightweight map implementation

## Privacy & Security

- **Location Data**: Only used locally, never sent to servers
- **No Tracking**: App doesn't store or transmit personal data
- **Offline Capable**: Core functionality works without internet after initial load

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (iOS 14+)
- Mobile browsers: Optimized experience

## Future Enhancements

- Integration with real traffic management systems
- Crowd-sourced timing data
- Route optimization based on light timing
- Voice alerts option
- Apple CarPlay/Android Auto integration

## Demo Data

The app currently uses sample traffic light data for demonstration. In a production environment, this would connect to:
- Municipal traffic management systems
- Real-time traffic APIs
- Crowd-sourced timing databases

## Usage Tips

1. **Best Results**: Use while walking or driving slowly for most accurate detection
2. **Permission**: Always allow location access for core functionality
3. **Visibility**: Works best in areas with good GPS signal
4. **Safety**: Use as a supplement to visual traffic light observation, not a replacement

---

*Built with React, TypeScript, and Leaflet. Designed for safety-conscious drivers and pedestrians.*
