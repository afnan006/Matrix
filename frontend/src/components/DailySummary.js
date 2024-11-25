import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function DailySummary({ summary, focusTime, breakTime, sleepTime }) {
  const totalTime = focusTime + breakTime + sleepTime;
  
  const chartData = {
    labels: ['Focus', 'Break', 'Sleep'],
    datasets: [
      {
        data: [focusTime, breakTime, sleepTime],
        backgroundColor: ['#4CAF50', '#FFC107', '#9C27B0'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const percentage = ((value / totalTime) * 100).toFixed(2);
            return `${label}: ${formatTime(value)} (${percentage}%)`;
          }
        }
      }
    },
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="daily-summary bg-gray-800 p-4">
      <h2 className="text-xl font-bold mb-4">Daily Summary</h2>
      <div className="flex justify-between">
        <div className="w-1/2">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Activity</th>
                <th className="text-right">Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Focus</td>
                <td className="text-right">{formatTime(focusTime)}</td>
              </tr>
              <tr>
                <td>Break</td>
                <td className="text-right">{formatTime(breakTime)}</td>
              </tr>
              <tr>
                <td>Sleep</td>
                <td className="text-right">{formatTime(sleepTime)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-1/2 h-64">
          <Pie data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
}

export default DailySummary;

