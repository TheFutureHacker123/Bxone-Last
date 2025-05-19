import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './styles/reset.css';

function Reset() {
  const [email, setEmail] = useState("");
  const [otpcode, setOtpCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0); // Countdown timer
  const [otpExpired, setOtpExpired] = useState(true); // Initially OTP is expired
  const [otpRequested, setOtpRequested] = useState(false); // Track if OTP has been requested
  const navigate = useNavigate();

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
      toast.error("Email and OTP can't be blank");
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
        toast.success("OTP Verified. Please set a new password.");
        setShowPasswordModal(true);
      } else {
        toast.error("Invalid Email or OTP!");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  }

  async function handlePasswordUpdate(e) {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error("Password fields can't be empty");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
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
        toast.success("Password updated successfully");
        setShowPasswordModal(false);
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred while updating password");
    }
  }

  async function getcode(e) {
    e.preventDefault();
    if (!email) {
      toast.error("Email can't be blank");
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
        toast.success("Check your email for the code!");
        setOtpTimer(60); // Start countdown timer
        setOtpExpired(false); // Set OTP as valid
        setOtpRequested(true); // Mark OTP as requested
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 className="text-center">Reset Password</h2>
        <form onSubmit={reset}>
          <div className="mb-3">
            <label htmlFor="email" className="custom-form-label text-start d-block">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="custom-form-control"
              id="email"
              placeholder="Enter your email"
              required
            />
            <div className="input-group mt-3">
              <input
                type="text"
                value={otpcode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="custom-form-control"
                placeholder="Enter OTP"
                required
              />
              <button onClick={getcode} className="btn btn-warning" disabled={!otpExpired}>Get Code</button>
             
            </div>
            {!otpExpired && (
  <div className="timer-container">
    <span className="timer">{otpTimer}s</span>
  </div>
)}
            {otpRequested && otpExpired && <span className="text-danger mt-2">OTP expired. Please resend.</span>}
          </div>

          <button type="submit" className="btn btn-warning w-100">Reset Password</button>
        </form>
        <p className="text-center mt-3">
          <a href="/login" className="forgot-password">Back to Login</a>
        </p>
      </div>

      {showPasswordModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Set New Password</h4>
            <form onSubmit={handlePasswordUpdate}>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                className="custom-form-control mt-2"
                required
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="custom-form-control mt-2"
                required
              />
              <button type="submit" className="btn btn-success w-100 mt-3">Update Password</button>
              {/* <button type="button" onClick={getcode} className="btn btn-warning w-100 mt-2" disabled={otpExpired}>Resend OTP</button>
              {!otpExpired && <span className="mt-2">OTP valid for: {otpTimer}s</span>} */}
            </form>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

export default Reset;