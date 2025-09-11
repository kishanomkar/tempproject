import express from "express";
import cookieParser from "cookie-parser";
import connectToDb from "./db/db"; 
connectToDb();

const userapp = express();


userapp.use(express.json());
userapp.use(cookieParser());

module.exports = userapp;