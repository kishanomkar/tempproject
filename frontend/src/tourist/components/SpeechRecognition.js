const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

import { sosAlertFlag, setSosAlertFlag } from "../pages/TrackingMap";

let transcript = "";
let alertFlag = false;
let permissionDenied = false;
let recognition = null;

// 🔊 Siren audio object
let sirenAudio = null;

// --- Initialize siren (only once) ---
function initSiren() {
  if (!sirenAudio) {
    sirenAudio = new Audio("/alert.mp3"); // Place alert.mp3 in public/
    sirenAudio.loop = true; // repeat continuously
  }
}

// --- Start playing siren ---
function startSiren() {
  initSiren();
  sirenAudio
    .play()
    .then(() => console.log("🚨 Siren started"))
    .catch((err) => console.error("❌ Siren play failed:", err));
}

// --- Stop siren ---
export function stopSiren() {
  if (sirenAudio) {
    sirenAudio.pause();
    sirenAudio.currentTime = 0; // reset
    console.log("🛑 Siren stopped");
  }
}

// --- Reusable function for sending alerts ---
export async function sendAlert(trigger = "Guardian Help Triggered") {
  const token = localStorage.getItem("token");
  const lat = localStorage.getItem("lat");
  const lng = localStorage.getItem("lng");

  if (!token || !lat || !lng) {
    console.error("❌ Missing token or location in localStorage!");
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/police/alert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        message: trigger,
        location: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        timestamp: new Date().toISOString(),
      }),
    });

    const data = await res.json();
    console.log("✅ Alert sent to police:", data);

    // 🔊 Start looping siren when alert is successfully sent
    startSiren();

    // Reset flags
    alertFlag = false;
    setSosAlertFlag(false);
  } catch (err) {
    console.error("❌ Error sending alert:", err);
  }
}

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.start();

  recognition.onresult = (event) => {
    transcript = event.results[event.results.length - 1][0].transcript.trim();
    console.log("You said:", transcript);

    if (transcript.toLowerCase().includes("guardian help help")) {
      alertFlag = true;
      console.log("🚨 Emergency command detected!");
      sendAlert("Guardian Help Triggered");
    } else if (sosAlertFlag) {
      alertFlag = true;
      console.log("🚨 SOS button pressed!");
      sendAlert("SOS Button Triggered");
    }
  };

  recognition.onend = () => {
    console.log("Recognition ended.");
    if (!permissionDenied) {
      console.log("Restarting...");
      recognition.start(); // auto-restart
    }
  };

  recognition.onerror = (event) => {
    console.error("Error in recognition:", event.error);
    if (event.error === "not-allowed" || event.error === "service-not-allowed") {
      permissionDenied = true;
      window.alert("Microphone permission denied!");
    }
  };
} else {
  console.error("SpeechRecognition is not supported in this browser.");
}

// --- Control functions ---
export function startRecognition() {
  if (recognition && !permissionDenied) {
    recognition.start();
  } else {
    console.error("SpeechRecognition not available or permission denied.");
  }
}

// --- Accessors ---
export function getTranscript() {
  return transcript;
}

export function getAlert() {
  return alertFlag;
}

export function resetAlert() {
  alertFlag = false;
}
