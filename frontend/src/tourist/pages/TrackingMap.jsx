import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";

export default function TrackingMap() {
  const [currentLocation, setCurrentLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [position, setPosition] = useState([28.6139, 77.2090]); // Default: Delhi
  const [insideDanger, setInsideDanger] = useState(false);

  // Get initial location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Define danger zone (example circle near Delhi)
  const dangerZone = {
    center: [28.615, 77.21],
    radius: 500, // meters
  };

  // Track user live location
  function LocationTracker() {
    const map = useMapEvents({
      locationfound(e) {
        const newPos = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);

        const distance = L.latLng(e.latlng).distanceTo(L.latLng(dangerZone.center));
        setInsideDanger(distance <= dangerZone.radius);
      },
    });

    useEffect(() => {
      map.locate({ watch: true, setView: true, enableHighAccuracy: true });
    }, [map]);

    return null;
  }

  useEffect(() => {
    getLocation();
  }, []);

  return (
<div className="h-screen w-screen relative">
      <MapContainer
        center={
          currentLocation.latitude
            ? [currentLocation.latitude, currentLocation.longitude]
            : position
        }
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User marker */}
        {currentLocation.latitude && currentLocation.longitude && (
          <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Danger zone circle */}
        <Circle
          center={dangerZone.center}
          radius={dangerZone.radius}
          pathOptions={{ color: "red", fillOpacity: 0.2 }}
        />

        <LocationTracker />
      </MapContainer>

      {/* Banner if inside danger zone */}
      {insideDanger && (
        <div
          style={{
            position: "absolute",
            bottom: 20,
            left: 20,
            right: 20,
            padding: "12px 16px",
            background: "rgba(255,0,0,0.9)",
            color: "white",
            borderRadius: "8px",
            textAlign: "center",
          }}
        >
          ⚠️ Heads up! You’ve entered a high-risk zone.
        </div>
      )}
    </div>
  );
}
