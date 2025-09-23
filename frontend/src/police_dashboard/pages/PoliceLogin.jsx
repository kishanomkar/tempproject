import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Reusable SVG Icons ---
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

const ServiceIdIcon = () => (
    <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4z" />
    </svg>
);

// --- Main Login Component ---
export default function PoliceLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        service_id: '',
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:3000/police/policelogin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include', // Important for sending/receiving cookies
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }
    localStorage.setItem("police token",token)


            // On successful login, navigate to the Nazar dashboard
            navigate('/nazar');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center font-sans">
            <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-2xl rounded-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-slate-900">Police Login</h1>
                    <p className="mt-2 text-sm text-slate-600">Access the Nazar Monitoring Dashboard</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><EmailIcon /></span>
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

                    {/* Service ID Input */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><ServiceIdIcon /></span>
                        <input
                            type="text"
                            name="service_id"
                            placeholder="Service ID"
                            required
                            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                            value={formData.service_id}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3"><LockIcon /></span>
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

                    {/* Error Message Display */}
                    {error && (
                        <div className="p-3 text-center bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-lg text-lg font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 transition-colors disabled:bg-slate-400"
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
}
