import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './styles/reset.css';
import Translation from "../translations/lang.json"; // Import translations

function Reset() {
  const [email, setEmail] = useState("");
  const [otpcode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpExpired, setOtpExpired] = useState(true);
  const [otpRequested, setOtpRequested] = useState(false);
  const navigate = useNavigate();


  
      const defaultFontSize = 'medium';
      const defaultFontColor = '#000000';
      const defaultLanguage = 'english';
  
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
  
          setContent(Translation[language]);
      }, [fontSize, fontColor, language]);
  

  useEffect(() => {
    if (localStorage.getItem('user-info')) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    } else {
      setOtpExpired(true);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  async function reset(e) {
    e.preventDefault();
    if (!email || !otpcode) {
      toast.error(content.email_empty || "Email and OTP can't be blank");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/reset", {
        method: 'POST',
        body: JSON.stringify({ email, otp: otpcode }),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });

      const result = await response.json();

      if (result.message === "Correct email and OTP") {
        toast.success(content.otp_verified || "OTP Verified. Please set a new password.");
        setShowPasswordModal(true);
      } else {
        toast.error(content.invalid_email_or_otp || "Invalid Email or OTP!");
      }
    } catch (error) {
      toast.error(content.an_error_occurred || "An error occurred. Please try again later.");
    }
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error(content.password_fields_empty || "Password fields can't be empty");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(content.passwords_do_not_match || "Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/updatepassword", {
        method: 'POST',
        body: JSON.stringify({ email, password: newPassword, "password_confirmation": confirmPassword }),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });

      const result = await response.json();
      if (result.message === "Password updated successfully") {
        toast.success(content.password_updated_successfully || "Password updated successfully");
        setShowPasswordModal(false);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(content.failed_to_update_password || "Failed to update password");
      }
    } catch (error) {
      toast.error(content.an_error_occurred || "An error occurred while updating password");
    }
  }

  async function getcode(e) {
    e.preventDefault();
    if (!email) {
      toast.error(content.email_empty || "Email can't be blank");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/getcode", {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });

      const result = await response.json();
      if (result.message === 'Otp sent successfully') {
        toast.success(content.check_email_code || "Check your email for the code!");
        setOtpTimer(60);
        setOtpExpired(false);
        setOtpRequested(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(content.an_error_occurred || "An error occurred. Please try again later.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="text-center">{content.reset_password || "Reset Password"}</h2>
        <form onSubmit={reset}>
          <div className="mb-3">
            <label htmlFor="email" className="custom-form-label text-start d-block">{content.email_address || "Email Address"}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="custom-form-control"
              id="email"
              placeholder={content.enter_your_email || "Enter your email"}
              required
            />
            <div className="input-group mt-3">
              <input
                type="text"
                value={otpcode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="custom-form-control"
                placeholder={content.enter_otp || "Enter OTP"}
                required
              />
              <button onClick={getcode} className="btn btn-warning" disabled={!otpExpired}>{content.get_code || "Get Code"}</button>
            </div>
            {!otpExpired && (
              <div className="timer-container">
                <span className="timer">{otpTimer}s</span>
              </div>
            )}
            {otpRequested && otpExpired && <span className="text-danger mt-2">{content.otp_expired || "OTP expired. Please resend."}</span>}
          </div>

          <button type="submit" className="btn btn-warning w-100">{content.reset_password || "Reset Password"}</button>
        </form>
        <p className="text-center mt-3">
          <a href="/login" className="forgot-password">{content.back_to_login || "Back to Login"}</a>
        </p>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>{content.set_new_password || "Set New Password"}</h4>
            <form onSubmit={handlePasswordUpdate}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={content.new_password || "New Password"}
                className="custom-form-control mt-2"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={content.confirm_password || "Confirm Password"}
                className="custom-form-control mt-2"
                required
              />
              <button type="submit" className="btn btn-success w-100 mt-3">{content.update_password || "Update Password"}</button>
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Reset;