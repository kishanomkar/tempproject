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

      {/* Updates List */}
      <div className="p-4 space-y-4 sm:p-3 lg:p-4">
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