import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Translation from "../translations/vendor.json";
import "react-toastify/dist/ReactToastify.css";
import "./style/login.css";

const LoginVendor = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

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
        const vendorInfo = localStorage.getItem("vendor-info");
        const userInfo = localStorage.getItem("user-info");
        const adminInfo = localStorage.getItem("admin-info");
        
        if (vendorInfo) {
            const vendor = JSON.parse(vendorInfo);
            if (vendor.status === "Pending") {
                navigate("/vendor/underreview/");
            } else if (vendor.status === "Rejected") {
                if (!vendor.has_completed_info) {
                    navigate("/vendor/vendor-info/");
                } else {
                    navigate("/vendor/");
                }
            } else if (vendor.status === "UnVerified") {
                if (!vendor.has_completed_info) {
                    navigate("/vendor/vendor-info/");
                } else {
                    navigate("/vendor/");
                }
            } else if (vendor.status === "Suspended") {
                navigate("/vendor/suspend/");
            } else {
                navigate("/vendor/");
            }
        }

        if (userInfo) {
            navigate("/");
        }
        if (adminInfo) {
            navigate("/admin/");
        }
    }, [navigate]);

    const validateEmail = (email) => {
        const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com", "@icloud.com"];
        if (!email.trim()) {
            return content?.email_required || "Email is required";
        }
        const isValidDomain = allowedDomains.some(domain => email.endsWith(domain));
        if (!isValidDomain) {
            return content?.valid_email || "Please use a valid email address.";
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return content?.invalid_email || "Invalid email format";
        }
        return ""; // No error
    };

    const login = async (e) => {
        e.preventDefault();
        let isValid = true;

        const emailErrorMessage = validateEmail(email);
        if (emailErrorMessage) {
            setEmailError(emailErrorMessage);
            isValid = false;
        } else {
            setEmailError("");
        }

        if (!password.trim()) {
            setPasswordError(content?.password_required || "Password is required");
            isValid = false;
        } else {
            setPasswordError("");
        }

        if (!isValid) {
            toast.error(content?.correct_fields || "Please correct the highlighted fields.", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
            return;
        }

        const items = { email, password };
        try {
            let response = await fetch("http://localhost:8000/api/vendor/login", {
                method: "POST",
                body: JSON.stringify(items),
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });

            let result = await response.json();
            if (result.success) {
                toast.success(content?.login_success || "Login Successful!", {
                    position: "top-right",
                    autoClose: 3000,
                });
                localStorage.clear();
                localStorage.setItem("vendor-info", JSON.stringify(result.storeData));

                setTimeout(() => {
                    if (result.storeData.status === "Pending") {
                        navigate("/vendor/underreview/");
                    } else if (result.storeData.status === "Verified") {
                        navigate("/vendor/");
                    } else if (result.storeData.status === "Rejected") {
                        if (!result.storeData.has_completed_info) {
                            navigate("/vendor/vendor-info/");
                        } else {
                            navigate("/vendor/");
                        }
                    } else if (result.storeData.status === "Suspended") {
                        navigate("/vendor/suspend/");
                    } else if (result.storeData.status === "UnVerified") {
                        if (!result.storeData.has_completed_info) {
                            navigate("/vendor/vendor-info/");
                        } else {
                            navigate("/vendor/");
                        }
                    }
                }, 1000);
            } else {
                toast.error(result.message || content?.login_failed || "Login Failed. Please check your credentials.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        } catch (err) {
            toast.error(content?.error_occurred || "An error occurred. Please try again later.");
        }
    };

    return (
        <div className="vendor-login-wrapper">
            <div className="vendor-login-container">
                <h2 className="text-center mb-4 vendor-login-header">{content?.vendor_login || "Vendor Login"}</h2>

                <form onSubmit={login} className="vendor-login-form">
                    <div className="form-group mb-3 vendor-form-group">
                        <label htmlFor="email" className="form-label vendor-form-label">
                            <FaUser className="me-2" /> {content?.email || "Email"}
                        </label>
                        <input
                            type="email"
                            id="email"
                            className={`form-control vendor-form-control ${emailError ? 'is-invalid' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder={content?.enter_email || "Enter your email"}
                        />
                        {emailError && <div className="invalid-feedback">{emailError}</div>}
                    </div>

                    <div className="form-group mb-3 vendor-form-group">
                        <label htmlFor="password" className="form-label vendor-form-label">
                            <FaLock className="me-2" /> {content?.password || "Password"}
                        </label>
                        <input
                            type="password"
                            id="password"
                            className={`form-control vendor-form-control ${passwordError ? 'is-invalid' : ''}`}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder={content?.enter_password || "Enter your password"}
                        />
                        {passwordError && <div className="invalid-feedback">{passwordError}</div>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success vendor-btn-submit w-100"
                    >
                        {content?.login || "Login"}
                    </button>
                </form>

                <div className="text-center mt-3">
                    <a href="/vendor/reset" className="vendor-forgot-link">
                        {content?.forgot_password || "Forgot Password?"}
                    </a>
                    <p>
                        {content?.no_account || "Don't have an account? "} 
                        <a href="/vendor/register" className="vendor-login-link">
                            {content?.register_here || "Register here"}
                        </a>
                    </p>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default LoginVendor;