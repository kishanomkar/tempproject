import { MapContainer, TileLayer, Circle, Marker, Popup, useMapEvents } from 'react-leaflet';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import PanicButton from '../components/PanicButton';
import SafetyScore from '../components/SafetyScore';

export default function Home() {
  const [currentLocation, setCurrentLocation] = useState({ latitude: null, longitude: null });
  const [position, setPosition] = useState([28.6139, 77.2090]); // Dilli ki location hai with danger jone
  const [insideDanger, setInsideDanger] = useState(false);
      const [profile, isProfile] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Ye danger jone ka cicle hai abhu uhi example lagaya hau
  const dangerZone = {
    center: [28.615, 77.21],     //Yaha live location appan api se track karenge(geolocation API)
    radius: 500 // in meters
  };

  // User location tarcking 
  function LocationTracker() {
    const map = useMapEvents({
      locationfound(e) {
        const newPos = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);

        const distance = L.latLng(e.latlng).distanceTo(L.latLng(dangerZone.center));
        setInsideDanger(distance <= dangerZone.radius);
      },
    });

    // Start locating once map is ready
    useEffect(() => {
      map.locate({ watch: true, setView: true, enableHighAccuracy: true });
    }, [map]);

    return null;
  }

  // New: Get initial location when component mounts
  useEffect(() => {
    getLocation();
  }, []);

  return (
    
    <div style={{ height: "100vh", width: "100%" }}>

    <nav className="bg-white border-gray-200 dark:bg-gray-900 font-bold">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        

        <div className="flex items-center gap-3 cursor-pointer"
        onClick={() => isProfile(!profile)}
        >
          <img
            className="h-8 w-8 rounded-full object-fit"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTypXUpuBp-yC6vlPgFeFiJNiERuMp2BYOInA&s"
            alt="profile"
          />
          <h1 
            className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
              md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 
              dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 
              dark:hover:text-white md:dark:hover:bg-transparent"
          >
            Profile
          </h1>
        </div>


        <button
          onClick={() => setOpen(!open)}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm 
            text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none 
            focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 
            dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>



        <div
          className={`${open ? "block" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul
            className="font-medium flex flex-col p-4 md:p-0 mt-4 
              rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 
              md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            <li>
              <Link

                to="/home"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 
                  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 
                  dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Home
              </Link>
            </li>
            <li>
              <Link

                to="/alerts"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 
                  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 
                  dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Alerts
              </Link>
            </li>
            <li>
              <Link

                to="/updates"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 
                  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 
                  dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Updates
              </Link>
            </li>
            <li>
              <Link

                to="/track-Members"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                  md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 
                  dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 
                  dark:hover:text-white md:dark:hover:bg-transparent"
              >
                Track-Members
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  
          <div
        className={ `${profile?"absolute z-1000 h-[92.09%]":"hidden"} h-[85.4%]  absolute z-1000 overflow-hidden bg-white border-gray-200 dark:bg-gray-900 text-white  flex-col gap-10 p-10 w-75` }>
      <div className=" flex flex-col  gap-5 ">
    
    <div className='flex gap-12  items-center'>
            <div className="flex-shrink-0">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTypXUpuBp-yC6vlPgFeFiJNiERuMp2BYOInA&s"
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover  border-gray-100"
            referrerPolicy="no-referrer"
          />
        </div>
<div className='flex-grow'>
        <h2 className="text-3xl font-bold    ">
        Mulli Natham 
        </h2>
        </div>
    </div>

        

        <div className="bg-blue-700 text-white px-4 py-6 h-10 rounded-full text-sm font-medium flex items-center gap-2 my-7">
        
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
          </svg>
kuchBhiBhangBhosada
        </div>


        <div className="flex items-center gap-2  text-base my-1">
          <svg className="w-5 h-5 " viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
          </svg>
          Trip ends: December 31, 2024
        </div>

      </div>
    </div>

      <MapContainer
        center={currentLocation.latitude ? [currentLocation.latitude, currentLocation.longitude] : position}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        {/* free tiles from OpenStreetMap */}
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* user marker */}
        {currentLocation.latitude && currentLocation.longitude && (
          <Marker position={[currentLocation.latitude, currentLocation.longitude]}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* danger zone circle */}
        <Circle
          center={dangerZone.center}
          radius={dangerZone.radius}
          pathOptions={{ color: "red", fillOpacity: 0.2 }}
        />

        <LocationTracker />
      </MapContainer>

      {/* Banner if inside danger zone */}
      {insideDanger && (
        <div style={{
          position: "absolute", bottom: 20, left: 20, right: 20,
          padding: "12px 16px", background: "rgba(255,0,0,0.9)",
          color: "white", borderRadius: "8px", textAlign: "center"
        }}>
          ⚠️ Heads up! You’ve entered a high-risk zone.
        </div>
      )}

      <div style={{ position: "absolute", top: "600px", right: "50px", zIndex: 900, height:"100px", width:'100px', cursor: "pointer" }}>
<PanicButton/>
      </div>
      <div style={{ position: "absolute", top: "600px", left: "50px", zIndex: 900, height:"100px", width:'100px', cursor: "pointer"  }}>
<SafetyScore/>
      </div>

    </div>
  );
}
