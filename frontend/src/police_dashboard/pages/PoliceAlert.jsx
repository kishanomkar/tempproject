import React, { useState, useEffect } from 'react';

const PoliceAlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/police/alert", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch alerts. Please check the network and authentication.');
      }

      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching alerts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const intervalId = setInterval(fetchAlerts, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 p-8 font-sans antialiased">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-blue-400 drop-shadow-lg">
          Police Alerts Dashboard
        </h1>
        <p className="mt-3 text-lg text-gray-400">
          Real-time updates on incoming alerts.
        </p>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center text-xl text-blue-500">
          <svg
            className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 
                 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 
                 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading Alerts...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="flex justify-center items-center text-xl text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 
                 0zm-7 4a1 1 0 11-2 0 1 1 0 
                 012 0zm-1-9a1 1 0 00-1 
                 1v4a1 1 0 102 0V6a1 1 
                 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && alerts.length === 0 && (
        <div className="text-center text-xl text-gray-500">
          No active alerts at this time.
        </div>
      )}

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {alerts.map((alert, index) => {
          const lat = alert.location?.latitude;
          const lng = alert.location?.longitude;

          return (
            <div
              key={index}
              className="bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <svg
                  className="h-6 w-6 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 
                       018 0zM12 14a7 7 0 00-7 
                       7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <h3 className="text-lg font-bold text-gray-100">User:</h3>
                <span className="text-lg font-medium text-blue-300">
                  {alert.userId?.email || alert.userId?._id || "Unknown"}
                </span>
              </div>

              {/* Message */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-400">Message:</h4>
                <p className="mt-1 text-gray-300 leading-tight">
                  {alert.message}
                </p>
              </div>

              {/* Location */}
              <div className="flex items-center space-x-2 mb-4">
                <svg
                  className="h-5 w-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 
                       1.998 0 01-2.827 0l-4.244-4.243a8 
                       8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 
                       3 3 0 016 0z"
                  />
                </svg>
                <h4 className="font-semibold text-gray-400">Location:</h4>
                <span className="text-sm text-gray-300">
                  {lat !== undefined && lng !== undefined
                    ? `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`
                    : "Unknown"}
                </span>
              </div>

              {/* Timestamp */}
              <div className="flex items-center space-x-2">
                <svg
                  className="h-5 w-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 
                       11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="font-semibold text-gray-400">Time:</h4>
                <span className="text-sm text-gray-300">
                  {alert.timestamp
                    ? new Date(alert.timestamp).toLocaleString()
                    : "Unknown"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PoliceAlertsDashboard;
