import React, { useState } from "react";

const ActivityInput = () => {
    const [inputText, setInputText] = useState("");
    const [response, setResponse] = useState(null);

    const handleSubmit = async () => {
        const response = await fetch("/api/gemini", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: inputText }),
        });
        const data = await response.json();
        setResponse(data);  // Set the Gemini API response to state
    };

    return (
        <div>
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a question..."
            />
            <button onClick={handleSubmit}>Submit</button>

            {response && (
                <div>
                    <h3>Response from Gemini:</h3>
                    <p>{response?.candidates?.[0]?.content?.parts?.[0]?.text}</p>
                </div>
            )}
        </div>
    );
};

export default ActivityInput;
