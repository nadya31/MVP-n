import { useState, useEffect, useCallback } from 'react';
import { UserLocation } from '../types/TrafficLight';

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

interface UseGeolocationReturn {
  location: UserLocation | null;
  error: string | null;
  isLoading: boolean;
  requestPermission: () => Promise<void>;
}

export const useGeolocation = (options: GeolocationOptions = {}): UseGeolocationReturn => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [watchId, setWatchId] = useState<number | null>(null);

  const defaultOptions: PositionOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 5000,
    ...options
  };

  const updateLocation = useCallback((position: GeolocationPosition) => {
    const newLocation: UserLocation = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      heading: position.coords.heading || undefined,
      speed: position.coords.speed || undefined,
      accuracy: position.coords.accuracy,
      timestamp: position.timestamp
    };

    setLocation(newLocation);
    setError(null);
    setIsLoading(false);
  }, []);

  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'An unknown error occurred';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Location access denied. Please enable location services.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Location information is unavailable.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Location request timed out.';
        break;
    }

    setError(errorMessage);
    setIsLoading(false);
  }, []);

  const requestPermission = useCallback(async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Request permission for location access
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      
      if (permission.state === 'denied') {
        setError('Location access denied. Please enable location services in your browser settings.');
        setIsLoading(false);
        return;
      }

      // Start watching position
      const id = navigator.geolocation.watchPosition(
        updateLocation,
        handleError,
        defaultOptions
      );

      setWatchId(id);
    } catch (err) {
      setError('Failed to request location permission.');
      setIsLoading(false);
    }
  }, [updateLocation, handleError, defaultOptions]);

  useEffect(() => {
    // Auto-request permission on mount
    requestPermission();

    // Cleanup function
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return {
    location,
    error,
    isLoading,
    requestPermission
  };
};