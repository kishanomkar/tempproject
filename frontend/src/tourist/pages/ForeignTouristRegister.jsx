import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";

// A custom hook for fetching and watching the user's geolocation.
// This encapsulates the location logic and makes it reusable.
const useLocation = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
    const [permissionState, setPermissionState] = useState('prompt'); // 'prompt', 'granted', 'denied'

    useEffect(() => {
        // Check initial permission status if the browser supports it
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setPermissionState(result.state);
                result.onchange = () => {
                    setPermissionState(result.state);
                };
            });
        }
    }, []);
    
    // Using a ref to store the watchId to avoid issues with stale closures in useEffect
    const watchId = React.useRef(null);

    const handleSuccess = (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setError(null);
    };

    const handleError = (err) => {
        setError(err.message);
    };

    const startWatching = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setPermissionState('denied');
            return;
        }

        // If permission is already granted, start watching immediately.
        if (permissionState === 'granted' && watchId.current === null) {
             watchId.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
                 enableHighAccuracy: true,
                 timeout: 5000,
                 maximumAge: 0,
             });
        }
    }, [permissionState]);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        // This single call will prompt for permission and get the current position.
        // The watch will start automatically if permission becomes 'granted' via the effect.
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    };

    useEffect(() => {
        if (permissionState === 'granted') {
            startWatching();
        }

        // Cleanup function to clear the watch when the component unmounts or permission changes
        return () => {
            if (watchId.current) {
                navigator.geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
        };
    }, [permissionState, startWatching]);
    
    // These are the "exported" variables, returned by the hook for the component to use.
    return { latitude, longitude, error, permissionState, requestLocation };
};


// Main Application Component
export default function ForeignTouristRegister() {
    const navigate = useNavigate();

    // We get the location data and methods from our custom hook.
    const { latitude, longitude, error: locationError, permissionState, requestLocation } = useLocation();

    // State to hold all form data
    const [formData, setFormData] = useState({
        fullname: '',
        gender: '',
        date_of_birth: '',
        nationality: '',
        passportNumber: '',
        visaNumber: '',
        email: '',
        phoneNumber: '',
        arrivalDate: '',
        departureDate: '',
        flightNumber: '',
        destination: '',
        password: '',
        confirmPassword: '',
        smartTouristId: `ST-${Date.now()}` // Pre-filled example
    });

    // Update form's location fields whenever new coordinates are fetched
    useEffect(() => {
        if (latitude && longitude) {
            setFormData(prevData => ({
                ...prevData,
                lat: latitude,
                lng: longitude,
            }));
        }
    }, [latitude, longitude]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic password match validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        
        try {
            const res = await fetch("http://localhost:4000/api/tourist/registerforeigntourist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                // Use the error message from the backend if it exists
                alert("Error: " + (data.error || "Registration failed. Please try again."));
                return;
            }

            alert("✅ Registered successfully!");
            console.log("Server response:", data);
            
            // ✅ Navigate to the login page AFTER successful registration
            navigate('/loginForeignTourist');
            
        } catch (err) {
            console.error("❌ Registration failed:", err);
            alert("Something went wrong. Please check the console for details.");
        }
    };

    // SVG Icon for location button
    const LocationMarkerIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
    );

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8 bg-slate-800 text-white">
                        <h1 className="text-3xl font-bold">Foreign Tourist Registration</h1>
                        <p className="text-slate-300 mt-2">Please fill out the form below to complete your registration.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Section: Personal Information */}
                        <div>
                            <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Personal Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="fullname" className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                                    <input type="text" id="fullname" name="fullname" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.fullname} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-slate-600 mb-1">Gender</label>
                                    <select id="gender" name="gender" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.gender} onChange={handleChange}>
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="date_of_birth" className="block text-sm font-medium text-slate-600 mb-1">Date of Birth</label>
                                    <input type="date" id="date_of_birth" name="date_of_birth" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.date_of_birth} onChange={handleChange} />
                                </div>
                                <div>
                                    <label htmlFor="nationality" className="block text-sm font-medium text-slate-600 mb-1">Nationality</label>
                                    <input type="text" id="nationality" name="nationality" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.nationality} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        {/* Section: Identity & Contact */}
                        <div>
                            <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Identity & Contact</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <input type="text" name="passportNumber" placeholder="Passport Number" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.passportNumber} onChange={handleChange} />
                                <input type="text" name="visaNumber" placeholder="Visa Number" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.visaNumber} onChange={handleChange} />
                                <input type="email" name="email" placeholder="Email Address" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.email} onChange={handleChange} />
                                <input type="tel" name="phoneNumber" placeholder="Phone Number" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.phoneNumber} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Section: Travel Details */}
                        <div>
                            <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Travel Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="arrivalDate" className="block text-sm font-medium text-slate-600 mb-1">Arrival Date</label>
                                    <input type="date" id="arrivalDate" name="arrivalDate" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.arrivalDate} onChange={handleChange} />
                                </div>
                                 <div>
                                    <label htmlFor="departureDate" className="block text-sm font-medium text-slate-600 mb-1">Departure Date</label>
                                    <input type="date" id="departureDate" name="departureDate" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.departureDate} onChange={handleChange} />
                                </div>
                                <input type="text" name="flightNumber" placeholder="Flight Number" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 md:col-span-2" value={formData.flightNumber} onChange={handleChange} />
                                <input type="text" name="destination" placeholder="Destination in Country" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 md:col-span-2" value={formData.destination} onChange={handleChange} />
                            </div>
                        </div>
                        
                        {/* Section: Account & Location */}
                        <div>
                             <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Account & Location</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                 <input type="password" name="password" placeholder="Password" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.password} onChange={handleChange}/>
                                 <input type="password" name="confirmPassword" placeholder="Confirm Password" required className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" value={formData.confirmPassword} onChange={handleChange}/>
                                 <div className="md:col-span-2">
                                     <label htmlFor="smartTouristId" className="block text-sm font-medium text-slate-600 mb-1">Smart Tourist ID</label>
                                     <input type="text" id="smartTouristId" name="smartTouristId" readOnly className="w-full px-4 py-2 border border-slate-300 rounded-md bg-slate-100 text-slate-500" value={formData.smartTouristId} />
                                 </div>
                                 <div className="md:col-span-2 p-4 border border-slate-200 rounded-lg">
                                     <h3 className="font-medium text-slate-700 mb-2">Location Information</h3>
                                     {permissionState === 'prompt' && (
                                         <button type="button" onClick={requestLocation} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                             <LocationMarkerIcon />
                                             Share Current Location
                                         </button>
                                     )}
                                     {permissionState === 'denied' && (
                                          <p className="text-sm text-red-600">Location access was denied. Please enable it in your browser settings to continue.</p>
                                     )}
                                     {locationError && permissionState !== 'denied' && <p className="text-sm text-red-600">Error: {locationError}</p>}
                                     {latitude && longitude ? (
                                         <div className="mt-4 text-sm space-y-2 bg-slate-50 p-3 rounded-md">
                                            <p className="text-green-600 font-semibold">Location shared successfully. We will keep this updated.</p>
                                            <p><strong className="font-medium text-slate-600">Latitude:</strong> {latitude.toFixed(6)}</p>
                                            <p><strong className="font-medium text-slate-600">Longitude:</strong> {longitude.toFixed(6)}</p>
                                         </div>
                                     ) : (
                                         permissionState === 'granted' && <p className="text-sm text-slate-500 mt-2">Acquiring location...</p>
                                     )}
                                 </div>
                               </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-slate-200">
                           <button 
                                type="submit" 
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}