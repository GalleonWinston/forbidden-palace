const express = require('express')

const { protectRoute } = require('../middleware/auth.middleware');

const { signup, login, logout, checkAuth, getUserProfile,  getAllUsers, deleteUser, deleteAllUsers } = require('../controllers/auth.controller');



const router = express.Router();

router.post('/signup', signup)

router.post('/login', login)

router.post('/logout', logout)


router.get('/check', protectRoute, checkAuth)

router.get('/getUserProfile', protectRoute, getUserProfile)

// Admin routes
router.get('/getAllUsers', getAllUsers)
router.post('/deleteUser', deleteUser)
router.delete('/deleteAllUsers', deleteAllUsers)

module.exports = router;
