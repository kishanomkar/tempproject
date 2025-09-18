import { foreignUser, domesticUser } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ------------------ REGISTER FOREIGN ------------------
export async function registerForeignUser(req, res) {
  try {
    const {
      fullname,
      gender,
      date_of_birth,
      nationality,
      identityDocument,
      contactInformation,
      travelDetails,
      password,
      smartTouristId,
    } = req.body;

    // check duplicate by passport / visa / email
    const isAlreadyRegistered = await foreignUser.findOne({
      $or: [
        { "identityDocument.passportNumber": identityDocument.passportNumber },
        { "identityDocument.visaNumber": identityDocument.visaNumber },
        { "contactInformation.email": contactInformation.email },
      ],
    });

    if (isAlreadyRegistered) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newForeignUser = await foreignUser.create({
      fullname,
      gender,
      date_of_birth,
      nationality,
      identityDocument,
      contactInformation,
      travelDetails,
      password: hashPassword,
      smartTouristId,
    });

    const token = jwt.sign({ id: newForeignUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newForeignUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ------------------ REGISTER DOMESTIC ------------------
export async function registerDomesticUser(req, res) {
  try {
    const {
      fullname,
      gender,
      date_of_birth,
      nationality,
      identityDocument,
      contactInformation,
      travelDetails,
      password,
      smartTouristId,
    } = req.body;

    // check duplicate by aadhar / email
    const isAlreadyRegistered = await domesticUser.findOne({
      $or: [
        { "identityDocument.aadharNumber": identityDocument.aadharNumber },
        { "contactInformation.email": contactInformation.email },
      ],
    });

    if (isAlreadyRegistered) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newDomesticUser = await domesticUser.create({
      fullname,
      gender,
      date_of_birth,
      nationality,
      identityDocument,
      contactInformation,
      travelDetails,
      password: hashPassword,
      smartTouristId,
    });

    const token = jwt.sign({ id: newDomesticUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res
      .status(201)
      .json({ message: "User registered successfully", user: newDomesticUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ------------------ LOGIN FOREIGN ------------------
export async function loginForeignUser(req, res) {
  try {
    const { email, phoneNumber, visaNumber, passportNumber, password } = req.body;

    const user = await foreignUser.findOne({
      $or: [
        { "contactInformation.email": email },
        { "contactInformation.phoneNumber": phoneNumber },
        { "identityDocument.visaNumber": visaNumber },
        { "identityDocument.passportNumber": passportNumber },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ------------------ LOGIN DOMESTIC ------------------
export async function loginDomesticUser(req, res) {
  try {
    const { email, phoneNumber, aadharNumber, drivingLicenseNumber, password } =
      req.body;

    const user = await domesticUser.findOne({
      $or: [
        { "contactInformation.email": email },
        { "contactInformation.phoneNumber": phoneNumber },
        { "identityDocument.aadharNumber": aadharNumber },
        { "identityDocument.drivingLicenseNumber": drivingLicenseNumber },
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ------------------ LOGOUT FOREIGN ------------------
export async function logoutForeignUser(req, res) {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ------------------ LOGOUT DOMESTIC ------------------
export async function logoutDomesticUser(req, res) {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// ------------------ PROFILE ------------------
export async function foreignUserProfileController(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function domesticUserProfileController(req, res) {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
