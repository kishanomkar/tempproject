import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the components Chart.js needs for a radar chart
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// This component expects data like:
// [ { name: "Time of Day", value: "High" }, { name: "Weather", value: "Low" } ]
const RiskRadarChart = ({ data = [] }) => {
  
  // 1. Map "Low", "Medium", "High" to numerical values
  const riskMapping = { 'Low': 1, 'Medium': 2, 'High': 3 };
  const chartLabels = data.map(risk => risk.name);
  const chartDataPoints = data.map(risk => riskMapping[risk.value] || 1); // Default to 1 (Low)

  // 2. Configure the chart data format for Chart.js
  const chartConfigData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Current Risk Level',
        data: chartDataPoints,
        backgroundColor: 'rgba(136, 132, 216, 0.2)', // fill color
        borderColor: 'rgba(136, 132, 216, 1)',     // line color
        borderWidth: 2,
        pointBackgroundColor: 'rgba(136, 132, 216, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(136, 132, 216, 1)',
      },
    ],
  };

  // 3. Configure the chart options (appearance)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: '#cbd5e1' // color of the lines from center to label
        },
        grid: {
          color: '#e2e8f0' // color of the circular grid lines
        },
        pointLabels: {
          color: '#475569', // color of the labels (Time of Day, etc.)
          font: {
            size: 13,
            weight: 'bold'
          }
        },
        ticks: {
          // This configures the 1, 2, 3 labels on the scale
          callback: function(value) {
            if (value === 1) return 'LOW';
            if (value === 2) return 'MED';
            if (value === 3) return 'HIGH';
            return '';
          },
          stepSize: 1,
          font: {
            size: 10,
            color: '#64748b'
          },
          backdropColor: 'rgba(255, 255, 255, 0.75)' // bg for the LOW/MED/HIGH labels
        },
        min: 0, // Start scale at 0
        max: 3, // End scale at 3
      },
    },
    plugins: {
      legend: {
        display: false // Hide the "Current Risk Level" legend
      }
    }
  };

  return (
    <div style={{ height: '250px' }}>
        <Radar data={chartConfigData} options={chartOptions} />
    </div>
  );
};

export default RiskRadarChart;