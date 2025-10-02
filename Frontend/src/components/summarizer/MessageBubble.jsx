import React from "react";
import clsx from "clsx";

const MessageBubble = ({ message, sender }) => {
  const isUser = sender === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={clsx(
          "max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-md whitespace-pre-line",
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-100 text-black rounded-bl-none"
        )}
      >
        {message}
      </div>
    </div>
  );
};

export default MessageBubble;
