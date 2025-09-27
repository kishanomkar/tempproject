import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

// --- Helper Components & Icons ---

const BotAvatar = () => (
    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center flex-shrink-0">
        <svg className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22a9.5 9.5 0 0 1-4.89-1.39l.79-1.79a7.5 7.5 0 0 0 8.2 0l.79 1.79A9.5 9.5 0 0 1 12 22zM3.5 14.04l1.79-.79a7.5 7.5 0 0 0 0-8.2l-1.79-.79A9.5 9.5 0 0 1 3.5 14.04zm17 0a9.5 9.5 0 0 1 0-4.08l1.79.79a7.5 7.5 0 0 0 0 8.2l-1.79.79zM12 2a1 1 0 0 1 1 1v2a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1zm0 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
        </svg>
    </div>
);

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405z"/>
    </svg>
);


// --- Main Chatbot Component ---
const Chatbot = () => {
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    useEffect(() => {
        const newSocket = io("http://localhost:8080");
        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log("Connected to chatbot server");
            setMessages([{ sender: "bot", text: "Hello! I am your personal safety assistant for Jaipur. How can I help you today?" }]);
        });

        newSocket.on("ai-message-response", (response) => {
            setIsTyping(false);
            setMessages((prev) => [...prev, { sender: "bot", text: response }]);
        });

        return () => newSocket.disconnect();
    }, []);

    const sendMessage = (messageText = input) => {
        if (messageText.trim() === "" || !socket) return;

        setMessages((prev) => [...prev, { sender: "user", text: messageText }]);
        setIsTyping(true);
        socket.emit("ai-message", messageText);
        setInput("");
    };

    const handleQuickReply = (text) => {
        sendMessage(text);
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[80vh]">
                
                <div className="hidden md:block bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1593714878536-391bf397855b?q=80&w=1887&auto=format&fit=crop')"}}>
                    <div className="h-full bg-slate-900/60 p-8 flex flex-col justify-between text-white">
                        <div>
                            <h2 className="text-3xl font-bold">Nazar Safety Assistant</h2>
                            <p className="mt-2 text-slate-200">Your AI-powered guide for a safe and enjoyable trip in Jaipur.</p>
                        </div>
                        <div className="text-sm text-slate-300">
                            <p>"Travel safely, for seeing is believing."</p>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col bg-slate-50 h-full">
                    <header className="p-4 border-b border-slate-200 flex items-center justify-between bg-white flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <BotAvatar />
                            <div>
                                <h2 className="font-bold text-slate-800">Safety Assistant</h2>
                                <p className="text-sm text-green-500 font-semibold flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Online
                                </p>
                            </div>
                        </div>
                    </header>

                    <main className="flex-1 overflow-y-auto p-6 space-y-6">
                        <AnimatePresence>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    layout
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.sender === "bot" && <BotAvatar />}
                                    <div
                                        className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                                            msg.sender === "user"
                                                ? "bg-blue-600 text-white rounded-br-none"
                                                : "bg-white text-slate-700 rounded-bl-none border border-slate-200"
                                        }`}
                                    >
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-end gap-3 justify-start"
                            >
                                <BotAvatar />
                                <div className="bg-white text-slate-700 p-3 rounded-2xl rounded-bl-none border border-slate-200 flex gap-1.5">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300"></span>
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} />
                    </main>

                    <footer className="p-4 bg-white border-t border-slate-200">
                        {messages.length <= 2 && (
                            <div className="mb-3 flex gap-2 flex-wrap">
                                <button onClick={() => handleQuickReply("Is Hawa Mahal safe at night?")} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full hover:bg-slate-200 transition">Is Hawa Mahal safe at night?</button>
                                <button onClick={() => handleQuickReply("Emergency number for police")} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full hover:bg-slate-200 transition">Emergency number</button>
                                <button onClick={() => handleQuickReply("Nearest hospital")} className="px-3 py-1 bg-slate-100 text-slate-600 text-sm rounded-full hover:bg-slate-200 transition">Nearest hospital</button>
                            </div>
                        )}
                        <div className="flex gap-2 items-center">
                            <input
                                className="flex-1 w-full bg-slate-100 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                onClick={() => sendMessage()}
                                className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-blue-700 transition disabled:bg-slate-300"
                                disabled={!input.trim()}
                            >
                                <SendIcon />
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
