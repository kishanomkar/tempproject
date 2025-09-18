import React from 'react';

// A mock array of updates to demonstrate the component
const updates = [
  {
    type: 'SOS Alert Received',
    message: 'Emergency contact "Sarah D." has activated an SOS. Location: Central Park. Check-in immediately.',
    time: 'Just now',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'Severe Weather Warning',
    message: 'Heavy rainfall expected in your area in the next 30 minutes. Drive safely and avoid flood-prone routes.',
    time: '5 min ago',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-500">
        <path fillRule="evenodd" d="M.5 9.75a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V10.5a.75.75 0 01.75-.75zm2.75 0a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0V10.5a.75.75 0 01.75-.75zM12 4.5a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zm3.75 0a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zm-7.5 0a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zm-6 0a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zm-3.75 0a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zm12.75 0a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75zm3.75 0a.75.75 0 01.75.75V9a.75.75 0 01-1.5 0V5.25a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'Geo-fence Alert: Home Area',
    message: 'You have entered your predefined "Home" geo-fence. Welcome back!',
    time: '15 min ago',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-green-500">
        <path fillRule="evenodd" d="M11.54 22.351A8.252 8.252 0 0021 12a9.752 9.752 0 00-9.45-9.714l-.94.025a1.5 1.5 0 00-1.127 1.25l-.015.114a1.5 1.5 0 00-.071.558V16.71a.75.75 0 00.106.337l.006.012a8.252 8.252 0 009.438 6.551z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'Low Battery Alert',
    message: 'Your device battery is at 15%. Connect to a charger soon to avoid interruption.',
    time: '1 hour ago',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-yellow-500">
        <path fillRule="evenodd" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-16.5a7.5 7.5 0 016.592 11.233A5.5 5.5 0 0112 18.75a5.5 5.5 0 01-6.592-2.017A7.5 7.5 0 0112 4.5zm.75 3a.75.75 0 00-1.5 0v5.25a.75.75 0 001.5 0V7.5z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    type: 'Unusual Activity Detected',
    message: 'You are heading to an Unsafe Jone rated level below 50.',
    time: '2 days ago',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-orange-500">
        <path fillRule="evenodd" d="M12 21a9 9 0 100-18 9 9 0 000 18zm.75-10.5a.75.75 0 00-1.5 0v5.25a.75.75 0 001.5 0v-5.25zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
      </svg>
    ),
  },
];

const Alerts = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Journey Updates</h1>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-500">
          <path fillRule="evenodd" d="M5.337 21.782A9.75 9.75 0 0112 2.25c2.408 0 4.654.717 6.516 1.968a.75.75 0 01-.482 1.341A8.25 8.25 0 0012 3.75a8.25 8.25 0 00-7.857 5.77 4.714 4.714 0 012.872.962.75.75 0 01-.194 1.353A8.243 8.243 0 0012 17.25a8.243 8.243 0 004.898-1.666.75.75 0 01.996 1.134A9.753 9.753 0 0112 18.75a9.752 9.752 0 01-6.75-2.617v1.86a.75.75 0 01-1.5 0v-2.75A.75.75 0 014.25 15h.75a.75.75 0 01-.75-.75V11.25a.75.75 0 01.75-.75H5a.75.75 0 01.75.75V15h.75a.75.75 0 01-.75.75h-.75V11.25a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75V15h.75a.75.75 0 01.75.75v2.75a.75.75 0 01-1.5 0v-1.86A9.753 9.753 0 0112 21.75c-1.838 0-3.553-.615-4.908-1.658a.75.75 0 01-.482-1.341z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Updates List */}
      <div className="p-4 space-y-4 sm:p-6 lg:p-8">
        {updates.map((update, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              {update.icon}
            </div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h2 className="text-base font-semibold text-gray-900 leading-tight">{update.type}</h2>
                <p className="text-sm text-gray-500 flex-shrink-0 ml-2">{update.time}</p>
              </div>
              <p className="text-sm text-gray-700 mt-1">{update.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;