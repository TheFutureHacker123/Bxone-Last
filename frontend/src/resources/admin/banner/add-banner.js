import React, { useState,useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Button, Navbar, Nav, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUsersCog, FaUsers, FaShoppingCart, FaStar, FaUser, FaList, FaSignOutAlt, FaBars, FaCog, FaFlag, FaAd, FaTruck, FaLock, FaDollarSign, FaComment, FaBox, FaUserCog, FaClipboardList, FaClock, FaCheckCircle, FaStore } from "react-icons/fa"; // Added FaPlus and FaTag
import Translation from "../../translations/lang.json";

function AddBanner() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productManagementOpen, setProductManagementOpen] = useState(false);

  const [orderManagementOpen, setOrderManagementOpen] = useState(false);
  const [messageManagementOpen, setMessageManagementOpen] = useState(false);
  const [accountSettingOpen, setAccountSettingOpen] = useState(false);

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
  

  const toggleProductManagement = () => {
    setProductManagementOpen(!productManagementOpen);
  };

  const toggleOrderManagement = () => {
    setOrderManagementOpen(!orderManagementOpen);
  };
  const toggleMessageManagement = () => {
    setMessageManagementOpen(!messageManagementOpen);
  };
  const toggleAccountSetting = () => {
    setAccountSettingOpen(!accountSettingOpen);
  };
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
              <Dropdown.Item as={Link} to="/admin/manage-profile">
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

        {/* Main Content */}
        <Col
          lg={sidebarOpen ? 10 : 12}
          className="p-4"
          style={{
            marginLeft: sidebarOpen ? '250px' : '0',
            transition: 'margin-left 0.3s ease',
            paddingTop: '56px'
          }}
        >
          <h3>List Banner</h3>

        </Col>
      </Row>
    </Container>
  );
}

export default AddBanner;
//this hello