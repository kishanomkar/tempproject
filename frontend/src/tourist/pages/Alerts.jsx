import React, { useEffect, useState } from "react";

// --- Helper function to format time for a better user experience ---
const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
};

// --- Icon Components for visual distinction ---
const SosIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const InfoIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

// --- Configuration to easily manage styles for different alert types ---
const alertStyles = {
    "SOS": {
        Icon: SosIcon,
        className: "border-red-500 text-red-600",
    },
    "Location Anomaly": {
        Icon: LocationIcon,
        className: "border-yellow-500 text-yellow-600",
    },
    "Default": {
        Icon: InfoIcon,
        className: "border-blue-500 text-blue-600",
    }
};

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/alerts");
        if (!res.ok) throw new Error("Failed to fetch alerts");
        const data = await res.json();
        setAlerts(data);
      } catch (err) {
        console.error("❌ Error fetching alerts:", err);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Real-Time Alerts</h1>
            
            {alerts.length > 0 ? (
                alerts.map((alert, i) => {
                    const { Icon, className } = alertStyles[alert.type] || alertStyles.Default;
                    return (
                        <div key={i} className={`flex items-start gap-4 p-4 mb-4 bg-white rounded-lg shadow-md border-l-4 ${className}`}>
                            <div className="flex-shrink-0 pt-1">
                                <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-grow">
                                <h2 className="font-bold text-gray-900">{alert.type}</h2>
                                <p className="text-gray-700 text-sm mt-1">{alert.message}</p>
                                <span className="block text-xs text-gray-500 mt-2">
                                    {formatTimeAgo(alert.time)}
                                </span>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div className="text-center py-16 px-4 bg-white rounded-lg shadow-sm border border-dashed">
                    <p className="text-gray-500">No active alerts at the moment.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Alerts;