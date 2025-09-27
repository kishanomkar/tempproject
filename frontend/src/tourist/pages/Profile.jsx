import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiPhone, FiCalendar, FiCreditCard, FiFlag, FiMapPin, FiLogOut, FiEdit2 } from 'react-icons/fi';

const ProfileField = ({ icon, label, value }) => (
    <div className="flex items-start gap-4">
        <div className="flex-shrink-0 text-slate-500 mt-1">{icon}</div>
        <div>
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className="text-base font-medium text-slate-800">{value || "Not Provided"}</p>
        </div>
    </div>
);

const ProfileSkeleton = () => (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen animate-pulse">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-2xl shadow-lg h-96">
                    <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto"></div>
                    <div className="h-6 w-3/4 bg-slate-200 rounded mt-4 mx-auto"></div>
                    <div className="h-4 w-1/2 bg-slate-200 rounded mt-2 mx-auto"></div>
                    <div className="mt-6 space-y-3">
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                        <div className="h-4 w-full bg-slate-200 rounded"></div>
                    </div>
                </div>
            </div>
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg">
                <div className="h-8 w-1/3 bg-slate-200 rounded mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="h-10 w-full bg-slate-200 rounded"></div>
                    <div className="h-10 w-full bg-slate-200 rounded"></div>
                    <div className="h-10 w-full bg-slate-200 rounded"></div>
                    <div className="h-10 w-full bg-slate-200 rounded"></div>
                    <div className="h-10 w-full bg-slate-200 rounded"></div>
                    <div className="h-10 w-full bg-slate-200 rounded"></div>
                </div>
            </div>
        </div>
    </div>
);

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:4000/api/tourist/profile", {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || "Failed to fetch profile");
                }

                const data = await res.json();
                setProfile(data.tourist);

            } catch (err) {
                setError(err.message);
            } finally {
                // Simulate loading for better skeleton visibility
                setTimeout(() => setLoading(false), 1000);
            }
        };

        fetchProfile();
    }, []);

    if (loading) return <ProfileSkeleton />;
    if (error) return <div className="p-8 text-center text-red-700 bg-red-100 font-medium">{error}</div>;
    if (!profile) return <div className="p-8 text-center text-slate-600">No profile data available.</div>;

    const isForeign = profile.nationality && profile.nationality.toLowerCase() !== 'indian';

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-slate-100 min-h-screen font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                <aside className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                        <div className="w-28 h-28 bg-slate-200 rounded-full mx-auto flex items-center justify-center text-4xl text-slate-500 mb-4 ring-4 ring-white ring-offset-4 ring-offset-slate-100">
                            👤
                        </div>
                        <h1 className="text-2xl font-bold text-slate-800">{profile.fullname}</h1>
                        <p className="text-slate-500 font-mono text-sm">{profile.smartTouristId}</p>
                        
                        <div className="mt-6 flex justify-center gap-2">
                            <button className="flex-1 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
                                <FiEdit2 /> Edit
                            </button>
                            <button className="flex-1 bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition flex items-center justify-center gap-2">
                                <FiLogOut /> Logout
                            </button>
                        </div>

                        <div className="text-left mt-8 pt-6 border-t border-slate-200 space-y-4">
                            <ProfileField icon={<FiMail size={20} />} label="Email" value={profile.email} />
                            <ProfileField icon={<FiPhone size={20} />} label="Phone" value={profile.phoneNumber} />
                            <ProfileField icon={<FiMapPin size={20} />} label="Destination" value={profile.destination} />
                        </div>
                    </div>
                </aside>

                <main className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-lg">
                    <div className="space-y-10">
                        <div>
                            <h2 className="text-xl font-bold text-slate-700 mb-6">Personal Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileField icon={<FiUser size={20} />} label="Full Name" value={profile.fullname} />
                                <ProfileField icon={<FiUser size={20} />} label="Gender" value={profile.gender} />
                                <ProfileField icon={<FiCalendar size={20} />} label="Date of Birth" value={new Date(profile.date_of_birth).toLocaleDateString()} />
                                <ProfileField icon={<FiFlag size={20} />} label="Nationality" value={profile.nationality} />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-700 mb-6">Identification</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {isForeign ? (
                                    <>
                                        <ProfileField icon={<FiCreditCard size={20} />} label="Passport Number" value={profile.passportNumber} />
                                        <ProfileField icon={<FiCreditCard size={20} />} label="Visa Number" value={profile.visaNumber} />
                                    </>
                                ) : (
                                    <>
                                        <ProfileField icon={<FiCreditCard size={20} />} label="Aadhar Number" value={profile.aadharNumber} />
                                        <ProfileField icon={<FiCreditCard size={20} />} label="Driving License" value={profile.drivingLicenseNumber} />
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold text-slate-700 mb-6">Travel Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <ProfileField icon={<FiCalendar size={20} />} label="Arrival Date" value={new Date(profile.arrivalDate).toLocaleDateString()} />
                                <ProfileField icon={<FiCalendar size={20} />} label="Departure Date" value={new Date(profile.departureDate).toLocaleDateString()} />
                                <ProfileField icon={<FiMapPin size={20} />} label="Flight/Train No." value={profile.flightNumber} />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}