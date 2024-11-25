import React from 'react';

function Sidebar({ activities, summary }) {
  return (
    <div className="sidebar w-64 bg-gray-800 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-white">Today's Activities</h2>
      <ul className="mb-8">
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <li key={index} className="mb-2 text-white">
              <span className="font-semibold">{activity.intent}:</span> {activity.task}
            </li>
          ))
        ) : (
          <li className="text-white">No activities for today.</li>
        )}
      </ul>
      
      <h2 className="text-xl font-bold mb-4 text-white">Summary</h2>
      {summary ? (
        <ul className="text-white">
          <li>Work: {summary.work} minutes</li>
          <li>Break: {summary.break} minutes</li>
          <li>Errands: {summary.errands} minutes</li>
          <li>Sleep: {summary.sleep} minutes</li>
        </ul>
      ) : (
        <p className="text-white">No summary available.</p>
      )}
    </div>
  );
}

export default Sidebar;
