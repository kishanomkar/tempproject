import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
// Note: You will need to create and provide these speech recognition functions
// import { startListening, stopListening, getTranscript, resetAlert } from "../components/SpeechRecognition"; 
import { dangerZones } from "../components/Dara"; 

// --- Custom Icons ---
const userIcon = new L.DivIcon({
  className: 'user-location-icon',
  html: `<div class="pulsating-circle bg-blue-500"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const warningIcon = new L.DivIcon({ 
  className: 'warning-icon',
  html: `<svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
           <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.031-1.742 3.031H4.42c-1.532 0-2.492-1.697-1.742-3.031l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"></path>
         </svg>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// --- Data Normalization ---
// This function converts your new JSON structure into the format Leaflet expects.
const normalizeZoneData = (zone) => {
  if (!zone || !isFinite(zone.lat) || !isFinite(zone.lng) || !isFinite(zone.recommended_geofence_meters)) {
    console.warn("Skipping invalid danger zone data:", zone);
    return null;
  }
  return {
    id: zone.id,
    name: zone.name,
    center: [zone.lat, zone.lng],
    radius: zone.recommended_geofence_meters,
    reason: zone.reason,
    severity: zone.severity,
  };
};

// --- Child Component: LocationTracker ---
const LocationTracker = ({ setPosition, setWarning, zones }) => {
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());

      const userLatLng = e.latlng;
      let inDangerZone = false;
      
      zones.forEach(zone => {
        const zoneLatLng = L.latLng(zone.center);
        if (userLatLng.distanceTo(zoneLatLng) < zone.radius) {
          setWarning(zone);
          inDangerZone = true;
        }
      });
      if (!inDangerZone) setWarning(null);
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
  const [isListening, setIsListening] = useState(false);
  const [sosAlert, setSosAlert] = useState(false);
  const mapRef = useRef(null);

  // Memoize the sanitized zones to prevent re-calculation on every render
  const sanitizedZones = useMemo(() => 
      (Array.isArray(dangerZones) ? dangerZones.map(normalizeZoneData).filter(Boolean) : [])
  , []);

  // Send location to the backend
  const updateLocation = async (lat, lng) => {
    try {
      const response = await fetch('http://localhost:4000/api/tourist/update-location', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to update location:", data.message);
      }
    } catch (error) {
      console.error("Error sending location update:", error);
    }
  };

  // Effect for sending location updates periodically
  useEffect(() => {
    if (position) {
      const interval = setInterval(() => {
        updateLocation(position.lat, position.lng);
      }, 10000); // every 10 seconds
      return () => clearInterval(interval);
    }
  }, [position]);

  // --- SOS & Speech Recognition Logic ---
  const handleSosClick = () => {
    if (isListening) {
      // stopListening(); // From your speech recognition utility
      setIsListening(false);
    } else {
      // startListening(); // From your speech recognition utility
      setIsListening(true);
      setSosAlert(false); // Reset any previous alert
    }
  };

  // Mock listening for "help" for demonstration
  useEffect(() => {
    let helpTimeout;
    if (isListening) {
      console.log("Listening for the word 'help'...");
      // In a real app, you would get this from your SpeechRecognition utility's transcript
      helpTimeout = setTimeout(() => {
        console.log("Detected 'help' command!");
        setSosAlert(true);
        setIsListening(false);
        // stopListening();
      }, 4000); // Simulate detecting "help" after 4 seconds
    }
    return () => clearTimeout(helpTimeout);
  }, [isListening]);


  const recenterMap = () => {
    if (position && mapRef.current) {
      mapRef.current.flyTo(position, 16);
    }
  };

  return (
    <div className="h-screen w-full relative font-sans">
      
      {/* --- Overlays: Warnings and Alerts --- */}
      {activeWarning && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] p-4 bg-yellow-400 text-yellow-900 rounded-lg shadow-2xl max-w-md text-center border border-yellow-500">
          <h3 className="font-bold text-lg">⚠️ Entering Warning Zone</h3>
          <p className="font-semibold">{activeWarning.name}</p>
          <p className="text-sm mt-1">{activeWarning.reason}</p>
        </div>
      )}

      {sosAlert && (
        <div className="absolute inset-0 z-[2000] bg-red-600/90 flex flex-col items-center justify-center text-white text-center p-8">
          <h1 className="text-6xl font-bold animate-pulse">SOS ACTIVATED</h1>
          <p className="mt-4 text-xl">Your location and details have been shared with the nearest police station.</p>
          <p className="mt-2">Help is on the way.</p>
          <button onClick={() => setSosAlert(false)} className="mt-8 px-6 py-3 bg-white text-red-600 font-bold rounded-lg shadow-lg">
            Dismiss
          </button>
        </div>
      )}

      <MapContainer center={[26.9124, 75.7873]} zoom={13} className="h-full w-full" ref={mapRef}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {position && <Marker position={position} icon={userIcon}><Popup>You are here.</Popup></Marker>}
        
        {sanitizedZones.map(zone => (
          <React.Fragment key={zone.id}>
            <Circle center={zone.center} radius={zone.radius} pathOptions={{ color: "red", fillColor: 'red', fillOpacity: 0.1, weight: 1.5 }} />
            <Marker position={zone.center} icon={warningIcon}>
              <Popup>
                <div className="font-bold text-base">{zone.name}</div>
                <div className="text-sm mt-1"><strong>Reason:</strong> {zone.reason}</div>
                <div className="text-sm mt-1"><strong>Severity:</strong> {zone.severity}/5</div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        <LocationTracker setPosition={setPosition} setWarning={setActiveWarning} zones={sanitizedZones} />
      </MapContainer>

      {/* --- On-Map UI Controls --- */}
      <div className="absolute bottom-6 right-6 z-[1000] flex flex-col gap-4">
        <button onClick={recenterMap} title="Recenter Map" className="bg-white p-3 rounded-full shadow-lg hover:bg-slate-100 transition">
          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>

        <button 
          onClick={handleSosClick} 
          title="SOS Alert"
          className={`p-4 rounded-full shadow-lg transition ${isListening ? 'bg-red-600 text-white animate-pulse' : 'bg-red-500 text-white hover:bg-red-600'}`}
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414m-1.414-1.414l1.414 1.414M12 3v2m2.828.172l-1.414 1.414M5.636 5.636l1.414 1.414M3 12h2m.172 2.828l1.414-1.414M12 21v-2m-2.828-.172l1.414-1.414m8.486-8.486l-1.414-1.414M21 12h-2m-.172-2.828l-1.414 1.414"></path>
          </svg>
           <span className="font-bold text-lg">SOS</span>
        </button>
      </div>
    </div>
  );
}
