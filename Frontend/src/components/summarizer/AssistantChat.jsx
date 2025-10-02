import React, { useState } from "react";
import MessageBubble from "./MessageBubble";

const AssistantChat = () => {
  const [messages, setMessages] = useState([
    { text: "Hi! I'm your Smart AI Assistant. How can I help today?", sender: "ai" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response (Replace this with API call)
    const aiResponse = {
      text: `You said: "${input}" — here's a smart reply ✨`,
      sender: "ai",
    };

    // Simulate delay
    setTimeout(() => {
      setMessages((prev) => [...prev, aiResponse]);
    }, 600);

    setInput(""); // clear input
  };

  return (
    <div className="flex flex-col h-full max-h-[70vh]">
      {/* Chat window */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-2 bg-white border rounded-lg mb-2">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg.text} sender={msg.sender} />
        ))}
      </div>

      {/* Input area */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 px-4 py-2 border rounded-xl focus:outline-none"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default AssistantChat;
