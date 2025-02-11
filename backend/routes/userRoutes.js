const express = require('express');
const router = express.Router();
const { requestEmailOtp, verifyEmailOtp } = require('../controllers/emailOtpController');
const { registerUser, loginUser } = require('../controllers/userController');

router.post('/verify-email', requestEmailOtp);

router.post('/verify-otp', verifyEmailOtp);

router.post('/signup', registerUser);        


router.post("/login", loginUser)

module.exports=router;