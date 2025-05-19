import React, { useState } from "react";
import { Container, Row, Col, Card, ListGroup, Button, Navbar, Nav, Dropdown, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaUsersCog, FaShoppingCart, FaStore, FaUser, FaList, FaSignOutAlt, FaBars, FaCog, FaBox, FaDollarSign, FaFlag, FaAd, FaLock, FaComment, FaBell, FaUserCog } from "react-icons/fa";
import Translation from "../../translations/lang.json";
import './style.css';

function UserMessagesAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productManagementOpen, setProductManagementOpen] = useState(false);
  const [orderManagementOpen, setOrderManagementOpen] = useState(false);
  const [messageManagementOpen, setMessageManagementOpen] = useState(false);
  const [accountSettingOpen, setAccountSettingOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const toggleProductManagement = () => setProductManagementOpen(!productManagementOpen);
  const toggleOrderManagement = () => setOrderManagementOpen(!orderManagementOpen);
  const toggleMessageManagement = () => setMessageManagementOpen(!messageManagementOpen);
  const toggleAccountSetting = () => setAccountSettingOpen(!accountSettingOpen);

  const handleShow = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    // Clear previous messages when opening modal
    setMessages([
      { text: "How can I track my order?", sender: "user", time: formatTime(new Date()) },
      { text: "Please provide your order ID.", sender: "me", time: formatTime(new Date()) },
    ]); 
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    setMessage(''); // Clear the message input when closing
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessages(prevMessages => [...prevMessages, { text: message, sender: 'me', time: formatTime(new Date()) }]);
      setMessage(''); // Clear the input after sending
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  // Example user data
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", lastMessage: "How can I track my order?" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", lastMessage: "Can I cancel my order?" },
    { id: 3, name: "Alice Johnson", email: "alice@example.com", lastMessage: "When will my product ship?" },
    { id: 4, name: "Bob Brown", email: "bob@example.com", lastMessage: "I need a refund." },
  ];

  return (
    <Container fluid>
      {/* Top Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="px-3 w-100 fixed-top" style={{ marginBottom: '56px' }}>
        <Button variant="dark" className="me-3 d-block" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars />
        </Button>
        <Navbar.Brand>WALIYA MARKET</Navbar.Brand>
        <Nav className="ms-auto">
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" className="text-white dropdown-toggle-no-arrow">
              <FaUser className="me-2" size={30} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item as={Link} to="/vendor/manage-profile">
                <FaCog className="me-2" /> Settings
              </Dropdown.Item>
              <Dropdown.Item as={Link} to="/vendorlogout">
                <FaSignOutAlt className="me-2" /> Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>

      <Row>
        {/* Sidebar */}
        <Col
          lg={2}
          className={`sidebar bg-dark text-white p-3 d-lg-block ${sidebarOpen ? 'sidebar-open' : ''}`}
          style={{
            minHeight: "100vh",
            position: 'fixed',
            zIndex: 999,
            top: '56px',
            left: sidebarOpen ? 0 : '-250px',
            transition: 'left 0.3s ease',
          }}
        >
           <ListGroup variant="flush">
                      <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                        <FaTachometerAlt className="me-2" />
                        <Link to="/admin/dashboard" style={{ textDecoration: 'none', color: 'white' }}>Dashboard</Link>
                      </ListGroup.Item>
                      {/* Product Management Section with Expandable Content */}
                      <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center" onClick={toggleProductManagement}>
                        <FaUsers className="me-2" />
                        User Management
                      </ListGroup.Item>
          
                      {/* Expanded content for Product Management */}
                      <div className={`product-management-dropdown ${productManagementOpen ? 'open' : ''}`}>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaUsersCog className="me-2" />
                          <Link to="/admin/list-users" style={{ textDecoration: 'none', color: 'white' }}>List Users</Link>
                        </ListGroup.Item>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaComment className="me-2" />
                          {/* <Link to="/admin/user-messages" style={{ textDecoration: 'none', color: 'white' }}>User Messages</Link> */}
                        </ListGroup.Item>
                      </div>
          
                      {/* Order Management Section with Expandable Content */}
                      <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center" onClick={toggleOrderManagement}>
                        <FaStore className="me-2" />
                        Vendor Management
                      </ListGroup.Item>
                      <div className={`product-management-dropdown ${orderManagementOpen ? 'open' : ''}`}>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaList className="me-2" />
                          <Link to="/admin/list-vendors" style={{ textDecoration: 'none', color: 'white' }}>List Vendors</Link>
                        </ListGroup.Item>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaBox className="me-2" />
                          <Link to="/admin/manage-products" style={{ textDecoration: 'none', color: 'white' }}>Manage Product</Link>
                        </ListGroup.Item>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaShoppingCart className="me-2" />
                          <Link to="/admin/manage-orders" style={{ textDecoration: 'none', color: 'white' }}>Manage Order</Link>
                        </ListGroup.Item>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaDollarSign className="me-2" />
                          <Link to="/admin/approve-payout" style={{ textDecoration: 'none', color: 'white' }}>Approve Payouts</Link>
                        </ListGroup.Item>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaComment className="me-2" />
                          <Link to="/admin/vendor-messages" style={{ textDecoration: 'none', color: 'white' }}>Vendor Messages</Link>
                        </ListGroup.Item>
                      </div>
          
                      {/* Message Management Section with Expandable Content */}
                      <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center" onClick={toggleMessageManagement}>
                        <FaFlag className="me-2" />
                        Banner Management
                      </ListGroup.Item>
                      <div className={`product-management-dropdown ${messageManagementOpen ? 'open' : ''}`}>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaAd className="me-2" />
                          <Link to="/admin/banners" style={{ textDecoration: 'none', color: 'white' }}>List Banner</Link>
                        </ListGroup.Item>
                      </div>
          
                      {/* Account Management Section with Expandable Content */}
                      <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center" onClick={toggleAccountSetting}>
                        <FaCog className="me-2" />
                        Account Settings
                      </ListGroup.Item>
                      <div className={`product-management-dropdown ${accountSettingOpen ? 'open' : ''}`}>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaUserCog className="me-2" />
                          <Link to="/admin/manage-profile" style={{ textDecoration: 'none', color: 'white' }}>Manage Profile</Link>
                        </ListGroup.Item>
                        <ListGroup.Item action className="bg-dark text-white border-0 d-flex align-items-center">
                          <FaLock className="me-2" />
                          <Link to="/admin/manage-password" style={{ textDecoration: 'none', color: 'white' }}>Update Password</Link>
                        </ListGroup.Item>
                      </div>
                    </ListGroup>
        </Col>

        <Col
          lg={10}
          className="p-4 d-flex justify-content-center align-items-center"
          style={{
            marginTop: '56px',
            minHeight: '100vh',
            marginLeft: sidebarOpen ? '250px' : '0',
            width: sidebarOpen ? 'calc(100% - 250px)' : '100%',
            transition: 'margin-left 0.3s ease, width 0.3s ease',
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
                <span style={{ fontSize: 'small', marginLeft: '10px', marginTop: '5px', alignSelf: 'flex-end' }}>{msg.time}</span> {/* Add time next to the message */}
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
                style={{ width: '100%' }} // Ensure full width
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

      <style jsx>{`
        .message {
          padding: 10px;
          border-radius: 8px;
          margin: 5px 0;
          width: fit-content;
          max-width: 70%;
          display: flex;
          align-items: center;
        }
        .my-message {
          background-color: #007bff;
          color: white;
          margin-left: auto;
        }
        .user-message {
          background-color: #f1f1f1;
          color: black;
        }
      `}</style>
    </Container>
  );
}

export default UserMessagesAdmin;