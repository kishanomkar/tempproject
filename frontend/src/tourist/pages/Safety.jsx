import React, { useState } from 'react';
import { FiShield } from "react-icons/fi";
import { FaLocationDot, FaShieldHalved } from "react-icons/fa6";
import { createRoot } from 'react-dom/client';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { LuShieldCheck } from "react-icons/lu";
import { BsShieldCheck } from "react-icons/bs";
import { useEffect } from 'react';
import { FiWifiOff } from "react-icons/fi";
import { FaSignal } from "react-icons/fa6";
import { IoWarningOutline } from "react-icons/io5";
import { FaWifi } from "react-icons/fa";

const Safety = () => {

    const initialRisks = [
  { name: 'Overall Risk Level', value: 'Medium' },
  { name: 'Location', value: 'Low' },
  { name: 'Time Of Day', value: 'High' },
  { name: 'Crowd Density', value: 'Low' },
  { name: 'Weather Conditions', value: 'Low' },
  { name: 'Historical Incidents', value: 'Medium' },
];

  const [locationData, setLocationData] = useState({
    city: 'Downtown',
    lastUpdated: '2 min ago',
  });
  
  const [safetyScoreData, setSafetyScoreData] = useState({
    score: 95,
    status: 'Very Safe',
  });

  const [risks, setRisks] = useState(initialRisks);

  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [signalStrength, setSignalStrength] = useState(0);
  const [smsActive, setSmsActive] = useState(false);
  const [loading, setLoading] = useState(true);


  const getColorClass = (value) => {
    switch (value.toLowerCase()) {
      case 'low':
        return 'bg-[#008894]';
      case 'medium':
        return 'bg-[#A0BD00]';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-gray-400';
    }
  };


  return (

<div>

{/*Connection Status:-Offline */}
    <div className=" bg-gray-100 flex w-full p-4 sm:p-4">
    <div className="w-full  bg-[#FEF3F4] rounded-xl p-6 border-1 border-[#F8CACC] shadow-xl space-y-4">
        <div className="flex items-center text-[16px] font-semibold text-gray-800 border-b pb-4 mb-4 border-gray-200">
          <div className='flex items-center gap-2'>
            <span className='text-[#D40724]'>
          <FiWifiOff />
          </span>
          <span>Connection Status</span>
          </div>
        </div>
        
        <div className="flex justify-between  w-full flex-col">
    <div className="flex items-center space-x-2">
        <div className={`p-1 rounded-full`}>

        </div>
        <div className="flex items-center gap-1">
        <span className={`text-[12px] bg-[#d40724] text-white px-2 py-0.5 rounded-sm `}>Offline</span>
        <span className="text-sm text-gray-500 flex items-center gap-1 ml-2"> <FaSignal /> Signal: 1/4 </span>
        </div>
    </div>
    <div className="bg-[#F4EEDF] rounded-lg p-4 mt-4 flex items-start space-x-3 border border-amber-200">

      <div>
        <div className='flex items-center gap-2'>
        <span className='text-[#CBD583] text-xl'>
            <IoWarningOutline />
        </span>
        <h3 className="font-medium text-sm ">Offline Mode Active</h3>
        </div>
        <p className="text-sm mt-2">
          Internet connection lost. SMS fallback system activated for emergency communications.
        </p>
      </div>
    </div>


    </div>
        

        
    </div>

    </div>

{/*Connection Status:-Online */}

    <div className="flex justify-center items-center  bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full p-6">
        {/* Header */}
<div className='flex items-center gap-2 '>
    <span className='text-xl text-[#A0BD03]'>
<FaWifi />
    </span>
    <h1 className='font-medium'>Connection Status</h1>
</div>

<div className='flex mt-9 justify-between'>

<div className='flex items-center gap-2'>
        <h1 className='bg-[#009689] inline-block px-2 py-1 text-sm rounded-md text-white'>Online</h1>

    <div>
                <span className="text-sm text-gray-500 flex items-center gap-1 ml-2"> <FaSignal /> Signal: 1/4 </span>
    </div>
        </div>
    
    <h1 className='bg-[#009689] inline-block px-2 py-1 text-sm rounded-md text-white'>SMS Active</h1>

</div>

        {/* Contact List */}
        <div className="space-y-4">

        </div>
      </div>
    </div>

{/*Current Risk Assesment */}
    <div className="flex justify-center items-center  bg-gray-100 p-4 font-sans w-full">
      <div className="bg-white rounded-xl shadow-lg p-6  w-full">
        {/* Header */}
        <div className="flex items-center space-x-2 mb-6">
<div className='text-[#008894] font-black text-2xl'>
<FiShield />
</div>
          <h2 className="text-lg font-semibold text-gray-800">Current Risk Assessment</h2>
        </div>
        
        {/* Risk Items */}
        {risks.map((risk, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0 border-gray-200">
            <span className="text-gray-600 font-semibold text-sm">{risk.name}</span>
            <div
              className={`px-4 py-1 text-sm text-white  rounded-md ${getColorClass(risk.value)}`}
            >
              {risk.value}
            </div>
          </div>
        ))}
      </div>
    </div>


{/* Location and Saftey*/ }
    <div className="flex  w-full bg-gray-100 px-4 pb-2 font-sans">
      <div className="flex flex-col md:flex-row gap-6 w-full ">
        {/* Location Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between w-[100%] sm:w-[100%]">
          <div className="flex items-center text-gray-400 mb-4 gap-1">
            <div className='text-[#008894] text-xl'>
<HiOutlineLocationMarker />
            </div>
            <span className="text-sm font-semibold">Location</span>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{locationData.city}</h2>
            <p className="text-sm text-gray-500">
              Last updated: {locationData.lastUpdated}
            </p>
          </div>
        </div>

        {/* Safety Score Card */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 flex flex-col justify-between w-[100%] sm:w-[100%]">
          <div className="flex items-center text-gray-400 mb-4 gap-1">
<div className='text-[#A0BD03] font-black text-xl'>
<FiShield />
</div>
            <span className="text-sm font-semibold ">Safety Score</span>
          </div>
          <div className="flex flex-col">
            <h2 className={`text-xl font-bold mb-2 ${safetyScoreData.score > 80 ? 'text-[#A0BD03]' : 'text-[#FB2B37]'}`}>
              {safetyScoreData.score}%
            </h2>
            <p className="text-sm text-gray-500">
              {safetyScoreData.status}
            </p>
          </div>
        </div>
      </div>
    </div>



</div>

  );
};

export default Safety;
