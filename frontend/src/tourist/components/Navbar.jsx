import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPeoplePulling } from 'react-icons/fa6';

const NavItem = ({ icon, text, active, onClick, to, isPremium }) => {
  const baseClasses =
    'flex items-center justify-start px-4 py-2 rounded-lg font-medium transition-all duration-200 cursor-pointer';
  const activeClasses = 'bg-teal-600 text-white shadow-lg';
  const inactiveClasses =
    'text-gray-600 hover:text-teal-700 hover:bg-gray-100';

  const premiumClasses =
    'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md hover:shadow-lg hover:scale-[1.03] border border-yellow-300';

  return (
    <Link
      to={to}
      className={`${baseClasses} ${
        isPremium ? premiumClasses : active ? activeClasses : inactiveClasses
      }`}
      onClick={onClick}
    >
      <div className="w-6 h-6 mr-2 flex items-center justify-center text-inherit">
        {icon}
      </div>
      <span className="text-sm font-semibold select-none whitespace-nowrap">
        {text}
      </span>
    </Link>
  );
};

const Navbar = () => {
  const [activeItem, setActiveItem] = useState();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasProVersion, setHasProVersion] = useState(false);

  // Check localStorage for pro version token on component mount
  useEffect(() => {
    const token = localStorage.getItem('proVersion');
    setHasProVersion(!!token);
  }, []);

  // Define nav items, adding/removing premium items based on proVersion status
  const navItems = [
    {
      id: 'Tracking',
      text: 'Tracking',
      to: '/home/tracking',
      icon: (
              <img
                src="/tracking-track-svgrepo-com.svg"
                alt="Premium Icon"
                className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
              />
            ),
    },
    {
      id: 'Safety',
      text: 'Safety',
      to: '/home/safety',
      icon: (
              <img
                src="/safety-svgrepo-com.svg"
                alt="Premium Icon"
                className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
              />
            ),
    },
    {
      id: 'Alerts',
      text: 'Alerts',
      to: '/home/alerts',
      icon: (
              <img
                src="/alert-svgrepo-com.svg"
                alt="Premium Icon"
                className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
              />
            ),
    },
    {
      id: 'Emergency',
      text: 'Emergency',
      to: '/home/emergency',
      icon: (
              <img
                src="/emergency-call-svgrepo-com.svg"
                alt="Premium Icon"
                className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
              />
            ),
    },
    // Show track members only if pro version is active
    ...(hasProVersion
      ? [
          {
            id: 'Track Members',
            text: 'Track Members',
            to: '/home/trackMembers',
            icon: (
              <img
                src="/family-3-generations-svgrepo-com.svg"
                alt="Premium Icon"
                className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
              />
            ),
          },
          {
            id: 'Community Chat',
            text: 'Community Chat',
            to: '/home/communitychat',
            icon: (
              <img
                src="/community-comments-svgrepo-com.svg"
                alt="Premium Icon"
                className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
              />
            ),
          },
        ]
      : []),
    {
      id: 'Profile',
      text: 'Profile',
      to: '/home/profile',
      icon: (
              <img
                src="/profile-user-svgrepo-com.svg"
                alt="Premium Icon"
                className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
              />
            ),
    },
    // Show "Get Pro" only if no pro version token
    ...(!hasProVersion
      ? [
          {
            id: 'Getpro',
            text: 'Get Pro',
            to: '/home/getpremiumfeatures',
            icon: (
              <img
                src="/red-dimond-premium-svgrepo-com.svg"
                alt="Premium Icon"
                className="w-5 h-5 drop-shadow-[0_0_6px_rgba(255,215,0,0.7)]"
              />
            ),
            isPremium: true,
          },
        ]
      : []),
  ];

  const handleNavItemClick = (id) => {
    setActiveItem(id);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-start bg-gray-100 overflow-hidden w-screen">
      <div className="w-full">
        <nav className="flex items-center justify-between bg-white p-3 shadow-lg border border-gray-200">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/home/slash" className="flex items-center text-lg font-bold">
              <img
                src="/logo.png"
                alt="logo"
                className="w-10 h-10 mr-2 rounded-md"
              />
              <span>tripShield</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                text={item.text}
                to={item.to}
                active={activeItem === item.id}
                onClick={() => handleNavItemClick(item.id)}
                isPremium={item.isPremium}
              />
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </nav>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg p-4 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        <div className="flex justify-end">
          <button
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
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
              isPremium={item.isPremium}
            />
          ))}
        </div>
      </div>

      {/* Overlay for Mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black opacity-25 z-40"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Navbar;
