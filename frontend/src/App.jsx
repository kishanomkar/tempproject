import { Route, Routes } from 'react-router-dom'
import Profile from './pages/Profile'
import Blog from './pages/Blog'
import Alerts from './pages/Alerts'
import 'leaflet/dist/leaflet.css';
import HomeMap from './pages/HomeMap'
import PoliceRegister from './police_dashboard/pages/PoliceRegister';
import TouristDashboard from './police_dashboard/pages/Nazar';
import TouristProfile from './police_dashboard/pages/TouristProfile';



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
      </Routes>
    </div>
  );
}
