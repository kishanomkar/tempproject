import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiCreditCard, FiLogIn, FiAlertCircle } from 'react-icons/fi';

// --- Helper Component for Input Fields ---
const InputField = ({ icon, type, name, placeholder, value, onChange }) => (
    <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
        </span>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            required
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition outline-none"
            value={value}
            onChange={onChange}
        />
    </div>
);


// --- The Enhanced Login Form Component ---
export default function DomesticLoginForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        aadharNumber: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setError(''); // Clear error on change
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.email || !formData.password || !formData.aadharNumber) {
            setError('Please fill in all required fields.');
            return;
        }
        
        setLoading(true);
        setError('');
        try {
            const res = await fetch("http://localhost:4000/api/tourist/domestictouristlogin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Login failed. Please check your credentials.");
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("DomesticTouristId", data.domesticTourist._id);
            localStorage.setItem("touristEmail", data.domesticTourist.email);
            
            navigate("/home/");

        } catch (err) {
            console.error("Login error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                
                {/* --- Left Panel: Image --- */}
                <div className="hidden md:block bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1679254165381-a4c0c0a7e73e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGhhd2FtYWhhbHxlbnwwfHwwfHx8MA%3D%3D')"}}>
                     <div className="h-full bg-slate-900/50 p-8 flex flex-col justify-end text-white">
                        <h2 className="text-3xl font-bold">Secure Login</h2>
                        <p className="mt-2 text-slate-200">Access your personalized travel dashboard and safety features.</p>
                    </div>
                </div>

                {/* --- Right Panel: Form --- */}
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">Domestic Tourist Login</h1>
                        <p className="text-slate-500 mt-2">Welcome back! Please enter your details.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <InputField 
                            icon={<FiMail className="w-5 h-5 text-slate-400" />}
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <InputField 
                            icon={<FiLock className="w-5 h-5 text-slate-400" />}
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                         <InputField 
                            icon={<FiCreditCard className="w-5 h-5 text-slate-400" />}
                            type="text"
                            name="aadharNumber"
                            placeholder="Aadhar Number"
                            value={formData.aadharNumber}
                            onChange={handleChange}
                        />
                        
                        {error && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm flex items-center gap-2">
                                <FiAlertCircle />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-lg font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 transition-colors disabled:bg-slate-400"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    <FiLogIn className="mr-2"/>
                                    Login
                                </>
                            )}
                        </button>

                       
                    </form>
                </div>
            </div>
        </div>
    );
}