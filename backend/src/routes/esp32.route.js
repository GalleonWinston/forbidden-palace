const express = require('express')

const { protectRoute } = require('../middleware/auth.middleware');

const { createEsp32, getDeviceReadings } = require('../controllers/esp32.controller');



const router = express.Router();

router.post('/createEsp32', protectRoute, createEsp32);

router.get('/readingData', protectRoute, getDeviceReadings);

module.exports = router;