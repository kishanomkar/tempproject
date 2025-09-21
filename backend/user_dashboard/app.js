import express from "express";
import cookieParser from "cookie-parser";
import connectToDb from "./db/db.js";
import userRoutes from "./routes/user.route.js";
import cors from 'cors'
import dotenv from 'dotenv'


connectToDb();

const userapp = express();

dotenv.config()
userapp.use(cors());
userapp.use(express.json());
userapp.use(cookieParser());
userapp.use("/api/user", userRoutes);


export default userapp;