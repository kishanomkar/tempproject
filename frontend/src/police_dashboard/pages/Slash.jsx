import React from 'react';
import { useNavigate } from 'react-router-dom';

// --- Icon Components (for a clean and consistent look) ---
const Icon = ({ path, className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
);

// --- Reusable Components for the Slash Grid ---

// StatCard for KPIs at the top
const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
    </div>
);

// A compact version of the AlertCard for the live feed
const CompactAlertCard = ({ alert }) => {
    const styles = {
        "SOS": { color: "bg-red-100 text-red-700", icon: <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /> },
        "Location Anomaly": { color: "bg-yellow-100 text-yellow-700", icon: <Icon path="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /> },
        "Default": { color: "bg-blue-100 text-blue-700", icon: <Icon path="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /> }
    };
    const { color, icon } = styles[alert.type] || styles.Default;

    return (
        <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg">
            <div className={`flex-shrink-0 p-2 rounded-full ${color}`}>{icon}</div>
            <div>
                <p className="text-sm font-semibold text-gray-800">{alert.type}</p>
                <p className="text-xs text-gray-600">{alert.message}</p>
            </div>
        </div>
    );
};

// --- Main Slash Component ---
const Slash = () => {
    const navigate = useNavigate();

    // --- MOCK DATA (replace with your API calls) ---
    const stats = {
        total: 8,
        domestic: 4,
        foreign: 4,
        alerts: 1,
    };
    const weather = {
        temp: 28,
        condition: "Clear skies",
        suggestion: "Sunny conditions may lead to larger crowds at outdoor heritage sites like Amber Fort and Hawa Mahal. Monitor these areas closely."
    };
    const anomalies = [
        { type: "SOS", message: "Signal from tourist ID 7A9B2C near Amber Fort.", id: 1 },
        { type: "Location Anomaly", message: "Tourist ID 4D5E6F has stopped moving for 30+ mins in a non-tourist area.", id: 2 },
    ];
    const alerts = [
        ...anomalies,
        { type: "General Info", message: "Traffic congestion reported near Ajmeri Gate.", id: 3 },
        { type: "Location Anomaly", message: "Tourist ID 9G8H7I has deviated from their planned itinerary.", id: 4 },
    ];

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                
                {/* --- Header --- */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Command Slash</h1>
                    <p className="text-gray-600 mt-2">
                        Summary of all tourist activities and alerts in Jaipur as of {new Date().toLocaleTimeString()}.
                    </p>
                </header>

                {/* --- Top Stat Cards --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard title="Total Monitored Tourists" value={stats.total} icon={<Icon path="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>} color="bg-blue-100 text-blue-600" />
                    <StatCard title="Domestic Tourists" value={stats.domestic} icon={<Icon path="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h2a2 2 0 002-2v-1a2 2 0 012-2h1.945a8.002 8.002 0 00-13.89 0zM10 2a8 8 0 100 16 8 8 0 000-16z"/>} color="bg-green-100 text-green-600" />
                    <StatCard title="Foreign Tourists" value={stats.foreign} icon={<Icon path="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 00-9-9m-9 9a9 9 0 019-9"/>} color="bg-indigo-100 text-indigo-600" />
                    <StatCard title="Active Alerts" value={stats.alerts} icon={<Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>} color="bg-red-100 text-red-600" />
                </div>

                {/* --- Main Content Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* --- Left Column --- */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Live Tourist Distribution</h2>
                            <button onClick={() => navigate('/nazar')} className="text-sm font-medium text-blue-600 hover:underline">View Full Map →</button>
                        </div>
                        {/* Mock Map Image - Replace with your actual map component if desired */}
                        <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                            <p className="text-gray-500">[Live Map Component Placeholder]</p>
                        </div>
                    </div>

                    {/* --- Right Column --- */}
                    <div className="space-y-8">
                        {/* Weather & Intel Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                             <h2 className="text-xl font-bold text-gray-800 mb-4">Weather & Intel</h2>
                             <div className="flex items-center gap-4">
                                <Icon path="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" className="w-16 h-16 text-yellow-500"/>
                                <div>
                                    <p className="text-3xl font-bold text-gray-800">{weather.temp}°C</p>
                                    <p className="text-gray-600">{weather.condition}</p>
                                </div>
                             </div>
                             <p className="text-sm text-gray-700 mt-4 bg-blue-50 p-3 rounded-lg border border-blue-200">{weather.suggestion}</p>
                        </div>
                        
                        {/* Priority Anomalies Card */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                             <h2 className="text-xl font-bold text-gray-800 mb-4">Priority Anomalies</h2>
                             <div className="space-y-2">
                                {anomalies.map(alert => <CompactAlertCard key={alert.id} alert={alert} />)}
                             </div>
                        </div>

                         {/* Quick Actions */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                             <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                             <div className="space-y-2">
                                <button onClick={() => navigate('/police/send-alert')} className="w-full text-left font-medium text-blue-600 hover:bg-gray-100 p-2 rounded-lg">Dispatch New Alert</button>
                                <button onClick={() => navigate('/police/alerts')} className="w-full text-left font-medium text-blue-600 hover:bg-gray-100 p-2 rounded-lg">View Full Alert Log</button>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Slash;