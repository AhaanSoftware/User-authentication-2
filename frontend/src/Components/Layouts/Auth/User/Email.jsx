import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import axios from 'axios';

const EmailVerificationForm = ({ onVerified }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpField, setShowOtpField] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  // Handle email verification request
  const handleVerifyEmail = async () => {
    try {
      const response = await axios.post('http://localhost:3000/user/verify-email', { email });
      if (response.status === 200) {
        setShowOtpField(true);
        setVerificationError(false); // Reset previous errors
      }
    } catch (error) {
      console.error('Error during email verification:', error);
      setVerificationError(true); // Mark verification error
    }
  };

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus to the next input field when a digit is entered
    if (value && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }

    // Check if all OTP digits are filled
    if (newOtp.every(digit => digit !== '')) {
      const otpCode = newOtp.join('');
      verifyOtp(otpCode);
    }
  };

  // Function to verify OTP
  const verifyOtp = async (otpCode) => {
    try {
      const response = await axios.post('http://localhost:3000/user/verify-otp', { email, otp: otpCode});
      if (response.status === 200 && response.data.success) {
        setOtpVerified(true);
        setVerificationError(false);
        onVerified(); // Notify parent component that email is verified
      } else {
        setOtpVerified(false);
        setVerificationError(true);
      }
    } catch (error) {
      setVerificationError(true);
    }
  };

  return (
    <Form>
      <Row className="mb-3">
        <Col md={otpVerified ? 12 : 8}>
          <Form.Control
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={showOtpField || otpVerified}
          />
        </Col>
        <Col md={otpVerified ? 0 : 4}>
          {!otpVerified && (
            <Button onClick={handleVerifyEmail} className="verify-button w-100">
              Verify
            </Button>
          )}
        </Col>
      </Row>

      {showOtpField && !otpVerified && (
        <Form.Group controlId="formOtp" className="mb-3">
          <div className="d-flex" style={{ gap: '10px' }}>
            {otp.map((digit, index) => (
              <Form.Control
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                maxLength={1}
                className={`otp-input text-center ${verificationError ? 'border-danger' : ''}`}
                style={{ flex: 1, width: '20%' }}
              />
            ))}
          </div>
        </Form.Group>
      )}
    </Form>
  );
};

export default EmailVerificationForm;
