import React, { useState, useEffect, useCallback } from 'react';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import DailySummary from './components/DailySummary';
import TimerDisplay from './components/TimerDisplay';
import { fetchSummary, logActivity } from './utils/api';
import { processWithGemini } from './utils/geminiApi';
import './App.css';

function App() {
  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : [];
  });
  const [summary, setSummary] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [focusTime, setFocusTime] = useState(() => {
    const saved = localStorage.getItem('focusTime');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [breakTime, setBreakTime] = useState(() => {
    const saved = localStorage.getItem('breakTime');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [sleepTime, setSleepTime] = useState(() => {
    const saved = localStorage.getItem('sleepTime');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [currentActivity, setCurrentActivity] = useState(() => {
    const saved = localStorage.getItem('currentActivity');
    return saved || 'idle';
  });
  const [sleepStart, setSleepStart] = useState(() => {
    const saved = localStorage.getItem('sleepStart');
    return saved ? new Date(saved) : null;
  });
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem('username');
    return saved || 'User';
  });

  const updateSummary = useCallback(async () => {
    try {
      const data = await fetchSummary();
      setSummary(data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  }, []);

  useEffect(() => {
    updateSummary();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [updateSummary]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentActivity === 'focus') {
        setFocusTime(prevTime => {
          const newTime = prevTime + 1;
          localStorage.setItem('focusTime', newTime.toString());
          return newTime;
        });
      } else if (currentActivity === 'break') {
        setBreakTime(prevTime => {
          const newTime = prevTime + 1;
          localStorage.setItem('breakTime', newTime.toString());
          return newTime;
        });
      }
      updateBrowserTab();
    }, 1000);
    return () => clearInterval(timer);
  }, [currentActivity]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
    localStorage.setItem('currentActivity', currentActivity);
    if (sleepStart) {
      localStorage.setItem('sleepStart', sleepStart.toISOString());
    } else {
      localStorage.removeItem('sleepStart');
    }
  }, [activities, currentActivity, sleepStart]);

  const updateBrowserTab = () => {
    let title = 'Matrix';
    if (currentActivity === 'focus') {
      title = `F ${formatTime(focusTime)} - Matrix`;
    } else if (currentActivity === 'break') {
      title = `B ${formatTime(breakTime)} - Matrix`;
    }
    document.title = title;
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleNewActivity = useCallback(async (input) => {
    try {
      const context = {
        username,
        currentActivity,
        focusTime: formatTime(focusTime),
        breakTime: formatTime(breakTime),
        sleepTime: formatTime(sleepTime)
      };
      const { response, intent } = await processWithGemini(input, context);
      
      const activity = { intent, task: input, duration: 0 };
      setActivities(prevActivities => [...prevActivities, activity]);
      setCurrentActivity(intent);

      if (intent === 'sleep') {
        setSleepStart(new Date());
      } else if (intent === 'wake' && sleepStart) {
        const sleepEnd = new Date();
        const sleepDuration = Math.floor((sleepEnd - sleepStart) / 1000); // in seconds
        setSleepTime(prevTime => {
          const newTime = prevTime + sleepDuration;
          localStorage.setItem('sleepTime', newTime.toString());
          return newTime;
        });
        setSleepStart(null);
      }

      await logActivity(activity);
      updateSummary();
      return response;
    } catch (error) {
      console.error('Error processing activity:', error);
      return "I'm sorry, I couldn't process that. Could you try again?";
    }
  }, [updateSummary, sleepStart, username, currentActivity, focusTime, breakTime, sleepTime]);

  return (
    <div className="app-container bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activities={activities} summary={summary} />
        <div className="flex-1 flex flex-col">
          <TimerDisplay
            currentTime={currentTime}
            focusTime={focusTime}
            breakTime={breakTime}
            sleepTime={sleepTime}
            currentActivity={currentActivity}
          />
          <div className="flex-1 overflow-y-auto p-4">
            <ChatInterface onNewActivity={handleNewActivity} username={username} setUsername={setUsername} />
          </div>
        </div>
      </div>
      <DailySummary summary={summary} focusTime={focusTime} breakTime={breakTime} sleepTime={sleepTime} />
    </div>
  );
}

export default App;

