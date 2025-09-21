import {validationResult} from 'express-validator';
import Police from '../models/police.model.js';
import * as policeService from "../services/police.services.js"
import mongoose from 'mongoose';
export const registerPoliceController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
    const police = await policeService.registerPolice(req.body);
    const token = police.generateAuthToken();

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" }); // store JWT in cookie
    delete police._doc.password; 
    res.status(200).json({ police, token });

  } catch (error) {
    res.status(400).send(error.message);
  }
}

export const loginPoliceController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    console.log("error in login");
  }

  try {
    const { email, password,service_id } = req.body;

    if (!email || !password || !service_id) {
      return res.status(400).send("All fields are required");
    }

    const police = await Police.findOne({ email }).select("+password");
    if (!police) {
      return res.status(400).send("Invalid email or password or service_id");
    }

    const isMatch = await police.isValidPassword(police.password, password); // ✅ fixed
    if (!isMatch) {
      return res.status(400).send("Invalid email or password");
    }

    const token = police.generateAuthToken();
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" }); // ✅ save token in cookie
    res.status(200).json({ police, token });

    delete police._doc.password
  } catch (error) {
    return res.status(400).send(error.message);
  }
};


export const logoutPoliceController = async (req, res) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "No token found" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
    }); 

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: error.message });
  }
};


export const policeProfileController = async (req, res) => {
  const police = req.user;
  console.log(req.user);
  res.status(200).json({ police });
};
