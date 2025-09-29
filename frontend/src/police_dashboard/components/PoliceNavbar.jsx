import React, { useState, createContext, useContext, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlert } from '../../context/AlertContext';

// --- SVG Icons ---
const FiMap = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>;
const FiAlertTriangle = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const FiSend = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>;
const FiUser = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const FiLogOut = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>;
const FiChevronLeft = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>;
const FiMenu = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;

// --- Context for Sidebar State ---
const SidebarContext = createContext();

// --- Main Layout Component ---
export default function PoliceMainLayout() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="flex h-screen bg-slate-100 font-sans">
            <SidebarContext.Provider value={{ isExpanded }}>
                <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
            </SidebarContext.Provider>
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header isSidebarExpanded={isExpanded} setIsSidebarExpanded={setIsExpanded} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

// --- Sidebar Component ---
const Sidebar = ({ isExpanded, setIsExpanded }) => {
    const { newAlertCount } = useAlert();
    const navItems = [
        { to: '/nazar', icon: <FiMap />, text: 'Live Map' },
        { to: '/police/alerts', icon: <FiAlertTriangle />, text: 'Alerts Feed', alertCount: newAlertCount },
        { to: '/police/send-alert', icon: <FiSend />, text: 'Dispatch Alert' },
    ];

    return (
        <aside className={`hidden md:flex flex-col transition-all duration-300 ease-in-out bg-white border-r border-slate-200 ${isExpanded ? 'w-64' : 'w-20'}`}>
            <div className="p-4 pb-2 flex justify-between items-center">
                <motion.div animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : 0 }} transition={{ duration: 0.2 }} className="flex items-center gap-2">
                     <img src="/logo.png" alt="Logo" className="w-8 h-8"/>
                    <span className="text-xl font-bold text-slate-800 whitespace-nowrap">Divya Drishti</span>
                </motion.div>
                <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200">
                    <FiChevronLeft className={`transition-transform duration-300 ${!isExpanded && "rotate-180"}`} />
                </button>
            </div>
            
            <nav className="flex-1 px-3 mt-4">
                {navItems.map(item => <NavItem key={item.to} {...item} />)}
            </nav>

            <div className="border-t border-slate-200 p-3">
                 <div className={`flex items-center p-2 rounded-lg`}>
                    <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center font-bold text-slate-600">
                        P
                    </div>
                    <div className={`flex justify-between items-center overflow-hidden transition-all ${isExpanded ? 'w-32 ml-3' : 'w-0'}`}>
                        <div className="leading-4">
                            <h4 className="font-semibold text-sm text-slate-800">Officer Name</h4>
                            <span className="text-xs text-slate-500">Service ID</span>
                        </div>
                        <FiLogOut size={20} className="text-slate-500 hover:text-red-500 cursor-pointer flex-shrink-0" />
                    </div>
                </div>
            </div>
        </aside>
    );
};

// --- Navigation Item Component ---
const NavItem = ({ to, icon, text, alertCount }) => {
    const { isExpanded } = useContext(SidebarContext);
    const location = useLocation();
    const { resetNewAlertCount } = useAlert();
    const isActive = location.pathname === to;

    useEffect(() => {
        if (isActive && to === '/police/alerts') {
            resetNewAlertCount();
        }
    }, [isActive, to, resetNewAlertCount]);

    return (
        <Link to={to} className={`relative flex items-center py-2.5 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100'}`}>
            {icon}
            <span className={`overflow-hidden transition-all ${isExpanded ? 'w-32 ml-3' : 'w-0'}`}>{text}</span>
            
            {alertCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {alertCount}
                </span>
            )}

            <AnimatePresence>
            {!isExpanded && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-full rounded-md px-2 py-1 ml-6 bg-slate-800 text-white text-sm invisible opacity-20 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all z-20"
                >
                    {text}
                </motion.div>
            )}
            </AnimatePresence>
        </Link>
    );
};

// --- Header Component for Main Content Area ---
const Header = ({ isSidebarExpanded, setIsSidebarExpanded }) => (
    <header className="bg-white p-4 border-b border-slate-200 flex items-center">
        <button onClick={() => setIsSidebarExpanded(!isSidebarExpanded)} className="md:hidden p-2 mr-4">
            <FiMenu />
        </button>
        <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
    </header>
);
