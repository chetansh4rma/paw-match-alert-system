
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for missing marker icons in Leaflet
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Delete the default icon
delete L.Icon.Default.prototype._getIconUrl;

// Set the default icon paths explicitly
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
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
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [center, onChange]);

  return <div id="map" style={{ height: '100%', width: '100%' }}></div>;
};

export default LeafletMap;
