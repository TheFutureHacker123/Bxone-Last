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
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(content?.fill_all_fields || "Please fill in all fields.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(content?.password_mismatch || "New passwords do not match.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem("admin-info"));
    const admin_id = userInfo?.admin_id;

    const payload = {
      admin_id: admin_id,
      current_password: currentPassword,
      new_password: newPassword,
      password_confirmation: confirmPassword,
    };

    try {
      const response = await fetch("http://localhost:8000/api/admin/updatepassword", {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        toast.success(content?.status_updated || "Password updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/admin/");
        }, 1000);
      } else {
        toast.error(result.message || content?.update_failed || "Failed to update password. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }

    } catch {
      toast.error(content?.error_occurred || "An error occurred. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  function logout() {
    localStorage.clear();
    toast.success(content?.logout || "Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate("/admin/login");
    }, 1000);
  }

  return (
    <div className="admin-dashboard-wrapper">
      <button className="admin-hamburger-btn" onClick={toggleSidebar}>
        <FaBars style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
      </button>

      <div className={`admin-custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <div className="d-flex align-items-center mb-3">
          <text className="text-center admin-custom-css flex-grow-1 mt-2 ms-4" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
            {content?.admin_dashboard_title || "Admin Dashboard"}
          </text>
        </div>

        <Link to="/admin/" className="admin-custom-link">
          <FaChartLine className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
          <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
            {content?.dashboard || "Dashboard"}
          </span>
        </Link>

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
              <li>
                <Link to="/admin/user-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.user_messages || "User Messages"}
                </Link>
              </li>
            </ul>
          )}
        </div>

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

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{content?.current_password || "Current Password"}</label>
                <input
                  type="password"
                  placeholder={content?.current_password || "Enter current password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

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
      </div>
      <ToastContainer />
    </div>
  );
}

export default UpdatePassword;