import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./police_dashboard/app.js";
import touristapp from "./tourist_dashboard/app.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { generateResponse } from "./tourist_dashboard/services/ai.service.js";
import { response } from "express";



/* ---------------- Helper: Auto-port fallback ---------------- */
function startServer(createServerOrApp, port, name, isSocket = false) {
  // Agar Socket server hai to use directly, else create HTTP server
  const server = isSocket
    ? createServerOrApp
    : http.createServer(createServerOrApp);

  server.listen(port)
    .on("listening", () => {
      console.log(`${name} is running on port ${port}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`⚠️ ${name}: Port ${port} busy, trying ${port + 1}...`);
        // recursion me naya server instance create kar rahe hain
        startServer(createServerOrApp, port + 1, name, isSocket);
      } else {
        console.error(err);
      }
    });

  return server;
}


const police_port = parseInt(process.env.POLICE_PORT) || 3000;
startServer(app, police_port, "Police Server");



const tourist_port = parseInt(process.env.TOURIST_PORT) || 4000;
startServer(touristapp, tourist_port, "Tourist Server");


const socket_port = parseInt(process.env.SOCKET_PORT) || 8080;
const httpSocketServer = createServer(); 
const io = new Server(httpSocketServer, { cors: { origin: "*" } });

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });

  // ✅ JOIN ROOM by region + nationality
  socket.on("join-room", ({ region, nationality }) => {
    const roomId = `${region}-${nationality}`; // e.g. India-Delhi
    socket.join(roomId);
    console.log(`User joined room: ${roomId}`);
  });

  // ✅ Community messages send to only that room
  socket.on("community-message", ({ room, name, text }) => {
    const msgData = { name, text, room };
    io.to(room).emit("community-message", msgData);
  });

  // ✅ AI chat code (kept separate & safe)
  socket.on("ai-message", async (data) => {
    console.log("AI message received:", data);
    chatHistory.push({ role: "user", parts: [{ text: data }] });

    const aiRes = await generateResponse(chatHistory);
    chatHistory.push({ role: "model", parts: [{ text: aiRes }] });

    socket.emit("ai-message-response", aiRes);
  });
});



startServer(httpSocketServer, socket_port, "Socket Server", true);