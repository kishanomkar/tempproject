import React from 'react';

const Profile = () => {

    const unqId = 'ab3433bdd_233bs'

  return (
    <div className=" h-screen  overflow-hidden   flex flex-col gap-10 p-10 w-75 ">

        <h1 className="text-2xl font-semibold text-gray-800 ">Profile</h1>
    

      <div className=" flex flex-col  gap-5 ">
    
    <div className='flex gap-12  items-center'>
            <div className="flex-shrink-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUPlNXBp05F4Asp2BThgjxjONPyLxUgk9EIQ&s"
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover  border-gray-100"
            referrerPolicy="no-referrer"
          />
        </div>
<div className='flex-grow'>
        <h2 className="text-3xl font-bold text-gray-800    ">
        Mulli Natham 
        </h2>
        </div>
    </div>

        

        <div className="bg-[#5b82c4] text-white px-4 py-6 h-10 rounded-full text-sm font-medium flex items-center gap-2 my-7">
        
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
          {unqId}
        </div>


        <div className="flex items-center gap-2 text-gray-600 text-base my-1">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
          </svg>
          Trip ends: December 31, 2024
        </div>

      </div>
    </div>
  );
};

export default Profile;