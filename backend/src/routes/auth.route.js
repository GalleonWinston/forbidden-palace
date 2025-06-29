const express = require('express')

const { signup, login, logout, checkAuth, getUserProfile } = require('../controllers/auth.controller');
const { protectRoute } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)


router.get('/check-auth', protectRoute, checkAuth)

router.get('/getUserProfile', protectRoute, getUserProfile)

module.exports = router;
