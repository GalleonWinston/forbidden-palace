const express = require('express')

const {postMethaneLevel,  getMethaneLevel, postBinCapacity, getBinCapacity } = require('../controllers/controller')

const router = express.Router();

router.post("/postMethaneLevel", postMethaneLevel)

router.get("/getMethaneLevel", getMethaneLevel)

router.post("/postBinCapacity", postBinCapacity)

router.get("/getBinCapacity", getBinCapacity)

router.get("/hello2", (req,res) => {
    res.status(201).json({ message: "hello World2"})
})

module.exports = router;
