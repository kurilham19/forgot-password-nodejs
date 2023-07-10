const express = require('express')

const {
  register,
  login,
} = require('../controller/authController')

const {
  requestToken,
  changePassword
} = require('../controller/forgotPasswordController')

const router = express.Router()

router.post('/register',register)
router.post('/login',login)
router.post('/forgot-password',requestToken)
router.post('/forgot-password/:idToken',changePassword)

module.exports = router