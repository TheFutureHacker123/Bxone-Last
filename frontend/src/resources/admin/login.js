import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import Translation from "../translations/admin.json";
import "./style/login.css";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      setError(content?.error_fill_fields || "Please fill in all fields.");
    } else {
      const payload = { email, password };
      try {
        let response = await fetch("http://localhost:8000/api/admin/login", {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json',
          },
        });

        let result = await response.json();

        if (result.success) {
          toast.success(content?.login_success || "Login successful!", {
            position: "top-right",
            autoClose: 3000,
          });
          localStorage.setItem("admin-info", JSON.stringify(result.admin));

          setTimeout(() => {
            if (result.admin.admin_role_id === "SuperAdmin") {
              navigate("/superadmin/");
            } else {
              navigate("/admin/");
            }
          }, 1000);
        } else {
          toast.error(content?.login_failed || "Login failed. Please try again.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error(content?.error_occurred || 'An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{content?.login_title || "Login"}</h2>
        {error && <div className="alert-superadmin">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{content?.email_label || "Email address"}</label>
            <input
              className="form-control-superadmin"
              type="email"
              placeholder={content?.email_placeholder || "Enter email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>{content?.password_label || "Password"}</label>
            <input
              className="form-control-superadmin"
              type="password"
              placeholder={content?.password_placeholder || "Password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn-superadmin" type="submit">
            {content?.login_button || "Login"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default LoginAdmin;