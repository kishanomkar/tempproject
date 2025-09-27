import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { FiUsers, FiSearch, FiX, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { motion, AnimatePresence } from 'framer-motion';

// --- Color Palette for Tracked Members ---
const MEMBER_COLORS = ['#16a34a', '#ca8a04', '#c026d3', '#2563eb', '#db2777', '#ea580c'];

// --- Enhanced Dynamic Custom Icons ---
const userIcon = new L.DivIcon({
    className: 'user-location-icon',
    html: `<div class="w-6 h-6 bg-blue-500 rounded-full ring-4 ring-white/50 shadow-lg"></div><div class="absolute top-0 left-0 w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

const createMemberIcon = (color, isSelected) => {
    const size = isSelected ? 36 : 28;
    const ring = isSelected ? `ring-4 ring-offset-2 ring-white` : 'ring-2 ring-white';
    return new L.DivIcon({
        className: 'member-location-icon',
        html: `<div class="flex items-center justify-center" style="width:${size}px; height:${size}px;">
                 <div class="absolute w-full h-full rounded-full transition-all" style="background-color: ${color}; opacity: 0.3;"></div>
                 <div class="absolute w-4/5 h-4/5 rounded-full shadow-lg transition-all ${ring}" style="background-color: ${color}; border: 2px solid white;"></div>
               </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
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
    const [selectedMember, setSelectedMember] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const mapRef = useRef();

    // Effect to clear feedback messages after a few seconds
    useEffect(() => {
        if (error || message) {
            const timer = setTimeout(() => {
                setError('');
                setMessage('');
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [error, message]);

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
            mapRef.current.flyTo([lat, lng], 16);
        }
    };

    const removeMember = (smartId) => {
        setTrackedMembers(prev => prev.filter(m => m.smartTouristId !== smartId));
        if (selectedMember?.smartTouristId === smartId) {
            setSelectedMember(null);
        }
    };

    return (
        <div className="relative h-screen w-screen font-sans">
            <MapContainer
                center={[26.9124, 75.7873]}
                zoom={13}
                className="h-full w-full"
                ref={mapRef}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
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

            {/* --- Floating Control Panel --- */}
            <aside className="absolute top-4 left-4 w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl z-[1000] p-6 flex flex-col max-h-[calc(100vh-2rem)]">
                <div className="flex items-center gap-3">
                    <FiUsers className="w-8 h-8 text-blue-600" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Track Your Group</h1>
                        <p className="text-gray-500 text-sm">Find members using their Smart ID or Email.</p>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="mt-6 space-y-4">
                    <InputField label="Smart Tourist ID" id="smartTouristId" value={searchId} onChange={setSearchId} placeholder="e.g., ST-DOM-123456" />
                    <InputField label="Email Address" id="email" value={searchEmail} onChange={setSearchEmail} type="email" placeholder="member@example.com" />
                    <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 transition-colors">
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Searching...
                            </>
                        ) : (
                             <><FiSearch /> Find Member</>
                        )}
                    </button>
                </form>

                <AnimatePresence>
                    {error && <Feedback type="error">{error}</Feedback>}
                    {message && <Feedback type="success">{message}</Feedback>}
                </AnimatePresence>

                <div className="mt-6 flex-grow overflow-y-auto pr-2 -mr-2">
                    {trackedMembers.length > 0 ? (
                        <div className="space-y-3">
                            {trackedMembers.map(member => (
                                <MemberCard key={member.smartTouristId} member={member} isSelected={selectedMember?.smartTouristId === member.smartTouristId} onSelect={handleMemberSelect} onRemove={removeMember} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>No members are being tracked yet.</p>
                            <p className="text-sm">Use the form above to add someone.</p>
                        </div>
                    )}
                </div>
            </aside>
        </div>
    );
}

// --- Helper Components ---
const InputField = ({ label, id, value, onChange, type = 'text', placeholder }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <input type={type} id={id} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
    </div>
);

const Feedback = ({ type, children }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className={`mt-4 p-3 rounded-lg text-sm flex items-center gap-2 ${type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
    >
        {type === 'error' ? <FiAlertCircle /> : <FiCheckCircle />}
        {children}
    </motion.div>
);

const MemberCard = ({ member, isSelected, onSelect, onRemove }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={() => onSelect(member)}
        className={`p-3 rounded-lg flex items-center justify-between gap-3 cursor-pointer transition-all ${isSelected ? 'bg-white ring-2 ring-blue-500 shadow-lg' : 'bg-white/70 hover:bg-white/90'}`}
    >
        <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: member.color }}></span>
            <div className="flex-grow">
                <p className="font-bold text-gray-800">{member.fullname}</p>
            </div>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onRemove(member.smartTouristId); }} className="text-gray-400 hover:text-red-500 p-1 rounded-full">
            <FiX />
        </button>
    </motion.div>
);