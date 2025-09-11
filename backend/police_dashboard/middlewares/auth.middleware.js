import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';

const authMiddleware = async (req, res, next) => {
  try {
    // Get token from cookie or A header
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);

    if (!token) {
      return res.status(401).send('Access denied. No token provided.');
    }

    // Check if token is blacklisted in MongoDB
    const BlacklistedToken = mongoose.model('BlacklistedToken', new mongoose.Schema({ token: String }));
    const isBlacklisted = await BlacklistedToken.findOne({ token });
    if (isBlacklisted) {
      res.clearCookie('token'); // clear cookie properly
      return res.status(401).send('Access denied. Token blacklisted.');
    }

    // Verify JWT
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    return res.status(400).send('Invalid or expired token.');
  }
};

export default authMiddleware;
