import { foreignUser, domesticUser } from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

<<<<<<< HEAD
// ------------------ Helper: Generate JWT ------------------
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// ------------------ REGISTER FOREIGN ------------------
export async function registerForeignUser(req, res) {
=======

async function registerForeignUser(req, res) {
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
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

<<<<<<< HEAD
    if (!fullname || !contactInformation?.email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check duplicate by passport / visa / email
    const isAlreadyRegistered = await foreignUser.findOne({
      $or: [
        { "identityDocument.passportNumber": identityDocument?.passportNumber },
        { "identityDocument.visaNumber": identityDocument?.visaNumber },
        { "contactInformation.email": contactInformation?.email },
      ],
    });

=======
    const isAlreadyRegistered = await foreignUser.findOne({ userId });
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
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

<<<<<<< HEAD
    const token = generateToken(newForeignUser._id);

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(201).json({
      message: "User registered successfully",
      user: newForeignUser,
      token,
    });
=======
    const token = jwt.sign({ id: ForeignUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true });
    res
      .status(201)
      .json({ message: "User registered successfully", ForeignUser });
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
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

<<<<<<< HEAD
    if (!fullname || !contactInformation?.email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check duplicate by aadhar / email
    const isAlreadyRegistered = await domesticUser.findOne({
      $or: [
        { "identityDocument.aadharNumber": identityDocument?.aadharNumber },
        { "contactInformation.email": contactInformation?.email },
      ],
    });

=======
    const isAlreadyRegistered = await domesticUser.findOne({ userId });
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
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

<<<<<<< HEAD
    const token = generateToken(newDomesticUser._id);

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(201).json({
      message: "User registered successfully",
      user: newDomesticUser,
      token,
    });
=======
    const token = jwt.sign({ id: DomesticUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true });
    res
      .status(201)
      .json({ message: "User registered successfully", DomesticUser });
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


<<<<<<< HEAD
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

=======
async function loginForeignUSer(req, res) {
  try {
    const { email, userId, password, visaNumber } = req.body; 
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
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

<<<<<<< HEAD
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
=======
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "User logged in successfully", user });
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


<<<<<<< HEAD
    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

=======
async function loginDomesticUser(req, res) {
  try {
    const { email, userId, password, aadharNumber } = req.body; 
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
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

<<<<<<< HEAD
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });
    res.status(200).json({
      message: "User logged in successfully",
      user,
      token,
    });
=======
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ message: "User logged in successfully", user });
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

<<<<<<< HEAD
// ------------------ LOGOUT ------------------
export async function logoutForeignUser(req, res) {
=======

async function logoutForeignUser(req, res) {
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" }); 
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

<<<<<<< HEAD
export async function logoutDomesticUser(req, res) {
=======
async function logoutDomesticUser(req, res) {
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "strict" }); 
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

<<<<<<< HEAD
// ------------------ PROFILE ------------------
export async function foreignUserProfileController(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function domesticUserProfileController(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json({ user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
=======

async function foreignUserProfileController(req, res) {
  const user = req.user;
  res.status(200).json({ user });
}

async function domesticUserProfileController(req, res) {
  const user = req.user;
  res.status(200).json({ user });
>>>>>>> b23d60a9a522fdc12d6bcb0e81bdf3a1a6aafc9d
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
