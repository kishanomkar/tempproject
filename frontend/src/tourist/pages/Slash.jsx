import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN; // Replace with your token

// --- Helper Icon Components ---
const Icon = ({ path, className = "w-8 h-8" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

// --- Reusable Card Component ---
const ActionCard = ({ title, description, icon, onClick, bgColor = 'bg-blue-500' }) => (
    <button
        onClick={onClick}
        className="w-full text-left p-6 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out border border-gray-200"
    >
        <div className={`p-3 rounded-full inline-block ${bgColor}`}>
            {icon}
        </div>
        <h3 className="mt-4 text-lg font-bold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
    </button>
);

// --- Main Dashboard Component ---
const SlashHome = () => {
    const navigate = useNavigate();
    const [tourist, setTourist] = useState({ fullname: "Guest" }); // Mock data, replace with actual fetch
    const [weather, setWeather] = useState({ temp: "28", condition: "Sunny" }); // Mock data
    
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [userLocation, setUserLocation] = useState({ lng: 75.7873, lat: 26.9124 }); // Default to Jaipur

    // --- MOCK: Fetch tourist data (replace with your actual API call) ---
    useEffect(() => {
        // Example: const fetchedTourist = await api.getTouristProfile();
        // setTourist(fetchedTourist);
        setTourist({ fullname: "Alexandra" }); // Placeholder
    }, []);
    
    // --- Initialize Map ---
    useEffect(() => {
        if (map.current) return;
        
        // Get user's current location
        navigator.geolocation.getCurrentPosition(position => {
            const { longitude, latitude } = position.coords;
            setUserLocation({ lng: longitude, lat: latitude });
            
            map.current = new mapboxgl.Map({
                container: mapContainer.current,
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [longitude, latitude],
                zoom: 14
            });

            // Add a marker for the user's location
            new mapboxgl.Marker({ color: '#3b82f6' })
                .setLngLat([longitude, latitude])
                .addTo(map.current);

        }, () => { console.error("Could not get user location.")}, { enableHighAccuracy: true });

    }, []);

    const handleSosClick = async () => {
        console.log("SOS button clicked!");
        // This would call the same backend endpoint as your "SendAlert" form
        // await fetch("http://localhost:3000/api/alerts/send", { ... });
        alert("SOS signal sent! Help is on the way. Please stay where you are.");
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* --- Header --- */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">
                        Welcome back, {tourist.fullname}!
                    </h1>
                    <p className="text-gray-600 mt-2">
                        It's <strong>{weather.temp}°C</strong> and {weather.condition} in Jaipur today. Enjoy your stay!
                    </p>
                </header>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- Left Column: Map and SOS --- */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Location</h2>
                            <div ref={mapContainer} className="h-96 rounded-lg" />
                        </div>
                        
                        <div className="bg-red-600 p-8 rounded-xl shadow-lg text-white text-center">
                            <h2 className="text-2xl font-bold">Emergency Assistance</h2>
                            <p className="mt-2 opacity-90">Press the button below only in a real emergency. Your location will be sent to the nearest police unit.</p>
                            <button 
                                onClick={handleSosClick}
                                className="mt-6 bg-white text-red-600 font-bold text-lg px-10 py-4 rounded-full shadow-xl hover:bg-red-50 transition-transform duration-200 ease-in-out hover:scale-105"
                            >
                                SEND SOS SIGNAL
                            </button>
                        </div>
                    </div>
                    
                    {/* --- Right Column: Quick Actions --- */}
                    <div className="space-y-6">
                        <ActionCard
                            title="My Profile"
                            description="View and manage your personal and travel details."
                            icon={<Icon path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" className="w-6 h-6 text-white" />}
                            onClick={() => navigate('/home/profile')}
                            bgColor="bg-blue-500"
                        />
                        <ActionCard
                            title="Official Alerts"
                            description="Check for safety alerts and updates from local authorities."
                            icon={<Icon path="M10 2a6 6 0 00-6 6c0 4.167 6 12 6 12s6-7.833 6-12a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" className="w-6 h-6 text-white" />}
                            onClick={() => navigate('/home/alerts')}
                            bgColor="bg-yellow-500"
                        />
                         <ActionCard
                            title="Find Help Nearby"
                            description="Locate police stations, hospitals, and embassies."
                            icon={<Icon path="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" className="w-6 h-6 text-white" />}
                            onClick={() => navigate('/home/emergency')}
                            bgColor="bg-green-500"
                        />
                        <ActionCard
                            title="Local Guide"
                            description="Explore tips, cultural etiquette, and must-visit places."
                            icon={<Icon path="M12 6.253v11.494m-9-5.747h18" className="w-6 h-6 text-white" />}
                            onClick={() => navigate('/home/chatbot')}
                            bgColor="bg-indigo-500"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlashHome;