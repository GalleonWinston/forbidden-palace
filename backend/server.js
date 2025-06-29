const express  = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

dotenv.config();


const authRoutes = require("./src/routes/auth.route")
const esp32Routes = require("./src/routes/esp32.route")

 
const app = express()
const PORT = process.env.PORT;

app.use(express.json())
app.use(cookieParser())

app.get("/", (req,res) => {
    res.status(201).json({ message: "hello World"})
})


app.use("/api/auth", authRoutes)
app.use("/api/esp32", esp32Routes)


app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})