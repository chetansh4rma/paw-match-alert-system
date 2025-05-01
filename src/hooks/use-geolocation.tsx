
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  permissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
}

export function useGeolocation(): GeolocationState {
  const { toast } = useToast();
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    permissionGranted: false,
    requestPermission: async () => false
  });

  // Function to request geolocation permission
  const requestPermission = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Unavailable",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return false;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      setState(prev => ({
        ...prev,
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
        permissionGranted: true,
      }));

      toast({
        title: "Location Access Granted",
        description: "Using your current location to help find nearby dogs",
      });

      return true;
    } catch (error) {
      let errorMessage = "Unable to retrieve your location";
      
      // Handle specific permission errors
      if (error instanceof GeolocationPositionError) {
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Location permission was denied. Please enable location services.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Location request timed out. Please try again.";
        }
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
        permissionGranted: false,
      }));

      toast({
        title: "Location Access Error",
        description: errorMessage,
        variant: "destructive",
      });

      return false;
    }
  };

  useEffect(() => {
    // Initialize the requestPermission function
    setState(prev => ({
      ...prev,
      requestPermission
    }));

    // Check for existing permissions
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          requestPermission();
        } else {
          setState(prev => ({ ...prev, loading: false }));
        }
      });
    }
  }, []);

  return state;
}
