const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // MS
    httpOnly: true, // JS cannot access the cookie
    sameSite: "strict", // cookie will only be sent in a first-party context
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};

module.exports = { generateToken };
