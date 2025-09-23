import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Helper component for SVG icons (using the same path, but colors updated)
const Icon = ({ path, className = "w-5 h-5 text-gray-600" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

// Refactored ProfileField with icon support and updated styling
const ProfileField = ({ label, value, children }) => (
    <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex-shrink-0">
            {children}
        </div>
        <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
            <p className="text-base font-medium text-gray-800">{value || 'N/A'}</p>
        </div>
    </div>
);

// Section header to organize the profile with updated styling
const SectionHeader = ({ title }) => (
    <h3 className="text-lg font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-4 md:col-span-2">{title}</h3>
);

export default function TouristProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const { tourist } = location.state || {};

    if (!tourist) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8 text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Tourist Data Not Available</h2>
                <p className="text-gray-600 mb-6 max-w-sm">The profile you are looking for could not be loaded.</p>
                <button
                    className="bg-green-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out shadow-md"
                    onClick={() => navigate('/nazar')}
                >
                    Return to Dashboard
                </button>
            </div>
        );
    }

    const isForeign = tourist.type === 'Foreign';

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl border border-gray-200">
                
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{tourist.fullname}</h2>
                        <span className={`inline-block px-3 py-1 mt-2 text-sm font-semibold rounded-full ${isForeign ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {tourist.type} Tourist
                        </span>
                    </div>
                    <button
                        className="mt-4 sm:mt-0 text-sm font-medium text-blue-600 hover:text-blue-800 transition hover:underline"
                        onClick={() => navigate('/nazar')}
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    {/* Personal Details */}
                    <SectionHeader title="Personal Details" />
                    <ProfileField label="Gender" value={tourist.gender}>
                        <Icon path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </ProfileField>
                    <ProfileField label="Date of Birth" value={new Date(tourist.date_of_birth).toLocaleDateString()}>
                        <Icon path="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                    </ProfileField>
                    <ProfileField label="Nationality" value={tourist.nationality}>
                        <Icon path="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2a2 2 0 002-2v-1a2 2 0 012-2h1.945a8.002 8.002 0 00-13.89 0zM10 2a8 8 0 100 16 8 8 0 000-16z" />
                    </ProfileField>

                    {/* Identification */}
                    <SectionHeader title="Identification" />
                    {isForeign ? (
                        <>
                            <ProfileField label="Passport Number" value={tourist.passportNumber}>
                                <Icon path="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2v1h8V6H5zm1 2v1h6V8H6z" />
                            </ProfileField>
                            <ProfileField label="Visa Number" value={tourist.visaNumber}>
                                <Icon path="M9 12h6v2H9v-2z M4 6a2 2 0 114 0 2 2 0 01-4 0zM4 12a2 2 0 114 0 2 2 0 01-4 0z M12 6a2 2 0 114 0 2 2 0 01-4 0z M12 12a2 2 0 114 0 2 2 0 01-4 0z" />
                            </ProfileField>
                        </>
                    ) : (
                        <>
                            <ProfileField label="Aadhar Number" value={tourist.aadharNumber}>
                                <Icon path="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a1 1 0 000-2H4a1 1 0 000 2zM4 8h3a1 1 0 100-2H4a1 1 0 100 2zM4 12h3a1 1 0 100-2H4a1 1 0 100 2zM4 16h3a1 1 0 100-2H4a1 1 0 100 2zM13 4h3a1 1 0 100-2h-3a1 1 0 100 2zM13 8h3a1 1 0 100-2h-3a1 1 0 100 2zM13 12h3a1 1 0 100-2h-3a1 1 0 100 2z" />
                            </ProfileField>
                            <ProfileField label="Driving License" value={tourist.drivingLicenseNumber}>
                                <Icon path="M10.5 3.5a2.5 2.5 0 00-5 0V4h5v-.5zM10 6H4.332a1 1 0 00-.998.924l-1.52 9.117A1 1 0 002.812 17h14.376a1 1 0 00.998-1.041l-1.52-9.117A1 1 0 0015.668 6H10z" />
                            </ProfileField>
                        </>
                    )}

                    {/* Contact Information */}
                    <SectionHeader title="Contact Information" />
                    <ProfileField label="Email Address" value={tourist.email}>
                        <Icon path="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </ProfileField>
                    <ProfileField label="Phone Number" value={tourist.phoneNumber}>
                        <Icon path="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </ProfileField>

                    {/* Travel Details */}
                    <SectionHeader title="Travel Details" />
                    <ProfileField label="Arrival Date" value={new Date(tourist.arrivalDate).toLocaleDateString()}>
                       <Icon path="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" />
                    </ProfileField>
                    <ProfileField label="Departure Date" value={new Date(tourist.departureDate).toLocaleDateString()}>
                         <Icon path="M10 18a8 8 0 100-16 8 8 0 000 16zm-.707-3.707a1 1 0 001.414 1.414l3-3a1 1 0 00-1.414-1.414L11 13.586V10a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3z" />
                    </ProfileField>
                    <ProfileField label="Flight Number" value={tourist.flightNumber}>
                        <Icon path="M2 12A2 2 0 014 10h12a2 2 0 010 4H4a2 2 0 01-2-2zM2 5a2 2 0 012-2h12a2 2 0 010 4H4a2 2 0 01-2-2zM2 19a2 2 0 012-2h12a2 2 0 010 4H4a2 2 0 01-2-2z" />
                    </ProfileField>
                    <ProfileField label="Destination" value={tourist.destination}>
                        <Icon path="M10 2a6 6 0 00-6 6c0 4.167 6 12 6 12s6-7.833 6-12a6 6 0 00-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" />
                    </ProfileField>
                </div>
            </div>
        </div>
    );
}