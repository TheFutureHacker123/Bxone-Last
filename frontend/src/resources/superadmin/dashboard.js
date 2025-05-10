import React, { useState,useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaThList, FaUsers, FaUser, FaUserShield, FaTools, FaEdit, FaTrash, } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from "react-router-dom";
import Translation from "../translations/lang.json";
import "./style/dashboard.css";

function SAdminDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditSubcategoryModal, setShowEditSubcategoryModal] = useState(false);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategoryToEdit, setSubcategoryToEdit] = useState(null);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleDropdown = (menu) => setOpenDropdown(openDropdown === menu ? null : menu);
  const navigate = useNavigate();

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
  

  
    function logout() {
      localStorage.clear();
      toast.success("Logout Successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/admin/login");
      }, 1000); // Delay the navigation for 3 seconds
    }
  
  return (
    <div className="admin-dashboard-wrapper">
      <button className="admin-hamburger-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`admin-custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <div className="d-flex align-items-center mb-3">
          <h2 className="text-center admin-custom-css flex-grow-1 mt-2 ms-4">SAdmin Dashboard</h2>
        </div>

        <a href="/superadmin/dashboard" className="admin-custom-link">
          <FaChartLine className="me-2" /> Dashboard
        </a>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("products")}>
            <FaUsers className="me-2" /> User Management
          </div>
          {openDropdown === "products" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/list-users" className="dropdown-item-admin">List Users</a></li>
              <li><a href="/superadmin/user-messages" className="dropdown-item-admin">User Messages</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("orders")}>
            <FaStore className="me-2" /> Vendor Management
          </div>
          {openDropdown === "orders" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/new-Vendors" className="dropdown-item-admin">New Vendors</a></li>
              <li><a href="/superadmin/list-vendors" className="dropdown-item-admin">List of Vendors</a></li>
              <li><a href="/superadmin/manage-products" className="dropdown-item-admin">Manage Products</a></li>
              <li><a href="/superadmin/manage-orders" className="dropdown-item-admin">Manage Orders</a></li>
              <li><a href="/superadmin/approve-payout" className="dropdown-item-admin">Approve Payout</a></li>
              <li><a href="/superadmin/vendor-messages" className="dropdown-item-admin">Vendor Messages</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("admin management")}>
            <FaUserShield className="me-2" /> Admin Management
          </div>
          {openDropdown === "admin management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/list-admins" className="dropdown-item-admin">List of Admins</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("catalog management")}>
            <FaThList className="me-2" /> Catalog Management
          </div>
          {openDropdown === "catalog management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/add-category" className="dropdown-item-admin">Add Categories</a></li>
              <li><a href="/superadmin/add-subcategory" className="dropdown-item-admin">Sub Categories</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("platform management")}>
            <FaTools className="me-2" /> Platform Management
          </div>
          {openDropdown === "platform management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/add-banner" className="dropdown-item-admin">List Banner</a></li>
              <li><a href="/superadmin/add-payment" className="dropdown-item-admin">Payment Method</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("profile")}>
            <FaUser className="me-2" /> Profile
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/manage-profile" className="dropdown-item-admin">Manage Profile</a></li>
              <li><a onClick={logout} className="dropdown-item-admin">Logout</a></li>
            </ul>
          )}
        </div>
      </div>

      <div className={`admin-main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="admin-custom-header text-center">
          <h1 className="h4 mb-0">Welcome to Super Admin Dashboard</h1>
        </div>

        {/* this is main content start here */}
      </div>
       <ToastContainer />
    </div>
  );
}

export default SAdminDashboard;
