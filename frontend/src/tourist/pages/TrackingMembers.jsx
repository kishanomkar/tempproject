import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';


// --- Color Palette for Tracked Members ---
const MEMBER_COLORS = ['#16a34a', '#ca8a04', '#c026d3', '#2563eb', '#db2777', '#ea580c'];

// --- Dynamic Custom Icons ---
// Icon for the current user (you)
const userIcon = new L.DivIcon({
  className: 'user-location-icon',
  html: `<div class="pulsating-circle bg-blue-600 border-2 border-white"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Function to generate a unique, colored icon for each family member
const createMemberIcon = (color, isSelected) => {
  const size = isSelected ? 'w-8 h-8' : 'w-6 h-6';
  const animation = isSelected ? 'animate-ping opacity-75' : '';
  const zIndex = isSelected ? 'z-10' : 'z-0';
  
  return new L.DivIcon({
    className: 'member-location-icon',
    html: `
      <div class="relative ${size} ${zIndex}">
        <div class="absolute top-0 left-0 ${size} rounded-full" style="background-color: ${color}; opacity: 0.5;"></div>
        <div class="absolute top-0 left-0 ${size} rounded-full ${animation}" style="background-color: ${color};"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
      </div>
    `,
    iconSize: [isSelected ? 32 : 24, isSelected ? 32 : 24],
    iconAnchor: [isSelected ? 16 : 12, isSelected ? 16 : 12],
  });
};

// --- Child Component: LocationTracker (for the user's own location) ---
const LocationTracker = ({ setPosition }) => {
  const map = useMapEvents({
    locationfound: (e) => setPosition(e.latlng),
    locationerror: (e) => console.error("Location error:", e.message),
  });

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16, watch: true });
  }, [map]);

  return null;
};

// --- Main TrackingMembers Component ---
export default function TrackingMembers() {
  const [userPosition, setUserPosition] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [trackedMembers, setTrackedMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null); // To track the selected member
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const mapRef = React.useRef();

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('http://localhost:4000/api/tourist/find-member', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ smartTouristId: searchId, email: searchEmail }),
        credentials: 'include',
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setTrackedMembers(prevMembers => {
        const isAlreadyTracked = prevMembers.some(m => m.smartTouristId === data.member.smartTouristId);
        if (isAlreadyTracked) {
          setMessage(`${data.member.fullname} is already on your map.`);
          return prevMembers;
        }
        // Assign a color from the palette
        const newMember = { ...data.member, color: MEMBER_COLORS[prevMembers.length % MEMBER_COLORS.length] };
        setMessage(`${newMember.fullname} has been added to your map.`);
        return [...prevMembers, newMember];
      });

      setSearchId('');
      setSearchEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMemberSelect = (member) => {
    setSelectedMember(member);
    if (mapRef.current && member.location?.coordinates) {
      const [lng, lat] = member.location.coordinates;
      mapRef.current.flyTo([lat, lng], 16); // Zoom to member
    }
  };

  const removeMember = (smartId) => {
    setTrackedMembers(prev => prev.filter(m => m.smartTouristId !== smartId));
    if (selectedMember?.smartTouristId === smartId) {
      setSelectedMember(null);
    }
  };


  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* --- Search and Control Panel --- */}
      <aside className="w-96 bg-white p-6 shadow-lg z-10 flex flex-col">
        <h1 className="text-3xl font-bold text-slate-800">Track Members</h1>
        <p className="text-slate-500 mt-2">Find and select family members to highlight them on the map.</p>

        <form onSubmit={handleSearch} className="mt-8 space-y-4">
          <InputField label="Smart Tourist ID" id="smartTouristId" value={searchId} onChange={setSearchId} placeholder="e.g., ST-DOM-123456" />
          <InputField label="Email Address" id="email" value={searchEmail} onChange={setSearchEmail} type="email" placeholder="member@example.com" />
          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 rounded-lg font-bold text-white bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400">
            {isLoading ? 'Searching...' : 'Find Member'}
          </button>
        </form>

        <div className="mt-4 flex-grow overflow-y-auto">
          {error && <Feedback type="error">{error}</Feedback>}
          {message && <Feedback type="success">{message}</Feedback>}
          
          {trackedMembers.length > 0 && (
            <div className="mt-4">
              <h2 className="font-bold text-slate-700">Tracked Members ({trackedMembers.length})</h2>
              <ul className="mt-2 space-y-2">
                {trackedMembers.map(member => (
                  <li 
                    key={member.smartTouristId} 
                    onClick={() => handleMemberSelect(member)}
                    className={`p-3 rounded-md flex items-center justify-between gap-3 cursor-pointer transition-all ${selectedMember?.smartTouristId === member.smartTouristId ? 'bg-blue-100 ring-2 ring-blue-500' : 'bg-slate-50 hover:bg-slate-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: member.color }}></span>
                      <span className="font-medium">{member.fullname}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); removeMember(member.smartTouristId); }} className="text-slate-400 hover:text-red-500 text-xs font-bold">X</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>

      {/* --- Map Display --- */}
      <div className="flex-grow h-full">
        <MapContainer center={[26.9124, 75.7873]} zoom={13} className="h-full w-full" ref={mapRef}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>' />
          <LocationTracker setPosition={setUserPosition} />
          {userPosition && <Marker position={userPosition} icon={userIcon}><Popup>You are here.</Popup></Marker>}

          {trackedMembers.map(member => (
            <Marker
              key={member.smartTouristId}
              position={[member.location.coordinates[1], member.location.coordinates[0]]}
              icon={createMemberIcon(member.color, selectedMember?.smartTouristId === member.smartTouristId)}
              eventHandlers={{ click: () => handleMemberSelect(member) }}
            >
              <Popup>{member.fullname}'s location</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}

// --- Helper Components ---
const InputField = ({ label, id, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-slate-600">{label}</label>
    <input type={type} id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm" />
  </div>
);

const Feedback = ({ type, children }) => {
  const baseClasses = "p-3 rounded-md";
  const typeClasses = type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700';
  return <div className={`${baseClasses} ${typeClasses}`}>{children}</div>;
};
