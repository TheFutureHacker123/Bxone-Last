import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Card, ListGroup, Button, Modal, Form } from "react-bootstrap";
import Translation from "../../translations/vendor.json";
import "../style/admin-messages.css";

function AdminMessages() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [admins, setAdmins] = useState([]);
  const navigate = useNavigate();

  const vendorInfo = JSON.parse(localStorage.getItem("vendor-info"));
  const vendorId = vendorInfo?.vendor_id;


  
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


  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/listadmins");
      const data = await response.json();
      setAdmins(data.users);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const fetchChat = async (adminId) => {
    try {
      const response = await fetch("http://localhost:8000/api/fetchChat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ vendor_id: vendorId, admin_id: adminId }),
      });
      const data = await response.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const handleShow = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    fetchChat(user.admin_id);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    setMessage('');
    setMessages([]);
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

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        message,
        vendor_id: vendorId,
        admin_id: selectedUser.admin_id,
        writen_by: "Vendor", // Change to "Admin" if sending as admin
      };
      try {
        const response = await fetch("http://localhost:8000/api/addChat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMessage),
        });
        const data = await response.json();
        if (data.success) {
          setMessages(prevMessages => [...prevMessages, { message, writen_by: "Vendor", created_at: new Date().toISOString() }]);
          setMessage('');
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
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

      <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="custom-header text-center">
          <h1 className="h4 mb-0">Admin Messages</h1>
        </div>

        <Container fluid>
          <Row>
            <Col lg={10} className="p-4 d-flex justify-content-center align-items-center">
              <Card style={{ width: '80%', maxWidth: '1200px' }}>
                <Card.Header>
                  <h4 className="text-center">Admin Messages</h4>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    {admins.map(admin => (
                      <ListGroup.Item key={admin.admin_id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{admin.name}</strong><br />
                          <small>{admin.email}</small>
                        </div>
                        <Button variant="outline-primary" size="sm" onClick={() => handleShow(admin)}>
                          View Messages
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Modal for Viewing Messages */}
          <Modal show={showModal} onHide={handleClose} size="lg" className="custom-modal">
  <Modal.Header closeButton>
    <Modal.Title>{selectedUser ? selectedUser.name : ''}</Modal.Title>
  </Modal.Header>
  <Modal.Body className="modal-body">
    <div className="message-container">
      {messages.map((msg, index) => (
        <div key={index} className={`message ${msg.writen_by === 'Vendor' ? 'my-message' : 'user-message'}`}>
          <span>{msg.message}</span>
          <span className="timestamp">{new Date(msg.created_at).toLocaleTimeString()}</span>
        </div>
      ))}
    </div>
    
  </Modal.Body>
  <Form>
      <Form.Group controlId="messageInput">
        <Form.Control
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </Form.Group>
    </Form>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleClose}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSendMessage}>
      Send
    </Button>
  </Modal.Footer>
</Modal>
        </Container>
      </div>
    </div>
  );
}

export default AdminMessages;
