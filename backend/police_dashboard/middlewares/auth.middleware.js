import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // ✅ Get token from cookie OR Authorization header
    const token =
      req.cookies?.token ||
      (req.headers.authorization &&
        req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // ✅ Verify JWT
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded payload (id, email, role, etc.)
    req.user = verified;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);

    if (error.name === "TokenExpiredError") {
      res.clearCookie("token");
      return res.status(401).json({ error: "Session expired. Please log in again." });
    }

    return res.status(400).json({ error: "Invalid or expired token." });
  }
};

export default authMiddleware;

