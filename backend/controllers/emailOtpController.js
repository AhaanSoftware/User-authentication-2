const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/userModel');
const EmailVerification=require('../models/emailVerification')
// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service
    auth: {
        user: "soumitra.ahaansoftware@gmail.com", // Your email
        pass: "jqnt jewb lvro smjo", // Your app password or real password
    },
});

// Generate OTP (6-digit number)
const generateOtp = () => {
    return crypto.randomInt(100000, 999999); // generates a random 6-digit number
};

// Function to send OTP email
const sendOtpEmail = (email, otp) => {
    const mailOptions = {
        from: process.env.EMAIL_USER, // Sender email
        to: email,                   // Recipient email
        subject: 'Your OTP Code',    // Subject of the email
        text: `Your OTP code is: ${otp}`, // OTP text
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending OTP email:', error);
        } else {
            console.log('OTP sent:', info.response);
        }
    });
};

const requestEmailOtp = async (req, res) => {
  const { firstName, lastName, email, password, reEnterPassword } = req.body;

  // Check if all fields are provided
  if (!firstName || !lastName || !email || !password || !reEnterPassword) {
      return res.status(400).json({ msg: 'All fields are required' });
  }

  // Check if password and re-entered password match
  if (password !== reEnterPassword) {
      return res.status(400).json({ msg: 'Passwords do not match' });
  }

  try {
      // Check if there is an existing OTP request for the email
      const existingOtp = await EmailVerification.findOne({ email });
      
      // If OTP exists, check if it was sent recently (e.g., within the last 30 seconds)
      if (existingOtp && Date.now() - existingOtp.createdAt < 30 * 1000) { // 30 seconds limit
          return res.status(400).json({ msg: 'Please wait 30 seconds before requesting a new OTP' });
      }

      // Generate OTP
      const otp = generateOtp();

      // If there is an existing OTP, delete it
      if (existingOtp) {
          await EmailVerification.deleteOne({ email });
      }

      // Store OTP with expiration time (e.g., 5 minutes)
      const otpData = new EmailVerification({
          email,
          otp,
          otpExpiry: Date.now() + 5 * 60 * 1000, // 5 minutes expiry
          createdAt: Date.now(),  // Store the creation time
      });

      await otpData.save();

      // Send OTP to email
      sendOtpEmail(email, otp);

      res.json({ msg: 'OTP sent successfully. Please verify it.' });
  } catch (error) {
      console.error('Error while requesting OTP:', error);
      res.status(500).json({ msg: 'Server error while sending OTP' });
  }
};


const verifyEmailOtp = async (req, res) => {
  const { email, otp, firstName, lastName, password } = req.body;

  if (!email || !otp || !firstName || !lastName || !password) {
      return res.status(400).json({ msg: 'Please provide all the required fields' });
  }

  try {
      const emailVerification = await EmailVerification.findOne({ email });

      if (!emailVerification) {
          return res.status(400).json({ msg: 'No OTP request found for this email' });
      }

      // Check if OTP has expired
      if (Date.now() > emailVerification.otpExpiry) {
          await EmailVerification.deleteOne({ email });
          return res.status(400).json({ msg: 'OTP has expired. Please request a new one.' });
      }

      // Verify OTP
      if (emailVerification.otp === otp) {
          emailVerification.isVerified = true;
          await emailVerification.save();

          // Now you can register the user
          const hashedPassword = await bcrypt.hash(password, 10);

          const newUser = new User({
              firstName,
              lastName,
              email,
              password: hashedPassword,
              isVerified: true, // Mark user as verified
          });

          await newUser.save();

          // Delete the email verification record after successful registration
          await EmailVerification.deleteOne({ email });

          res.status(201).json({ msg: 'User registered successfully' });
      } else {
          return res.status(400).json({ msg: 'Invalid OTP' });
      }
  } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).json({ msg: 'Server error during registration' });
  }
};



module.exports = { requestEmailOtp, verifyEmailOtp };
