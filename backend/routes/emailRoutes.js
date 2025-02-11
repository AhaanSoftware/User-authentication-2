const express=require('express')
const router=express.Router();
const {requestEmailOtp, verifyEmailOtp}=require('../controllers/emailOtpController')

router.post('/request-email-otp', requestEmailOtp)

router.post('/verify-email-otp', verifyEmailOtp)

module.exports=router