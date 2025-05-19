import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaUsers, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Translation from "../../translations/admin.json";
import { Container, Row, Col, Card, ListGroup, Button, Modal, Form } from "react-bootstrap";

function VendorMessages() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  const adminInfo = JSON.parse(localStorage.getItem("admin-info"));
  const adminId = adminInfo?.admin_id;

  
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
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/listvendors");
      const data = await response.json();
      setVendors(data.users);
    } catch (error) {
      console.error("Error fetching vendors:", error);
    }
  };

  const fetchChat = async (vendorId) => {
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

  const handleShow = (vendor) => {
    setSelectedUser(vendor);
    setShowModal(true);
    fetchChat(vendor.vendor_id);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    setMessage('');
    setMessages([]);
  };

   const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        message,
        vendor_id: selectedUser.vendor_id,
        admin_id: adminId,
        writen_by: adminInfo.admin_role_id, // Use admin_role_id for writen_by
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
          setMessages(prevMessages => [...prevMessages, { message, writen_by: adminInfo.admin_role_id, created_at: new Date().toISOString() }]);
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

  
    const logout = () => {
      localStorage.clear();
      toast.success(content?.logout || "Logout Successful!", { position: "top-right", autoClose: 3000 });
      setTimeout(() => navigate("/admin/login"), 1000);
    };

  return (
    <div className="dashboard-wrapper">
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

      <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="custom-header text-center">
          <h1 className="h4 mb-0">Vendor Messages</h1>
        </div>

        <Container fluid>
          <Row>
            <Col lg={10} className="p-4 d-flex justify-content-center align-items-center">
              <Card style={{ width: '80%', maxWidth: '1200px' }}>
                <Card.Header>
                  <h4 className="text-center">Vendors</h4>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    {vendors.map(vendor => (
                      <ListGroup.Item key={vendor.vendor_id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{vendor.email}</strong><br />
                          <small>Status: {vendor.status}</small>
                        </div>
                        <Button variant="outline-primary" size="sm" onClick={() => handleShow(vendor)}>
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
    <Modal.Title>{selectedUser ? selectedUser.email : ''}</Modal.Title>
  </Modal.Header>

  <Modal.Body className="modal-body">
    <div className="message-container">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`message ${
            msg.writen_by === adminInfo.admin_role_id ? 'my-message' : 'user-message'
          }`}
        >
          <span>{msg.message}</span>
          <span className="timestamp">
            {new Date(msg.created_at).toLocaleTimeString()}
          </span>
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

export default VendorMessages;