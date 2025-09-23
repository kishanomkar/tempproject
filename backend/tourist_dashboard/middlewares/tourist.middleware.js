import jwt from 'jsonwebtoken'

const touristMiddleware = (req, res, next) => {
  try {
    // Get token from cookie or A header
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.foreignTourist = decoded;
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default touristMiddleware;
