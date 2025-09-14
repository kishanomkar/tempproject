import express from "express";
import cookieParser from "cookie-parser";
import connectToDb from "./db/db.js";
import userRoutes from "./routes/user.route.js";

connectToDb();

const userapp = express();


userapp.use(express.json());
userapp.use(cookieParser());
userapp.use("/api/user", userRoutes);

export default userapp;