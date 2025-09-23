// Check if the browser supports SpeechRecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();

  // Set recognition properties
  recognition.lang = 'en-US'; // Language
  recognition.interimResults = false; // Final results only
  recognition.continuous = false; // Stop after one result

  // Start recognition
  recognition.start();

  // Event: When speech is recognized
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log('You said:', transcript);
    alert(`You said: ${transcript}`);
  };

  // Event: When recognition ends
  recognition.onend = () => {
    console.log('Speech recognition ended.');
  };

  // Event: If an error occurs
  recognition.onerror = (event) => {
    console.error('Error occurred in recognition:', event.error);
  };
} else {
  console.error('SpeechRecognition is not supported in this browser.');
}
