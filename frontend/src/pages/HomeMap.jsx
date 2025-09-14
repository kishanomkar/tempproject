import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState } from 'react';
import L from 'leaflet';

export default function HomeMap() {
  const [position, setPosition] = useState([28.6139, 77.2090]); // Dilli ki location hai with danger jone
  const [insideDanger, setInsideDanger] = useState(false);

  // Ye danger jone ka cicle hai abhu uhi example lagaya hau
  const dangerZone = {
    center: [28.615, 77.21],     //Yaha live location appan api se track karenge(geolocation API)
    radius: 500 // in meters
  };

  // User location tarcking 
  function LocationTracker() {
    useMapEvents({
      locationfound(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);

        const distance = L.latLng(e.latlng).distanceTo(L.latLng(dangerZone.center));
        setInsideDanger(distance <= dangerZone.radius);
      },
    });
    return null;
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={position}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        {/* free tiles from OpenStreetMap */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* user marker */}
        <Marker position={position}>
          <Popup>You are here</Popup>
        </Marker>

        {/* danger zone circle */}
        <Circle
          center={dangerZone.center}
          radius={dangerZone.radius}
          pathOptions={{ color: "red", fillOpacity: 0.2 }}
        />

        <LocationTracker />
      </MapContainer>

      {/* Banner if inside danger zone */}
      {insideDanger && (
        <div style={{
          position: "absolute", bottom: 20, left: 20, right: 20,
          padding: "12px 16px", background: "rgba(255,0,0,0.9)",
          color: "white", borderRadius: "8px", textAlign: "center"
        }}>
          ⚠️ Heads up! You’ve entered a high-risk zone.
        </div>
      )}
    </div>
  );
}
