import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { useNavigate } from 'react-router-dom';

// Function to fetch tourists from the backend
const getTourists = async () => {
  try {
    const response = await fetch('http://localhost:3000/total-tourist', {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      return data; // { foreignTourists, domesticTourists }
    } else {
      throw new Error(data.message || 'Failed to fetch tourists');
    }
  } catch (error) {
    console.error('Error fetching tourists:', error);
    throw error;
  }
};

// Function to update tourist's location
const updateMyLocation = async (id, lat, lng) => {
  try {
    const response = await fetch(`http://localhost:3000/tourist/update-location/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ lat, lng })
    });

    const data = await response.json();
    if (response.ok) {
      console.log(`Location updated for ${id}:`, data.location);
    } else {
      throw new Error(data.message || 'Failed to update location');
    }
  } catch (error) {
    console.error(`Error updating location for ${id}:`, error);
  }
};

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

export default function TouristDashboard() {
  const [hoveredTourist, setHoveredTourist] = useState(null);
  const [currentLocation, setCurrentLocation] = useState({ latitude: null, longitude: null });
  const [tourists, setTourists] = useState([]); // Combined tourists
  const [markers, setMarkers] = useState([]); // For cleanup of markers
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const defaultPosition = [77.2090, 28.6139]; // fallback [lng, lat]

  // Get current location using Geolocation API
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Error fetching location:", err);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Fetch tourists from backend and combine them into one list
  const fetchTourists = async () => {
    try {
      const data = await getTourists();
      const combinedTourists = [
        ...data.foreignTourists.map(t => ({ ...t, type: 'Foreign' })),
        ...data.domesticTourists.map(t => ({ ...t, type: 'Domestic' }))
      ];
      setTourists(combinedTourists);
    } catch (error) {
      console.error('Failed to load tourists:', error);
    }
  };

  // Fetch location and tourists on component mount
  useEffect(() => {
    getLocation();
    fetchTourists();
  }, []);

  // Periodically update location for all tourists every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentLocation.latitude && currentLocation.longitude && tourists.length > 0) {
        tourists.forEach(tourist => {
          if (tourist._id) {
            updateMyLocation(tourist._id, currentLocation.latitude, currentLocation.longitude);
          }
        });
      }
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
  }, [currentLocation, tourists]);

  // Initialize map only once
  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: defaultPosition,
        zoom: 12,
      });
    }
  }, []);

  // Update map view and markers when tourists or location change
  useEffect(() => {
    if (mapRef.current && currentLocation.latitude && currentLocation.longitude) {
      mapRef.current.flyTo({
        center: [currentLocation.longitude, currentLocation.latitude],
        zoom: 14,
        speed: 1.2,
        curve: 1,
      });
    }

    // Remove old markers
    markers.forEach(marker => marker.remove());
    const newMarkers = [];

    // Add markers for all tourists with valid location
    tourists.forEach((tourist) => {
      if (tourist.location && tourist.location.lat != null && tourist.location.lng != null) {
        const el = document.createElement('div');
        el.className = 'w-4 h-4 bg-red-500 rounded-full cursor-pointer hover:ring-2 hover:ring-red-400';
        el.style.boxShadow = '0 0 4px #333';
        el.addEventListener('mouseenter', () => setHoveredTourist(tourist));
        el.addEventListener('mouseleave', () => setHoveredTourist(null));
        el.addEventListener('click', () => navigate(`/tourist/${tourist._id}`));

        const marker = new mapboxgl.Marker(el)
          .setLngLat([tourist.location.lng, tourist.location.lat])
          .addTo(mapRef.current);

        newMarkers.push(marker);
      }
    });

    setMarkers(newMarkers);

    // Cleanup on unmount or before re-rendering
    return () => {
      newMarkers.forEach(marker => marker.remove());
    };
  }, [tourists, currentLocation, navigate]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Map Area */}
      <div className="lg:w-2/3 bg-gray-100 p-6 border-r border-gray-300">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Map of area under police station</h3>
        <div
          ref={mapContainer}
          className="relative h-[590px] bg-white border border-gray-300 rounded-md overflow-hidden"
        />
      </div>

      {/* Right Panel - Profile */}
      <div className="lg:w-1/3 bg-white p-6 space-y-6">
        <div className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">Tourist Profile</h3>
          {hoveredTourist ? (
            <div className="text-gray-600 space-y-2">
              <p><span className="font-medium">Name:</span> {hoveredTourist.fullname}</p>
              <p><span className="font-medium">Type:</span> {hoveredTourist.type}</p>
              <p><span className="font-medium">Latitude:</span> {hoveredTourist.location.lat.toFixed(5)}</p>
              <p><span className="font-medium">Longitude:</span> {hoveredTourist.location.lng.toFixed(5)}</p>
            </div>
          ) : (
            <p className="text-gray-500">Hover over a tourist dot to see details</p>
          )}
        </div>
      </div>
    </div>
  );
}
