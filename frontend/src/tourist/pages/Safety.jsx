// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { FiWifi, FiWifiOff, FiShield, FiMapPin, FiBarChart2, FiAlertTriangle } from "react-icons/fi";

// // --- Helper Components ---

// const SafetyScoreGauge = ({ score }) => {
//     const radius = 60;
//     const circumference = 2 * Math.PI * radius;
//     const offset = circumference - (score / 100) * circumference;
    
//     let scoreColor, statusText;
//     if (score > 80) {
//         scoreColor = 'text-green-500';
//         statusText = 'Very Safe';
//     } else if (score > 60) {
//         scoreColor = 'text-yellow-500';
//         statusText = 'Good';
//     } else if (score > 40) {
//         scoreColor = 'text-orange-500';
//         statusText = 'Moderate Risk';
//     } else {
//         scoreColor = 'text-red-500';
//         statusText = 'High Risk';
//     }

//     return (
//         <div className="relative flex items-center justify-center w-40 h-40">
//             <svg className="transform -rotate-90" width="100%" height="100%" viewBox="0 0 140 140">
//                 <circle cx="70" cy="70" r={radius} stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
//                 <motion.circle
//                     cx="70"
//                     cy="70"
//                     r={radius}
//                     stroke={scoreColor.replace('text-', '')} // Use actual color value
//                     strokeWidth="12"
//                     fill="transparent"
//                     strokeDasharray={circumference}
//                     strokeLinecap="round"
//                     initial={{ strokeDashoffset: circumference }}
//                     animate={{ strokeDashoffset: offset }}
//                     transition={{ duration: 1, ease: "easeOut" }}
//                 />
//             </svg>
//             <div className="absolute flex flex-col items-center justify-center">
//                 <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
//                 <span className="text-sm font-semibold text-gray-600">{statusText}</span>
//             </div>
//         </div>
//     );
// };

// const RiskFactorBar = ({ name, value }) => {
//     let width, color;
//     switch (value.toLowerCase()) {
//         case 'low': width = 'w-1/4'; color = 'bg-green-500'; break;
//         case 'medium': width = 'w-1/2'; color = 'bg-yellow-500'; break;
//         case 'high': width = 'w-full'; color = 'bg-red-500'; break;
//         default: width = 'w-0'; color = 'bg-gray-400';
//     }
//     return (
//         <div>
//             <div className="flex justify-between items-center mb-1">
//                 <span className="text-sm font-medium text-gray-600">{name}</span>
//                 <span className={`text-xs font-bold ${color.replace('bg-', 'text-')}`}>{value}</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//                 <motion.div
//                     className={`h-2 rounded-full ${color}`}
//                     initial={{ width: 0 }}
//                     animate={{ width }}
//                     transition={{ duration: 0.5 }}
//                 ></motion.div>
//             </div>
//         </div>
//     );
// };

// const InfoCard = ({ icon, title, children, className = '' }) => (
//     <motion.div
//         className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 ${className}`}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//     >
//         <div className="flex items-center gap-3 mb-4">
//             {icon}
//             <h2 className="text-lg font-bold text-gray-800">{title}</h2>
//         </div>
//         {children}
//     </motion.div>
// );

// const SkeletonCard = () => (
//     <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 animate-pulse">
//         <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
//         <div className="space-y-3">
//             <div className="h-4 bg-gray-200 rounded w-full"></div>
//             <div className="h-4 bg-gray-200 rounded w-5/6"></div>
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//         </div>
//     </div>
// );


// // --- Main Safety Component ---
// const Safety = () => {
//     const [isLoading, setIsLoading] = useState(true);
//     const [isOnline, setIsOnline] = useState(true);
//     const [safetyData, setSafetyData] = useState(null);

//     const generateRandomData = () => {
//         const riskLevels = ['Low', 'Medium', 'High'];
//         const getRandomRisk = () => riskLevels[Math.floor(Math.random() * 3)];
        
//         return {
//             location: { city: 'Hawa Mahal Area', lastUpdated: new Date().toLocaleTimeString() },
//             safetyScore: { score: Math.floor(Math.random() * 15) + 80 },
//             risks: [
//                 { name: 'Overall Safety', value: new Date().getHours() > 19 || new Date().getHours() < 6 ? 'Excellent' : 'Good' },
//                 { name: 'Crowd Density', value: "Low" },
//                 { name: 'Historical Incidents', value: 'Low' },
//                 { name: 'Weather Conditions', value: 'Sunny' },
//             ]
//         };
//     };

//     useEffect(() => {
//         // Initial load
//         setTimeout(() => {
//             setSafetyData(generateRandomData());
//             setIsLoading(false);
//         }, 1500);

