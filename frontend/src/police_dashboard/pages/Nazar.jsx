import React, { useState, useRef, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom';

// It's good practice to place styles in a separate CSS file,
// but for this self-contained example, we'll inject them here.
const MarkerStyles = () => (
  <style>{`
    .marker {
      background-size: cover;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid #fff;
      box-shadow: 0 0 0 2px var(--marker-color, #3b82f6), 0 4px 6px rgba(0,0,0,0.1);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
    }

    .marker::after {
        content: '';
        position: absolute;
        border-radius: 50%;
        width: 100%;
        height: 100%;
        animation: pulse 1.75s infinite cubic-bezier(0.66, 0, 0, 1);
        /* The glow size is now controlled by a CSS variable */
        box-shadow: 0 0 0 var(--pulse-max-size, 12px) var(--marker-color, #3b82f6);
    }

    .marker-domestic {
      --marker-color: #3b82f6; /* Blue-500 */
      background-color: #3b82f6;
    }

    .marker-foreign {
      --marker-color: #f97316; /* Orange-500 */
      background-color: #f97316;
    }

    @keyframes pulse {
      to {
        /* We animate the box-shadow to a transparent state */
        box-shadow: 0 0 0 var(--pulse-max-size, 0px) rgba(255, 255, 255, 0);
      }
    }
  `}</style>
);


// Set your Mapbox access token here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN; // ⚠️ IMPORTANT: Replace with your actual token


/**
 * Fetches all tourist data from the secure police backend endpoint.
 */
const getTourists = async () => {
  try {
    const response = await fetch('http://localhost:3000/police/total-tourist', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      const foreign = data.foreignTourists.map(t => ({ ...t, type: 'Foreign' }));
      const domestic = data.domesticTourists.map(t => ({ ...t, type: 'Domestic' }));
      return [...foreign, ...domestic];
    } else {
      throw new Error(data.message || 'Failed to fetch tourist data');
    }
  } catch (error) {
    console.error('Error fetching tourist data:', error);
    return []; // Return an empty array on error
  }
};


export default function Nazar() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [tourists, setTourists] = useState([]);
    const [hoveredTourist, setHoveredTourist] = useState(null);
    const navigate = useNavigate();
    // This ref will now store both the marker instance and its HTML element
    const markersRef = useRef([]);

    // NEW: Function to dynamically update glow size based on zoom
    const updateGlowSize = useCallback(() => {
        if (!map.current) return;
        const zoom = map.current.getZoom();
        // Simple formula to decrease size on zoom out.
        // You can tweak these numbers to change the scaling behavior.
        const maxSize = Math.max(4, 28 - zoom * 1.5);
        
        markersRef.current.forEach(markerItem => {
            if (markerItem.element) {
                markerItem.element.style.setProperty('--pulse-max-size', `${maxSize}px`);
            }
        });
    }, []);


    // Function to update markers on the map
    const updateMarkers = useCallback((touristsData) => {
        if (!map.current) return;
        
        // Remove old markers
        markersRef.current.forEach(markerItem => markerItem.marker.remove());
        markersRef.current = [];

        // Add new markers
        touristsData.forEach(tourist => {
            if (tourist.location?.lat && tourist.location?.lng) {
                const el = document.createElement('div');
                el.className = `marker ${tourist.type === 'Foreign' ? 'marker-foreign' : 'marker-domestic'}`;

                const marker = new mapboxgl.Marker(el)
                    .setLngLat([tourist.location.lng, tourist.location.lat])
                    .addTo(map.current);

                el.addEventListener('mouseenter', () => setHoveredTourist(tourist));
                el.addEventListener('mouseleave', () => setHoveredTourist(null));
                el.addEventListener('click', () => {
                    navigate(`/tourist/${tourist._id}`, { state: { tourist } });
                });
                
                // Store both marker and element for later access
                markersRef.current.push({ marker, element: el });
            }
        });
        
        // Set the initial glow size after markers are added
        updateGlowSize();
    }, [navigate, updateGlowSize]);

    // Effect to initialize the map
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [75.7873, 26.9124], // Jaipur
            zoom: 11
        });

        // NEW: Add user location control to the map
        map.current.addControl(
            new mapboxgl.GeolocateControl({
                positionOptions: { enableHighAccuracy: true },
                trackUserLocation: true,
                showUserHeading: true
            })
        );
        
        // NEW: Add the zoom event listener for dynamic glow
        map.current.on('zoom', updateGlowSize);

        // Cleanup
        return () => {
             map.current.off('zoom', updateGlowSize);
        }

    }, [updateGlowSize]);

    // Effect to fetch tourist data periodically
    useEffect(() => {
        const fetchData = async () => {
            const touristsData = await getTourists();
            setTourists(touristsData);
            updateMarkers(touristsData);
        };

        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [updateMarkers]);


    return (
        <>
            <MarkerStyles />
            <div className="flex h-screen bg-gray-100 font-sans">
                {/* Main Map Area */}
                <div ref={mapContainer} className="flex-grow h-full" />

                {/* Sidebar */}
                <aside className="w-96 bg-white shadow-2xl flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">NAZAR</h1>
                        <p className="text-gray-500">Live Tourist Monitoring Dashboard</p>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Stats Card */}
                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                            <p className="text-sm font-medium text-gray-500">Total Monitored Tourists</p>
                            <p className="text-4xl font-bold text-gray-800">{tourists.length}</p>
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow"></span>
                                <p className="text-sm text-gray-600">Domestic</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3.5 h-3.5 rounded-full bg-orange-500 border-2 border-white shadow"></span>
                                <p className="text-sm text-gray-600">Foreign</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-200" />

                    {/* Tourist Information Panel */}
                    <div className="flex-grow p-6 overflow-y-auto">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Tourist Information</h2>
                        {hoveredTourist ? (
                            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h3 className="font-bold text-xl text-gray-900">{hoveredTourist.fullname}</h3>
                                
                                <InfoRow label="Type" value={hoveredTourist.type} />
                                {hoveredTourist.type === 'Foreign' ? (
                                    <>
                                        <InfoRow label="Passport" value={hoveredTourist.passportNumber} />
                                        <InfoRow label="Visa" value={hoveredTourist.visaNumber} />
                                    </>
                                ) : (
                                    <InfoRow label="Aadhar" value={hoveredTourist.aadharNumber} />
                                )}
                                <InfoRow label="Email" value={hoveredTourist.email} />
                                <InfoRow label="Phone" value={hoveredTourist.phoneNumber} />
                                <InfoRow label="Last Update" value={new Date(hoveredTourist.updatedAt).toLocaleString()} />
                            </div>
                        ) : (
                            <div className="text-center py-10 px-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <p className="text-gray-500">Hover over a tourist on the map to see their details.</p>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </>
    );
}

// A small helper component to keep the info display clean and consistent
const InfoRow = ({ label, value }) => (
    <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
    </div>
);