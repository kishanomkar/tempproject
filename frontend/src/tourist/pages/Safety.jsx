import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- SVG Icon Components (Replaced react-icons) ---

const IconShield = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
);

const IconMapPin = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
    </svg>
);

const IconBarChart2 = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"></line>
        <line x1="12" y1="20" x2="12" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="14"></line>
    </svg>
);

const IconAlertTriangle = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const IconPhoneCall = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2a19.79 19.79 0 0 1-8.63-3.07a19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 3 6.18A2 2 0 0 1 5.02 4h3a2 2 0 0 1 2 1.72a12.84 12.84 0 0 0 .7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45a12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.98z"></path>
    </svg>
);

const IconClock = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
);

const IconCloud = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
    </svg>
);

const IconUsers = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
);

// --- Sub-Components ---

const SafetyScoreGauge = ({ score }) => {
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    
    let scoreColor, statusText;
    if (score > 80) {
        scoreColor = 'text-green-500';
        statusText = 'Very Safe';
    } else if (score > 60) {
        scoreColor = 'text-yellow-500';
        statusText = 'Good';
    } else if (score > 40) {
        scoreColor = 'text-orange-500';
        statusText = 'Moderate Risk';
    } else {
        scoreColor = 'text-red-500';
        statusText = 'High Risk';
    }

    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 140 140">
                <circle 
                    cx="70" cy="70" r={radius} 
                    stroke="#e5e7eb" strokeWidth="12" fill="none" />
                <circle 
                    cx="70" cy="70" r={radius} 
                    stroke="currentColor" strokeWidth="12" fill="none" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={offset} 
                    strokeLinecap="round"
                    className={scoreColor} 
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }} 
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-5xl font-bold ${scoreColor}`}>{score}</span>
                <span className="text-sm font-semibold text-gray-700">{statusText}</span>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, title, children, className = '' }) => (
    <motion.div
        className={`backdrop-blur-md bg-white/70 p-6 rounded-2xl shadow-lg border border-white/30 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white rounded-full shadow-md">
                {icon}
            </div>
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </motion.div>
);

const RiskItem = ({ icon, name, value }) => {
    let barColor, textColor;
    switch (value) {
        case 'High':
            barColor = 'bg-red-500';
            textColor = 'text-red-700';
            break;
        case 'Medium':
            barColor = 'bg-yellow-500';
            textColor = 'text-yellow-700';
            break;
        default:
            barColor = 'bg-green-500';
            textColor = 'text-green-700';
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-gray-700">
                    {icon}
                    <span className="font-semibold">{name}</span>
                </div>
                <span className={`font-bold ${textColor}`}>{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                    className={`h-2.5 rounded-full ${barColor}`} 
                    style={{ 
                        width: value === 'High' ? '100%' : value === 'Medium' ? '66%' : '33%',
                        transition: 'width 0.5s ease'
                    }}
                ></div>
            </div>
        </div>
    );
};

const SkeletonGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Array(6).fill(0).map((_, i) => (
            <div 
                key={i} 
                className={`bg-white/50 p-6 rounded-2xl shadow-lg animate-pulse ${i === 0 ? 'lg:col-span-2' : ''} ${i === 1 ? 'lg:col-span-2' : ''} ${i === 2 ? 'lg:col-span-4' : ''} ${i === 3 ? 'lg:col-span-2' : ''} ${i === 4 ? 'lg:col-span-2' : ''}`}
            >
                <div className="h-8 bg-gray-300 rounded-md w-1/2 mb-4"></div>
                <div className="h-24 bg-gray-300 rounded-md"></div>
            </div>
        ))}
    </div>
);

// Emergency Call Functions
const callAmbulance = () => { window.location.href = "tel:108"; };
const callPolice = () => { window.location.href = "tel:100"; };
const callFire = () => { window.location.href = "tel:101"; };
const callWomenHelpline = () => { window.location.href = "tel:1091"; };
const callChildHelpline = () => { window.location.href = "tel:1098"; };

// --- Main Component ---

