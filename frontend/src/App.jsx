feature-PrashantSharma
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Profile from './pages/Profile'
import Blog from './pages/Blog'
import Alerts from './pages/Alerts'
import 'leaflet/dist/leaflet.css';
import HomeMap from './pages/HomeMap'
main



export default function App() {
  return (
    feature-PrashantSharma
    <div>
<Routes>

<Route path='/profile' element={<Profile/>} />
<Route path='/blog' element={<Blog/>} />
<Route path='/alerts' element={<Alerts/>} />
<Route path='/home-map' element={<HomeMap/>} />
</Routes>

    </div>
  )
}

    <div className="App">
      <h1>Welcome to the Guardian App</h1>
    </div>
  );
}

export default App;
main
