import React from 'react';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// --- Mock Secret ID Logic (to resolve import error) ---
const getSecretId = () => "SECRET12345"; // This simulates a valid secret ID

// --- Helper Components & Icons ---
const CheckIcon = () => (
    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
        <svg className="w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
    </div>
);

const DomesticIcon = () => (
    <svg className="w-12 h-12 text-orange-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M4.92893 4.92893L19.0711 19.0711" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M4.92893 19.0711L19.0711 4.92893" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M2 12L22 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M12 2L12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
);

const ForeignIcon = () => (
    <svg className="w-12 h-12 text-indigo-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12Z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

// --- Main Selection Page Component ---
export default function SelectionPage() {
    const [userType, setUserType] = useState("");
    const navigate = useNavigate();
    const secretId = getSecretId();

    const handleProceed = () => {
        if (userType === "domestic") {
            navigate("/registerDomesticTourist");
        } else if (userType === "foreign") {
            navigate("/registerForeignTourist");
        }
    };

    if (!secretId) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4 text-center">
                <div className="bg-white p-10 rounded-2xl shadow-2xl">
                    <svg className="w-16 h-16 mx-auto text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h2 className="mt-6 text-3xl font-bold text-slate-800">Access Denied</h2>
                    <p className="text-slate-500 mt-2 max-w-sm">
                        This registration page can only be accessed after verifying a valid QR code. Please return to the scanning page to proceed.
                    </p>
                    <button onClick={() => navigate("/")} className="mt-8 w-full py-3 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition">
                        Back to Scanner
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="hidden md:block bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1524230507669-3ff94f421501?q=80&w=1887&auto=format&fit=crop')"}}>
                     <div className="h-full bg-slate-900/50 p-8 flex flex-col justify-end text-white">
                        <h2 className="text-3xl font-bold">Begin Your Journey</h2>
                        <p className="mt-2 text-slate-200">Select your registration type to get started with our secure smart tourist system.</p>
                    </div>
                </div>

                <div className="p-8 flex flex-col justify-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Registration Type</h1>
                        <p className="text-slate-500 mt-2">Please select one of the options below to continue.</p>
                    </div>

                    <div className="space-y-4 my-8">
                        <SelectionCard
                            icon={<DomesticIcon />}
                            title="Domestic Tourist"
                            description="For residents of India."
                            isSelected={userType === "domestic"}
                            onClick={() => setUserType("domestic")}
                        />
                        <SelectionCard
                            icon={<ForeignIcon />}
                            title="Foreign Tourist"
                            description="For international visitors."
                            isSelected={userType === "foreign"}
                            onClick={() => setUserType("foreign")}
                        />
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleProceed}
                            disabled={!userType}
                            className="w-full py-4 px-6 rounded-xl text-lg font-bold text-white bg-slate-800 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                        >
                            Proceed
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SelectionCard = ({ icon, title, description, isSelected, onClick }) => (
    <motion.button
        type="button"
        onClick={onClick}
        animate={isSelected ? { scale: 1.02 } : { scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ease-in-out ${
            isSelected ? "bg-blue-50 border-blue-600 shadow-lg" : "bg-slate-100 border-slate-200 hover:bg-slate-200"
        }`}
    >
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                {icon}
                <div>
                    <h3 className={`text-xl font-bold ${isSelected ? 'text-blue-800' : 'text-slate-800'}`}>{title}</h3>
                    <p className={`text-sm ${isSelected ? 'text-blue-600' : 'text-slate-500'}`}>{description}</p>
                </div>
            </div>
            {isSelected && <CheckIcon />}
        </div>
    </motion.button>
);

