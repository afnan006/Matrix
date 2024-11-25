export function updateBrowserTab(activity) {
    const title = activity ? `${activity.intent.charAt(0).toUpperCase()} - Matrix` : 'Matrix';
    document.title = title;
  
    // Update favicon (you'll need to create these favicon files)
    const favicon = document.querySelector("link[rel*='icon']");
    if (favicon) {
      favicon.href = activity ? `/favicon-${activity.intent}.ico` : '/favicon.ico';
    }
  }
  
  export function sendNotification(title, body) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    }
  }
  
  