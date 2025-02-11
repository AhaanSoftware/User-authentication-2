import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AuthPage.css";
import Login from "./User/Login";
import Register from "./User/Register";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false); // Flag to toggle sign-up/login form for user
  const [registerData, setRegisterData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();

  // Set initial state based on the route
  useEffect(() => {
    if (location.pathname === "/register") {
      setIsSignUp(true);
    } else {
      setIsSignUp(false);
    }
  }, [location.pathname]);

  const toggleForm = () => {
    setIsSignUp((prevState) => !prevState);
    
  };

  const handleRegisterSuccess = (email, password) => {
    setRegisterData({ email, password });
    setIsSignUp(false);
    navigate("/login"); // After registration success, navigate to user login
  };

  return (
    <div className="background">
      <div className={`auth-container ${isSignUp ? "active" : ""}`}>
        <div className="form-container sign-in-container">
          {!isSignUp ? (
            <Login onLoginSuccess={handleRegisterSuccess} preFillData={registerData} />
          ) : (
            <Register onRegisterSuccess={handleRegisterSuccess} />
          )}
        </div>

        <div className="overlay">
          <h1>Welcome to Our Page</h1>
          <p>{ !isSignUp ? "Create a new account." : "If you already have an account, please log in."}</p>
          <button onClick={toggleForm} className="login">
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
