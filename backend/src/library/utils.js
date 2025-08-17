const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // JS cannot access the cookie
    sameSite: "none", // CHANGED: Allow cross-site cookies
    secure: true, // CHANGED: Always true for cross-site cookies
  });

  return token;
};

module.exports = { generateToken };
