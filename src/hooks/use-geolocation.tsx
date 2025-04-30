
import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      });
    };

    const errorHandler = (error: GeolocationPositionError) => {
      setState(prev => ({
        ...prev,
        error: error.message,
        loading: false,
      }));
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // Extended timeout for slower connections
      maximumAge: 0
    };

    // Get current position
    navigator.geolocation.getCurrentPosition(
      successHandler,
      errorHandler,
      options
    );

    // Also set up a watcher to update if the position changes
    const watchId = navigator.geolocation.watchPosition(
      successHandler,
      errorHandler,
      options
    );

    // Cleanup function to remove the watcher
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
}
