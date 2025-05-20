import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Translation from "../translations/vendor.json";
import "./style/register.css";

const RegisterVendor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [otp, setOtp] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passConfirmError, setPassConfirmError] = useState("");
  const [otpSent, setOtpSent] = useState(false); // to toggle OTP popup
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60); // 1
  // ... your existing fontSize, fontColor, language, content, useEffect for styles, password requirements, etc.

    const defaultFontSize = 'medium';
    const defaultFontColor = '#000000';
    const defaultLanguage = 'english';

    const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || defaultFontSize);
    const [fontColor, setFontColor] = useState(() => localStorage.getItem('fontColor') || defaultFontColor);
    const [language, setLanguage] = useState(() => localStorage.getItem('language') || defaultLanguage);
    const [content, setContent] = useState(Translation[language]);


    useEffect(() => {
    let interval;

    if (otpSent) {
      setTimer(60); // reset timer each time OTP is sent

      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setOtpSent(false); // close popup when timer ends
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [otpSent]);


    useEffect(() => {
        document.documentElement.style.setProperty('--font-size', fontSize);
        document.documentElement.style.setProperty('--font-color', fontColor);

        localStorage.setItem('fontSize', fontSize);
        localStorage.setItem('fontColor', fontColor);
        localStorage.setItem('language', language);

        setContent(Translation[language]);
    }, [fontSize, fontColor, language]);


    const [passReqMet, setPassReqMet] = useState({
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
    });

    useEffect(() => {
        const userInfo = localStorage.getItem('user-info');
        if (userInfo) {
            const user = JSON.parse(userInfo);
            if (user.admin_role_id === "SuperAdmin") {
                navigate("/superadmin/");
            } else if (user.vendor_role_id === "Vendor") {
                navigate("/vendor/")
            } else if (user.admin_role_id === "Admin") {
                navigate("/admin/");
            } else {
                navigate("/");
            }
        }
    }, []);

    const validateEmail = (email) => {
        const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com", "@icloud.com"];
        if (!email.trim()) {
            return content?.email_required || "Email is required";
        }
        const isValidDomain = allowedDomains.some(domain => email.endsWith(domain));
        if (!isValidDomain) {
            return content?.valid_email_domains || "Please use a valid @gmail.com, @hotmail.com, @outlook.com, @yahoo.com, or @icloud.com email address.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return content?.invalid_email_format || "Invalid email format";
        }
        return "";
    };

    const checkPasswordRequirements = (password) => {
        setPassReqMet({
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /\d/.test(password),
            special: /[!@#$%^&*]/.test(password),
        });

        if (!password.trim()) {
            return content?.password_required || "Password is required";
        } else if (password.length < 8) {
            return content?.password_min_length || "Password must be at least 8 characters long";
        } else if (!/[a-z]/.test(password)) {
            return content?.password_lowercase || "Password must contain at least one lowercase letter";
        } else if (!/[A-Z]/.test(password)) {
            return content?.password_uppercase || "Password must contain at least one uppercase letter";
        } else if (!/\d/.test(password)) {
            return content?.password_number || "Password must contain at least one number";
        } else if (!/[!@#$%^&*]/.test(password)) {
            return content?.password_special || "Password must contain at least one special character";
        }
        return "";
    };
  // validation functions (validateEmail, checkPasswordRequirements) - same as before

  // Function to send OTP
  const sendOtp = async () => {
    try {
        console.warn("Sending OTP to:", email); // Debugging line
      const response = await fetch("http://localhost:8000/api/vendor/sendotp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const result = await response.json();
      if (result.status === true) {
        setOtpSent(true); // show OTP input popup
        toast.success("OTP sent to your email", { autoClose: 2000 });
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP");
    }
  };

  // Modified handleSubmit to handle two phases
  const handleSubmit = async (e) => {
    e.preventDefault();

    // If OTP not sent yet, validate fields and send OTP
    if (!otpSent) {
      let isValid = true;

      const emailErrorMessage = validateEmail(email);
      if (emailErrorMessage) {
        setEmailError(emailErrorMessage);
        isValid = false;
      } else {
        setEmailError("");
      }

      const passwordErrorMessage = checkPasswordRequirements(password);
      if (passwordErrorMessage) {
        setPasswordError(passwordErrorMessage);
        isValid = false;
      } else {
        setPasswordError("");
      }

      if (!passConfirm.trim()) {
        setPassConfirmError("Password confirmation is required");
        isValid = false;
      } else if (password !== passConfirm) {
        setPassConfirmError("Passwords do not match");
        isValid = false;
      } else {
        setPassConfirmError("");
      }

      if (!isValid) {
        toast.error("Please correct the highlighted fields.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Send OTP request here
      await sendOtp();

      return; // wait for OTP input
    }

    // OTP sent and user submitting OTP and registration data
    if (!otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    // Now send full registration including OTP
    const registrationData = {
      email,
      password,
      password_confirmation: passConfirm,
      otp,
    };

    try {
        console.warn("Registering vendor with data:", registrationData); // Debugging line
      const response = await fetch("http://localhost:8000/api/vendor/register", {
        method: "POST",
        body: JSON.stringify(registrationData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Registration Successful!", { autoClose: 2000 });
        setTimeout(() => {
          navigate("/vendor/login");
        }, 2000);
      } else {
        if (result.message && result.message.toLowerCase().includes("otp")) {
          toast.error("OTP is incorrect");
        } else {
          toast.error(result.message || "Registration failed");
        }
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="vendor-signup-wrapper">
      <div className="vendor-signup-container">
        <h2 className="text-center mb-4 vendor-signup-header">
          {otpSent ? "Enter OTP" : content?.vendor_sign_up || "Vendor Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="vendor-signup-form">
          {/* Email input, always enabled */}
          <div className="form-group mb-3 vendor-form-group">
            <label htmlFor="email" className="form-label vendor-form-label">
              <FaEnvelope className="me-2" /> {content?.email || "Email"}
            </label>
            <input
              type="email"
              id="email"
              className={`form-control vendor-form-control ${emailError ? "is-invalid" : ""}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content?.enter_your_email || "Enter your email"}
              disabled={otpSent} // disable email editing after OTP sent
            />
            {emailError && <div className="text-danger invalid-feedback">{emailError}</div>}
          </div>

          {!otpSent && (
            <>
              {/* Password inputs only show before OTP */}
              <div className="form-group mb-3 vendor-form-group">
                <label htmlFor="password" className="form-label vendor-form-label">
                  <FaLock className="me-2" /> {content?.password || "Password"}
                </label>
                <input
                  type="password"
                  id="password"
                  className={`form-control vendor-form-control ${passwordError ? "is-invalid" : ""}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    checkPasswordRequirements(e.target.value);
                  }}
                  placeholder={content?.enter_your_password || "Enter your password"}
                />
                {passwordError && <div className="text-danger invalid-feedback">{passwordError}</div>}

                <ul className="password-requirements">
                  <li className={passReqMet.length ? "met" : ""}>
                    <FaCheckCircle className="me-2" /> {content?.at_least_8_characters || "At least 8 characters"}
                  </li>
                  <li className={passReqMet.lowercase ? "met" : ""}>
                    <FaCheckCircle className="me-2" /> {content?.one_lowercase_letter || "One lowercase letter"}
                  </li>
                  <li className={passReqMet.uppercase ? "met" : ""}>
                    <FaCheckCircle className="me-2" /> {content?.one_uppercase_letter || "One uppercase letter"}
                  </li>
                  <li className={passReqMet.number ? "met" : ""}>
                    <FaCheckCircle className="me-2" /> {content?.one_number || "One number"}
                  </li>
                  <li className={passReqMet.special ? "met" : ""}>
                    <FaCheckCircle className="me-2" /> {content?.one_special_character || "One special character (!@#$%^&*)"}
                  </li>
                </ul>
              </div>

              <div className="form-group mb-3 vendor-form-group">
                <label htmlFor="passConfirm" className="form-label vendor-form-label">
                  <FaCheckCircle className="me-2" /> {content?.confirm_password || "Confirm Password"}
                </label>
                <input
                  type="password"
                  id="passConfirm"
                  className={`form-control vendor-form-control ${passConfirmError ? "is-invalid" : ""}`}
                  value={passConfirm}
                  onChange={(e) => setPassConfirm(e.target.value)}
                  placeholder={content?.confirm_your_password || "Confirm your password"}
                />
                {passConfirmError && <div className="text-danger invalid-feedback">{passConfirmError}</div>}
              </div>
            </>
          )}

         {otpSent && (
            <div className="form-group mb-3 vendor-form-group">
              <label htmlFor="otp" className="form-label vendor-form-label">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                className="form-control vendor-form-control"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <div className="otp-timer vendor-form-text mt-2 text-center w-100">
  OTP expires in: {timer} second{timer !== 1 ? "s" : ""}
</div>

            </div>
            
          )}

          <button type="submit" className="btn btn-success vendor-btn-submit w-100">
            {otpSent ? "Verify & Sign Up" : content?.sign_up || "Sign Up"}
          </button>
        </form>

        {!otpSent && (
          <div className="text-center mt-3">
            <p style={{ color: "var(--font-color)" }}>
              {content?.already_have_account || "Already have an account?"}{" "}
              <a href="/vendor/login" className="vendor-login-link" style={{ color: "var(--font-color)" }}>
                {content?.login_here || "Login here"}
              </a>
            </p>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default RegisterVendor;
