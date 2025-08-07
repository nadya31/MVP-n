import React, { useState, useEffect, useCallback } from 'react';
import { MapView } from './components/MapView';
import { TrafficLightTimer } from './components/TrafficLightTimer';
import { useGeolocation } from './hooks/useGeolocation';
import { TrafficLightService } from './services/TrafficLightService';
import { TrafficLight } from './types/TrafficLight';
import './App.css';

function App() {
  const { location: userLocation, error: locationError, isLoading } = useGeolocation();
  const [trafficLightService] = useState(() => new TrafficLightService());
  const [trafficLights, setTrafficLights] = useState<TrafficLight[]>([]);
  const [nearestLight, setNearestLight] = useState<TrafficLight | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  // Update traffic light phases every second
  useEffect(() => {
    const updateInterval = setInterval(() => {
      trafficLightService.updateTrafficLightPhases();
      setTrafficLights([...trafficLightService.getTrafficLights()]);
    }, 1000);

    return () => clearInterval(updateInterval);
  }, [trafficLightService]);

  // Find nearest traffic light when user location changes
  useEffect(() => {
    if (userLocation) {
      const nearest = trafficLightService.getNearestTrafficLight(userLocation);
      setNearestLight(nearest);
      
      // Check for warning condition
      if (nearest) {
        const isWarning = trafficLightService.isRedLightWarning(nearest);
        setShowWarning(isWarning);
      } else {
        setShowWarning(false);
      }
    }
  }, [userLocation, trafficLights, trafficLightService]);

  // Initialize traffic lights
  useEffect(() => {
    setTrafficLights(trafficLightService.getTrafficLights());
  }, [trafficLightService]);

  if (isLoading) {
    return (
      <div className="app-loading">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Getting your location...</h2>
          <p>Please allow location access to see nearby traffic lights</p>
        </div>
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="app-error">
        <div className="error-content">
          <div className="error-icon">📍</div>
          <h2>Location Access Required</h2>
          <p>{locationError}</p>
          <p className="error-help">
            This app needs location access to show nearby traffic lights and provide timing information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <MapView 
        userLocation={userLocation}
        trafficLights={trafficLights}
        nearestLight={nearestLight}
      />
      
      <TrafficLightTimer
        trafficLight={nearestLight}
        showWarning={showWarning}
      />
      
      {userLocation && (
        <div className="app-info">
          <div className="location-status">
            <span className="status-indicator online">●</span>
            <span>Live Location Active</span>
            {userLocation.speed && userLocation.speed > 1 && (
              <span className="speed"> • {Math.round(userLocation.speed * 3.6)} km/h</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
