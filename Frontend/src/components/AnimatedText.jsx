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
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-500/20 to-indigo-500/30 backdrop-blur-lg">
      <div className="bg-white/10 border border-white/20 rounded-3xl px-12 py-8 shadow-xl backdrop-blur-md">
        <h1 className="text-5xl sm:text-6xl font-bold text-black tracking-wide drop-shadow-md">
          {text}
        </h1>
      </div>
      <p className="mt-6 text-lg text-black/80 font-medium tracking-wider">
        Your smart meeting assistant is ready.
      </p>
    </div>
  );
};

export default AnimatedText;
