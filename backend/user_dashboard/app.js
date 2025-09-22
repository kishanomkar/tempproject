import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectToDb from "./db/db.js";
import userRoutes from "./routes/user.route.js";
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

// ------------------ CONNECT TO DATABASE ------------------
connectToDb();

const userapp = express();


dotenv.config()
userapp.use(cors());

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
