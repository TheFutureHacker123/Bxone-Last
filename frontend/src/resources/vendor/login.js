import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style/login.css";

const LoginVendro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem("user-info");
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.admin_role_id === "superadmin") {
        navigate("/superadmin/");
      } else if (user.vendor_role_id === "vendor") {
        navigate("/vendor/");
      } else if (user.admin_role_id === "admin") {
        navigate("/admin/");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const login = async (e) => {
    e.preventDefault();

    if (!email || !password) {
  
      toast.error("Please enter both email and password.", {
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
      let response = await fetch("http://localhost:8000/api/vendorlogin", {
        method: "POST",
        body: JSON.stringify(items),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      let result = await response.json();
      if (result.success) {
        toast.success("Login Successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        localStorage.setItem("user-info", JSON.stringify(result.storeData));

        setTimeout(() => {
          if(result.status === "Pending"){
            navigate("/underreview/");
          }else if(result.status === "Verified"){
            navigate("/vendor/");
          }else if(result.status === "Rejected"){
            navigate("/vendor-info/");
          }else if(result.status === "Suspended"){
            navigate("/suspend/");
          }    
        }, 1000);
      } else {
        toast.error("Login Failed. Please check your credentials.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="vendor-login-wrapper">
      <div className="vendor-login-container">
        <h2 className="text-center mb-4 vendor-login-header">Vendor Login</h2>

        <form onSubmit={login} className="vendor-login-form">
          <div className="form-group mb-3 vendor-form-group">
            <label htmlFor="email" className="form-label vendor-form-label">
              <FaUser className="me-2" /> Email
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
            <label
              htmlFor="password"
              className="form-label vendor-form-label"
            >
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

          <button
            type="submit"
            className="btn btn-success vendor-btn-submit w-100"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-3">
          <a href="/vendor/reset" className="text-muted vendor-forgot-link">
            Forgot Password?
          </a>
          <p className="text-muted">
            Don't have an account?{" "}
            <a href="/vendor/register" className="vendor-login-link">
              Register here
            </a>
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginVendro;
