const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const EmailVerification=require('../models/emailVerification')

const nodemailer = require('nodemailer');

// Create a reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail', // or another email service
    auth: {
        user: "soumitra.ahaansoftware@gmail.com", // Your email
        pass: "jqnt jewb lvro smjo", // Your app password or real password
    },
});
const generateAccessToken = (user) => {    
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};


const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        // Check if the email has been verified
        const emailVerification = await EmailVerification.findOne({ email });

        if (!emailVerification || !emailVerification.isVerified) {
            return res.status(400).json({ msg: 'Please verify your email first' });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            // isVerified: true,  // Optional: can remove this if verification status is enough
        });

        await newUser.save();

        // Delete the email verification record after successful registration
        await EmailVerification.deleteOne({ email });

        // Send email notification to the user (and optionally admin)
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Your email
            to: email,  // The email the user provided
            subject: 'New User Registration', // Subject of the email
            text: `
            Thank you for registering!

            Full Name: ${firstName} ${lastName}
            Email: ${email}

            Your account has been successfully created. Please review your details.
            `,
        };

        // Send the email (using async/await for cleaner handling)
        try {
            await transporter.sendMail(mailOptions);
            console.log('Notification email sent successfully');
        } catch (emailError) {
            console.log('Error sending notification email:', emailError);
        }

        // Respond with success message
        res.status(201).json({ msg: 'User registered successfully' });

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};



const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Email and password are required' });
    }

    try {
        // Find user by email (case-insensitive)
        const user = await User.findOne({ email: new RegExp('^' + email + '$', 'i') });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Compare the entered password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password); // Assuming `user.password` is hashed
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = generateAccessToken(user);

        // Send the token in the response
        res.status(200).json({ token, msg: 'Login successful' });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = { registerUser, loginUser  };
