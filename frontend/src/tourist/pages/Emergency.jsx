import React, { useState } from 'react';
import { FaCarCrash } from "react-icons/fa";
import { IoMedical, IoShieldSharp } from "react-icons/io5";
import { GoAlertFill } from "react-icons/go";
import { FiPhoneCall } from "react-icons/fi";
import { LuSiren } from "react-icons/lu";

// --- Main Emergency Component ---
const Emergency = () => {
    // --- State Management ---
    const [selectedType, setSelectedType] = useState(null);
    const [selectedNumbers, setSelectedNumbers] = useState([]);
    const [message, setMessage] = useState("");

    // --- Static Data ---
    const emergencyTypes = [
        { id: 1, type: 'Medical', icon: <IoMedical />, color: 'bg-blue-500 hover:bg-blue-600' },
        { id: 2, type: 'Security', icon: <IoShieldSharp />, color: 'bg-indigo-500 hover:bg-indigo-600' },
        { id: 3, type: 'Accident', icon: <FaCarCrash />, color: 'bg-amber-500 hover:bg-amber-600' },
        { id: 4, type: 'Other', icon: <GoAlertFill />, color: 'bg-gray-500 hover:bg-gray-600' },
    ];

    const emergencyContacts = [
        { name: 'Local Police', eta: '3-5 min', status: 'Available' },
        { name: 'Emergency Medical', eta: '4-7 min', status: 'Available' },
        { name: 'Tourist Police', eta: '2-4 min', status: 'Available' },
        { name: 'Hotel Security', eta: '1-3 min', status: 'Busy' },
    ];
    
    const smsNumbers = ['8104633321', '7340157703', '9256782078'];

    // --- Event Handlers ---
    const handleNumberToggle = (number) => {
        setSelectedNumbers(prev =>
            prev.includes(number)
                ? prev.filter(n => n !== number)
                : [...prev, number]
        );
    };

    const handleSendSms = () => {
        if (!message || selectedNumbers.length === 0) {
            alert("Please select at least one number and write a message.");
            return;
        }
        console.log(`Sending SMS: "${message}" to ${selectedNumbers.join(', ')}`);
        // Add your API call logic here
        alert("SMS Sent!");
        setMessage("");
        setSelectedNumbers([]);
    };
    
    const isSmsSendDisabled = !message.trim() || selectedNumbers.length === 0;

    return (
        <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* --- Header --- */}
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Emergency Command Center</h1>
                    <p className="text-gray-600 mt-2">Select an emergency type or contact services directly.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* --- Left Column: Emergency Selection & Contacts --- */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Emergency Type Selection */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Select Emergency Type</h2>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                {/* SOS Button */}
                                <button
                                    onClick={() => setSelectedType('SOS')}
                                    className={`md:col-span-2 flex flex-col items-center justify-center p-6 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 ${selectedType === 'SOS' ? 'ring-4 ring-offset-2 ring-red-400' : ''}`}
                                >
                                    <LuSiren className="w-10 h-10 mb-2" />
                                    <span className="font-bold text-lg">SOS ALERT</span>
                                </button>
                                {/* Other Emergency Types */}
                                <div className="md:col-span-3 grid grid-cols-2 gap-4">
                                    {emergencyTypes.map(item => (
                                        <button
                                            key={item.id}
                                            onClick={() => setSelectedType(item.id)}
                                            className={`flex flex-col items-center justify-center p-4 text-white rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 ${item.color} ${selectedType === item.id ? 'ring-4 ring-offset-2 ring-blue-400' : ''}`}
                                        >
                                            <div className="text-3xl mb-1">{item.icon}</div>
                                            <span className="text-sm font-medium">{item.type}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contacts List */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Emergency Contacts</h2>
                            <div className="space-y-4">
                                {emergencyContacts.map((contact, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex items-center">
                                            <span className={`block h-3 w-3 rounded-full mr-4 ${contact.status === 'Available' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                            <div>
                                                <div className="font-medium text-gray-800">{contact.name}</div>
                                                <div className="text-sm text-gray-500">ETA: {contact.eta}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`py-1 px-3 text-xs font-semibold rounded-full ${contact.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                {contact.status}
                                            </span>
                                            <button className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors">
                                                <FiPhoneCall className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* --- Right Column: SMS System --- */}
                    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 mb-6">Emergency SMS System</h2>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">1. Select Recipients</label>
                            <div className="space-y-2 bg-gray-50 p-3 rounded-md border">
                                {smsNumbers.map(number => (
                                    <label key={number} className="flex items-center gap-3 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={selectedNumbers.includes(number)}
                                            onChange={() => handleNumberToggle(number)}
                                            className="w-5 h-5 accent-blue-600 rounded"
                                        />
                                        <span className="text-gray-700">{number}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="mt-6">
                            <label htmlFor="sms-message" className="block text-sm font-medium text-gray-700 mb-2">2. Write Message</label>
                            <textarea
                                id="sms-message"
                                placeholder="Describe the situation briefly..."
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="5"
                            />
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={handleSendSms}
                                disabled={isSmsSendDisabled}
                                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            >
                                Send Emergency SMS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Emergency;