const Safety = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [safetyData, setSafetyData] = useState(null);

    useEffect(() => {
        const fetchData = (latitude, longitude) => {
            setIsLoading(true);
            // Simulating API fetch delay
            setTimeout(() => {
                fetch(`http://localhost:4000/api/tourist/safety-data?lat=${latitude}&lon=${longitude}`)
                    .then(res => {
                        if (!res.ok) throw new Error('Network response was not ok');
                        return res.json();
                    })
                    .then(data => {
                        setSafetyData(data);
                        setIsLoading(false);
                    }) 
                    .catch(error => {
                        console.error("Error fetching safety data:", error);
                        // Set mock data on failure so the UI still displays something
                        setSafetyData({
                            location: { city: "Jaipur", lastUpdated: "07:00 AM" },
                            safetyScore: { score: 75 },
                            risks: [
                                { name: "Time of Day", value: "Medium" },
                                { name: "Weather", value: "Low" },
                                { name: "Crowd Density", value: "Medium" }
                            ],
                            tip: "Could not fetch live data. Stay aware of your surroundings."
                        });
                        setIsLoading(false);
                    });
            }, 1500); // 1.5 second delay for skeleton loader visibility
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    fetchData(latitude, longitude);
                },
                (error) => {
                    console.error("Error getting location, falling back to default.", error);
                    fetchData(26.9124, 75.7873); // Default to Jaipur
                }
            );
        } else {
            console.log("Geolocation not supported, falling back to default.");
            fetchData(26.9124, 75.7873);
        }
    }, []);

    const getSafetyTip = () => safetyData?.tip || "Stay aware of your surroundings and keep your phone charged.";

    const getRiskValue = (riskName) => {
        const risk = safetyData?.risks.find(r => r.name === riskName);
        return risk ? risk.value : 'Low';
    };

    if (isLoading || !safetyData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 font-sans p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <div className="h-10 bg-gray-300 rounded-md w-1/3 mb-2 animate-pulse"></div>
                        <div className="h-6 bg-gray-300 rounded-md w-1/2 animate-pulse"></div>
                    </header>
                    <SkeletonGrid />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-purple-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Safety Dashboard</h1>
                    <p className="text-lg text-gray-600">
                        Live safety insights for your current location.<br />
                        Last updated: <span className="font-semibold text-gray-800">{safetyData.location?.lastUpdated}</span>
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    <InfoCard 
                        icon={<IconShield className="w-6 h-6 text-blue-500" />} 
                        title="Live Safety Score" 
                        className="lg:col-span-2 flex flex-col items-center justify-center text-center"
                    >
                        <SafetyScoreGauge score={safetyData.safetyScore?.score} />
                    </InfoCard>

                    <InfoCard 
                        icon={<IconBarChart2 className="w-6 h-6 text-amber-500" />} 
                        title="Current Risk Factors" 
                        className="lg:col-span-2"
                    >
                        <div className="grid grid-cols-1 gap-4">
                            <RiskItem 
                                icon={<IconClock />} 
                                name="Time of Day" 
                                value={getRiskValue("Time of Day")} 
                            />
                            <RiskItem 
                                icon={<IconCloud />} 
                                name="Weather" 
                                value={getRiskValue("Weather")} 
                            />
                            <RiskItem 
                                icon={<IconUsers />} 
                                name="Crowd Density" 
                                value={getRiskValue("Crowd Density")} 
                            />
                        </div>
                    </InfoCard>

                    <InfoCard 
                        icon={<IconAlertTriangle className="w-6 h-6 text-blue-600" />} 
                        title="Actionable Safety Tip" 
                        className="md:col-span-2 lg:col-span-4 bg-blue-50/70 border-blue-200/80"
                    >
                        <p className="text-xl font-semibold text-blue-800">{getSafetyTip()}</p>
                    </InfoCard>

                    <InfoCard 
                        icon={<IconMapPin className="w-6 h-6 text-indigo-500" />} 
                        title="Current Location" 
                        className="lg:col-span-2"
                    >
                        <h3 className="text-4xl font-bold text-gray-800">Malviya Nagar</h3>
                        <p className="text-gray-600">Jaipur, Rajasthan, India</p>
                    </InfoCard>
                    
                    <InfoCard 
                        icon={<IconPhoneCall className="w-6 h-6 text-red-600" />} 
                        title="Emergency Calls" 
                        className="md:col-span-2 lg:col-span-2"
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[
                                { name: "Ambulance", handler: callAmbulance },
                                { name: "Police", handler: callPolice },
                                { name: "Fire", handler: callFire },
                                { name: "Women", handler: callWomenHelpline, short: "Women" },
                                { name: "Child", handler: callChildHelpline, short: "Child" },
                            ].map((btn) => (
                                <button 
                                    key={btn.name}
                                    onClick={btn.handler} 
                                    className="text-white rounded-lg py-3 px-2 text-center font-bold shadow-lg transition-all duration-300 ease-in-out bg-red-500 hover:bg-red-600 hover:shadow-xl hover:-translate-y-1"
                                >
                                    <span className="sm:hidden">{btn.short || btn.name}</span>
                                    <span className="hidden sm:inline">{btn.name} Helpline</span>
                                </button>
                            ))}
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default Safety;