const { db } = require("../library/db")
const bcrypt = require("bcryptjs");
const admin = require("firebase-admin");

const signup = async (req, res) => {
try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const snapshot = await db
      .ref("users")
      .orderByChild("email")
      .equalTo(email)
      .once("value");

    if (snapshot.exists()) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userRef = db.ref("users").push();

    await userRef.set({
      name: name,
      email: email,
      password: hashedPassword,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    });

    res.status(201).json({
      success: true,
      userId: userRef.key,
      message: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {signup}