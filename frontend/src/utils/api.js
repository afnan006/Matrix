const API_BASE_URL = 'http://127.0.0.1:5000/api';

// Function to fetch the summary data from the backend
export async function fetchSummary() {
  try {
    const response = await fetch(`${API_BASE_URL}/summary`);
    if (!response.ok) {
      throw new Error('Failed to fetch summary');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching summary:', error);
    throw error;
  }
}

// Function to log activity data to the backend
export async function logActivity(activity) {
  try {
    const response = await fetch(`${API_BASE_URL}/activity`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(activity),
    });
    if (!response.ok) {
      throw new Error('Failed to log activity');
    }
    return response.json();
  } catch (error) {
    console.error('Error logging activity:', error);
    throw error;
  }
}

// Function to get Gemini response by sending data to the backend
export async function getGeminiResponse(input, username, currentActivity, focusTime, breakTime, sleepTime) {
  try {
    const response = await fetch(`${API_BASE_URL}/gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: input,
        username,
        currentActivity,
        focusTime,
        breakTime,
        sleepTime,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Gemini API response from backend:', data);
      return data.response;
    } else {
      console.error('Failed to get Gemini response:', response.status, response.statusText);
      throw new Error('Failed to get Gemini response');
    }
  } catch (error) {
    console.error('Error in getGeminiResponse:', error);
    throw error;
  }
}
// utils/api.js


  