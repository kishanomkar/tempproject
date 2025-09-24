import React, { useEffect, useState } from "react";

// Reusable Profile Field
const ProfileField = ({ label, value }) => (
  <div className="bg-slate-50 p-4 rounded-lg">
    <div className="flex items-center text-sm font-semibold text-slate-500 mb-1">
      <span className="ml-2 uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-lg font-medium text-slate-800">{value || "Not Provided"}</p>
  </div>
);

// Loading Spinner
const LoadingSpinner = () => (
  <div className="flex justify-center items-center p-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
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
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-center text-red-600 bg-red-50">{error}</div>;
  if (!profile) return <div className="p-8 text-center">No profile data available.</div>;

  return (
    <div className="p-8 bg-slate-100 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex items-center space-x-4 pb-6 border-b border-slate-200">
          <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center text-3xl text-slate-500">
            👤
          </div>
          <div>
            <h1 className="text-4xl font-bold text-slate-800">{profile.fullname}</h1>
            <p className="text-slate-500">Domestic Tourist</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <h2 className="md:col-span-2 text-xl font-bold text-slate-700">Personal & Contact Details</h2>
          <ProfileField label="Email" value={profile.email} />
          <ProfileField label="Phone Number" value={profile.phoneNumber} />
          <ProfileField label="Gender" value={profile.gender} />
          <ProfileField label="Date of Birth" value={new Date(profile.date_of_birth).toLocaleDateString()} />

          <h2 className="md:col-span-2 text-xl font-bold text-slate-700 mt-6">Identification</h2>
          <ProfileField label="Aadhar Number" value={profile.aadharNumber} />
          <ProfileField label="Driving License" value={profile.drivingLicenseNumber} />
          <ProfileField label="Smart Tourist ID" value={profile.smartTouristId} />
          <ProfileField label="Nationality" value={profile.nationality} />

          <h2 className="md:col-span-2 text-xl font-bold text-slate-700 mt-6">Travel Information</h2>
          <ProfileField label="Arrival Date" value={new Date(profile.arrivalDate).toLocaleDateString()} />
          <ProfileField label="Departure Date" value={new Date(profile.departureDate).toLocaleDateString()} />
          <ProfileField label="Destination" value={profile.destination} />
          <ProfileField label="Flight/Train No." value={profile.flightNumber} />
        </div>
      </div>
    </div>
  );
}
