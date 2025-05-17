import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser, } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Translation from "../../translations/vendor.json";
import "react-toastify/dist/ReactToastify.css";
import "../style/manage-profile.css";

function ManageProfile() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const defaultFontSize = 'medium';
  const defaultFontColor = '#000000';
  const defaultLanguage = 'english'; // Default language

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

    // Update content based on selected language
    setContent(Translation[language]);
  }, [fontSize, fontColor, language]);


  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      toast.error("New password cannot be the same as the current password.");
      return;
    }

    // Get vendor_id from localStorage
    const userInfo = JSON.parse(localStorage.getItem("vendor-info"));
    const vendor_id = userInfo?.vendor_id;

    if (!vendor_id) {
      toast.error("Vendor ID not found. Please login again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/vendor/updatepassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          vendor_id,
          current_password: currentPassword,
          new_password: newPassword,
          password_confirmation: confirmPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Password updated successfully.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.message || result.error || "Failed to update password.");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again later.");
    }
  };

  function logout() {
      localStorage.clear();
      toast.success(content?.logout_success || "Logout Successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/vendor/login");
      }, 1000);
    }



  return (
    <div className="dashboard-wrapper">
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <FaBars style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
      </button>

      <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
              <div className="d-flex align-items-center ">
                <span className="text-center custom-css flex-grow-1 mt-1 ms-3" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.vendor_dashboard || "Vendor Dashboard"}
                </span>
              </div>
      
              <Link to="/vendor" className="custom-link">
                <FaChartLine className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.analytics || "Analytics"}
                </span>
              </Link>
      
              <div className="dropdown">
                <div className="custom-link" onClick={() => handleDropdown("products")}>
                  <FaBox className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.manage_products || "Manage Products"}
                  </span>
                </div>
                {openDropdown === "products" && (
                  <ul className="dropdown-menu custom-dropdown-menu">
                    <li>
                      <Link to="/vendor/add-products" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.add_products || "Add Products"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/add-coupons" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.add_coupons || "Add Coupons"}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
      
              <div className="dropdown">
                <div className="custom-link" onClick={() => handleDropdown("orders")}>
                  <FaShoppingCart className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.manage_orders || "Manage Orders"}
                  </span>
                </div>
                {openDropdown === "orders" && (
                  <ul className="dropdown-menu custom-dropdown-menu">
                    <li>
                      <Link to="/vendor/new-orders" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.new_order || "New Order"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/shipped" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.shipped || "Shipped"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/refunds" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.refund || "Refund"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/completed" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.completed || "Completed"}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
      
              <div className="dropdown">
                <div className="custom-link" onClick={() => handleDropdown("messages")}>
                  <FaComments className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.manage_messages || "Manage Messages"}
                  </span>
                </div>
                {openDropdown === "messages" && (
                  <ul className="dropdown-menu custom-dropdown-menu">
                    <li>
                      <Link to="/vendor/user-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.user_message || "User Message"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/admin-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.admin_message || "Admin Message"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/review-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.review_message || "Review Message"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/notifications" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.notifications || "Notification"}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
      
              <div className="dropdown">
                <div className="custom-link" onClick={() => handleDropdown("profile")}>
                  <FaUser className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.profile || "Profile"}
                  </span>
                </div>
                {openDropdown === "profile" && (
                  <ul className="dropdown-menu custom-dropdown-menu">
                    <li>
                      <Link to="/vendor/setting" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.settings || "Settings"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/manage-profile" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.update_password || "Updated Password"}
                      </Link>
                    </li>
                    <li>
                      <a onClick={logout} className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.logout || "Logout"}
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>

      {/* Main Content */}
      <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
  <div className="custom-header text-center">
    <h1 className="h4 mb-0">{content?.update_your_password || "Update Your Password"}</h1>
  </div>

  <div className="p-0">
    <h2 className="mb-3">{content?.change_password || "Change Password"}</h2>
    <p>{content?.enter_current_password || "Please enter your current password and choose a new one."}</p>

    <form className="update-password-form mt-4" onSubmit={handleUpdatePassword}>
      <div className="form-group mb-3 text-start">
        <label htmlFor="currentPassword" className="form-label">
          {content?.current_password || "Current Password"}
        </label>
        <input
          type="password"
          id="currentPassword"
          className="form-control"
          placeholder={content?.enter_current_password_placeholder || "Enter current password"}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div className="form-group mb-3 text-start">
        <label htmlFor="newPassword" className="form-label">
          {content?.new_password || "New Password"}
        </label>
        <input
          type="password"
          id="newPassword"
          className="form-control"
          placeholder={content?.enter_new_password_placeholder || "Enter new password"}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <div className="form-group mb-4 text-start">
        <label htmlFor="confirmPassword" className="form-label">
          {content?.confirm_new_password || "Confirm New Password"}
        </label>
        <input
          type="password"
          id="confirmPassword"
          className="form-control"
          placeholder={content?.confirm_new_password_placeholder || "Confirm new password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        {content?.update_password || "Update Password"}
      </button>
    </form>
  </div>
</div>

      <ToastContainer />
    </div>
  );
}

export default ManageProfile;
