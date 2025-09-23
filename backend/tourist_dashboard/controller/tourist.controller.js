import { validationResult } from "express-validator";
import { foreignUser,domesticUser } from "../models/user.model.js";
import * as touristService from "../services/tourist.services.js"

export const registerForeignTouristController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
    const foreignTourist = await touristService.registerForeignTourist(req.body);
    const token = foreignTourist.generateAuthToken();

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" }); // store JWT in cookie
    delete foreignTourist._doc.password;
    res.status(201).json({ foreignTourist, token });
} catch (error) {
    res.status(500).json({ error: error.message });
}
}

export const registerDomesticTouristController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const domesticTourist = await touristService.registerDomesticTourist(req.body);
        const token = domesticTourist.generateAuthToken();

        res.cookie("token", token, { httpOnly: true, sameSite: "strict" }); // store JWT in cookie
        delete domesticTourist._doc.password;
        res.status(201).json({ domesticTourist, token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const loginForeignTouristController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password, visaNumber } = req.body;
        if (!email || !password || !visaNumber) {
            return res.status(400).send("All fields are required");
        }

        const foreignTourist = await foreignUser.findOne({ email }).select("+password");
        if (!foreignTourist) {
            return res.status(400).send("Invalid email or password");
        }
        const isMatch = await foreignTourist.isValidPassword(foreignTourist.password, password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }
        const token = foreignTourist.generateAuthToken();
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ foreignTourist, token });

        delete foreignTourist._doc.password;
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const loginDomesticTouristController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password, aadharNumber } = req.body;
        if (!email || !password || !aadharNumber) {
            return res.status(400).send("All fields are required");
        }

        const domesticTourist = await domesticUser.findOne({ email }).select("+password");
        if (!domesticTourist) {
            return res.status(400).send("Invalid email or password");
        }
        const isMatch = await domesticTourist.isValidPassword(domesticTourist.password, password);
        if (!isMatch) {
            return res.status(400).send("Invalid email or password");
        }
        const token = domesticTourist.generateAuthToken();
        res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
        res.status(200).json({ domesticTourist, token });

        delete domesticTourist._doc.password;
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export const logoutForeignTouristController = async (req, res) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
        res.status(200).send("Logged out successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const logoutDomesticTouristController = async (req, res) => {
    try {
        const token =
            req.cookies?.token ||
            req.headers?.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).send("Unauthorized");
        }
        res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
        res.status(200).send("Logged out successfully");
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getForeignTouristProfileController = async (req, res) => {
    try {
        const foreignTouristId = req.foreignTourist._id;
        const foreignTourist = await foreignUser.findById(foreignTouristId).select("-password");
        if (!foreignTourist) {
            return res.status(404).send("Foreign tourist not found");
        }
        res.status(200).json({ foreignTourist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const getDomesticTouristProfileController = async (req, res) => {
    try {
        const domesticTouristId = req.domesticTourist._id;
        const domesticTourist = await domesticUser.findById(domesticTouristId).select("-password");
        if (!domesticTourist) {
            return res.status(404).send("Domestic tourist not found");
        }
        res.status(200).json({ domesticTourist });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}