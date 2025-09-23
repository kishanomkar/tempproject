
import React from 'react'
import { LuMessageCircle } from "react-icons/lu";

function AskAI() {
  return (
    <div className='absolute top-[80vh] left-[88vw] bg-[#009689] text-white p-4 rounded-full z-1000 fixed'>
<div className='text-3xl'>
    <LuMessageCircle />
</div>
    </div>
  )
}

export default AskAI




import React, { useEffect, useState, useRef } from "react";
import {
  startRecognition,
  getTranscript,
  getAlert,
  resetAlert,
} from "./speechRecognition";

const AskAI = () => {
  const [text, setText] = useState("");
  const [emergency, setEmergency] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    // ✅ Start recognition ONCE, and let speechRecognition.js handle restarts
    startRecognition();

    // Poll transcript + alert flag every second
    intervalRef.current = setInterval(() => {
      setText(getTranscript());
      setEmergency(getAlert());
    }, 1000);

    // Cleanup only clears interval, NOT recognition
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (emergency) {
      alert(
        "🚨 Help is on the way! Your location has been shared with the nearest police station."
      );
      setEmergency(false);
      resetAlert(); // reset so next "guardian help help" works
    }
  }, [emergency]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-100">
      <div className="border border-gray-400 rounded-lg p-6 w-full max-w-md shadow-lg bg-white">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Voice Command Transcript
        </h2>
        <textarea
          id="askAI"
          className="w-full h-40 border border-gray-300 p-3 rounded-md resize-none bg-gray-50 text-sm"
          value={text}
          readOnly
          aria-label="Live voice transcript"
        />
      </div>
    </div>
  );
};

export default AskAI;

