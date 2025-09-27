import React, { useEffect, useState, useRef, useMemo } from "react";
import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiCheckCircle, FiCrosshair, FiMapPin, FiShield } from "react-icons/fi";
import { dangerZones } from "../components/Dara"; 
import { getTranscript, getAlert, resetAlert, sendAlert } from "../components/SpeechRecognition";

export let sosAlertFlag = false;
export function setSosAlertFlag(value) {
    sosAlertFlag = value;
}

const userIcon = new L.DivIcon({
    className: 'user-location-icon',
    html: `<div class="w-5 h-5 bg-blue-500 rounded-full ring-4 ring-white shadow-lg"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
});

const warningIcon = new L.DivIcon({
    className: 'warning-icon',
    html: `<div class="text-red-500"><svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 drop-shadow-lg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.983 0a1.502 1.502 0 0 0-1.228.665L.665 19.167a1.5 1.5 0 0 0 1.228 2.333H22.107a1.5 1.5 0 0 0 1.228-2.333L13.21.665A1.502 1.502 0 0 0 11.983 0zM12 17a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-1-4a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H12a1 1 0 0 1-1-1z"/></svg></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});

const normalizeZoneData = (zone) => {
    if (!zone || !isFinite(zone.lat) || !isFinite(zone.lng) || !isFinite(zone.recommended_geofence_meters)) {
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

const LocationTracker = ({ setPosition, setWarning, zones }) => {
    const map = useMapEvents({
        locationfound(e) {
            setPosition(e.latlng);
            let inDangerZone = false;
            zones.forEach(zone => {
                if (e.latlng.distanceTo(L.latLng(zone.center)) < zone.radius) {
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

export default function TrackingMap() {
    const [position, setPosition] = useState(null);
    const [activeWarning, setActiveWarning] = useState(null);
    const [sosAlert, setSosAlert] = useState(false);
    const mapRef = useRef(null);

    const sanitizedZones = useMemo(() =>
        (Array.isArray(dangerZones) ? dangerZones.map(normalizeZoneData).filter(Boolean) : [])
    , []);

    const updateLocation = async (lat, lng) => {
        const token = localStorage.getItem("token");
        localStorage.setItem("lat", lat);
        localStorage.setItem("lng", lng);
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

    useEffect(() => {
        if (position) {
            const interval = setInterval(() => {
                updateLocation(position.lat, position.lng);
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [position]);

    const handleSosClick = () => {
        if (window.confirm("Are you sure you want to send an SOS alert? This action will immediately notify the nearest authorities.")) {
            setSosAlert(true);
            setSosAlertFlag(true);
            sendAlert("SOS Button Triggered");
        }
    };

    const recenterMap = () => {
        if (position && mapRef.current) {
            mapRef.current.flyTo(position, 16);
        }
    };

    const flyToZone = (zone) => {
        if (mapRef.current) {
            mapRef.current.flyTo(zone.center, 15);
        }
    };

    return (
        <div className="h-screen w-screen flex font-sans">
            <AnimatePresence>
                {sosAlert && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-[2000] bg-gradient-to-br from-red-600 to-red-800 flex flex-col items-center justify-center text-white text-center p-8"
                    >
                        <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
                            <FiShield className="w-24 h-24 text-white animate-pulse" />
                        </motion.div>
                        <h1 className="text-5xl md:text-6xl font-bold mt-6">SOS ACTIVATED</h1>
                        <p className="mt-4 text-lg md:text-xl max-w-lg">Your location and details have been shared with the nearest police station. Help is on the way.</p>
                        <button onClick={() => setSosAlert(false)} className="mt-8 px-8 py-3 bg-white text-red-600 font-bold rounded-lg shadow-lg hover:bg-gray-200 transition">
                            Dismiss
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <aside className="w-96 bg-white shadow-lg z-[1000] flex flex-col h-full">
                <header className="p-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold text-gray-800">Safety Compass</h1>
                    <p className="text-sm text-gray-500">Your real-time guide to staying safe.</p>
                </header>

                <div className="p-6 space-y-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeWarning ? 'warning' : 'safe'}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`p-4 rounded-lg border-l-4 ${activeWarning ? 'bg-yellow-50 border-yellow-400' : 'bg-green-50 border-green-400'}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`flex-shrink-0 text-2xl ${activeWarning ? 'text-yellow-500' : 'text-green-500'}`}>
                                    {activeWarning ? <FiAlertTriangle /> : <FiCheckCircle />}
                                </div>
                                <div>
                                    <h2 className="font-bold text-gray-800">{activeWarning ? "Warning Zone Entered" : "You are in a Safe Zone"}</h2>
                                    <p className="text-sm text-gray-600">{activeWarning ? activeWarning.name : "Continue to be aware of your surroundings."}</p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <button
                        onClick={handleSosClick}
                        className="w-full py-4 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <FiShield size={20} />
                        ACTIVATE SOS
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto border-t border-gray-200">
                    <h3 className="p-4 text-sm font-semibold text-gray-500 uppercase tracking-wider bg-gray-50">Known Danger Zones</h3>
                    <ul className="divide-y divide-gray-200">
                        {sanitizedZones.map(zone => (
                            <li key={zone.id} onClick={() => flyToZone(zone)} className="p-4 hover:bg-gray-100 cursor-pointer">
                                <p className="font-semibold text-gray-800">{zone.name}</p>
                                <p className="text-sm text-gray-600">{zone.reason}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            <main className="flex-grow h-full relative">
                <MapContainer center={[26.9124, 75.7873]} zoom={13} className="h-full w-full" ref={mapRef} zoomControl={false}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {position && <Marker position={position} icon={userIcon}><Popup>You are here.</Popup></Marker>}
                    
                    {sanitizedZones.map(zone => (
                        <React.Fragment key={zone.id}>
                            <Circle center={zone.center} radius={zone.radius} pathOptions={{ color: "#ef4444", fillColor: '#ef4444', fillOpacity: 0.1, weight: 1.5 }} />
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
                <button
                    onClick={recenterMap}
                    title="Recenter Map"
                    className="absolute top-4 right-4 z-[1000] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200 transition"
                >
                    <FiCrosshair className="w-6 h-6 text-gray-700" />
                </button>
            </main>
        </div>
    );
}