import React, { useState, useEffect } from "react";
import {
    FaBars, FaChartLine, FaStore, FaUsers, FaUser, FaUserShield, FaTools,
} from "react-icons/fa";
import { Container, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../../translations/admin.json";
import 'react-toastify/dist/ReactToastify.css';
import "../style/update-password.css";

function AdminSettings() {
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

    const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

    const handleDropdown = (menu) => setOpenDropdown(openDropdown === menu ? null : menu);

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
            admin_id,
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
                setTimeout(() => navigate("/admin/"), 1000);
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

    const logout = () => {
        localStorage.clear();
        toast.success(content?.logout || "Logout Successful!", {
            position: "top-right",
            autoClose: 3000,
        });
        setTimeout(() => navigate("/admin/login"), 1000);
    };

    const resetToDefault = () => {
        setFontSize(defaultFontSize);
        setFontColor(defaultFontColor);
        setLanguage(defaultLanguage);
        localStorage.removeItem("fontSize");
        localStorage.removeItem("fontColor");
        localStorage.removeItem("language");
        toast.success(content?.settings_reset_success || "Settings reset to default.");
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
                          <li>
                            <Link to="/admin/user-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.user_messages || "User Messages"}
                            </Link>
                          </li>
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
                    <h2 className="h4 mb-0" style={{ color: "var(--font-color)" }}>{content?.settings || "Settings"}</h2>
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

            <ToastContainer />
        </div>
    );
}

export default AdminSettings;