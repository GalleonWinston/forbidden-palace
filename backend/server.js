const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const authRoutes = require("./src/routes/auth.route");
const esp32Routes = require("./src/routes/esp32.route");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.get("/", (req, res) => {
  res.status(201).json({ message: "hello World" });
});

app.use("/api/auth", authRoutes);
app.use("/api/esp32", esp32Routes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
