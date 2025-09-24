import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Reusable SVG Icons for input fields
const EmailIcon = () => (
    <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
    </svg>
);

const LockIcon = () => (
    <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);

const PhoneIcon = () => (
     <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const AadharIcon = () => (
    <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    </svg>
);


// The Login Form component for Domestic Tourists
export default function DomesticLoginForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        aadharNumber: '',
        phoneNumber: '' // This field is optional for login
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation to check if required fields are filled
        if (!formData.email || !formData.password || !formData.aadharNumber) {
            alert('Please fill in all required fields: Email, Password, and Aadhar Number.');
            return;
        }
        
        setLoading(true);
        try {
            const res = await fetch("http://localhost:4000/api/tourist/domestictouristlogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include", // Necessary for handling cookies
            });

            const data = await res.json();

            if (!res.ok) {
                // Display the specific error message from the backend
                alert(data.error || "Login failed. Please check your credentials.");
                return;
            }

            alert("✅ Login successful!");
            console.log("Login response:", data);
            // Save token after login
localStorage.setItem("token", data.token);
localStorage.setItem("DomesticTouristId", data.domesticTourist._id);
localStorage.setItem("touristEmail", data.domesticTourist.email);



            // Redirect to the domestic tourist dashboard after a successful login
            navigate("/home/trackyourlocation");

        } catch (err) {
            console.error("❌ Login error:", err);
            alert("An error occurred during login. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-slate-800">Domestic Tourist Login</h1>
                        <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <EmailIcon />
                            </span>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Input */}
                        <div className="relative">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockIcon />
                            </span>
                            <input
                                type="password"
                                name="password"
                                placeholder="Password"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Aadhar Number Input */}
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <AadharIcon />
                            </span>
                            <input
                                type="text"
                                name="aadharNumber"
                                placeholder="Aadhar Number"
                                required
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.aadharNumber}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Phone Number Input */}
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <PhoneIcon />
                            </span>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Phone Number (Optional)"
                                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-lg text-lg font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 transition-colors disabled:bg-slate-400"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
