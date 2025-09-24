// HomeRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Safety from './tourist/pages/Safety';
import Emergency from './tourist/pages/Emergency';
import TrackingMap from './tourist/pages/TrackingMap';
import Alerts from './tourist/pages/Alerts';
import TrackingMembers from './tourist/pages/TrackingMembers';
import MainLayout from './tourist/components/MainLayout';
import LandmarkIdentifier from './tourist/pages/LandmartIdentify';
import Profile from './tourist/pages/Profile';

export default function HomeRoutes() {
  return (
    <Routes>
      <Route path='/home' element={<MainLayout />}>
        <Route path='/home/trackyourlocation' element={<TrackingMap />} /> {/* Set a default route */}
        <Route path='safety' element={<Safety />} />
        <Route path='emergency' element={<Emergency />} />
        <Route path='tracking' element={<TrackingMap />} />
        <Route path='/home/profile' element={<Profile />} />
        <Route path='alerts' element={<Alerts />} />
        <Route path='trackMembers' element={<TrackingMembers />} />
        <Route path='/home/identify' element={<LandmarkIdentifier />} /> {/* Placeholder for Identify page */}
      </Route>
    </Routes>
  );
}