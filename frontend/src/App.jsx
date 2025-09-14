import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PoliceRegister from './police_dashboard/pages/PoliceRegister';
// import Test from './police_dashboard/components/QRreader';
import QRCamera from './police_dashboard/components/QRreader';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/police/registerpolice" element={<PoliceRegister />} />
        <Route path='/' element={<QRCamera />} />
      </Routes>
    </Router>
  );
}

export default App;