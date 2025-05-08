import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './styles/register.css'; // Corrected relative path

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
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

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: null
            }));
        }

        if (name === 'password') {
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
        const allowedDomains = ["@gmail.com", "@hotmail.com", "@outlook.com", "@yahoo.com", "@icloud.com"];

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        } else if (!/^[A-Za-z\s-]+$/.test(formData.name)) {
            newErrors.name = "Name can only contain letters and spaces";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
        } else {
            const isValidDomain = allowedDomains.some(domain => formData.email.endsWith(domain));
            if (!isValidDomain) {
                newErrors.email = "Please use a valid @gmail.com, @hotmail.com, @outlook.com, @yahoo.com, or @icloud.com email address.";
            }
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(formData.password)) {
            newErrors.password = "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = "Please confirm your password";
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Passwords do not match";
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
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
            });

            const result = await response.json();


            if (!response.ok) {
                // Handle Laravel validation errors
                if (result.errors) {
                    const backendErrors = {};
                    Object.keys(result.errors).forEach(key => {
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
                toast.error(result.message || "Failed to create account. Please try again.", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred. Please try again later.', {
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

    return (
        <div className="signup-container">
            <div className="signup-form">
                <h2 className="text-center">Sign Up</h2>
                <form onSubmit={signUp}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label text-start d-block">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`custom-input ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            placeholder="Enter your name"
                        />
                        {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label text-start d-block">Email address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`custom-input ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            placeholder="Enter your email"
                        />
                        {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label text-start d-block">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`custom-input ${errors.password ? 'is-invalid' : ''}`}
                            id="password"
                            placeholder="Enter your password"
                        />
                        {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                        <ul className="password-requirements">
                            <li className={passReqMet.length ? 'met' : ''}>
                                <FaCheckCircle className="me-2" /> At least 8 characters
                            </li>
                            <li className={passReqMet.lowercase ? 'met' : ''}>
                                <FaCheckCircle className="me-2" /> One lowercase letter
                            </li>
                            <li className={passReqMet.uppercase ? 'met' : ''}>
                                <FaCheckCircle className="me-2" /> One uppercase letter
                            </li>
                            <li className={passReqMet.number ? 'met' : ''}>
                                <FaCheckCircle className="me-2" /> One number
                            </li>
                            <li className={passReqMet.special ? 'met' : ''}>
                                <FaCheckCircle className="me-2" /> One special character
                            </li>
                        </ul>
                        
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password_confirmation" className="form-label text-start d-block">Confirm Password</label>
                        <input
                            type="password"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className={`custom-input ${errors.password_confirmation ? 'is-invalid' : ''}`}
                            id="password_confirmation"
                            placeholder="Confirm your password"
                        />
                        {errors.password_confirmation && <div className="invalid-feedback d-block">{errors.password_confirmation}</div>}
                    </div>
                    <button
                        type="submit"
                        className="btn btn-warning w-100"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Registering...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-center mt-3">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Register;