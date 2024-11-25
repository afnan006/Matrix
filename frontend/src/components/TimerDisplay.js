import React from 'react';

function TimerDisplay({ currentTime, focusTime, breakTime, sleepTime, currentActivity }) {
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatCurrentTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  };

  return (
    <div className="timer-display bg-gray-800 p-4 flex justify-between items-center">
      <div className="current-time text-2xl font-bold">
        {formatCurrentTime(currentTime)}
      </div>
      <div className="timers flex space-x-4">
        <div className={`focus-timer ${currentActivity === 'focus' ? 'text-green-500' : ''}`}>
          Focus: {formatTime(focusTime)}
        </div>
        <div className={`break-timer ${currentActivity === 'break' ? 'text-yellow-500' : ''}`}>
          Break: {formatTime(breakTime)}
        </div>
        <div className="sleep-timer text-purple-500">
          Sleep: {formatTime(sleepTime)}
        </div>
      </div>
      <div className="current-activity text-xl">
        Current: {currentActivity.charAt(0).toUpperCase() + currentActivity.slice(1)}
      </div>
    </div>
  );
}

export default TimerDisplay;

