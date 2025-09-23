// HomeRoutes.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Safety from './tourist/pages/Safety';
import Emergency from './tourist/pages/Emergency';
import TrackingMap from './tourist/pages/TrackingMap';
import Alerts from './tourist/pages/Alerts';
import TrackingMembers from './tourist/pages/TrackingMembers';
import MainLayout from './tourist/components/MainLayout';

export default function HomeRoutes() {
  return (
    <Routes>
      <Route path='/home' element={<MainLayout />}>
        <Route index element={<TrackingMap />} /> {/* Set a default route */}
        <Route path='safety' element={<Safety />} />
        <Route path='emergency' element={<Emergency />} />
        <Route path='tracking' element={<TrackingMap />} />
        <Route path='alerts' element={<Alerts />} />
        <Route path='trackMembers' element={<TrackingMembers />} />
      </Route>
    </Routes>
  );
}