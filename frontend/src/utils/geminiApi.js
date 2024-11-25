import { GoogleGenerativeAI } from "@google/generative-ai";

// TODO: Replace with your actual API key
const API_KEY = "API HERE";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function processWithGemini(input, context) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    You are Matrix, a personal productivity assistant. The user's name is ${context.username}.
    Current activity: ${context.currentActivity}
    Focus time today: ${context.focusTime}
    Break time today: ${context.breakTime}
    Sleep time today: ${context.sleepTime}

    Respond to the following input in a friendly and supportive manner. 
    Determine the intent of the user's activity (focus, break, sleep, or wake) and provide an encouraging response.
    Current input: "${input}"

    Return your response in the following JSON format:
    {
      "response": "Your friendly response here",
      "intent": "focus/break/sleep/wake"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  try {
    const parsedResponse = JSON.parse(text);
    return parsedResponse;
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return {
      response: "I'm sorry, I couldn't process that. Could you try again?",
      intent: "unknown"
    };
  }
}

