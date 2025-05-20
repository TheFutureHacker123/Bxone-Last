import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import { Container, Button, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import Translation from "../../translations/vendor.json";
import "../style/dashboard.css";


function VendorSetting() {
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

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
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

    const resetToDefault = () => {
        setFontSize(defaultFontSize);
        setFontColor(defaultFontColor);
        setLanguage(defaultLanguage);
        localStorage.removeItem("fontSize");
        localStorage.removeItem("fontColor");
        localStorage.removeItem("language");
        toast.success(content?.settings_reset_success || "Settings reset to default.");
    };

    const handleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

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
                          {/* <li>
                            <Link to="/vendor/user-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.user_message || "User Message"}
                            </Link>
                          </li> */}
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
        </div>
    );
}

export default VendorSetting;