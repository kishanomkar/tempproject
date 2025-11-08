import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { FiSun, FiMoon, FiUsers, FiCloud } from 'react-icons/fi'; // Icons

ChartJS.register(ArcElement, Tooltip);

// --- 1. Weather Chart ---
export const WeatherChart = ({ temp, main }) => {
    const data = {
        datasets: [
            {
                data: [temp, 50 - temp], // Assumes a 0-50°C scale
                backgroundColor: ['#f97316', '#e5e7eb'],
                borderColor: ['#f97316', '#e5e7eb'],
                borderWidth: 1,
                circumference: 180, // Half-circle
                rotation: 270,      // Start at the bottom-left
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { tooltip: { enabled: false } }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-20 relative">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                    {main === 'Clear' ? <FiSun className="w-6 h-6 text-gray-700" /> : <FiCloud className="w-6 h-6 text-gray-700" />}
                    <span className="text-xl font-bold text-gray-800">{temp}°C</span>
                </div>
            </div>
            <span className="text-sm font-semibold text-gray-600 mt-1">Weather</span>
        </div>
    );
};

// --- 2. Time of Day Chart ---
export const TimeChart = ({ hour }) => {
    // Create an array for 24 hours, highlight the current one
    const timeData = Array(24).fill(1); // 24 equal segments
    const bgColors = Array(24).fill('#e5e7eb');
    bgColors[hour] = '#3b82f6'; // Highlight current hour

    const data = {
        datasets: [
            {
                data: timeData,
                backgroundColor: bgColors,
                borderColor: '#fff',
                borderWidth: 2,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { tooltip: { enabled: false } }
    };

    const isDay = hour > 6 && hour < 20;

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-20 relative">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    {isDay ? <FiSun className="w-6 h-6 text-gray-700" /> : <FiMoon className="w-6 h-6 text-gray-700" />}
                    <span className="text-xl font-bold text-gray-800">
                        {hour % 12 === 0 ? 12 : hour % 12}:00 {hour < 12 ? 'AM' : 'PM'}
                    </span>
                </div>
            </div>
            <span className="text-sm font-semibold text-gray-600 mt-1">Time of Day</span>
        </div>
    );
};

// --- 3. Crowd Density Chart ---
export const CrowdChart = ({ level }) => {
    const riskMapping = { 'Low': 1, 'Medium': 2, 'High': 3 };
    const levelValue = riskMapping[level] || 1;
    const levelColor = level === 'Low' ? '#22c55e' : (level === 'Medium' ? '#f59e0b' : '#ef4444');

    const data = {
        datasets: [
            {
                data: [levelValue, 3 - levelValue], // Data point (1, 2, or 3) vs. remaining
                backgroundColor: [levelColor, '#e5e7eb'],
                borderColor: [levelColor, '#e5e7eb'],
                borderWidth: 1,
                circumference: 180,
                rotation: 270,
            },
        ],
    };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: { tooltip: { enabled: false } }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-20 relative">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center mt-4">
                    <FiUsers className="w-6 h-6 text-gray-700" />
                    <span className={`text-xl font-bold`} style={{ color: levelColor }}>
                        {level}
                    </span>
                </div>
            </div>
            <span className="text-sm font-semibold text-gray-600 mt-1">Crowd Density</span>
        </div>
    );
};