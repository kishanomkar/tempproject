import React, { useEffect, useState } from "react";
import { getTranscript, getAlert } from "./SpeechRecognition";

const AskAI = () => {
  const [text, setText] = useState("");
  const [emergency, setEmergency] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setText(getTranscript());
      setEmergency(getAlert());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ✅ Only trigger alert when emergency becomes true
  useEffect(() => {
    if (emergency) {
      alert("🚨 Help is on the way! Your location has been shared with the nearest police station.");
      // optional: reset flag so it doesn't keep firing
      setEmergency(false);
    }
  }, [emergency]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="border border-black rounded-md p-4">
        <textarea
          name="askAI"
          id="askAI"
          cols={30}
          rows={10}
          value={text}
          readOnly
        />
      </div>
    </div>
  );
};

export default AskAI;
