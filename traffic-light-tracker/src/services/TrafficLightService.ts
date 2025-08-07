import { TrafficLight, TrafficLightLocation, TrafficLightTiming, TrafficLightPhase, UserLocation } from '../types/TrafficLight';

export class TrafficLightService {
  private trafficLights: TrafficLight[] = [];

  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Sample traffic light data - in a real app, this would come from an API
    const sampleLights: TrafficLight[] = [
      {
        location: {
          id: 'tl_001',
          latitude: 37.7749,
          longitude: -122.4194,
          direction: 'north',
          streetName: 'Market Street',
          intersection: 'Market St & 5th St'
        },
        timing: {
          greenDuration: 45,
          yellowDuration: 5,
          redDuration: 40,
          cycleStartTime: Date.now() - 10000 // Started 10 seconds ago
        },
        phase: {
          current: 'green',
          timeRemaining: 35,
          nextPhase: 'yellow',
          cycleProgress: 0.22
        },
        isActive: true,
        lastUpdated: Date.now()
      },
      {
        location: {
          id: 'tl_002',
          latitude: 37.7849,
          longitude: -122.4094,
          direction: 'north',
          streetName: 'Market Street',
          intersection: 'Market St & 6th St'
        },
        timing: {
          greenDuration: 40,
          yellowDuration: 5,
          redDuration: 35,
          cycleStartTime: Date.now() - 60000 // Started 60 seconds ago
        },
        phase: {
          current: 'red',
          timeRemaining: 15,
          nextPhase: 'green',
          cycleProgress: 0.75
        },
        isActive: true,
        lastUpdated: Date.now()
      }
    ];

    this.trafficLights = sampleLights;
  }

  public updateTrafficLightPhases(): void {
    const now = Date.now();
    
    this.trafficLights.forEach(light => {
      const timeSinceCycleStart = (now - light.timing.cycleStartTime) / 1000;
      const totalCycleDuration = light.timing.greenDuration + light.timing.yellowDuration + light.timing.redDuration;
      
      // Calculate position in cycle
      const cycleTime = timeSinceCycleStart % totalCycleDuration;
      
      if (cycleTime < light.timing.greenDuration) {
        // Green phase
        light.phase.current = 'green';
        light.phase.timeRemaining = light.timing.greenDuration - cycleTime;
        light.phase.nextPhase = 'yellow';
      } else if (cycleTime < light.timing.greenDuration + light.timing.yellowDuration) {
        // Yellow phase
        light.phase.current = 'yellow';
        light.phase.timeRemaining = (light.timing.greenDuration + light.timing.yellowDuration) - cycleTime;
        light.phase.nextPhase = 'red';
      } else {
        // Red phase
        light.phase.current = 'red';
        light.phase.timeRemaining = totalCycleDuration - cycleTime;
        light.phase.nextPhase = 'green';
      }
      
      light.phase.cycleProgress = cycleTime / totalCycleDuration;
      light.lastUpdated = now;
    });
  }

  public getNearestTrafficLight(userLocation: UserLocation, maxDistance: number = 500): TrafficLight | null {
    let nearest: TrafficLight | null = null;
    let minDistance = Infinity;

    this.trafficLights.forEach(light => {
      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        light.location.latitude,
        light.location.longitude
      );

      if (distance < maxDistance && distance < minDistance) {
        // Check if light is in the direction of travel
        if (this.isLightInTravelDirection(userLocation, light)) {
          nearest = light;
          minDistance = distance;
        }
      }
    });

    return nearest;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }

  private isLightInTravelDirection(userLocation: UserLocation, light: TrafficLight): boolean {
    if (!userLocation.heading) return true; // If no heading, include all lights
    
    const bearing = this.calculateBearing(
      userLocation.latitude,
      userLocation.longitude,
      light.location.latitude,
      light.location.longitude
    );
    
    // Check if the light is roughly in the direction of travel (within 45 degrees)
    const headingDiff = Math.abs(bearing - userLocation.heading);
    return headingDiff <= 45 || headingDiff >= 315;
  }

  private calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);

    return (θ * 180/Math.PI + 360) % 360;
  }

  public getTrafficLights(): TrafficLight[] {
    return this.trafficLights;
  }

  public isRedLightWarning(light: TrafficLight): boolean {
    return (light.phase.current === 'green' && light.phase.timeRemaining <= 5) ||
           (light.phase.current === 'yellow' && light.phase.timeRemaining <= 2);
  }
}