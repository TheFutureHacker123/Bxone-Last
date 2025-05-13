import React, { useState,useEffect } from "react";
import { FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import Translation from "../translations/lang.json";
import "./style/reset-password.css";  // Make sure this points to your custom CSS file

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  
  const defaultFontSize = 'medium';
  const defaultFontColor = '#000000';
  const defaultLanguage = 'english'; // Default language

  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || defaultFontSize);
  const [fontColor, setFontColor] = useState(() => localStorage.getItem('fontColor') || defaultFontColor);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || defaultLanguage);
  const [content, setContent] = useState(Translation[language]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', fontSize);
    document.documentElement.style.setProperty('--font-color', fontColor);
    
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('fontColor', fontColor);
    localStorage.setItem('language', language);

    // Update content based on selected language
    setContent(Translation[language]);
  }, [fontSize, fontColor, language]);
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !newPassword || !confirmPassword) {
      setError("Please fill out all fields.");
    } else if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
      setSuccessMessage("Password has been reset successfully.");
      // Add your reset password logic here (e.g., call API to reset the password)
      console.log("Resetting password for", { email, newPassword });
    }
  };

  return (
    <div className="vendor-reset-password-wrapper">
      <div className="vendor-reset-password-container">
        <h2 className="text-center mb-4 vendor-reset-password-header">Reset Password</h2>

        {error && <div className="alert alert-danger vendor-error-message">{error}</div>}
        {successMessage && <div className="alert alert-success vendor-success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="vendor-reset-password-form">
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
            <label htmlFor="newPassword" className="form-label vendor-form-label">
              <FaLock className="me-2" /> New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-control vendor-form-control"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
            />
          </div>

          <div className="form-group mb-3 vendor-form-group">
            <label htmlFor="confirmPassword" className="form-label vendor-form-label">
              <FaCheckCircle className="me-2" /> Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control vendor-form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
            />
          </div>

          <button type="submit" className="btn btn-success vendor-btn-submit w-100">
            Reset Password
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            Remembered your password? <a href="/vendor/login" className="vendor-login-link">Login here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
