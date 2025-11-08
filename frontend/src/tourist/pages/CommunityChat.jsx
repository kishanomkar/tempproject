import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

export default function CommunityChat() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [region, setRegion] = useState("");      // ✅ FIXED
  const [nationality, setNationality] = useState(""); 
  const [joined, setJoined] = useState(false);

  const chatBoxRef = useRef(null);

  const room = `${region.trim()}-${nationality.trim()}`; // ✅ Now works fine

  useEffect(() => {
    socket.on("community-message", (data) => {
      setChat((prev) => [...prev, data]);
    });
    return () => socket.off("community-message");
  }, []);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [chat]);

  const joinRoom = (e) => {
    e.preventDefault();
    if (name.trim() && region.trim() && nationality.trim()) {
      socket.emit("join-room", { region, nationality }); // ✅ FIXED
      setJoined(true);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit("community-message", { room, name, text: message });
    setMessage("");
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.chatContainer}>
        {!joined ? (
          <form onSubmit={joinRoom} style={styles.joinBox}>
            <h2 style={styles.chatTitle}>🌍 Join Community Chat</h2>
            <p style={styles.joinSubtitle}>Enter your details to connect</p>

            <input
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              style={styles.input}
              placeholder="Enter region (e.g., Jaipur)"
              value={region}
              onChange={(e) => setRegion(e.target.value)} // ✅ FIXED
            />

            <input
              style={styles.input}
              placeholder="Enter nationality (e.g., India)"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
            />

            <button style={styles.button} type="submit">Join Chat</button>
          </form>
        ) : (
          <>
            <div style={styles.chatHeader}>
              <h2 style={styles.chatTitle}>Community Chat</h2>
              <p style={styles.chatSubtitle}>You joined: {room}</p>
            </div>

            <div ref={chatBoxRef} style={styles.chatBox}>
              {chat.map((m, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.messageBase,
                    ...(m.name === name ? styles.myMessage : styles.otherMessage),
                  }}
                >
                  {m.name !== name && (
                    <span style={styles.messageName}>{m.name}</span>
                  )}
                  <p style={styles.messageText}>{m.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={sendMessage} style={styles.form}>
              <input
                style={styles.chatInput}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button style={styles.sendButton} type="submit">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 100px)",
    padding: "20px",
    backgroundColor: "#f4f7f6",
    fontFamily: "Arial, sans-serif",
  },
  chatContainer: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  joinBox: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "30px",
    textAlign: "center",
  },
  joinSubtitle: { marginTop: "-10px", color: "#555", fontSize: "0.9rem" },
  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxSizing: "border-box",
    fontSize: "1rem",
  },
  button: {
    padding: "12px 15px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
  },
  chatHeader: {
    padding: "20px",
    borderBottom: "1px solid #eee",
    textAlign: "center",
  },
  chatTitle: { margin: 0, color: "#333" },
  chatSubtitle: {
    margin: "5px 0 0",
    color: "#007bff",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  chatBox: {
    height: "400px",
    overflowY: "auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  messageBase: {
    padding: "10px 15px",
    borderRadius: "18px",
    maxWidth: "75%",
    wordWrap: "break-word",
  },
  myMessage: {
    backgroundColor: "#007bff",
    color: "white",
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  otherMessage: {
    backgroundColor: "#e9ecef",
    color: "#333",
    alignSelf: "flex-start",
    marginRight: "auto",
  },
  messageName: {
    display: "block",
    fontWeight: "bold",
    fontSize: "0.8rem",
    marginBottom: "4px",
    color: "#555",
  },
  messageText: { margin: 0, fontSize: "0.95rem" },
  form: {
    display: "flex",
    gap: "10px",
    padding: "20px",
    borderTop: "1px solid #eee",
    backgroundColor: "#fff",
  },
  chatInput: {
    flex: 1,
    padding: "12px 15px",
    borderRadius: "20px",
    border: "1px solid #ddd",
    fontSize: "1rem",
    outline: "none",
  },
  sendButton: {
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};