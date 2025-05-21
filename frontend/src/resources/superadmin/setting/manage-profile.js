import React, { useState, useEffect } from "react";

import {
    FaBars, FaChartLine, FaStore, FaThList, FaUsers, FaUser, FaUserShield, FaTools,
} from "react-icons/fa";
import { Container, Button, Form, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import Translation from "../../translations/superadmin.json";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const defaultFontSize = "medium";
const defaultFontColor = "#000000";
const defaultLanguage = "english";

function SAdminManageProfile() {
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const [openDropdown, setOpenDropdown] = useState(null);
    const [fontSize, setFontSize] = useState(() => localStorage.getItem("fontSize") || defaultFontSize);
    const [fontColor, setFontColor] = useState(() => localStorage.getItem("fontColor") || defaultFontColor);
    const [language, setLanguage] = useState(() => localStorage.getItem("language") || defaultLanguage);
    const [content, setContent] = useState(Translation[language]);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.style.setProperty("--font-size", fontSize);
        document.documentElement.style.setProperty("--font-color", fontColor);

        localStorage.setItem("fontSize", fontSize);
        localStorage.setItem("fontColor", fontColor);
        localStorage.setItem("language", language);
        setContent(Translation[language]);
    }, [fontSize, fontColor, language]);

    const resetToDefault = () => {
        setFontSize(defaultFontSize);
        setFontColor(defaultFontColor);
        setLanguage(defaultLanguage);
        localStorage.removeItem("fontSize");
        localStorage.removeItem("fontColor");
        localStorage.removeItem("language");
        toast.success(content?.settings_reset_success || "Settings reset to default.");
    };

    const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

    const handleDropdown = (menu) => setOpenDropdown(openDropdown === menu ? null : menu);


    const logout = () => {
        localStorage.clear();
        toast.success("Logout Successful!", { position: "top-right", autoClose: 3000 });
        setTimeout(() => navigate("/admin/login"), 1000);
    };

    return (
        <div className="admin-dashboard-wrapper">
            <button className="admin-hamburger-btn" onClick={toggleSidebar}>
                <FaBars className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            </button>

            <div className={`admin-custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
                    <div className="d-flex align-items-center mb-3">
                      <text className="text-center admin-custom-css flex-grow-1 mt-2 ms-4" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.admin_dashboard_title || "Admin Dashboard"}
                      </text>
                    </div>
            
                    <Link to="/superadmin/dashboard" className="admin-custom-link">
                      <FaChartLine className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                      <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.dashboard || "Dashboard"}
                      </span>
                    </Link>
            
                    <div className="dropdown">
                      <div className="admin-custom-link" onClick={() => handleDropdown("user_management")}>
                        <FaUsers className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.user_management || "User Management"}
                        </span>
                      </div>
                      {openDropdown === "user_management" && (
                        <ul className="dropdown-menu admin-custom-dropdown-menu">
                          <li><Link to="/superadmin/list-users" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.list_users || "List Users"}</Link></li>
                          {/* <li><Link to="/superadmin/user-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.user_messages || "User Messages"}</Link></li> */}
                        </ul>
                      )}
                    </div>
            
                    <div className="dropdown">
                      <div className="admin-custom-link" onClick={() => handleDropdown("vendor_management")}>
                        <FaStore className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.vendor_management || "Vendor Management"}
                        </span>
                      </div>
                      {openDropdown === "vendor_management" && (
                        <ul className="dropdown-menu admin-custom-dropdown-menu">
                          <li><Link to="/superadmin/new-vendors" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.new_vendors || "New Vendors"}</Link></li>
                          <li><Link to="/superadmin/list-vendors" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.list_of_vendors || "List of Vendors"}</Link></li>
                          <li><Link to="/superadmin/manage-products" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.manage_products || "Manage Products"}</Link></li>
                          <li><Link to="/superadmin/manage-orders" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.manage_orders || "Manage Orders"}</Link></li>
                          {/* <li><Link to="/superadmin/approve-payout" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.approve_payout || "Approve Payout"}</Link></li> */}
                          <li><Link to="/superadmin/vendor-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.vendor_messages || "Vendor Messages"}</Link></li>
                        </ul>
                      )}
                    </div>
            
                    <div className="dropdown">
                      <div className="admin-custom-link" onClick={() => handleDropdown("admin_management")}>
                        <FaUserShield className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.admin_management || "Admin Management"}
                        </span>
                      </div>
                      {openDropdown === "admin_management" && (
                        <ul className="dropdown-menu admin-custom-dropdown-menu">
                          <li><Link to="/superadmin/list-admins" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.list_of_admins || "List of Admins"}</Link></li>
                        </ul>
                      )}
                    </div>
            
                    <div className="dropdown">
                      <div className="admin-custom-link" onClick={() => handleDropdown("catalog_management")}>
                        <FaThList className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.catalog_management || "Catalog Management"}
                        </span>
                      </div>
                      {openDropdown === "catalog_management" && (
                        <ul className="dropdown-menu admin-custom-dropdown-menu">
                          <li><Link to="/superadmin/add-category" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.add_categories || "Add Categories"}</Link></li>
                          <li><Link to="/superadmin/add-subcategory" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.sub_categories || "Sub Categories"}</Link></li>
                        </ul>
                      )}
                    </div>
            
                    {/* <div className="dropdown">
                      <div className="admin-custom-link" onClick={() => handleDropdown("platform_management")}>
                        <FaTools className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.platform_management || "Platform Management"}
                        </span>
                      </div>
                      {openDropdown === "platform_management" && (
                        <ul className="dropdown-menu admin-custom-dropdown-menu">
                          <li><Link to="/superadmin/add-banner" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.list_banner || "List Banner"}</Link></li>
                          <li><Link to="/superadmin/add-payment" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.payment_method || "Payment Method"}</Link></li>
                        </ul>
                      )}
                    </div> */}
            
                    <div className="dropdown">
                      <div className="admin-custom-link" onClick={() => handleDropdown("profile")}>
                        <FaUser className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.profile || "Profile"}
                        </span>
                      </div>
                      {openDropdown === "profile" && (
                        <ul className="dropdown-menu admin-custom-dropdown-menu">
                          <li><Link to="/superadmin/manage-profile" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.setting || "Settings"}</Link></li>
                          <li><a onClick={logout} className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.logout || "Logout"}</a></li>
                        </ul>
                      )}
                    </div>
                  </div>

            <div className={`admin-main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
                <div className="admin-custom-header text-center">
                    <h2 className="h4 mb-0" style={{ color: "var(--font-color)" }}>{content?.setting || "Settings"}</h2>
                </div>

                <Container className="settings-container mt-3">
                    <Form>
                        <Form.Group controlId="language">
                            <Form.Label>{content?.language || "Language"}:</Form.Label>
                            <Form.Control
                                as="select"
                                value={language}
                                onChange={(e) => {
                                    const selectedLanguage = e.target.value;
                                    setLanguage(selectedLanguage);
                                    localStorage.setItem("language", selectedLanguage);
                                    setContent(Translation[selectedLanguage]);
                                }}
                            >
                                <option value="english">English</option>
                                <option value="amharic">አማርኛ</option>
                                <option value="afan_oromo">Afaan Oromoo</option>
                                <option value="ethiopian_somali">Somali</option>
                                <option value="tigrinya">ትግሪኛ</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="font-size">
                            <Form.Label>{content?.font_size || "Font Size"}:</Form.Label>
                            <Form.Control
                                as="select"
                                value={fontSize}
                                onChange={(e) => setFontSize(e.target.value)}
                            >
                                <option value="small">{content?.small || "Small"}</option>
                                <option value="medium">{content?.medium || "Medium"}</option>
                                <option value="large">{content?.large || "Large"}</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="font-color">
                            <Form.Label>{content?.font_color || "Font Color"}:</Form.Label>
                            <Form.Control
                                type="color"
                                value={fontColor}
                                onChange={(e) => setFontColor(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="secondary" onClick={resetToDefault}>
                            {content?.set_to_default || "Set to Default"}
                        </Button>
                    </Form>

                    <ToastContainer />
                </Container>
            </div>
        </div>
    );
}

export default SAdminManageProfile;

