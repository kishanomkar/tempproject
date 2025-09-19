import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToDb from "./db/db.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

// ------------------ CONNECT TO DATABASE ------------------
connectToDb();

const userapp = express();

// ------------------ MIDDLEWARE ------------------
userapp.use(express.json());
userapp.use(express.urlencoded({ extended: true })); // ✅ handles form-data
userapp.use(cookieParser());

// ------------------ ROUTES ------------------
userapp.use("/api/user", userRoutes);

// ------------------ HEALTH CHECK ------------------
userapp.get("/", (req, res) => {
  res.status(200).json({ message: "User Service is running 🚀" });
});

export default userapp;