//         // Live update interval
//         const interval = setInterval(() => {
//             setSafetyData(generateRandomData());
//         }, 3600000);

//         return () => clearInterval(interval);
//     }, []);

//     const getSafetyTip = () => {
//         const highRiskFactor = safetyData?.risks.find(r => r.value === 'High');
//         if (highRiskFactor?.name === 'Time Of Day') {
//             return "It's late. Stick to well-lit main roads and avoid isolated areas.";
//         }
//         if (highRiskFactor?.name === 'Crowd Density') {
//             return "Area is crowded. Be aware of your surroundings and keep belongings secure.";
//         }
//         if (safetyData?.safetyScore.score < 50) {
//             return "Risk level is elevated. Consider leaving the area or staying vigilant.";
//         }
//         return "Stay aware of your surroundings and keep your phone charged.";
//     };

//     if (isLoading) {
//         return (
//             <div className="min-h-screen bg-gray-100 p-8">
//                 <div className="h-10 bg-gray-300 rounded w-1/3 mb-8 animate-pulse"></div>
//                 <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//                     <SkeletonCard />
//                     <SkeletonCard />
//                     <SkeletonCard />
//                     <SkeletonCard />
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
//             <div className="max-w-7xl mx-auto">
//                 <header className="mb-8">
//                     <h1 className="text-4xl font-bold text-gray-900">Live Safety Dashboard</h1>
//                     <p className="text-gray-600 mt-2">
//                         Last updated: <span className="font-semibold">{safetyData.location.lastUpdated}</span>
//                     </p>
//                 </header>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//                     <InfoCard icon={<FiShield className="w-6 h-6 text-blue-500" />} title="Live Safety Score" className="lg:col-span-2 flex flex-col items-center text-center">
//                         <SafetyScoreGauge score={safetyData.safetyScore.score} />
//                     </InfoCard>

//                     <InfoCard icon={<FiBarChart2 className="w-6 h-6 text-amber-500" />} title="Current Risk Factors" className="lg:col-span-2">
//                         <div className="space-y-4">
//                             {safetyData.risks.map((risk) => (
//                                 <RiskFactorBar key={risk.name} name={risk.name} value={risk.value} />
//                             ))}
//                         </div>
//                     </InfoCard>

//                     <InfoCard icon={<FiAlertTriangle className="w-6 h-6 text-red-500" />} title="Actionable Safety Tip" className="md:col-span-2 lg:col-span-4">
//                         <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
//                             <p className="font-semibold">{getSafetyTip()}</p>
//                         </div>
//                     </InfoCard>
                    
//                     <InfoCard icon={<FiWifi className="w-6 h-6 text-green-500" />} title="Connection Status" className="lg:col-span-2">
//                         {isOnline ? (
//                              <div className="font-semibold text-green-700">Connected & Secure</div>
//                         ) : (
//                              <div className="font-semibold text-red-700">Offline Mode Active (SMS Fallback)</div>
//                         )}
//                     </InfoCard>
                    
//                     <InfoCard icon={<FiMapPin className="w-6 h-6 text-indigo-500" />} title="Current Location" className="lg:col-span-2">
//                          <h3 className="text-xl font-bold text-gray-800">{safetyData.location.city}</h3>
//                     </InfoCard>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Safety;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiWifi, FiShield, FiMapPin, FiBarChart2, FiAlertTriangle, FiPhoneCall } from "react-icons/fi";

// --- Helper Components ---

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
                <circle cx="70" cy="70" r={radius} stroke="#f3f4f6" strokeWidth="12" fill="transparent" />
                <motion.circle
                    cx="70"
                    cy="70"
                    r={radius}
                    stroke={scoreColor.replace('text-', '')}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${scoreColor}`}>{score}</span>
                <span className="text-sm font-semibold text-gray-600">{statusText}</span>
            </div>
        </div>
    );
};

const RiskFactorBar = ({ name, value }) => {
    let width, color;
    switch (value.toLowerCase()) {
        case 'low': width = 'w-1/4'; color = 'bg-green-500'; break;
        case 'medium': width = 'w-1/2'; color = 'bg-yellow-500'; break;
        case 'high': width = 'w-full'; color = 'bg-red-500'; break;
        default: width = 'w-0'; color = 'bg-gray-400';
    }
    return (
        <div>
            <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-600">{name}</span>
                <span className={`text-xs font-bold ${color.replace('bg-', 'text-')}`}>{value}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                    className={`h-2 rounded-full ${color}`}
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{ duration: 0.5 }}
                ></motion.div>
            </div>
        </div>
    );
};

const InfoCard = ({ icon, title, children, className = '' }) => (
    <motion.div
        className={`bg-white p-6 rounded-xl shadow-md border border-gray-200 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="flex items-center gap-3 mb-4">
            {icon}
            <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        {children}
    </motion.div>
);

