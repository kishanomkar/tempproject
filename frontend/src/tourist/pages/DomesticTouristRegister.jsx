import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { FiUser, FiCreditCard, FiCalendar, FiLock, FiMapPin, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

// --- Custom Hook for Geolocation (Unchanged) ---
const useLocation = () => {
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [error, setError] = useState(null);
    const [permissionState, setPermissionState] = useState('prompt');

    useEffect(() => {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                setPermissionState(result.state);
                result.onchange = () => setPermissionState(result.state);
            });
        }
    }, []);
    
    const watchId = React.useRef(null);

    const handleSuccess = (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setError(null);
    };

    const handleError = (err) => setError(err.message);

    const startWatching = useCallback(() => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported.");
            setPermissionState('denied');
            return;
        }
        if (permissionState === 'granted' && watchId.current === null) {
            watchId.current = navigator.geolocation.watchPosition(handleSuccess, handleError, {
                enableHighAccuracy: true, timeout: 5000, maximumAge: 0,
            });
        }
    }, [permissionState]);

    const requestLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported.");
            return;
        }
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    };

    useEffect(() => {
        if (permissionState === 'granted') {
            startWatching();
        }
        return () => {
            if (watchId.current) {
                navigator.geolocation.clearWatch(watchId.current);
                watchId.current = null;
            }
        };
    }, [permissionState, startWatching]);
    
    return { latitude, longitude, error, permissionState, requestLocation };
};

// --- Helper Components ---
const InputField = ({ name, type, placeholder, value, onChange, required = true }) => (
    <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
    />
);

const StepIndicator = ({ currentStep, totalSteps }) => (
    <div className="flex items-center gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
            <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${index < currentStep ? 'bg-blue-600' : 'bg-slate-200'}`}
            ></div>
        ))}
    </div>
);

// --- Main Registration Component ---
export default function DomesticTouristRegister() {
    const navigate = useNavigate();
    const { latitude, longitude, error: locationError, permissionState, requestLocation } = useLocation();
    
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullname: '', gender: '', date_of_birth: '', nationality: 'Indian', aadharNumber: '',
        drivingLicenseNumber: '', email: '', phoneNumber: '', arrivalDate: '', departureDate: '',
        flightNumber: '', destination: '', password: '', confirmPassword: '', lat: null, lng: null,
        smartTouristId: `ST-DOM-${Date.now()}`
    });
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (latitude && longitude) {
            setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
        }
    }, [latitude, longitude]);

    const handleChange = (e) => {
        setFormError("");
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            setFormError("Passwords do not match!");
            return;
        }
        if (!formData.lat || !formData.lng) {
            setFormError("Location sharing is required to complete registration.");
            return;
        }
        
        try {
            const res = await fetch("http://localhost:4000/api/tourist/registerdomestictourist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });
            const data = await res.json();
            if (!res.ok) {
                const errorMsg = data.errors ? data.errors.map(err => err.msg).join(', ') : (data.error || "Registration failed.");
                throw new Error(errorMsg);
            }
            alert("Registration successful!");
            navigate('/loginDomesticTourist');
        } catch (err) {
            console.error("Registration failed:", err);
            setFormError(err.message);
        }
    };
    
    return (
        <div className="bg-slate-100 min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="hidden md:block bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop')"}}>
                    <div className="h-full bg-slate-900/50 p-8 flex flex-col justify-end text-white">
                        <h2 className="text-3xl font-bold">Incredible India Awaits</h2>
                        <p className="mt-2 text-slate-200">Register to ensure a safe and seamless journey with our smart tourist services.</p>
                    </div>
                </div>

                <div className="p-8">
                    <h1 className="text-3xl font-bold text-slate-800">Domestic Registration</h1>
                    <p className="text-slate-500 mt-1">Create your secure travel account.</p>
                    
                    <div className="my-6">
                        <StepIndicator currentStep={currentStep} totalSteps={3} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <section className="space-y-4">
                                <h2 className="font-semibold text-lg text-slate-700 flex items-center gap-2"><FiUser /> Personal & ID</h2>
                                <InputField name="fullname" type="text" placeholder="Full Name" value={formData.fullname} onChange={handleChange} />
                                <InputField name="aadharNumber" type="text" placeholder="Aadhar Number" value={formData.aadharNumber} onChange={handleChange} />
                                <InputField name="drivingLicenseNumber" type="text" placeholder="Driving License (Optional)" value={formData.drivingLicenseNumber} onChange={handleChange} required={false} />
                                <InputField name="date_of_birth" type="date" placeholder="Date of Birth" value={formData.date_of_birth} onChange={handleChange} />
                                <select name="gender" value={formData.gender} onChange={handleChange} required className="w-full px-4 py-2.5 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                                    <option value="" disabled>Select Gender...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <button type="button" onClick={nextStep} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Next: Travel Details</button>
                            </section>
                        )}

                        {currentStep === 2 && (
                            <section className="space-y-4">
                                <h2 className="font-semibold text-lg text-slate-700 flex items-center gap-2"><FiCalendar /> Travel Details</h2>
                                <InputField name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                                <InputField name="phoneNumber" type="tel" placeholder="Phone Number" value={formData.phoneNumber} onChange={handleChange} />
                                <InputField name="arrivalDate" type="date" placeholder="Arrival Date" value={formData.arrivalDate} onChange={handleChange} />
                                <InputField name="departureDate" type="date" placeholder="Departure Date" value={formData.departureDate} onChange={handleChange} required={false} />
                                <InputField name="destination" type="text" placeholder="Primary Destination (e.g., Jaipur)" value={formData.destination} onChange={handleChange} />
                                <div className="flex gap-4">
                                    <button type="button" onClick={prevStep} className="w-full py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition">Back</button>
                                    <button type="button" onClick={nextStep} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Next: Account & Security</button>
                                </div>
                            </section>
                        )}
                        
                        {currentStep === 3 && (
                             <section className="space-y-4">
                                <h2 className="font-semibold text-lg text-slate-700 flex items-center gap-2"><FiLock /> Account & Security</h2>
                                <InputField name="password" type="password" placeholder="Create Password" value={formData.password} onChange={handleChange} />
                                <InputField name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                                
                                <div className="p-4 border-2 border-dashed border-slate-300 rounded-lg">
                                    <h3 className="font-medium text-slate-700 mb-2 flex items-center gap-2"><FiMapPin /> Location Sharing (Required)</h3>
                                    {permissionState === 'prompt' && (
                                        <button type="button" onClick={requestLocation} className="w-full py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition">Enable Location</button>
                                    )}
                                    {permissionState === 'denied' && (
                                        <div className="text-sm text-red-600 font-semibold p-2 bg-red-50 rounded-md flex items-center gap-2"><FiAlertCircle/> Location access denied. Please enable it in your browser settings.</div>
                                    )}
                                    {locationError && permissionState !== 'denied' && <p className="text-sm text-red-600 font-semibold">Error: {locationError}</p>}
                                    {latitude && longitude && (
                                        <div className="text-sm text-green-700 font-semibold p-2 bg-green-50 rounded-md flex items-center gap-2"><FiCheckCircle /> Location successfully captured.</div>
                                    )}
                                </div>

                                {formError && <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg font-semibold">{formError}</div>}

                                <div className="flex gap-4">
                                    <button type="button" onClick={prevStep} className="w-full py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition">Back</button>
                                    <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-slate-400 transition" disabled={!formData.lat}>Complete Registration</button>
                                </div>
                            </section>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}