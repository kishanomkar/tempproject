import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PoliceRegister from './police_dashboard/pages/PoliceRegister';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/police/registerpolice" element={<PoliceRegister />} />
      </Routes>
    </Router>
  );
}

export default App;