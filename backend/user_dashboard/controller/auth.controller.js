import { foreignUser, domesticUser } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


async function registerForeignUser(req, res) {
  try {
    const {
      fullname,
      userId,
      smartTouristId,
      email,
      phoneNumber,
      password,
      visaNumber, 
    } = req.body;

    const isAlreadyRegistered = await foreignUser.findOne({ userId });
    if (isAlreadyRegistered) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const ForeignUser = await foreignUser.create({
      fullname,
      contactInformation: { email, phoneNumber },
      identityDocument: { visaNumber },
      password: hashPassword,
      userId,
      smartTouristId,
    });

    const token = jwt.sign({ id: ForeignUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true });
    res
      .status(201)
      .json({ message: "User registered successfully", ForeignUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function registerDomesticUser(req, res) {
  try {
    const {
      fullname,
      userId,
      smartTouristId,
      email,
      phoneNumber,
      password,
      aadharNumber, 
    } = req.body;

    const isAlreadyRegistered = await domesticUser.findOne({ userId });
    if (isAlreadyRegistered) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const DomesticUser = await domesticUser.create({
      fullname,
      contactInformation: { email, phoneNumber },
      identityDocument: { aadharNumber }, 
      userId,
      smartTouristId,
    });

    const token = jwt.sign({ id: DomesticUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true });
    res
      .status(201)
      .json({ message: "User registered successfully", DomesticUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function loginForeignUSer(req, res) {
  try {
    const { email, userId, password, visaNumber } = req.body; 
    const user = await foreignUser.findOne({
      userId,
      "contactInformation.email": email,
      "identityDocument.visaNumber": visaNumber, 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
    
}


async function loginDomesticUser(req, res) {
  try {
    const { email, userId, password, aadharNumber } = req.body; 
    const user = await domesticUser.findOne({
      userId,
      "contactInformation.email": email,
      "identityDocument.aadharNumber": aadharNumber, 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "User logged in successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function logoutForeignUser(req, res) {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" }); 
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function logoutDomesticUser(req, res) {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" }); 
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function foreignUserProfileController(req, res) {
  const user = req.user;
  res.status(200).json({ user });
}

async function domesticUserProfileController(req, res) {
  const user = req.user;
  res.status(200).json({ user });
}

export default {
  registerForeignUser,
  registerDomesticUser,
  loginForeignUSer,
  loginDomesticUser,
  logoutForeignUser,
  logoutDomesticUser,
  foreignUserProfileController,
  domesticUserProfileController,
};
