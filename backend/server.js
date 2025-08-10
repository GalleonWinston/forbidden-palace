const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const path = require("path");

dotenv.config();

const authRoutes = require("./src/routes/auth.route");
const esp32Routes = require("./src/routes/esp32.route");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies to be sent with requests
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.status(201).json({ message: "hello World" });
});

app.use("/api/auth", authRoutes);
app.use("/api/esp32", esp32Routes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
