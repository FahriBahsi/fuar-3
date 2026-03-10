'use client';

import { useEffect, useRef } from 'react';
import { useGoogleMaps } from '@/lib/hooks/useGoogleMaps';

interface GoogleMapProps {
  mapId: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  onMarkerMove?: (lat: number, lng: number) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

const GOOGLE_MAPS_API_KEY = 'AIzaSyA0C5etf1GVmL_ldVAichWwFFVcDfa1y_c';

export default function GoogleMap({ 
  mapId, 
  lat = 37.387597, 
  lng = -122.048102, 
  zoom = 13,
  onMarkerMove 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const { loaded, error } = useGoogleMaps(GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    if (!loaded || error || !mapRef.current) return;

    const initializeMap = () => {
      if (!window.google || !window.google.maps || !window.google.maps.Map || !mapRef.current) {
        console.warn('Google Maps API not fully loaded yet');
        return;
      }

      // Extra safety check for LatLng
      if (!window.google.maps.LatLng) {
        console.error('Google Maps LatLng constructor not available');
        return;
      }

      const myCenter = new window.google.maps.LatLng(lat, lng);
      
      const mapStyles = [
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            { "color": "#e9e9e9" },
            { "lightness": 17 }
          ]
        },
        {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [
            { "color": "#f5f5f5" },
            { "lightness": 20 }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [
            { "color": "#ffffff" },
            { "lightness": 17 }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            { "color": "#ffffff" },
            { "lightness": 29 },
            { "weight": 0.2 }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            { "color": "#ffffff" },
            { "lightness": 18 }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [
            { "color": "#ffffff" },
            { "lightness": 16 }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            { "color": "#f5f5f5" },
            { "lightness": 21 }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [
            { "color": "#dedede" },
            { "lightness": 21 }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            { "visibility": "on" },
            { "color": "#ffffff" },
            { "lightness": 16 }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            { "saturation": 36 },
            { "color": "#333333" },
            { "lightness": 40 }
          ]
        },
        {
          "elementType": "labels.icon",
          "stylers": [
            { "visibility": "off" }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [
            { "color": "#f2f2f2" },
            { "lightness": 19 }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [
            { "color": "#fefefe" },
            { "lightness": 20 }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            { "color": "#fefefe" },
            { "lightness": 17 },
            { "weight": 1.2 }
          ]
        }
      ];

      const mapProp = {
        center: myCenter,
        zoom: zoom,
        styles: mapStyles
      };

      const map = new window.google.maps.Map(mapRef.current, mapProp);
      mapInstanceRef.current = map;

      // Note: google.maps.Marker is deprecated but still functional
      // For production, consider migrating to google.maps.marker.AdvancedMarkerElement
      // See: https://developers.google.com/maps/documentation/javascript/advanced-markers/migration
      const marker = new window.google.maps.Marker({
        position: myCenter,
        icon: '/images/marker.png',
        draggable: true
      });

      marker.setMap(map);
      markerRef.current = marker;

      // Add click listener to map
      map.addListener('click', (event: any) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        
        marker.setPosition(event.latLng);
        
        if (onMarkerMove) {
          onMarkerMove(newLat, newLng);
        }
      });

      // Add drag listener to marker
      marker.addListener('dragend', (event: any) => {
        const newLat = event.latLng.lat();
        const newLng = event.latLng.lng();
        
        if (onMarkerMove) {
          onMarkerMove(newLat, newLng);
        }
      });
    };

    // Initialize map when Google Maps API is loaded
    initializeMap();

    // Cleanup function
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
        markerRef.current = null;
      }
      if (mapInstanceRef.current) {
        // Clear map instance
        mapInstanceRef.current = null;
      }
    };
  }, [loaded, error, lat, lng, zoom, onMarkerMove]);

  if (error) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '400px',
          borderRadius: '0.25rem',
          border: '1px solid #ced4da',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          color: '#dc3545'
        }}
      >
        Failed to load map. Please check your API key.
      </div>
    );
  }

  if (!loaded) {
    return (
      <div 
        style={{ 
          width: '100%', 
          height: '400px',
          borderRadius: '0.25rem',
          border: '1px solid #ced4da',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8f9fa',
          color: '#6c757d'
        }}
      >
        Loading map...
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      id={mapId}
      style={{ 
        width: '100%', 
        height: '400px',
        borderRadius: '0.25rem',
        border: '1px solid #ced4da'
      }}
    />
  );
}
