import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngTuple } from 'leaflet';
import { TrafficLight, UserLocation } from '../types/TrafficLight';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapViewProps {
  userLocation: UserLocation | null;
  trafficLights: TrafficLight[];
  nearestLight: TrafficLight | null;
}

// Custom marker icons for traffic lights
const createTrafficLightIcon = (phase: string, isNearest: boolean = false) => {
  const color = phase === 'red' ? '#ef4444' : phase === 'yellow' ? '#f59e0b' : '#22c55e';
  const size = isNearest ? 30 : 20;
  const border = isNearest ? '3px solid #ffffff' : '2px solid #ffffff';
  
  return L.divIcon({
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border: ${border};
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: ${isNearest ? 'pulse 2s infinite' : 'none'};
      ">
        <div style="
          width: ${size * 0.4}px;
          height: ${size * 0.4}px;
          background-color: rgba(255,255,255,0.8);
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'traffic-light-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

// Custom marker for user location
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #3b82f6;
        border: 3px solid #ffffff;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          position: absolute;
          inset: -8px;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          opacity: 0.3;
          animation: user-pulse 2s infinite;
        "></div>
      </div>
    `,
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to handle map updates
const MapUpdater: React.FC<{ center: LatLngTuple; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

export const MapView: React.FC<MapViewProps> = ({ 
  userLocation, 
  trafficLights, 
  nearestLight 
}) => {
  const mapRef = useRef<L.Map | null>(null);
  
  // Default center (San Francisco)
  const defaultCenter: LatLngTuple = [37.7749, -122.4194];
  const center: LatLngTuple = userLocation ? 
    [userLocation.latitude, userLocation.longitude] : 
    defaultCenter;

  const formatTimeRemaining = (seconds: number): string => {
    return seconds < 60 ? `${Math.ceil(seconds)}s` : 
           `${Math.floor(seconds / 60)}:${(Math.ceil(seconds % 60)).toString().padStart(2, '0')}`;
  };

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={userLocation ? 16 : 12}
        style={{ height: '100vh', width: '100%' }}
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {userLocation && (
          <MapUpdater 
            center={[userLocation.latitude, userLocation.longitude]} 
            zoom={16} 
          />
        )}
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={createUserLocationIcon()}
          >
            <Popup>
              <div className="popup-content">
                <h4>Your Location</h4>
                <p>Accuracy: ±{Math.round(userLocation.accuracy)}m</p>
                {userLocation.speed && (
                  <p>Speed: {Math.round(userLocation.speed * 3.6)} km/h</p>
                )}
                {userLocation.heading && (
                  <p>Heading: {Math.round(userLocation.heading)}°</p>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Traffic light markers */}
        {trafficLights.map((light) => (
          <Marker
            key={light.location.id}
            position={[light.location.latitude, light.location.longitude]}
            icon={createTrafficLightIcon(
              light.phase.current, 
              nearestLight?.location.id === light.location.id
            )}
          >
            <Popup>
              <div className="popup-content">
                <h4>{light.location.intersection}</h4>
                <p className="street-name">{light.location.streetName}</p>
                <div className="light-status">
                  <span className={`status-indicator ${light.phase.current}`}>
                    {light.phase.current.toUpperCase()}
                  </span>
                  <span className="time-remaining">
                    {formatTimeRemaining(light.phase.timeRemaining)}
                  </span>
                </div>
                <p className="next-phase">
                  Next: {light.phase.nextPhase.toUpperCase()}
                </p>
                {nearestLight?.location.id === light.location.id && (
                  <p className="nearest-label">📍 Nearest Light</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};