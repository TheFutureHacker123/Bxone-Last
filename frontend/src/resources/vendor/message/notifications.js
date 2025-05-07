import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser, FaTrash } from "react-icons/fa";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../../translations/lang.json";
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
        <FaBars />
      </button>

      <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <div className="d-flex align-items-center mb-3">
          <h2 className="text-center custom-css flex-grow-1 mt-2 ms-4">Vendor Dashboard</h2>
        </div>

        <a href="/vendor" className="custom-link">
          <FaChartLine className="me-2" /> Analytics
        </a>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("products")}>
            <FaBox className="me-2" /> Manage Products
          </div>
          {openDropdown === "products" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><a href="/vendor/add-products" className="dropdown-item-vendor">Add Products</a></li>
              <li><a href="/vendor/add-coupons" className="dropdown-item-vendor">Add Coupons</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("orders")}>
            <FaShoppingCart className="me-2" /> Manage Orders
          </div>
          {openDropdown === "orders" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><a href="/vendor/new-orders" className="dropdown-item-vendor">New Order</a></li>
              <li><a href="/vendor/shipped" className="dropdown-item-vendor">Shipped</a></li>
              <li><a href="/vendor/refunds" className="dropdown-item-vendor">Refund</a></li>
              <li><a href="/vendor/completed" className="dropdown-item-vendor">Completed</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("messages")}>
            <FaComments className="me-2" /> Manage Messages
          </div>
          {openDropdown === "messages" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><a href="/vendor/user-messages" className="dropdown-item-vendor">User Message</a></li>
              <li><a href="/vendor/admin-messages" className="dropdown-item-vendor">Admin Message</a></li>
              <li><a href="/vendor/review-messages" className="dropdown-item-vendor">Review Message</a></li>
              <li><a href="/vendor/notifications" className="dropdown-item-vendor">Notification</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("profile")}>
            <FaUser className="me-2" /> Profile
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><a href="/vendor/manage-profile" className="dropdown-item-vendor">Updated Password</a></li>
              <li><a onClick={logout} className="dropdown-item-vendor">Logout</a></li>
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