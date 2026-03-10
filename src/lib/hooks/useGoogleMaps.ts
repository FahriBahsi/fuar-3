import { useEffect, useState } from 'react';

let isLoading = false;
let isLoaded = false;

/**
 * Custom hook to load Google Maps API
 * Prevents multiple script loads and handles loading state
 */
export function useGoogleMaps(apiKey: string) {
  const [loaded, setLoaded] = useState(isLoaded);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if Google Maps API is fully loaded
    const isGoogleMapsReady = () => {
      return window.google && window.google.maps && window.google.maps.Map;
    };

    // Already loaded
    if (isGoogleMapsReady()) {
      setLoaded(true);
      isLoaded = true;
      return;
    }

    // Currently loading
    if (isLoading) {
      // Wait for loading to complete
      const checkLoaded = setInterval(() => {
        if (isGoogleMapsReady()) {
          setLoaded(true);
          isLoaded = true;
          clearInterval(checkLoaded);
        }
      }, 100);

      return () => clearInterval(checkLoaded);
    }

    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    
    if (existingScript) {
      if (isGoogleMapsReady()) {
        setLoaded(true);
        isLoaded = true;
      } else {
        // Script exists but not loaded yet, wait for it
        const checkReady = setInterval(() => {
          if (isGoogleMapsReady()) {
            setLoaded(true);
            isLoaded = true;
            isLoading = false;
            clearInterval(checkReady);
          }
        }, 100);

        return () => clearInterval(checkReady);
      }
      return;
    }

    // Load the script
    isLoading = true;
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';
    
    script.onload = () => {
      // Wait a bit for Google Maps to fully initialize
      const checkReady = setInterval(() => {
        if (isGoogleMapsReady()) {
          setLoaded(true);
          isLoaded = true;
          isLoading = false;
          clearInterval(checkReady);
        }
      }, 50);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkReady);
        if (!isGoogleMapsReady()) {
          setError(new Error('Google Maps API failed to initialize'));
          isLoading = false;
        }
      }, 10000);
    };
    
    script.onerror = () => {
      const err = new Error('Failed to load Google Maps API');
      setError(err);
      isLoading = false;
      console.error(err);
    };
    
    document.head.appendChild(script);

    return () => {
      // Don't remove script on unmount as it can be reused
      // isLoading = false;
    };
  }, [apiKey]);

  return { loaded, error };
}

