// import dotenv from "dotenv";
// dotenv.config();

// import http from "http"
// import app from "./police_dashboard/app.js"
// import touristapp from "./tourist_dashboard/app.js";

// const police_server = http.createServer(app)
// const police_port = process.env.POLICE_PORT || 3000
// const tourist_server = http.createServer(touristapp)
// const tourist_port = process.env.TOURIST_PORT || 4000

// police_server.listen(police_port,()=>{
//     console.log(`Police Server is running on port ${police_port}`);
// }) 

// tourist_server.listen(tourist_port,()=>{
//     console.log(`Tourist Server is running on port ${tourist_port}`);
// })


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
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  socket.on("ai-message", async (data) => {
    console.log("Ai message received:", data);

    chatHistory.push({ role: "user", parts: [{ text: data }] });

    const response = await generateResponse(chatHistory);

    chatHistory.push({ role: "model", parts: [{ text: response }] });

    socket.emit("ai-message-response", response);
  });

  
});

startServer(httpSocketServer, socket_port, "Socket Server", true);