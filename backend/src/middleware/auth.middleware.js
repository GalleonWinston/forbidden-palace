const jwt = require("jsonwebtoken");

const protectRoute = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

module.exports = { protectRoute };