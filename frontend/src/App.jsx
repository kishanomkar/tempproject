import { Route, Routes } from 'react-router-dom'
import Profile from './tourist/pages/Profile'
import Blog from './tourist/pages/Blog'
import Alerts from './tourist/pages/Alerts'
import 'leaflet/dist/leaflet.css';
import HomeMap from './tourist/pages/HomeMap'
import PoliceRegister from './police_dashboard/pages/PoliceRegister';
import TouristDashboard from './police_dashboard/pages/Nazar';
import TouristProfile from './police_dashboard/pages/TouristProfile';
import QRCamera from './tourist/components/QRreader';
import SelectionPage from './tourist/pages/Diversion';
import ForeignTouristRegister from './tourist/pages/ForeignTouristRegister';
import DomesticTouristRegister from './tourist/pages/DomesticTouristRegister';
import ForeignTouristLogin from './tourist/pages/ForeignTouristLogin';
import DomesticTouristLogin from './tourist/pages/DomesticTouristLogin';
import AskAI from './tourist/components/AskAI';


export default function App() {
  return (
    <div className="App">
      <h1>Welcome to the Guardian App</h1>
      <Routes>
        <Route path='/profile' element={<Profile/>} />
        <Route path='/blog' element={<Blog/>} />
        <Route path='/alerts' element={<Alerts/>} />
        <Route path='/home-map' element={<HomeMap/>} />
        <Route path='/policeee' element={<PoliceRegister />} />
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
