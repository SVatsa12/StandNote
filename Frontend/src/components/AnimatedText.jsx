import React, { useEffect, useState } from "react";

const phrase = "Live. Transcribe. Summarize.";
const typingSpeed = 100;
const delayAfterFinish = 2000;

const AnimatedText = () => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeout;
    if (index < phrase.length) {
      timeout = setTimeout(() => {
        setText((prev) => prev + phrase[index]);
        setIndex((prev) => prev + 1);
      }, typingSpeed);
    } else {
      timeout = setTimeout(() => {
        setText("");
        setIndex(0);
      }, delayAfterFinish);
    }
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent">
      <div className="bg-gray-900/60 border border-gray-800 rounded-3xl px-12 py-8 shadow-2xl backdrop-blur-md">
        <h1 className="text-5xl sm:text-6xl font-bold text-white tracking-wide drop-shadow-md">
          {text}
        </h1>
      </div>
      <p className="mt-6 text-lg text-gray-400 font-medium tracking-wider">
        Your smart meeting assistant is ready.
      </p>
    </div>
  );
};

export default AnimatedText;