const SkeletonCard = () => (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
    </div>
);

// --- Emergency Call Functions ---
const callAmbulance = () => { window.location.href = "tel:108"; }; // Ambulance India
const callPolice = () => { window.location.href = "tel:100"; };    // Police India
const callFire = () => { window.location.href = "tel:101"; };      // Fire Brigade
const callWomenHelpline = () => { window.location.href = "tel:1091"; }; // Women Helpline

// --- Main Safety Component ---
const Safety = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [safetyData, setSafetyData] = useState(null);

    const generateRandomData = () => {
        const riskLevels = ['Low', 'Medium', 'High'];
        const getRandomRisk = () => riskLevels[Math.floor(Math.random() * 3)];
        
        return {
            location: { city: 'Hawa Mahal Area', lastUpdated: new Date().toLocaleTimeString() },
            safetyScore: { score: Math.floor(Math.random() * 15) + 80 },
            risks: [
                { name: 'Overall Safety', value: new Date().getHours() > 19 || new Date().getHours() < 6 ? 'Excellent' : 'Good' },
                { name: 'Crowd Density', value: "Low" },
                { name: 'Historical Incidents', value: 'Low' },
                { name: 'Weather Conditions', value: 'Sunny' },
            ]
        };
    };

    useEffect(() => {
        setTimeout(() => {
            setSafetyData(generateRandomData());
            setIsLoading(false);
        }, 1500);

        const interval = setInterval(() => {
            setSafetyData(generateRandomData());
        }, 3600000);

        return () => clearInterval(interval);
    }, []);

    const getSafetyTip = () => {
        const highRiskFactor = safetyData?.risks.find(r => r.value === 'High');
        if (highRiskFactor?.name === 'Time Of Day') {
            return "It's late. Stick to well-lit main roads and avoid isolated areas.";
        }
        if (highRiskFactor?.name === 'Crowd Density') {
            return "Area is crowded. Be aware of your surroundings and keep belongings secure.";
        }
        if (safetyData?.safetyScore.score < 50) {
            return "Risk level is elevated. Consider leaving the area or staying vigilant.";
        }
        return "Stay aware of your surroundings and keep your phone charged.";
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="h-10 bg-gray-300 rounded w-1/3 mb-8 animate-pulse"></div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Live Safety Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                        Last updated: <span className="font-semibold">{safetyData.location.lastUpdated}</span>
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <InfoCard icon={<FiShield className="w-6 h-6 text-blue-500" />} title="Live Safety Score" className="lg:col-span-2 flex flex-col items-center text-center">
                        <SafetyScoreGauge score={safetyData.safetyScore.score} />
                    </InfoCard>

                    <InfoCard icon={<FiBarChart2 className="w-6 h-6 text-amber-500" />} title="Current Risk Factors" className="lg:col-span-2">
                        <div className="space-y-4">
                            {safetyData.risks.map((risk) => (
                                <RiskFactorBar key={risk.name} name={risk.name} value={risk.value} />
                            ))}
                        </div>
                    </InfoCard>

                    <InfoCard icon={<FiAlertTriangle className="w-6 h-6 text-red-500" />} title="Actionable Safety Tip" className="md:col-span-2 lg:col-span-4">
                        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                            <p className="font-semibold">{getSafetyTip()}</p>
                        </div>
                    </InfoCard>
                    
                    <InfoCard icon={<FiWifi className="w-6 h-6 text-green-500" />} title="Connection Status" className="lg:col-span-2">
                        {isOnline ? (
                             <div className="font-semibold text-green-700">Connected & Secure</div>
                        ) : (
                             <div className="font-semibold text-red-700">Offline Mode Active (SMS Fallback)</div>
                        )}
                    </InfoCard>
                    
                    <InfoCard icon={<FiMapPin className="w-6 h-6 text-indigo-500" />} title="Current Location" className="lg:col-span-2">
                         <h3 className="text-xl font-bold text-gray-800">{safetyData.location.city}</h3>
                    </InfoCard>

                    {/* 🚨 Emergency Call Section */}
                    <InfoCard icon={<FiPhoneCall className="w-6 h-6 text-red-600" />} title="Emergency Calls" className="md:col-span-2 lg:col-span-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <button onClick={callAmbulance} className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold">🚑 Ambulance</button>
                            <button onClick={callPolice} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">👮 Police</button>
                            <button onClick={callFire} className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold">🔥 Fire</button>
                            <button onClick={callWomenHelpline} className="px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold">👩 Women Helpline</button>
                        </div>
                    </InfoCard>
                </div>
            </div>
        </div>
    );
};

export default Safety;
