import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import "./style/register.css";  // Make sure this points to your custom CSS file

const RegisterVendor = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill out all fields.");
    } else if (password !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
      // Add your sign-up logic here (e.g., call API to register the user)
      console.log("Signing up with", { name, email, password });
    }
  };

  return (
    <div className="vendor-signup-wrapper">
      <div className="vendor-signup-container">
        <h2 className="text-center mb-4 vendor-signup-header">Vendor Sign Up</h2>

        {error && <div className="alert alert-danger vendor-error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="vendor-signup-form">
          <div className="form-group mb-3 vendor-form-group">
            <label htmlFor="name" className="form-label vendor-form-label">
              <FaUser className="me-2" /> Full Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control vendor-form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group mb-3 vendor-form-group">
            <label htmlFor="email" className="form-label vendor-form-label">
              <FaEnvelope className="me-2" /> Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control vendor-form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group mb-3 vendor-form-group">
            <label htmlFor="password" className="form-label vendor-form-label">
              <FaLock className="me-2" /> Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control vendor-form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <div className="form-group mb-3 vendor-form-group">
            <label htmlFor="confirmPassword" className="form-label vendor-form-label">
              <FaCheckCircle className="me-2" /> Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control vendor-form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn btn-success vendor-btn-submit w-100">
            Sign Up
          </button>
        </form>

        <div className="text-center mt-3">
          <p className="text-muted">
            Already have an account? <a href="/vendor/login" className="vendor-login-link">Login here</a>
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default RegisterVendor;
