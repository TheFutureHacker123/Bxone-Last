import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaUsers, FaUser } from "react-icons/fa";
import { Row, Col, Button, Form, Modal } from "react-bootstrap";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Translation from "../../translations/admin.json";
import "../style/list-user.css";

function ListUsers() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userStatus, setUserStatus] = useState("Active");
  const [users, setUsers] = useState([]);
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
  const handleEntriesChange = (newEntries) => {
    setEntries(newEntries);
    setCurrentPage(1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const logout = () => {
    localStorage.clear();
    toast.success(content?.logout || "Logout Successful!", { position: "top-right", autoClose: 3000 });
    setTimeout(() => navigate("/admin/login"), 1000);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/listusers");
      const data = await response.json();
      setUsers(data.users);
    } catch {
      toast.error(content?.error_occurred || "Failed to fetch users.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeUserStatus = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/changeuserstatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: selectedUserId, status: userStatus }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(content?.user_status_updated || "User status updated successfully!");
        setShowEditModal(false);
        fetchUsers();
      } else {
        toast.error(content?.update_failed || "Failed to update status.");
      }
    } catch {
      toast.error(content?.error_occurred || "An error occurred. Please try again.");
    }
  };

  // Filtering + Pagination
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / entries);
  const indexOfLastUser = currentPage * entries;
  const indexOfFirstUser = indexOfLastUser - entries;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

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
          <h1 className="h4 mb-0">{content?.user_list || "User List"}</h1>
        </div>

        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <Row className="mb-3 d-flex justify-content-between align-items-center">
            <Col xs="auto" className="d-flex align-items-center">
              <label className="me-2">{content?.show || "Show"}</label>
              <Form.Select
                value={entries}
                onChange={(e) => handleEntriesChange(Number(e.target.value))}
                style={{ width: '100px' }}
              >
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </Form.Select>
              <label className="ms-2">{content?.entries || "Entries"}</label>
            </Col>

            <Col xs="auto" className="d-flex align-items-center mt-3 mt-sm-0">
              <label className="me-2">{content?.search || "Search:"}</label>
              <Form.Control
                type="text"
                placeholder={content?.search_placeholder || "Search"}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // reset to first page on search
                }}
                style={{ width: '150px' }}
              />
            </Col>
          </Row>
        </div>

        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <div style={{ height: '440px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
            <div style={{ overflowY: 'auto', height: 'calc(100% - 60px)', padding: '1rem' }}>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <div
                    key={user.user_id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '1rem',
                      backgroundColor: '#fff',
                      borderRadius: '8px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                      marginBottom: '10px'
                    }}
                  >
                    <div>
                      <h5 style={{ margin: 0 }}>{user.name}</h5>
                      <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
                    </div>
                    <div>
                      <span
                        style={{
                          padding: '0.5rem 1rem',
                          borderRadius: '20px',
                          backgroundColor: user.status === 'Active' ? '#d4edda' : '#f8d7da',
                          color: user.status === 'Active' ? '#155724' : '#721c24',
                          marginRight: '1rem'
                        }}
                      >
                        {user.status}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setSelectedUserId(user.user_id);
                          setUserStatus(user.status);
                          setShowEditModal(true);
                        }}
                      >
                        {content?.edit || "Edit"}
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>{content?.no_users_found || "No users found."}</p>
              )}
            </div>

            {/* Pagination */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '60px',
                backgroundColor: '#fff',
                borderTop: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 1rem'
              }}
            >
              <Button variant="secondary" onClick={handlePrevious} disabled={currentPage === 1}>
                {content?.previous || "Previous"}
              </Button>
              <div>
                {content?.page || "Page"} {currentPage} {content?.of || "of"} {totalPages || 1}
              </div>
              <Button variant="secondary" onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>
                {content?.next || "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{content?.edit_user_status || "Edit User Status"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="userStatus">
            <Form.Label>{content?.select_status || "Select Status"}</Form.Label>
            <Form.Control
              as="select"
              value={userStatus}
              onChange={(e) => setUserStatus(e.target.value)}
            >
              <option value="Active">{content?.active || "Active"}</option>
              <option value="Suspended">{content?.suspended || "Suspended"}</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            {content?.close || "Close"}
          </Button>
          <Button variant="primary" onClick={changeUserStatus}>
            {content?.save_changes || "Save Changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListUsers;