import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- Reusable SVG Icons ---
const FiAlertTriangle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const FiMapPin = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const FiInfo = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>;
const FiUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FiClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

// --- Alert Configuration (Updated for Light Mode) ---
const alertConfig = {
    'SOS': { icon: <FiAlertTriangle />, color: 'red-500', title: 'SOS Alerts' },
    'Location Anomaly': { icon: <FiMapPin />, color: 'yellow-500', title: 'Location Anomalies' },
    'General Info': { icon: <FiInfo />, color: 'blue-500', title: 'General Information' }
};

// --- Helper Functions ---
const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown time";
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

// --- Main Dashboard Component ---
const PoliceAlertsDashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const categorizedAlerts = React.useMemo(() => {
        const categories = { 'SOS': [], 'Location Anomaly': [], 'General Info': [] };
        alerts.forEach(alert => {
            if (categories[alert.type]) {
                categories[alert.type].push(alert);
            } else {
                 if(!categories['Other']) categories['Other'] = [];
                 categories['Other'].push(alert);
            }
        });
        return categories;
    }, [alerts]);

    useEffect(() => {
        const fetchAlerts = async () => {
            if (!alerts.length) setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("police token");
                const response = await fetch("http://localhost:3000/police/alert", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch alerts.');
                const data = await response.json();
                setAlerts(data);
            } catch (err) {
                setError('An error occurred while fetching alerts. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
        const intervalId = setInterval(fetchAlerts, 10000);
        return () => clearInterval(intervalId);
    }, []);

    if (loading) return <DashboardSkeleton />;
    if (error) return <div className="min-h-screen bg-slate-100 flex items-center justify-center text-red-600 text-xl">{error}</div>;

    return (
        <div className="min-h-screen bg-slate-100 text-slate-800 p-8 font-sans">
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-slate-900">Alerts Command Center</h1>
                <p className="mt-2 text-slate-600">Live feed of all incoming tourist-related alerts.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {Object.entries(categorizedAlerts).map(([category, alertsInCategory]) => {
                    const config = alertConfig[category] || { icon: <FiInfo />, color: 'gray-500', title: category };
                    const colorName = config.color.split('-')[0];
                    return (
                        <div key={category} className="bg-white rounded-xl shadow-md border border-gray-200">
                            <h2 className={`text-xl font-bold p-4 border-b-2 border-${config.color} text-slate-800 flex items-center gap-3`}>
                                <span className={`text-${config.color}`}>{config.icon}</span>
                                {config.title}
                                <span className={`ml-auto text-sm font-semibold bg-${colorName}-100 text-${colorName}-700 rounded-full px-2.5 py-0.5`}>
                                    {alertsInCategory.length}
                                </span>
                            </h2>
                            <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                                <AnimatePresence>
                                    {alertsInCategory.length > 0 ? (
                                        alertsInCategory.map((alert, index) => <AlertCard key={alert._id || index} alert={alert} color={config.color} />)
                                    ) : (
                                        <p className="text-slate-500 text-center py-8">No active {category.toLowerCase()} alerts.</p>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const AlertCard = ({ alert, color }) => {
    const lat = alert.location?.latitude ?? alert.location?.coordinates?.[1];
    const lng = alert.location?.longitude ?? alert.location?.coordinates?.[0];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`bg-slate-50 rounded-lg p-4 border border-slate-200 shadow-sm hover:border-${color} transition-colors`}
        >
            <div className="flex items-center gap-3 text-slate-500 text-sm mb-3">
                <FiUser />
                <span className="font-semibold text-slate-800">{alert.userId?.fullname || 'Unknown User'}</span>
            </div>
            <p className="text-slate-700 mb-4">{alert.message}</p>
            <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-200 pt-3">
                <div className="flex items-center gap-1.5">
                    <FiClock />
                    <span>{formatTimeAgo(alert.timestamp)}</span>
                </div>
                {lat !== undefined && lng !== undefined && (
                    <a href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                        <FiMapPin />
                        View on Map
                    </a>
                )}
            </div>
        </motion.div>
    );
};

const DashboardSkeleton = () => (
    <div className="min-h-screen bg-slate-100 p-8 animate-pulse">
        <div className="h-10 bg-slate-300 rounded w-1/3 mb-10"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-md border border-gray-200">
                    <div className="h-14 bg-slate-200 m-4 rounded"></div>
                    <div className="p-4 space-y-4">
                        <div className="h-24 bg-slate-200 rounded-lg"></div>
                        <div className="h-24 bg-slate-200 rounded-lg"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default PoliceAlertsDashboard;

