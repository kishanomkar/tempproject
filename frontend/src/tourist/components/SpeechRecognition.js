const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

let transcript = "";
let alertFlag = false; 

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US"; // ✅ set one language; can be changed dynamically
  recognition.interimResults = false;
  recognition.continuous = true; // keep listening until stopped manually

  recognition.start();

  recognition.onresult = (event) => {
    transcript = event.results[event.results.length - 1][0].transcript.trim();
    console.log("You said:", transcript);

    if (transcript.toLowerCase() === "guardian help help") {
      alertFlag = true;
      alert("🚨 Emergency command detected!");
    }
  };

  recognition.onend = () => {
    console.log("Recognition ended. Restarting...");
    recognition.start(); 
  };

  recognition.onerror = (event) => {
    console.error("Error occurred in recognition:", event.error);
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      window.alert("Microphone permission denied!");
    }
  };
} else {
  console.error("SpeechRecognition is not supported in this browser.");
}

export function getTranscript() {
  return transcript;
}

export function getAlert() {
  return alertFlag; 
}
