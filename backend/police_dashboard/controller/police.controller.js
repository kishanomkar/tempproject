import {validationResult} from 'express-validator';
import Police from '../models/police.model.js';
import * as policeService from "../services/police.services.js"
import { getAllTourists } from '../services/data.services.js';
import { Alert } from '../models/police.model.js';
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
    localStorage.setItem("police token",token)
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


export const getAllTouristsController = async (req, res) => {
    try {
        // 1. Fetch the raw tourist data from the database via the service.
        const { foreignTourists, domesticTourists } = await getAllTourists();

        // 2. Map over the foreign tourists to format their data.
        const flatForeignTourists = foreignTourists.map(tourist => {
            const doc = tourist._doc;
            return {
                ...doc,
                type: 'Foreign', // Add a 'type' for easy identification on the frontend.
                // Convert GeoJSON coordinates to a simple lat/lng object for the map.
                location: {
                    lat: doc.location?.coordinates[1],
                    lng: doc.location?.coordinates[0]
                }
            };
        });

        // 3. Map over the domestic tourists similarly.
        const flatDomesticTourists = domesticTourists.map(tourist => {
            const doc = tourist._doc;
            return {
                ...doc,
                type: 'Domestic',
                location: {
                    lat: doc.location?.coordinates[1],
                    lng: doc.location?.coordinates[0]
                }
            };
        });
        
        // 4. Send the prepared data back to the dashboard.
        res.status(200).json({
            foreignTourists: flatForeignTourists,
            domesticTourists: flatDomesticTourists,
        });

    } catch (error) {
        console.error("Error in getAllTouristsController:", error);
        res.status(500).json({ message: "Server error while fetching tourist data" });
    }
};

export const createAlert = async (req, res) => {
  try {
    const { message, location, timestamp } = req.body;

    console.log("📩 Alert received:", message, location, timestamp);

    // ✅ Get userId from JWT payload
    const userId = req.user?.id; // middleware should attach req.user
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized: No userId found" });
    }

    const alert = new Alert({
      userId, // must exist in schema
      message,
      location,
      timestamp,
    });

    await alert.save();

    res.json({ status: "ok", alert });
  } catch (err) {
    console.error("❌ Error creating alert:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all alerts
export const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find()
      .populate("userId", "username email")
      .sort({ timestamp: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};