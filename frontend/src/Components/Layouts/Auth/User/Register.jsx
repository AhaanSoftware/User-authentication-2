import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";

const Signup = () => {
  // Step 1: Signup Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  // Step 2: OTP Verification Form State
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false); // Flag to check if OTP is sent
  const [errorMessage, setErrorMessage] = useState("");
  const [otpErrorMessage, setOtpErrorMessage] = useState("");

  // Handle input changes in signup form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Request OTP from the backend
  const sendOtp = async () => {
    const { firstName, lastName, email, password, reEnterPassword } = formData;

    // Validate fields
    if (!firstName || !lastName || !email || !password || !reEnterPassword) {
      setErrorMessage("All fields are required");
      return;
    }
    if (password !== reEnterPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      // Send OTP request to backend
      const response = await fetch("http://localhost:3000/user/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, email, password, reEnterPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true); // OTP sent, show the OTP form
        setErrorMessage(""); // Clear any previous error
      } else {
        setErrorMessage(data.msg || "Error sending OTP. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrorMessage("Server error. Please try again later.");
    }
  };

  // Verify OTP and complete registration
  const verifyOtp = async () => {
    const { email, firstName, lastName, password } = formData;

    // Validate OTP field
    if (!otp) {
      setOtpErrorMessage("Please enter OTP");
      return;
    }

    try {
      // Verify OTP with backend
      const response = await fetch("http://localhost:3000/user/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, firstName, lastName, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("User registered successfully!");
        // Redirect to login page or other logic
        window.location.href = "/login"; // Example redirect to login page
      } else {
        setOtpErrorMessage(data.msg || "Error verifying OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpErrorMessage("Server error. Please try again later.");
    }
  };

  return (
    <Container>
      <h2 className="my-4 text-center">Signup</h2>

      {/* Signup Form */}
      {!isOtpSent ? (
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6}>
            <div style={{ color: "red" }}>{errorMessage}</div>
            <Form>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                />
              </Form.Group>

              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                />
              </Form.Group>

              <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                />
              </Form.Group>

              <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                />
              </Form.Group>

              <Form.Group controlId="reEnterPassword">
                <Form.Label>Re-enter Password</Form.Label>
                <Form.Control
                  type="password"
                  name="reEnterPassword"
                  value={formData.reEnterPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                />
              </Form.Group>

              <Button variant="primary" onClick={sendOtp} className="w-100 mt-3">
                Send OTP
              </Button>
            </Form>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-center">
          <Col xs={12} sm={8} md={6}>
            <div style={{ color: "red" }}>{otpErrorMessage}</div>
            <Form>
              <Form.Group controlId="otp">
                <Form.Label>OTP</Form.Label>
                <Form.Control
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  placeholder="Enter the OTP"
                />
              </Form.Group>

              <Button variant="success" onClick={verifyOtp} className="w-100 mt-3">
                Verify OTP
              </Button>
            </Form>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Signup;
