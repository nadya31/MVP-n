export interface TrafficLightLocation {
  id: string;
  latitude: number;
  longitude: number;
  direction: 'north' | 'south' | 'east' | 'west';
  streetName: string;
  intersection: string;
}

export interface TrafficLightTiming {
  greenDuration: number; // seconds
  yellowDuration: number; // seconds
  redDuration: number; // seconds
  cycleStartTime: number; // timestamp when current cycle started
}

export interface TrafficLightPhase {
  current: 'red' | 'yellow' | 'green';
  timeRemaining: number; // seconds
  nextPhase: 'red' | 'yellow' | 'green';
  cycleProgress: number; // 0-1 percentage through current cycle
}

export interface TrafficLight {
  location: TrafficLightLocation;
  timing: TrafficLightTiming;
  phase: TrafficLightPhase;
  isActive: boolean;
  lastUpdated: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  heading?: number; // degrees from north
  speed?: number; // m/s
  accuracy: number; // meters
  timestamp: number;
}