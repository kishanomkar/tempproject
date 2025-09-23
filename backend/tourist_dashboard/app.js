import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToDb from "./db/db.js";
import touristRoutes from "./routes/tourist.route.js";  // ✅ fixed
import cors from "cors";

dotenv.config();

// ------------------ CONNECT TO DATABASE ------------------
connectToDb();

const touristapp = express();

touristapp.use(cors());

// ------------------ MIDDLEWARE ------------------
touristapp.use(express.json());
touristapp.use(express.urlencoded({ extended: true })); // ✅ handles form-data
touristapp.use(cookieParser());

// ------------------ ROUTES ------------------
touristapp.use("/api/tourist", touristRoutes);

// ------------------ HEALTH CHECK ------------------
touristapp.get("/", (req, res) => {
  res.status(200).json({ message: "Tourist Service is running 🚀" });
});

export default touristapp;
