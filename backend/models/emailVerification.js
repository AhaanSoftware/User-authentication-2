// models/emailVerification.js
const mongoose = require('mongoose');

// Define schema for email verification
const emailVerificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,  // Ensures email is stored in lowercase
    },
    otp: {
      type: String, // Store the OTP temporarily
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false, // Set to true once the user verifies their OTP
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date, // You can set this to a specific time (e.g., OTP expires after 10 minutes)
      default: Date.now() + 10 * 60 * 1000, // 10 minutes expiry for example
    },
  },
  {
    timestamps: true,
  }
);

// Create the model for email verification
const EmailVerification = mongoose.model('EmailVerification', emailVerificationSchema);

module.exports = EmailVerification;
