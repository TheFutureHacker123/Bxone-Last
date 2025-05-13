import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser, FaTrash } from "react-icons/fa";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../../translations/vendor.json";
import "../style/notifications.css";

function Notifications() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [notifications, setNotifications] = useState([]);
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

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('vendor-info'));
    const vendorId = userInfo?.vendor_id;

    if (vendorId) {
      fetchNotifications(vendorId);
    }
  }, []);

  const fetchNotifications = async (vendorId) => {
    try {
      const response = await fetch('http://localhost:8000/api/vendor/getnotifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vendor_id: vendorId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setNotifications(data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toISOString().slice(0, 19).replace("T", " ");
  };

  const handleDeleteNotification = async (notificationId) => {
    const userInfo = JSON.parse(localStorage.getItem('vendor-info'));
    const vendorId = userInfo?.vendor_id;

    if (vendorId) {
      try {
        const response = await fetch('http://localhost:8000/api/vendor/deletenotification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ vendor_id: vendorId, notification_id: notificationId }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // Remove the notification from the state
        setNotifications(prev => prev.filter(notification => notification.notification_id !== notificationId));
        toast.success("Notification deleted successfully!");
      } catch (error) {
        console.error('Error deleting notification:', error);
      }
    }
  };


  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

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
      navigate("/vendor/login");
    }, 1000);
  }


  return (
    <div className="dashboard-wrapper">
      <button className="hamburger-btn" onClick={() => setSidebarVisible(!sidebarVisible)}>
        <FaBars style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
      </button>

      <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <text className="text-center custom-css flex-grow-1 mt-2 ms-4" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
          {content?.vendor_dashboard || "Vendor Dashboard"}
        </text>
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
                  {content?.new_orders || "New Order"}
                </Link>
              </li>
              <li>
                <Link to="/vendor/shipped" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.shipped || "Shipped"}
                </Link>
              </li>
              <li>
                <Link to="/vendor/refunds" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.refunds || "Refund"}
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

      <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="custom-header text-center">
          <h1 className="h4 mb-0">Notifications</h1>
        </div>

        <Container fluid>
          <Row>
            <Col className="p-4 d-flex justify-content-center">
              <Card style={{ width: '80%', maxWidth: '800px' }}>
                <Card.Header className="text-center">
                  <h4>Recent Notifications</h4>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    {notifications.length === 0 ? (
                      <ListGroup.Item className="text-center">
                        <strong>No notifications available.</strong>
                      </ListGroup.Item>
                    ) : (
                      notifications.map(notification => (
                        <ListGroup.Item key={notification.notification_id} className="notification-item d-flex justify-content-between align-items-center text-center">
                          <div className="flex-grow-1">
                            <strong>{notification.notification_text}</strong>
                            <br />
                            <small className="text-muted">{formatDate(notification.created_at)}</small>
                          </div>
                          <Button variant="link" onClick={() => handleDeleteNotification(notification.notification_id)}>
                            <FaTrash />
                          </Button>
                        </ListGroup.Item>
                      ))
                    )}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Notifications;