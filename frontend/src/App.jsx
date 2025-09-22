import { Link, Route, Routes } from 'react-router-dom'
import Blog from './tourist/pages/Blog'
import Alerts from './tourist/pages/Alerts'
import 'leaflet/dist/leaflet.css';
import PoliceRegister from './police_dashboard/pages/PoliceRegister';
import TouristDashboard from './police_dashboard/pages/Nazar';
import TouristProfile from './police_dashboard/pages/TouristProfile';
import QRCamera from './tourist/components/QRreader';
import SelectionPage from './tourist/pages/Diversion';
import ForeignTouristRegister from './tourist/pages/ForeignTouristRegister';
import DomesticTouristRegister from './tourist/pages/DomesticTouristRegister';
import ForeignTouristLogin from './tourist/pages/ForeignTouristLogin';
import DomesticTouristLogin from './tourist/pages/DomesticTouristLogin';
<<<<<<< HEAD
import AskAI from './tourist/components/AskAI';
=======
import TrackingMembers from './tourist/pages/TrackingMembers';
import { useState } from 'react';
import PanicButton from './tourist/components/PanicButton';
import SafetyScore from './tourist/components/SafetyScore';
import Home from './tourist/pages/Home';

>>>>>>> 0e526ee719d14fb605e49391e742b811af238d6b


export default function App() {

  return (
    <div className="App relative">


      <Routes>
        <Route path='/updates' element={<Blog/>} />
        <Route path='/alerts' element={<Alerts/>} />

        <Route path='/police' element={<PoliceRegister />} />
        <Route path='/track-Members' element={<TrackingMembers/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/nazar' element={<TouristDashboard />} />
        <Route path='/tourist/:id' element={<TouristProfile />} />
        <Route path='/data' element={<QRCamera />} />
        <Route path='/askAI' element={<AskAI />} />
        <Route path='/diversion' element={<SelectionPage />} />
        <Route path='/registerForeignTourist' element={<ForeignTouristRegister />} />
        <Route path='/registerDomesticTourist' element={<DomesticTouristRegister />} />
        <Route path='/loginForeignTourist' element={<ForeignTouristLogin />} />
        <Route path='/loginDomesticTourist' element={<DomesticTouristLogin />} />
      </Routes>


    </div>
  );
}
