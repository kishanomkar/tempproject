import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// --- Reusable SVG Icons ---
const FiUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FiMail = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const FiPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const FiCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const FiCreditCard = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
const FiFlag = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>;
const FiMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const FiGlobe = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;

// --- Helper Components ---
const ProfileField = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-slate-500 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-base font-medium text-slate-800">{value || "N/A"}</p>
        </div>
    </div>
);

// --- Main Profile Component ---
export default function TouristProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const { tourist } = location.state || {};

    if (!tourist) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-2xl">
                    <svg className="w-16 h-16 mx-auto text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="mt-6 text-3xl font-bold text-slate-800">Profile Not Found</h2>
                    <p className="text-slate-500 mt-2 max-w-sm">The tourist data could not be loaded. This may be due to a navigation error.</p>
                    <button onClick={() => navigate('/nazar')} className="mt-8 w-full py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition">
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const isForeign = tourist.type === 'Foreign';

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <aside className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center sticky top-8">
                         <div className="w-28 h-28 bg-slate-200 rounded-full mx-auto flex items-center justify-center text-4xl text-slate-500 mb-4 ring-4 ring-white ring-offset-4 ring-offset-slate-100">
                            {tourist.gender === 'Female' ? '👩' : '👨'}
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">{tourist.fullname}</h1>
                        <span className={`inline-block px-3 py-1 mt-2 text-sm font-semibold rounded-full ${isForeign ? 'bg-indigo-100 text-indigo-700' : 'bg-green-100 text-green-700'}`}>
                            {tourist.type} Tourist
                        </span>
                        
                        <div className="text-left mt-8 pt-6 border-t border-slate-200 space-y-4">
                            <ProfileField icon={<FiMail />} label="Email" value={tourist.email} />
                            <ProfileField icon={<FiPhone />} label="Phone" value={tourist.phoneNumber} />
                            <ProfileField icon={<FiMapPin />} label="Destination" value={tourist.destination} />
                        </div>

                         <button onClick={() => navigate('/nazar')} className="mt-8 w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
                            ← Back to Dashboard
                        </button>
                    </div>
                </aside>

                <main className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-700 mb-6">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileField icon={<FiUser />} label="Gender" value={tourist.gender} />
                                <ProfileField icon={<FiCalendar />} label="Date of Birth" value={new Date(tourist.date_of_birth).toLocaleDateString()} />
                                <ProfileField icon={<FiFlag />} label="Nationality" value={tourist.nationality} />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-700 mb-6">Identification</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {isForeign ? (
                                    <>
                                        <ProfileField icon={<FiCreditCard />} label="Passport Number" value={tourist.passportNumber} />
                                        <ProfileField icon={<FiGlobe />} label="Visa Number" value={tourist.visaNumber} />
                                    </>
                                ) : (
                                    <>
                                        <ProfileField icon={<FiCreditCard />} label="Aadhar Number" value={tourist.aadharNumber} />
                                        <ProfileField icon={<FiCreditCard />} label="Driving License" value={tourist.drivingLicenseNumber || 'N/A'} />
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-700 mb-6">Travel Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileField icon={<FiCalendar />} label="Arrival Date" value={new Date(tourist.arrivalDate).toLocaleDateString()} />
                                <ProfileField icon={<FiCalendar />} label="Departure Date" value={new Date(tourist.departureDate).toLocaleDateString()} />
                                <ProfileField icon={<FiMapPin />} label="Flight/Train No." value={tourist.flightNumber} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
