import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

// Main Application Component
export default function PoliceRegister() {
    const navigate = useNavigate();

    // State to hold all form data, tailored for the police schema
    const [formData, setFormData] = useState({
        fullname: '',
        service_id: '',
        rank: '',
        phone_no: '',
        station: '',
        email: '',
        password: '',
        confirmPassword: '', // Added for validation
        place_of_posting: '',
        district: '',
        state: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Basic password match validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        
        try {
            const res = await fetch("http://localhost:3000/police/registerpolice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                // If the backend sends validation errors, display them
                const errorMsg = data.errors ? data.errors.map(err => err.msg).join(', ') : (data.message || "Registration failed.");
                setError(errorMsg);
                return;
            }

            setMessage("✅ Registration successful! You can now log in.");
            setFormData({ // Reset form to initial state
                fullname: '', service_id: '', rank: '', phone_no: '', station: '',
                email: '', password: '', confirmPassword: '', place_of_posting: '',
                district: '', state: ''
            });
            // Optional: navigate to login page after a short delay
            setTimeout(() => navigate('/policeLogin'), 2000);

        } catch (err) {
            console.error("❌ Registration failed:", err);
            setError("A network error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen text-slate-800 font-sans">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-8 bg-slate-800 text-white">
                        <h1 className="text-3xl font-bold">Police Officer Registration</h1>
                        <p className="text-slate-300 mt-2">Create a new operational account for the Nazar Dashboard.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        {/* Section: Personal & Service Information */}
                        <div>
                            <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Personal & Service Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField name="fullname" label="Full Name" value={formData.fullname} onChange={handleChange} />
                                <InputField name="service_id" label="Service ID" value={formData.service_id} onChange={handleChange} />
                                <InputField name="rank" label="Rank" value={formData.rank} onChange={handleChange} />
                                <InputField name="phone_no" label="Phone Number" value={formData.phone_no} onChange={handleChange} type="tel" />
                            </div>
                        </div>

                        {/* Section: Posting & Contact */}
                        <div>
                            <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Posting & Contact</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField name="station" label="Police Station" value={formData.station} onChange={handleChange} />
                                <InputField name="place_of_posting" label="Place of Posting" value={formData.place_of_posting} onChange={handleChange} />
                                <InputField name="district" label="District" value={formData.district} onChange={handleChange} />
                                <InputField name="state" label="State" value={formData.state} onChange={handleChange} />
                            </div>
                        </div>
                        
                        {/* Section: Account Credentials */}
                        <div>
                             <h2 className="text-xl font-semibold text-slate-700 border-b pb-3 mb-6">Account Credentials</h2>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField name="email" label="Email Address" value={formData.email} onChange={handleChange} type="email" />
                                <div /> 
                                <InputField name="password" label="Password" value={formData.password} onChange={handleChange} type="password" />
                                <InputField name="confirmPassword" label="Confirm Password" value={formData.confirmPassword} onChange={handleChange} type="password" />
                            </div>
                        </div>

                        {/* User Feedback */}
                        { (error || message) &&
                            <div className={`p-4 rounded-lg text-center font-medium ${error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                {error || message}
                            </div>
                        }

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-slate-200">
                           <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 disabled:bg-slate-400 transition-colors"
                            >
                                {isLoading ? 'Registering...' : 'Register Officer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// Reusable InputField component to keep the form clean
const InputField = ({ name, label, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input 
            type={type} 
            id={name} 
            name={name} 
            required 
            className="w-full px-4 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            value={value} 
            onChange={onChange} 
        />
    </div>
);
