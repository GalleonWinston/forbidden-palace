const express  = require('express')
const dotenv = require('dotenv')
dotenv.config();


const apiRoutes = require("./src/routes/apiRoutes")
const { db } = require('./src/library/db')
 
const app = express()
const PORT = process.env.PORT;

app.use(express.json())

app.get("/", (req,res) => {
    res.status(201).json({ message: "hello World"})
})


app.use("/api", apiRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})