import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaThList, FaUsers, FaUser, FaUserShield, FaTools } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import Translation from "../translations/superadmin.json";
import "./style/dashboard.css";

function SAdminDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
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

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleDropdown = (menu) => setOpenDropdown(openDropdown === menu ? null : menu);

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
        <FaBars />
      </button>

      <div className={`admin-custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <div className="d-flex align-items-center mb-3">
          <h2 className="text-center admin-custom-css flex-grow-1 mt-2 ms-4">{content?.admin_dashboard_title || "SAdmin Dashboard"}</h2>
        </div>

        <Link to="/superadmin/dashboard" className="admin-custom-link">
          <FaChartLine className="me-2" /> {content?.dashboard || "Dashboard"}
        </Link>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("user_management")}>
            <FaUsers className="me-2" /> {content?.user_management || "User Management"}
          </div>
          {openDropdown === "user_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/list-users" className="dropdown-item-admin">{content?.list_users || "List Users"}</Link></li>
              <li><Link to="/superadmin/user-messages" className="dropdown-item-admin">{content?.user_messages || "User Messages"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("vendor_management")}>
            <FaStore className="me-2" /> {content?.vendor_management || "Vendor Management"}
          </div>
          {openDropdown === "vendor_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/new-vendors" className="dropdown-item-admin">{content?.new_vendors || "New Vendors"}</Link></li>
              <li><Link to="/superadmin/list-vendors" className="dropdown-item-admin">{content?.list_of_vendors || "List of Vendors"}</Link></li>
              <li><Link to="/superadmin/manage-products" className="dropdown-item-admin">{content?.manage_products || "Manage Products"}</Link></li>
              <li><Link to="/superadmin/manage-orders" className="dropdown-item-admin">{content?.manage_orders || "Manage Orders"}</Link></li>
              <li><Link to="/superadmin/approve-payout" className="dropdown-item-admin">{content?.approve_payout || "Approve Payout"}</Link></li>
              <li><Link to="/superadmin/vendor-messages" className="dropdown-item-admin">{content?.vendor_messages || "Vendor Messages"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("admin_management")}>
            <FaUserShield className="me-2" /> {content?.admin_management || "Admin Management"}
          </div>
          {openDropdown === "admin_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/list-admins" className="dropdown-item-admin">{content?.list_of_admins || "List of Admins"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("catalog_management")}>
            <FaThList className="me-2" /> {content?.catalog_management || "Catalog Management"}
          </div>
          {openDropdown === "catalog_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/add-category" className="dropdown-item-admin">{content?.add_categories || "Add Categories"}</Link></li>
              <li><Link to="/superadmin/add-subcategory" className="dropdown-item-admin">{content?.sub_categories || "Sub Categories"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("platform_management")}>
            <FaTools className="me-2" /> {content?.platform_management || "Platform Management"}
          </div>
          {openDropdown === "platform_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/add-banner" className="dropdown-item-admin">{content?.list_banner || "List Banner"}</Link></li>
              <li><Link to="/superadmin/add-payment" className="dropdown-item-admin">{content?.payment_method || "Payment Method"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("profile")}>
            <FaUser className="me-2" /> {content?.profile || "Profile"}
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/manage-profile" className="dropdown-item-admin">{content?.manage_profile || "Manage Profile"}</Link></li>
              <li><a onClick={logout} className="dropdown-item-admin">{content?.logout || "Logout"}</a></li>
            </ul>
          )}
        </div>
      </div>

      <div className={`admin-main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="admin-custom-header text-center">
          <h1 className="h4 mb-0">{content?.welcome_message || "Welcome to Super Admin Dashboard"}</h1>
        </div>

        {/* Main content starts here */}
      </div>
      
      <ToastContainer />
    </div>
  );
}

export default SAdminDashboard;