import jwt from "jsonwebtoken";
// ✅ Import the user models
import { foreignUser, domesticUser } from "../models/user.model.js";

const touristMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.id || !decoded.type) {
        return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
    }

    // ✅ Find the user in the database based on the token type
    let user;
    if (decoded.type === 'Foreign') {
        user = await foreignUser.findById(decoded.id).select("-password");
    } else if (decoded.type === 'Domestic') {
        user = await domesticUser.findById(decoded.id).select("-password");
    }

    if (!user) {
        return res.status(404).json({ message: "Unauthorized: Tourist not found in database" });
    }
    
    // ✅ Attach the correct user object to the request
    if (decoded.type === 'Foreign') {
        req.foreignTourist = user;
    } else {
        req.domesticTourist = user;
    }

    next();
  } catch (error) {
    console.error("Middleware error:", error.message);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};

export default touristMiddleware;