import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Translation from "../translations/lang.json";
import "react-toastify/dist/ReactToastify.css";
import "./styles/register.css"; // Corrected relative path

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [passReqMet, setPassReqMet] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const defaultFontSize = "medium";
  const defaultFontColor = "#000000";
  const defaultLanguage = "english";

  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem("fontSize") || defaultFontSize
  );
  const [fontColor, setFontColor] = useState(
    () => localStorage.getItem("fontColor") || defaultFontColor
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || defaultLanguage
  );
  const [content, setContent] = useState(Translation[language]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", fontSize);
    document.documentElement.style.setProperty("--font-color", fontColor);

    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontColor", fontColor);
    localStorage.setItem("language", language);

    setContent(Translation[language]);
  }, [fontSize, fontColor, language]);

  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.admin_role_id === "SuperAdmin") {
        navigate("/superadmin/");
      } else if (user.vendor_role_id === "Vendor") {
        navigate("/vendor/");
      } else if (user.admin_role_id === "Admin") {
        navigate("/admin/");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }

    if (name === "password") {
      checkPasswordRequirements(value);
    }
  };

  const checkPasswordRequirements = (password) => {
    setPassReqMet({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*]/.test(password),
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const allowedDomains = [
      "@gmail.com",
      "@hotmail.com",
      "@outlook.com",
      "@yahoo.com",
      "@icloud.com",
    ];

    if (!formData.name.trim()) {
      newErrors.name = content?.name_required || "Name is required";
    } else if (formData.name.length < 2) {
      newErrors.name =
        content?.name_length || "Name must be at least 2 characters";
    } else if (!/^[A-Za-z\s-]+$/.test(formData.name)) {
      newErrors.name =
        content?.name_format || "Name can only contain letters and spaces";
    }

    if (!formData.email.trim()) {
      newErrors.email = content?.email_required || "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = content?.invalid_email_format || "Invalid email format";
    } else {
      const isValidDomain = allowedDomains.some((domain) =>
        formData.email.endsWith(domain)
      );
      if (!isValidDomain) {
        newErrors.email =
          content?.valid_email_domain ||
          "Please use a valid @gmail.com, @hotmail.com, @outlook.com, @yahoo.com, or @icloud.com email address.";
      }
    }

    if (!formData.password) {
      newErrors.password = content?.password_required || "Password is required";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(formData.password)
    ) {
      newErrors.password =
        content?.password_strength ||
        "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation =
        content?.password_confirmation_required ||
        "Please confirm your password";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation =
        content?.passwords_do_not_match || "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const signUp = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle Laravel validation errors
        if (result.errors) {
          const backendErrors = {};
          Object.keys(result.errors).forEach((key) => {
            backendErrors[key] = result.errors[key][0];
          });
          setErrors(backendErrors);
          return;
        }

        throw new Error(result.message || "Registration failed");
      }

      if (result.success) {
        toast.success("Registration Successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.error(
          result.message || "Failed to create account. Please try again.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      }
    } catch (error) {
      toast.error(
        error.message || "An error occurred. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2 className="text-center">{content?.sign_up || "Sign Up"}</h2>
        <form onSubmit={signUp}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label text-start d-block">
              {content?.enter_your_name || "Name"}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`custom-input ${errors.name ? "is-invalid" : ""}`}
              id="name"
              placeholder={content?.enter_your_name || "Enter your name"}
            />
            {errors.name && (
              <div className="text-danger invalid-feedback d-block">{errors.name}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label text-start d-block">
              {content?.email_address || "Email address"}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`custom-input ${errors.email ? "is-invalid" : ""}`}
              id="email"
              placeholder={content?.enter_your_email || "Enter your email"}
            />
            {errors.email && (
              <div className="text-danger invalid-feedback d-block">{errors.email}</div>
            )}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-start d-block">
              {content?.password || "Password"}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`custom-input ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder={
                content?.enter_your_password || "Enter your password"
              }
            />
            {errors.password && (
              <div className="text-danger invalid-feedback d-block">{errors.password}</div>
            )}
            <ul className="password-requirements">
              <li className={passReqMet.length ? "met" : ""}>
                <FaCheckCircle className="me-2" />{" "}
                {content?.password_requirements_length ||
                  "At least 8 characters"}
              </li>
              <li className={passReqMet.lowercase ? "met" : ""}>
                <FaCheckCircle className="me-2" />{" "}
                {content?.password_requirements_lowercase ||
                  "One lowercase letter"}
              </li>
              <li className={passReqMet.uppercase ? "met" : ""}>
                <FaCheckCircle className="me-2" />{" "}
                {content?.password_requirements_uppercase ||
                  "One uppercase letter"}
              </li>
              <li className={passReqMet.number ? "met" : ""}>
                <FaCheckCircle className="me-2" />{" "}
                {content?.password_requirements_number || "One number"}
              </li>
              <li className={passReqMet.special ? "met" : ""}>
                <FaCheckCircle className="me-2" />{" "}
                {content?.password_requirements_special ||
                  "One special character"}
              </li>
            </ul>
          </div>
          <div className="mb-3">
            <label
              htmlFor="password_confirmation"
              className="form-label text-start d-block"
            >
              {content?.confirm_password || "Confirm Password"}
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              className={`custom-input ${
                errors.password_confirmation ? "is-invalid" : ""
              }`}
              id="password_confirmation"
              placeholder={
                content?.confirm_your_password || "Confirm your password"
              }
            />
            {errors.password_confirmation && (
              <div className="text-danger invalid-feedback d-block">
                {errors.password_confirmation}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-warning w-100"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? content?.registering || "Registering..."
              : content?.sign_up || "Sign Up"}
          </button>
        </form>
        <p className="text-center mt-3">
          {content?.already_have_account || "Already have an account?"}{" "}
          <a href="/login">{content?.login || "Login"}</a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Register;
