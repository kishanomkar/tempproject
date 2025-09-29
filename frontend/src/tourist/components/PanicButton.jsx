import React from 'react';
import { useAlert } from '../../context/AlertContext';

function PanicButton() {
    const { setAlertingTourist } = useAlert();

    const handlePanicClick = () => {
        // Mock tourist data - replace with actual user data from context/auth
        const touristId = `tourist_${Date.now()}`; 

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                const touristData = {
                    id: touristId,
                    lat: latitude,
                    lng: longitude,
                };
                
                // Set the alerting tourist in the context
                setAlertingTourist(touristData);

                // Also send the alert to your backend API
                // fetch('/api/alert', {
                //     method: 'POST',
                //     headers: { 'Content-Type': 'application/json' },
                -                //     body: JSON.stringify(touristData),
                // });

                console.log('Panic alert sent for:', touristData);
                alert('Emergency alert has been sent to the authorities.');
            },
            (error) => {
                console.error("Error getting location for panic alert:", error);
                alert('Could not get your location. Please ensure location services are enabled.');
            }
        );
    };

    return (
        <div onClick={handlePanicClick} className="cursor-pointer">
            <img className='object-cover h-24 w-24 rounded-full shadow-lg hover:scale-110 transition-transform' src="https://img.freepik.com/free-vector/siren-icon_632498-3822.jpg?semt=ais_incoming&w=740&q=80" alt="Panic Button" />
        </div>
    );
}

export default PanicButton;