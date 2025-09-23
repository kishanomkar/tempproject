import { Link, Route, Routes } from 'react-router-dom'


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
import Navbar from './tourist/components/Navbar';



export default function App() {

  return (
    <div className="App relative">



      <Routes>
        <Route path='/police' element={<PoliceRegister />} />
        <Route path='/nazar' element={<TouristDashboard />} />
        <Route path='/tourist/:id' element={<TouristProfile />} />
        <Route path='/data' element={<QRCamera />} />
        <Route path='/diversion' element={<SelectionPage />} />
        <Route path='/registerForeignTourist' element={<ForeignTouristRegister />} />
        <Route path='/registerDomesticTourist' element={<DomesticTouristRegister />} />
        <Route path='/loginForeignTourist' element={<ForeignTouristLogin />} />
        <Route path='/loginDomesticTourist' element={<DomesticTouristLogin />} />
      </Routes>
    </div>
  );
}
