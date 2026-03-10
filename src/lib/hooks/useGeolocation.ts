import { useState, useCallback } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  latitude: number | null;
  longitude: number | null;
}

/**
 * Custom hook for geolocation functionality
 * Replaces the jQuery geolocation from script.min.js
 */
export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: false,
    error: null,
    latitude: null,
    longitude: null,
  });

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: 'Geolocation is not supported by this browser.',
        latitude: null,
        longitude: null,
      });
      return;
    }

    setState({ ...state, loading: true, error: null });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
        }
        setState({
          loading: false,
          error: errorMessage,
          latitude: null,
          longitude: null,
        });
      }
    );
  }, []);

  const getCityFromCoords = useCallback(
    async (lat: number, lng: number): Promise<string> => {
      return new Promise((resolve, reject) => {
        if (!window.google || !window.google.maps) {
          reject('Google Maps not loaded');
          return;
        }

        const geocoder = new window.google.maps.Geocoder();
        const latlng = new window.google.maps.LatLng(lat, lng);

        geocoder.geocode({ latLng: latlng }, (results: any, status: any) => {
          if (status === window.google.maps.GeocoderStatus.OK) {
            if (results[0]) {
              const addressComponents = results[0].formatted_address.split(',');
              const count = addressComponents.length;
              const city = addressComponents[count - 3]?.trim() || addressComponents[0]?.trim();
              resolve(city);
            } else {
              reject('Address not found');
            }
          } else {
            reject(`Geocoder failed due to: ${status}`);
          }
        });
      });
    },
    []
  );

  return {
    ...state,
    getLocation,
    getCityFromCoords,
  };
}

