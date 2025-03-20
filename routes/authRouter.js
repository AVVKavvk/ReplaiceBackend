const express= require('express')
const { Signup, Login, Logout,CheckAuthenticity,UpdateProfile, GetUserById } = require('../controllers/authController')
const { isUserAuthenticated } = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/signup',Signup)
router.post('/login',Login)
router.post('/logout',Logout)
router.put('/updateProfile',isUserAuthenticated, UpdateProfile)
router.get('/check',isUserAuthenticated,CheckAuthenticity)
router.get('/user/:id',isUserAuthenticated,GetUserById)

module.exports = router