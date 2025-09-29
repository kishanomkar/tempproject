import React, { createContext, useState, useContext } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
    const [alerts, setAlerts] = useState([]);
    const [newAlertCount, setNewAlertCount] = useState(0);

    const addAlert = (alert) => {
        setAlerts(prevAlerts => [...prevAlerts, alert]);
        setNewAlertCount(prevCount => prevCount + 1);
    };

    const resetNewAlertCount = () => {
        setNewAlertCount(0);
    };

    const value = {
        alerts,
        addAlert,
        newAlertCount,
        resetNewAlertCount,
    };

    return (
        <AlertContext.Provider value={value}>
            {children}
        </AlertContext.Provider>
    );
};
