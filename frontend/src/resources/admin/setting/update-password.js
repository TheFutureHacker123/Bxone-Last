import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaUsers, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../../translations/admin.json";
import 'react-toastify/dist/ReactToastify.css';
import "../style/update-password.css";

function UpdatePassword() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
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
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    } else {
      setOtpExpired(true);
    }
    return () => clearInterval(timer);
  }, [otpTimer]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const getcode = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Email can't be blank");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/admin/getcode", {
        method: 'POST',
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });

      const result = await response.json();
      if (result.message === 'OTP sent successfully') {
        toast.success("Check your email for the code!");
        setOtpTimer(60);
        setOtpExpired(false);
        setOtpRequested(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  const reset = async (e) => {
    e.preventDefault();
    if (!email || !otpcode) {
      toast.error("Email and OTP can't be blank");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/admin/reset", {
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
  };

  const handlePasswordUpdate = async (e) => {
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
      const response = await fetch("http://localhost:8000/api/admin/updatepassword", {
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
        localStorage.clear();
        setTimeout(() => navigate("/admin/login"), 1500);
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      toast.error("An error occurred while updating password");
    }
  };

  const logout = () => {
    localStorage.clear();
    toast.success(content?.logout || "Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate("/admin/login");
    }, 1000);
  };

  return (
    <div className="admin-dashboard-wrapper">
      <button className="admin-hamburger-btn" onClick={toggleSidebar}>
        <FaBars style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
      </button>

      <div className={`admin-custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
              <div className="d-flex align-items-center mb-3">
                <span className="text-center admin-custom-css flex-grow-1 mt-2 ms-4" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.admin_dashboard_title || "Admin Dashboard"}
                </span>
              </div>
      
              <Link to="/admin/" className="admin-custom-link">
                <FaChartLine className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.dashboard || "Dashboard"}
                </span>
              </Link>
      
              {/* User Management Dropdown */}
              <div className="dropdown">
                <div className="admin-custom-link" onClick={() => handleDropdown("products")}>
                  <FaUsers className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.user_management || "User Management"}
                  </span>
                </div>
                {openDropdown === "products" && (
                  <ul className="dropdown-menu admin-custom-dropdown-menu">
                    <li>
                      <Link to="/admin/list-users" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.list_users || "List Users"}
                      </Link>
                    </li>
                    {/* <li>
                      <Link to="/admin/user-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.user_messages || "User Messages"}
                      </Link>
                    </li> */}
                  </ul>
                )}
              </div>
      
              {/* Vendor Management Dropdown */}
              <div className="dropdown">
                <div className="admin-custom-link" onClick={() => handleDropdown("orders")}>
                  <FaStore className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.vendor_management || "Vendor Management"}
                  </span>
                </div>
                {openDropdown === "orders" && (
                  <ul className="dropdown-menu admin-custom-dropdown-menu">
                    <li>
                      <Link to="/admin/new-vendors" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.new_vendors || "New Vendors"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/list-vendors" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.list_of_vendors || "List of Vendors"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/manage-products" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.manage_products || "Manage Products"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/manage-orders" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.manage_orders || "Manage Orders"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/approve-payout" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.approve_payout || "Approve Payout"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/admin/vendor-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.vendor_messages || "Vendor Messages"}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
      
              {/* Profile Dropdown */}
              <div className="dropdown">
                <div className="admin-custom-link" onClick={() => handleDropdown("profile")}>
                  <FaUser className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.profile || "Profile"}
                  </span>
                </div>
                {openDropdown === "profile" && (
                  <ul className="dropdown-menu admin-custom-dropdown-menu">
                    <li>
                      <li><Link to="/admin/settings" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.settings || "Settings"}</Link></li>
                      <Link to="/admin/manage-password" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.update_password || "Update Password"}
                      </Link>
                    </li>
                    <li>
                      <a onClick={logout} className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.logout || "Logout"}
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>

      <div className={`admin-main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="admin-custom-header text-center">
          <h1 className="h4 mb-0">{content?.update_password || "Update Password"}</h1>
        </div>

        <div className="outer-container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div className="update-password-container" style={{ width: '1000px' }}>
            <h2>{content?.update_password || "Update Password"}</h2>

            <form onSubmit={reset}>
              <div className="form-group">
                <label>{content?.email || "Email"}</label>
                <input
                  type="email"
                  placeholder={content?.email || "Enter your email"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

             <div className="form-group" style={{ position: 'relative' }}>
  <label style={{ marginRight: '10px' }}>{content?.otp_code || "OTP Code"}</label>
  <input
    type="text"
    placeholder={content?.otp_code || "Enter OTP"}
    value={otpcode}
    onChange={(e) => setOtpCode(e.target.value)}
    required
    style={{ width: '100%', paddingRight: '80px' }} // Adjust input width
  />
  <button
    onClick={getcode}
    disabled={!otpExpired}
    style={{
      position: 'absolute',
      right: '0px', // Position the button slightly from the right edge
      top: '50%',
      transform: 'translateY(-18%)',
      width: '30%', // Button width
      padding: '10px 0', // Adjust padding
      zIndex: 1, // Ensure button is above the input
    }}
  >
    Get Code
  </button>
</div>

              {!otpExpired && <span>{otpTimer}s</span>}
              {otpRequested && otpExpired && <span className="text-danger">OTP expired. Please resend.</span>}

              <button type="submit">{content?.reset_password || "Reset Password"}</button>
            </form>

            {showPasswordModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h4>Set New Password</h4>
                  <form onSubmit={handlePasswordUpdate}>
                    <div className="form-group">
                      <label>{content?.new_password || "New Password"}</label>
                      <input
                        type="password"
                        placeholder={content?.new_password || "Enter new password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>{content?.confirm_new_password || "Confirm New Password"}</label>
                      <input
                        type="password"
                        placeholder={content?.confirm_new_password || "Confirm new password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit">{content?.update_password || "Update Password"}</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UpdatePassword;