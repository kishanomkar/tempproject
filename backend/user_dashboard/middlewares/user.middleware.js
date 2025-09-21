import { foreignUser, domesticUser } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// ✅ Generic function for verifying tokens
async function verifyToken(req, res, next, model) {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await model.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
}

// ✅ Foreign user middleware
async function authForeignUser(req, res, next) {
  return verifyToken(req, res, next, foreignUser);
}

// ✅ Domestic user middleware
async function authDomesticUser(req, res, next) {
  return verifyToken(req, res, next, domesticUser);
}

export default { authForeignUser, authDomesticUser };
