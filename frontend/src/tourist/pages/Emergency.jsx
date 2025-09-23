import React, { useState } from 'react';
import { FaTruckMedical } from "react-icons/fa6";
import { TiWarningOutline } from "react-icons/ti";
import { IoShield } from "react-icons/io5";
import { FaCarCrash } from "react-icons/fa";
import { GoAlertFill } from "react-icons/go";
import { CiMobile1 } from "react-icons/ci";

// Main App component
const Emergency = () => {
  // Use state to manage the emergency types
  const [emergencyTypes, setEmergencyTypes] = useState([
    {
      id: 1,
      type: 'Medical Emergency',
      icon: (
<FaTruckMedical />
      ),
      color: 'bg-[#D40724]',
    },
    {
      id: 2,
      type: 'Security Threat',
      icon: (
<IoShield />
      ),
      color: 'bg-[#D40724]',
    },
    {
      id: 3,
      type: 'Accident',
      icon: (
<FaCarCrash />
      ),
      color: 'bg-[#A0BD00]',
    },
    {
      id: 4,
      type: 'Other Emergency',
      icon: (
<GoAlertFill />
      ),
      color: 'bg-[#A0BD00]',
    },
  ]);


  const [selectedType, setSelectedType] = useState(null);

  const handleSelect = (id) => {
    setSelectedType(id);
    // You can add logic here to handle the selection,
    // like navigating to another page or showing a form.
    console.log(`Emergency type with id ${id} selected.`);
  };

    const emergencyContacts = [
    { name: 'Local Police', eta: '3-5 min', status: 'Available' },
    { name: 'Emergency Medical', eta: '4-7 min', status: 'Available' },
    { name: 'Tourist Police', eta: '2-4 min', status: 'Available' },
    { name: 'Hotel Security', eta: '1-3 min', status: 'Busy' },
  ];

  const [number, setNumber] = useState([]);
  const numbers = ['8104633321', '7340157703', '9256782078'];

  const handleChange = (number) => {
    setNumber((prev) =>
      prev.includes(number)
        ? prev.filter((n) => n !== number) 
        : [...prev, number]               
    );
  };


  return (
<>
{/*Emergency Buttons */}
    <div className="flex w-full bg-gray-100 p-4">
      <div className=" w-full bg-white shadow-xl rounded-2xl p-6 ">
        <div className="flex items-center text-xl font-semibold text-gray-800 mb-6 ">
          <span className="text-red-500 mr-2 text-2xl">
<TiWarningOutline />

          </span>
          <p className='text-sm'>Emergency Type</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {emergencyTypes.map((item) => (
            <div
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`p-4 pt-3 rounded-lg text-white cursor-pointer transition-all duration-300 transform hover:scale-105 ${item.color} ${selectedType === item.id ? 'ring-4 ring-offset-2 ring-lime-500' : ''}`}
            >
              <div className="flex flex-col items-center justify-center space-y-2.5">
                <span className="text-white">{item.icon}</span>
                <span className="text-sm font-medium text-center">{item.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

{/* Emergency Contacts */}
    <div className="flex justify-center items-center  bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full  p-6">
        {/* Header */}
        <div className="flex items-center text-gray-700 mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 mr-3 text-[#009689]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <h1 className="text-xl font-semibold">Emergency Contacts</h1>
        </div>
        {/* Contact List */}
        <div className="space-y-4">
          {emergencyContacts.map((contact, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            >
              {/* Status and Details */}
              <div className="flex items-center">
                <span
                  className={`block h-3 w-3 rounded-full ${
                    contact.status === 'Available' ? 'bg-[#009689]' : 'bg-gray-400'
                  } mr-4`}
                ></span>
                <div>
                  <div className="font-medium text-gray-800">{contact.name}</div>
                  <div className="text-sm text-gray-500">ETA: {contact.eta}</div>
                </div>
              </div>
              {/* Status Tag and Call Button */}
              <div className="flex items-center space-x-2">
                <span
                  className={`py-1 px-3 text-sm font-semibold rounded-full ${
                    contact.status === 'Available'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {contact.status}
                </span>
                <button className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>



    <div className="flex w-full justify-center items-center  bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full  p-6">
        {/* Header */}
        <div className="flex items-center text-gray-700 mb-6 gap-2">
            <span className='text-2xl text-[#009689]'>
                <CiMobile1 />
            </span>
          <h1 className="text-md font-semibold">Emergency SMS System</h1>
        
        </div>
<div className=" max-w-sm bg-white rounded-xl px-4">
      <h2 className="font-semibold text-lg mb-4">Select Numbers</h2>
      <div className="flex flex-col gap-3">
        {numbers.map((s) => (
          <label key={s} className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={number.includes(s)}
              onChange={() => handleChange(s)}
              className="w-5 h-5 accent-blue-600"
            />
            <span>{s}</span>
          </label>
        ))}
      </div>


    </div>

    <hr className='my-6 border-t-0 border-gray-300' />

<div className=" px-2 mb-6">
  <input
    type="text"
    placeholder="Write Your Message here..."
    className="w-full h-20 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009689]"
  />
</div>

<div className='p-2'>
<button className='bg-[#D40724] text-white p-4 rounded-md '>
    Send Message
</button>

</div>

      </div>
    </div>

    </>
  );
};

export default Emergency;
