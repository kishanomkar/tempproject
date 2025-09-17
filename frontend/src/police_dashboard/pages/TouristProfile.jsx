import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const dummyTourists = [
  { id: 1, name: 'John Doe', lat: 28.61, lng: 77.20 },
  { id: 2, name: 'Jane Smith', lat: 28.62, lng: 77.21 },
  { id: 3, name: 'Ali Khan', lat: 28.63, lng: 77.22 },
];

export default function TouristProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tourist = dummyTourists.find(t => t.id === Number(id));

  if (!tourist) return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Tourist not found.</h2>
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate(-1)}>Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Tourist Profile</h2>
        <div className="space-y-2 text-gray-700">
          <p><span className="font-medium">Name:</span> {tourist.name}</p>
          <p><span className="font-medium">Latitude:</span> {tourist.lat}</p>
          <p><span className="font-medium">Longitude:</span> {tourist.lng}</p>
        </div>
        <button className="mt-6 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => navigate(-1)}>Back to Map</button>
      </div>
    </div>
  );
}
