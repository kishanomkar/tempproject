import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';

// --- Configuration ---
const dangerZones = [
  { id: 1, center: [26.9180, 75.8270], radius: 300, name: "Johari Bazaar Area", message: "You are entering a highly crowded market area. Please be mindful of your belongings." },
  { id: 2, center: [26.9239, 75.8267], radius: 400, name: "Hawa Mahal Complex", message: "This is a major tourist hotspot. Expect large crowds and heavy traffic." },
  { id: 3, center: [26.9128, 75.7873], radius: 500, name: "Jaipur Railway Station Area", message: "Be cautious in this busy transit hub. Watch out for pickpockets and unofficial guides." }
];

// --- Custom Icons ---
const userIcon = new L.DivIcon({
  className: 'user-location-icon',
  html: '<div class="pulsating-circle bg-blue-500"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const warningIcon = new L.DivIcon({
  className: 'warning-icon',
  html: '<svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.031-1.742 3.031H4.42c-1.532 0-2.492-1.697-1.742-3.031l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// --- Location Tracker Component ---
const LocationTracker = ({ setPosition, setWarning }) => {
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());

      const userLatLng = e.latlng;
      let inDangerZone = false;
      dangerZones.forEach(zone => {
        const zoneLatLng = L.latLng(zone.center);
        if (userLatLng.distanceTo(zoneLatLng) < zone.radius) {
          setWarning(zone);
          inDangerZone = true;
        }
      });
      if (!inDangerZone) {
        setWarning(null);
      }
    },
    locationerror(e) {
      console.error("Location error:", e.message);
    }
  });

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16, watch: true, enableHighAccuracy: true });
  }, [map]);

  return null;
};

// --- Main TrackingMap Component ---
export default function TrackingMap() {
  const [position, setPosition] = useState(null);
  const [activeWarning, setActiveWarning] = useState(null);
  const mapRef = useRef();

  // Function to send location updates to the backend
  const updateLocation = async (lat, lng) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourist/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
        credentials: 'include', // Important for sending the auth cookie
      });
      const data = await response.json();
      if (response.ok) {
        console.log("Location updated successfully:", data.location);
      } else {
        console.error("Failed to update location:", data.message);
      }
    } catch (error) {
      console.error("Error sending location update:", error);
    }
  };

  // Use an effect to periodically send the location
  useEffect(() => {
    if (position) {
      // Send location immediately when it's first found
      updateLocation(position.lat, position.lng);

      // Then set up an interval to send it every 10 seconds
      const interval = setInterval(() => {
        updateLocation(position.lat, position.lng);
      }, 10000); // 10 seconds

      // Clean up the interval when the component unmounts or position changes
      return () => clearInterval(interval);
    }
  }, [position]);


  const recenterMap = () => {
    if (position && mapRef.current) {
      mapRef.current.flyTo(position, 16);
    }
  };

  return (
    <div className="h-screen w-full relative">
      {activeWarning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] p-4 bg-yellow-300 text-yellow-900 rounded-lg shadow-lg max-w-md text-center">
          <h3 className="font-bold text-lg">{activeWarning.name}</h3>
          <p>{activeWarning.message}</p>
        </div>
      )}

      <MapContainer
        center={[26.9124, 75.7873]} // Default center (Jaipur)
        zoom={13}
        className="h-full w-full"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {position && <Marker position={position} icon={userIcon}><Popup>You are here.</Popup></Marker>}

        {dangerZones.map(zone => (
          <React.Fragment key={zone.id}>
            <Circle
              center={zone.center}
              radius={zone.radius}
              pathOptions={{ color: "red", fillColor: 'red', fillOpacity: 0.1, weight: 1.5 }}
            />
            <Marker position={zone.center} icon={warningIcon}>
              <Popup>
                <div className="font-bold">{zone.name}</div>
                <div className="text-sm">{zone.message}</div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        <LocationTracker setPosition={setPosition} setWarning={setActiveWarning} />
      </MapContainer>

      <div className="absolute top-4 right-4 z-[1000]">
        <button onClick={recenterMap} className="bg-white p-3 rounded-full shadow-lg hover:bg-slate-100 transition">
          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}