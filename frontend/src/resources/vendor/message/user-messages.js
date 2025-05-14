import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser, } from "react-icons/fa";
import { Container, Row, Col, Card, ListGroup, Button, Navbar, Nav, Dropdown, Modal, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../../translations/vendor.json";
import "../style/user-messages.css";

function UserMessages() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
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


  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleShow = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    setMessages([
      { text: "How can I track my order?", sender: "user", time: formatTime(new Date()) },
      { text: "Please provide your order ID.", sender: "me", time: formatTime(new Date()) },
    ]);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    setMessage('');
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prevMessages => [...prevMessages, { text: message, sender: 'me', time: formatTime(new Date()) }]);
      setMessage('');
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", lastMessage: "How can I track my order?" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", lastMessage: "Can I cancel my order?" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", lastMessage: "When will my product ship?" },
    { id: 4, name: "Bob Brown", email: "bob@example.com", lastMessage: "I need a refund." },
  ];

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
    }, 1000); // Delay the navigation for 3 seconds
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

      <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="custom-header text-center">
          <h1 className="h4 mb-0">User Messages</h1>
        </div>

        <Container fluid>
          <Row>
            <Col
              lg={10}
              className="p-4 d-flex justify-content-center align-items-center"
              style={{
                width: '100%',
              }}
            >
              <Card style={{ width: '80%', maxWidth: '1200px' }}>
                <Card.Header>
                  <h4 className="text-center">User Messages</h4>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    {users.map(user => (
                      <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{user.name}</strong><br />
                          <small>{user.email}</small>
                        </div>
                        <div className="text-muted">
                          <small>{user.lastMessage}</small>
                        </div>
                        <Button variant="outline-primary" size="sm" onClick={() => handleShow(user)}>
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
          <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedUser ? selectedUser.name : ''}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ height: '350px', overflowY: 'scroll', marginBottom: '20px' }}>
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.sender === 'me' ? 'my-message' : 'user-message'}`} style={{ display: 'flex', justifyContent: msg.sender === 'me' ? 'flex-end' : 'flex-start' }}>
                    <span>{msg.text}</span>
                    <span style={{ fontSize: 'small', marginLeft: '10px', marginTop: '5px', alignSelf: 'flex-end' }}>{msg.time}</span>
                  </div>
                ))}
              </div>
              <Form>
                <Form.Group controlId="messageInput">
                  <Form.Control
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
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

export default UserMessages;