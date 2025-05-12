import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../translations/lang.json";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import './styles/login.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        const userInfo = localStorage.getItem('user-info');
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
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const login = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch("http://localhost:8000/api/login", {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });

            const result = await response.json();

            if (!response.ok) {
                if (result.errors) {
                    const backendErrors = {};
                    Object.keys(result.errors).forEach(key => {
                        backendErrors[key] = result.errors[key][0];
                    });
                    setErrors(backendErrors);
                    return;
                }
                throw new Error(result.message || "Login failed");
            }

            if (result.success) {
                toast.success(content?.login_successful || "Login Successful!", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
              //  localStorage.clear();
                localStorage.setItem("user-info", JSON.stringify(result.storeData));
                setTimeout(() => {
                    navigate("/");
                }, 1000);
            } else {
                toast.error(result.message || content?.login_failed_credentials || "Login Failed. Please check your credentials.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            toast.error(error.message || content?.login_error || 'An error occurred. Please try again later.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const goBack = () => {
        navigate('/'); // Navigate directly to the homepage
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <div className="back-button">
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        onClick={goBack}
                        style={{ cursor: 'pointer', fontSize: '1em', marginBottom: '10px' }}
                    />
                </div>
                <h2 className="text-center">{content?.login || "Login"}</h2>
                <form onSubmit={login}>
                    <div className="mb-3">
                        <label htmlFor="email" className="custom-form-label text-start d-block">{content?.email_address || "Email address"}</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`custom-form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            placeholder={content?.enter_your_email || "Enter your email"}
                        />
                        {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="custom-form-label text-start d-block">{content?.password || "Password"}</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`custom-form-control ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            placeholder={content?.enter_your_password || "Enter your password"}
                        />
                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-warning w-100"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (content?.logging_in || 'Logging in...') : (content?.login || 'Login')}
                    </button>
                </form>
                <p className="text-center mt-3">
                    <a href="/reset" className="forgot-password">{content?.forgot_password || "Forgot Password?"}</a>
                </p>
                <p className="text-center mt-2">
                    {content?.no_account || "Don't have an account?"} <a href="/signup">{content?.register || "Register"}</a>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;