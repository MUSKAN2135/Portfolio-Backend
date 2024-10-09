const express = require('express')
const { loginUser, SendResetPasswordEmail, changePassword, UserSignup } = require('../controllers/usercontroller')

const userRouter = express.Router()

userRouter.post('/SignupUser', UserSignup)
userRouter.post('/Loginuser', loginUser)
userRouter.post('/resetPassword', SendResetPasswordEmail)
userRouter.post('/changeuserpass/:token', changePassword)

module.exports = userRouter
