const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

let transcript = "";
let alertFlag = false;
let permissionDenied = false;
let recognition = null;

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

      const token = localStorage.getItem("token");
      const lat = localStorage.getItem("lat");
      const lng = localStorage.getItem("lng");

      if (!token || !lat || !lng) {
        console.error("❌ Missing token or location in localStorage!");
        return;
      }

      fetch("http://localhost:3000/police/alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ JWT middleware verify karega
        },
        body: JSON.stringify({
          message: "Guardian Help Triggered",
          location: { latitude: parseFloat(lat), longitude: parseFloat(lng) },
          timestamp: new Date().toISOString(),
        }),
      })
        .then((res) => res.json())
        .then((data) => console.log("✅ Alert sent to police:", data))
        .catch((err) => console.error("❌ Error sending alert:", err));
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

// Control functions
export function startRecognition() {
  if (recognition && !permissionDenied) {
    recognition.start();
  } else {
    console.error("SpeechRecognition not available or permission denied.");
  }
}

// Accessors
export function getTranscript() {
  return transcript;
}

export function getAlert() {
  return alertFlag;
}

export function resetAlert() {
  alertFlag = false;
}
