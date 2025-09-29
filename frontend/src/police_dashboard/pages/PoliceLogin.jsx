import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// --- Reusable SVG Icons ---
const FiMail = () => <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>;
const FiLock = () => <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const FiCreditCard = () => <svg className="w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" /></svg>;
const FiLogIn = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>;
const FiAlertCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;


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
        setError('');
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
                credentials: 'include',
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Login failed. Please check your credentials.');
            }

            localStorage.setItem('police token', data.token);
            navigate('/nazar');

        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                
                <div className="hidden md:block bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGF3JTIwZW5mb3JjZW1lbnR8ZW58MHx8MHx8fDA%3D')"}}>
                     <div className="h-full bg-slate-900/60 p-8 flex flex-col justify-end text-white">
                        <h2 className="text-3xl font-bold">Divya Drishti Center</h2>
                        <p className="mt-2 text-slate-200">Authorized personnel only. Secure access to the live monitoring dashboard.</p>
                    </div>
                </div>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-800">Officer Login</h1>
                        <p className="text-slate-500 mt-2">Access the Monitoring Dashboard</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <InputField 
                            icon={<FiMail />}
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                         <InputField 
                            icon={<FiCreditCard />}
                            type="text"
                            name="service_id"
                            placeholder="Service ID"
                            value={formData.service_id}
                            onChange={handleChange}
                        />
                        <InputField 
                            icon={<FiLock />}
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
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
                            disabled={isLoading}
                            className="w-full flex items-center justify-center py-3 px-4 rounded-lg text-lg font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 transition-colors disabled:bg-slate-400"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <FiLogIn className="mr-2"/>
                                    Sign In
                                </>
                            )}
                        </button>

                         <p className="text-center text-sm text-slate-500">
                            Don't have an account?{' '}
                            <button type="button" onClick={() => navigate('/policeRegister')} className="font-semibold text-blue-600 hover:underline">
                                Register Here
                            </button>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
