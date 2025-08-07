import React from 'react';
import { TrafficLight } from '../types/TrafficLight';
import './TrafficLightTimer.css';

interface TrafficLightTimerProps {
  trafficLight: TrafficLight | null;
  showWarning: boolean;
}

export const TrafficLightTimer: React.FC<TrafficLightTimerProps> = ({ 
  trafficLight, 
  showWarning 
}) => {
  if (!trafficLight) {
    return (
      <div className="traffic-light-timer no-light">
        <div className="timer-content">
          <div className="status-text">No traffic lights nearby</div>
        </div>
      </div>
    );
  }

  const { phase, location } = trafficLight;
  const timeRemaining = Math.ceil(phase.timeRemaining);

  const getPhaseColor = (currentPhase: string): string => {
    switch (currentPhase) {
      case 'red': return '#ef4444';
      case 'yellow': return '#f59e0b';
      case 'green': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`traffic-light-timer ${phase.current} ${showWarning ? 'warning' : ''}`}>
      <div className="timer-content">
        <div className="light-indicator">
          <div 
            className={`light-circle ${phase.current}`}
            style={{ backgroundColor: getPhaseColor(phase.current) }}
          >
            <div className="light-glow"></div>
          </div>
        </div>
        
        <div className="timer-info">
          <div className="countdown">{formatTime(timeRemaining)}</div>
          <div className="phase-status">
            {phase.current.toUpperCase()}
            {showWarning && phase.current === 'green' && (
              <span className="warning-text"> → RED SOON</span>
            )}
          </div>
        </div>
        
        <div className="location-info">
          <div className="intersection">{location.intersection}</div>
          <div className="street">{location.streetName}</div>
        </div>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ 
            width: `${(1 - phase.cycleProgress) * 100}%`,
            backgroundColor: getPhaseColor(phase.current)
          }}
        ></div>
      </div>

      {showWarning && (
        <div className="warning-pulse"></div>
      )}
    </div>
  );
};