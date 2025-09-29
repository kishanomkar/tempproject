import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

// --- Helper Components & Inline SVGs to remove dependencies ---
const FiUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FiShield = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>;
const FiMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const FiLock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;
const FiCheckCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const FiAlertCircle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;


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


// --- Main Police Registration Component ---
export default function PoliceRegister() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        fullname: '', service_id: '', rank: '', phone_no: '', station: '',
        email: '', password: '', confirmPassword: '', place_of_posting: '',
        district: '', state: ''
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setError('');
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

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
                const errorMsg = data.errors ? data.errors.map(err => err.msg).join(', ') : (data.message || "Registration failed.");
                throw new Error(errorMsg);
            }

            setMessage("Registration successful! Redirecting to login...");
            setTimeout(() => navigate('/policeLogin'), 2000);

        } catch (err) {
            console.error("Registration failed:", err);
            setError(err.message || "A network error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-slate-100 min-h-screen font-sans flex items-center justify-center p-4">
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="hidden md:block bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')"}}>
                    <div className="h-full bg-slate-900/60 p-8 flex flex-col justify-end text-white">
                        <h2 className="text-3xl font-bold">Divya Drishti Protocol</h2>
                        <p className="mt-2 text-slate-200">Secure registration for authorized law enforcement personnel.</p>
                    </div>
                </div>

                <div className="p-8">
                    <h1 className="text-3xl font-bold text-slate-800">Officer Registration</h1>
                    <p className="text-slate-500 mt-1">Create a new operational account.</p>
                    
                    <div className="my-6">
                        <StepIndicator currentStep={currentStep} totalSteps={3} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <section className="space-y-4">
                                <h2 className="font-semibold text-lg text-slate-700 flex items-center gap-2"><FiUser /> Personal & Service</h2>
                                <InputField name="fullname" type="text" placeholder="Full Name" value={formData.fullname} onChange={handleChange} />
                                <InputField name="service_id" type="text" placeholder="Service ID" value={formData.service_id} onChange={handleChange} />
                                <InputField name="rank" type="text" placeholder="Rank (e.g., Constable, Inspector)" value={formData.rank} onChange={handleChange} />
                                <InputField name="phone_no" type="tel" placeholder="Phone Number" value={formData.phone_no} onChange={handleChange} />
                                <button type="button" onClick={nextStep} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Next: Posting Details</button>
                            </section>
                        )}

                        {currentStep === 2 && (
                            <section className="space-y-4">
                                <h2 className="font-semibold text-lg text-slate-700 flex items-center gap-2"><FiMapPin /> Posting Information</h2>
                                <InputField name="station" type="text" placeholder="Police Station" value={formData.station} onChange={handleChange} />
                                <InputField name="place_of_posting" type="text" placeholder="Place of Posting" value={formData.place_of_posting} onChange={handleChange} />
                                <InputField name="district" type="text" placeholder="District" value={formData.district} onChange={handleChange} />
                                <InputField name="state" type="text" placeholder="State" value={formData.state} onChange={handleChange} />
                                <div className="flex gap-4">
                                    <button type="button" onClick={prevStep} className="w-full py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition">Back</button>
                                    <button type="button" onClick={nextStep} className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">Next: Account Credentials</button>
                                </div>
                            </section>
                        )}
                        
                        {currentStep === 3 && (
                             <section className="space-y-4">
                                <h2 className="font-semibold text-lg text-slate-700 flex items-center gap-2"><FiLock /> Account Credentials</h2>
                                <InputField name="email" type="email" placeholder="Official Email Address" value={formData.email} onChange={handleChange} />
                                <InputField name="password" type="password" placeholder="Create Password" value={formData.password} onChange={handleChange} />
                                <InputField name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
                                
                                { (error || message) &&
                                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 font-medium ${error ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {error ? <FiAlertCircle /> : <FiCheckCircle />}
                                        {error || message}
                                    </div>
                                }

                                <div className="flex gap-4">
                                    <button type="button" onClick={prevStep} className="w-full py-3 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition">Back</button>
                                    <button type="submit" className="w-full py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 disabled:bg-slate-400 transition flex items-center justify-center gap-2" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Registering...
                                            </>
                                        ) : (
                                            <>
                                                <FiShield />
                                                Register Officer
                                            </>
                                        )}
                                    </button>
                                </div>
                            </section>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

