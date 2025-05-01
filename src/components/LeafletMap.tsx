
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing marker icons in Leaflet
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Set the default icon paths explicitly
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

interface LeafletMapProps {
  center: [number, number];
  onChange: (lat: number, lng: number) => void;
}

const LeafletMap = ({ center, onChange }: LeafletMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    // Initialize map if it doesn't exist yet
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView(center, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);

      // Create the marker with a draggable option
      markerRef.current = L.marker(center, { draggable: true }).addTo(mapRef.current);

      // Add drag end event to update location
      markerRef.current.on('dragend', function() {
        const position = markerRef.current?.getLatLng();
        if (position) {
          onChange(position.lat, position.lng);
        }
      });

      // Automatically update location when map is clicked
      mapRef.current.on('click', function(e) {
        const clickPos = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng(clickPos);
        }
        onChange(clickPos.lat, clickPos.lng);
      });

      // Watch for location changes
      mapRef.current.locate({
        setView: true,
        maxZoom: 16,
        enableHighAccuracy: true,
        watch: true
      });

      // When location is found, update marker and center
      mapRef.current.on('locationfound', function(e) {
        const pos = e.latlng;
        if (markerRef.current) {
          markerRef.current.setLatLng(pos);
        }
        // Only trigger onChange when the location is first found to avoid continuous updates
        if (!locationFoundRef.current) {
          onChange(pos.lat, pos.lng);
          locationFoundRef.current = true;
        }
      });
    } else {
      // Update map view and marker position if center changes
      mapRef.current.setView(center);
      if (markerRef.current) {
        markerRef.current.setLatLng(center);
      }
    }

    // Cleanup function
    return () => {
      if (mapRef.current) {
        mapRef.current.stopLocate();
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [center, onChange]);

  // Track if location has been found already
  const locationFoundRef = useRef(false);

  return <div id="map" style={{ height: '100%', width: '100%' }}></div>;
};

export default LeafletMap;
