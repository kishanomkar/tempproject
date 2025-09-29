import React, { useState } from 'react';
import {  Link } from 'react-router-dom';
import { FaPeoplePulling } from "react-icons/fa6";
import { createRoot } from 'react-dom/client';
import { FaLocationDot, FaShieldHalved } from "react-icons/fa6";
import { Outlet } from 'react-router-dom';

// The NavItem component now uses Link for navigation
const NavItem = ({ icon, text, active, onClick, to }) => {
const baseClasses = "flex items-center justify-start p-3 w-full rounded-lg transition-colors duration-200 cursor-pointer";
const activeClasses = "bg-teal-600 text-white shadow-lg";
const inactiveClasses = "text-gray-500 hover:text-gray-700 hover:bg-gray-100";




return (
    <Link 
    to={to}
    className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
    onClick={onClick}
    >
    <div className="w-6 h-6 mr-3">
        {icon}
    </div>
    <span className="text-sm font-medium select-none whitespace-nowrap">{text}</span>
    </Link>
);
};


const Navbar = () => {
const [activeItem, setActiveItem] = useState();
const [isMenuOpen, setIsMenuOpen] = useState(false);

const navItems = [
    {
    id: 'Tracking',
    text: 'Tracking',
    to: '/home/tracking',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
        <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h1.5a.75.75 0 0 0 .75-.75V21h4.5v.75a.75.75 0 0 0 .75.75h1.5a3 3 0 0 0 3-3V12.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25ZM3.75 12a1.5 1.5 0 0 1 1.5-1.5h.75v3h-.75a1.5 1.5 0 0 1-1.5-1.5Zm15-1.5h-.75v3h.75a1.5 1.5 0 0 1 1.5-1.5c0-.828-.672-1.5-1.5-1.5Zm-.75 6.75h.75a1.5 1.5 0 0 0 1.5-1.5v-1.5H18v3ZM7.5 14.25h1.5v-1.5h-1.5v1.5Zm-1.5-3h1.5v-1.5H6v1.5Zm1.5-3h1.5v-1.5h-1.5v1.5Zm1.5-1.5h1.5v-1.5h-1.5v1.5ZM12 6.75a.75.75 0 0 1 .75.75v.75H11.25V7.5a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
        </svg>
    ),
    },
    {
    id: 'Safety',
    text: 'Safety',
    to: '/home/safety',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 1 9 0v3.75M3.75 21h10.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25H3.75a2.25 2.25 0 0 0-2.25 2.25v7.5a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    ),
    },
    {
      id: 'Alerts',
      text: 'Alerts',
      to: '/home/alerts',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.039 3.377 1.763 3.377h1.093c.319 0 .62.1.884.28l.191.135a4.5 4.5 0 0 0 4.14 0l.19-.135a1.5 1.5 0 0 1 .884-.28h1.094c1.724 0 2.629-1.877 1.763-3.377l-5.694-9.845a1.5 1.5 0 0 0-1.334-.73h-.096a1.5 1.5 0 0 0-1.334.73l-5.694 9.845ZM12 15.75h.008v.008H12v-.008Z" />
        </svg>
      ),
    },
    {
      id: 'Emergency',
      text: 'Emergency',
      to: '/home/emergency',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.106l-1.383-.31c-.663-.15-1.3-.413-1.912-.754l-.45-.257a1.125 1.125 0 0 0-1.462-.195l-.353.272a1.125 1.125 0 1 1-1.573.114l-.17-.169a1.125 1.125 0 0 0-1.573.114l-.353.272a1.125 1.125 0 0 1-1.462-.195l-.45-.256a4.507 4.507 0 0 0-1.912-.754L9.75 9.75a.75.75 0 0 1 .586.326L12 12.195a.75.75 0 0 0 .586.326c.354 0 .695-.12.96-.341l.24-.191a2.25 2.25 0 0 1 2.25-3.08l1.79-1.79c.683-.683 1.077-1.597 1.077-2.556V6.75a2.25 2.25 0 0 0-2.25-2.25h-1.5" />
        </svg>
      ),
    },
    {
      id: 'Track Members',
      text: 'Track Members',
      to: '/home/trackMembers',
      icon: (
        <div className='mt-0.5 text-xl'>
<FaPeoplePulling />
</div>
      ),
    },
    {
      id: 'Profile',
      text: 'Profile',
      to: '/home/profile',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
      ),
    },
  ];

  const handleNavItemClick = (id) => {
    setActiveItem(id);
    setIsMenuOpen(false); 
  };

  return (

      <div className=' flex flex-col items-center justify-start  bg-gray-100  overflow-hidden w-screen z-500' >
        <div className='w-full '>
          <nav className=" flex items-center justify-between bg-white p-3 shadow-lg border border-gray-200">
            
                  <div className="flex-shrink-0">
                    <Link to="/home/slash" className="flex items-center text-lg font-bold">
                    <img src="/logo.png" alt="logo" className="w-10 h-10 mr-2 rounded-md" />
                    <span>tripShield</span>
                    </Link>
                  </div>
                  
                  {/* Desktop Nav Items (visible on sm screens and up) */}
            <div className='hidden lg:flex items-center gap-2'>
              {navItems.map((item) => (
                <NavItem
                  key={item.id}
                  icon={item.icon}
                  text={item.text}
                  to={item.to}
                  active={activeItem === item.id}
                  onClick={() => handleNavItemClick(item.id)}
                />
              ))}
            </div>

            {/* Hamburger Menu Icon (visible on mobile) */}
            <button
              className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </nav>
        </div>

        {/* Mobile Menu Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}
        >
          <div className="flex justify-end">
            <button
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close navigation menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-start gap-2 mt-4">
            {navItems.map((item) => (
            <NavItem
                key={item.id}
                icon={item.icon}
                text={item.text}
                to={item.to}
                active={activeItem === item.id}
                onClick={() => handleNavItemClick(item.id)}
            />
            ))}
        </div>
        </div>
        
        {/* Overlay to close menu when clicking outside */}
        {isMenuOpen && (
        <div  onClick={() => setIsMenuOpen(false)}></div>
        )}


    </div>

);
};

export default Navbar;
