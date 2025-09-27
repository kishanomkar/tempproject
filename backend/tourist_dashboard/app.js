// ✅ UPDATED AND CORRECTED app.js

import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToDb from "./db/db.js";
import touristRoutes from "./routes/tourist.route.js";
import cors from "cors";

dotenv.config();

// ------------------ CONNECT TO DATABASE ------------------
connectToDb();

const touristapp = express();

// ❌ CHANGE THIS:
// touristapp.use(cors());

// ✅ TO THIS:
touristapp.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174", 
      "http://localhost:5175"
    ], // Replace if your frontend port is different
    credentials: true,
  })
);

// ------------------ MIDDLEWARE ------------------
touristapp.use(express.json());
touristapp.use(express.urlencoded({ extended: true }));
touristapp.use(cookieParser());

// ------------------ ROUTES ------------------
touristapp.use("/api/tourist", touristRoutes);

// ------------------ HEALTH CHECK ------------------
touristapp.get("/", (req, res) => {
  res.status(200).json({ message: "Tourist Service is running 🚀" });
});

export default touristapp;