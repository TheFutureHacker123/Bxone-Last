import React, { useState, useEffect } from "react";
import {
  FaBars, FaChartLine, FaStore, FaThList, FaUsers, FaUser, FaUserShield, FaTools,
} from "react-icons/fa";
import { Row, Col, Button, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Translation from "../../translations/superadmin.json";
import "../style/list-admin.css";

function SAdminListAdmins() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userStatus, setUserStatus] = useState("Active");
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', name: '', phone: '', image: null });
  const [errors, setErrors] = useState({});
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

  const handlePrevious = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };
  const handleNext = () => {
    const totalPages = Math.ceil(users.length / entries);
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const logout = () => {
    localStorage.clear();
    toast.success("Logout Successful!", { position: "top-right", autoClose: 3000 });
    setTimeout(() => navigate("/admin/login"), 1000);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/listadmins");
      const data = await response.json();
      setUsers(data.users);
    } catch {
      toast.error("Failed to fetch users.");
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const changeUserStatus = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/admin/changeuserstatusadmin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id: selectedUserId, status: userStatus }),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("User status updated successfully!");
        setShowEditModal(false);
        fetchUsers();
      } else {
        toast.error("Failed to update status.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().startsWith(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / entries);
  const indexOfLastUser = currentPage * entries;
  const indexOfFirstUser = indexOfLastUser - entries;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const validateUser = () => {
    const newErrors = {};
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[A-Za-z\s]+$/; // Allow alphabetic characters and spaces
    const phoneRegexPlus = /^\+\d{12}$/;
    const phoneRegexZero = /^0\d{9}$/;

    if (!newUser.name.trim()) {
        newErrors.name = "Name is required";
    } else if (newUser.name.length < 3) {
        newErrors.name = "Name must be at least 3 characters long"; // Minimum length check
    } else if (!nameRegex.test(newUser.name)) {
        newErrors.name = "Name can only contain alphabetic characters (a-z, A-Z)";
    }

    if (!newUser.email.trim()) {
        newErrors.email = "Email is required";
    } else if (!emailRegex.test(newUser.email)) {
        newErrors.email = "Invalid email format";
    }

    if (!newUser.password) {
        newErrors.password = "Password is required";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}/.test(newUser.password)) {
        newErrors.password = "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character";
    }

    if (!newUser.phone.trim()) {
        newErrors.phone = "Phone number is required";
    } else if (!phoneRegexPlus.test(newUser.phone) && !phoneRegexZero.test(newUser.phone)) {
        newErrors.phone = "Phone number must start with + and have 13 digits or start with 0 and have 10 digits";
    }

    // Validate image
    if (!newUser.image) {
        newErrors.image = "Select photo!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
};

  
const handleInputChange = (e) => {
  const { name, value } = e.target;

  // Restrict input based on current value
  if (name === 'phone') {
    if (value.startsWith('+') && value.length > 13) return;
    if (value.startsWith('0') && value.length > 10) return;
  }

  setNewUser((prev) => ({ ...prev, [name]: value }));
};

  const handleAddUser = async () => {
    if (!validateUser()) {
      return; // Stop execution if validation fails
    }

    const formData = new FormData();
    formData.append("email", newUser.email);
    formData.append("password", newUser.password);
    formData.append("name", newUser.name);
    formData.append("phone", newUser.phone);
    if (newUser.image) formData.append("image", newUser.image);

    try {
      const response = await fetch("http://localhost:8000/api/superadmin/addadmins", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success("User added successfully!", { position: "top-right", autoClose: 3000 });
        setShowAddModal(false);
        setNewUser({ name: "", email: "", password: "", phone: "", image: null });
        fetchUsers();
      } else if(result.status === "exist"){
        toast.error("Admin already exists.", { position: "top-right", autoClose: 3000 });
      } else{
        toast.error("Failed to add user. Please try again.", { position: "top-right", autoClose: 3000 });
      }
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="dashboard-wrapper">
      <button className="admin-hamburger-btn" onClick={toggleSidebar}>
        <FaBars className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
      </button>

<div className={`admin-custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <div className="d-flex align-items-center mb-3">
          <text className="text-center admin-custom-css flex-grow-1 mt-2 ms-4" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
            {content?.admin_dashboard_title || "Admin Dashboard"}
          </text>
        </div>

        <Link to="/superadmin/dashboard" className="admin-custom-link">
          <FaChartLine className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
          <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
            {content?.dashboard || "Dashboard"}
          </span>
        </Link>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("user_management")}>
            <FaUsers className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
              {content?.user_management || "User Management"}
            </span>
          </div>
          {openDropdown === "user_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/list-users" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.list_users || "List Users"}</Link></li>
              <li><Link to="/superadmin/user-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.user_messages || "User Messages"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("vendor_management")}>
            <FaStore className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
              {content?.vendor_management || "Vendor Management"}
            </span>
          </div>
          {openDropdown === "vendor_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/new-vendors" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.new_vendors || "New Vendors"}</Link></li>
              <li><Link to="/superadmin/list-vendors" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.list_of_vendors || "List of Vendors"}</Link></li>
              <li><Link to="/superadmin/manage-products" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.manage_products || "Manage Products"}</Link></li>
              <li><Link to="/superadmin/manage-orders" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.manage_orders || "Manage Orders"}</Link></li>
              <li><Link to="/superadmin/approve-payout" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.approve_payout || "Approve Payout"}</Link></li>
              <li><Link to="/superadmin/vendor-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.vendor_messages || "Vendor Messages"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("admin_management")}>
            <FaUserShield className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
              {content?.admin_management || "Admin Management"}
            </span>
          </div>
          {openDropdown === "admin_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/list-admins" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.list_of_admins || "List of Admins"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("catalog_management")}>
            <FaThList className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
              {content?.catalog_management || "Catalog Management"}
            </span>
          </div>
          {openDropdown === "catalog_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/add-category" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.add_categories || "Add Categories"}</Link></li>
              <li><Link to="/superadmin/add-subcategory" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.sub_categories || "Sub Categories"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("platform_management")}>
            <FaTools className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
              {content?.platform_management || "Platform Management"}
            </span>
          </div>
          {openDropdown === "platform_management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><Link to="/superadmin/add-banner" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.list_banner || "List Banner"}</Link></li>
              <li><Link to="/superadmin/add-payment" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.payment_method || "Payment Method"}</Link></li>
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
              <li><Link to="/superadmin/manage-profile" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.setting || "Settings"}</Link></li>
              <li><a onClick={logout} className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.logout || "Logout"}</a></li>
            </ul>
          )}
        </div>
      </div>

      <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="custom-header text-center">
          <h1 className="h4 mb-0">{content?.admin_list || "Admin List"}</h1>
        </div>

        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
          <Row className="mb-3 d-flex justify-content-between align-items-center">
            <Col xs="auto" className="d-flex align-items-center">
              <label className="me-2">Show</label>
              <Form.Select
                value={entries}
                onChange={(e) => handleEntriesChange(Number(e.target.value))}
                style={{ width: '100px' }}>
                {[10, 25, 50, 100].map((num) => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </Form.Select>
              <label className="ms-2">Entries</label>
            </Col>

            <Col xs="auto">
              <Form.Control
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                style={{ width: '180px', textAlign: 'center' }}
              />
            </Col>
            <Col xs="auto">
              <Button variant="success" onClick={() => setShowAddModal(true)}>Add User</Button>
            </Col>
          </Row>
        </div>

        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <div style={{ height: '440px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
            <div style={{ overflowY: 'auto', height: 'calc(100% - 60px)', padding: '1rem' }}>
              {currentUsers.length > 0 ? (
                currentUsers.map((user) => (
                  <div key={user.admin_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', marginBottom: '10px' }}>
                    <div>
                      <h5 style={{ margin: 0 }}>{user.name}</h5>
                      <p style={{ margin: 0, color: '#666' }}>{user.email}</p>
                    </div>
                    <div>
                      <span style={{ padding: '0.5rem 1rem', borderRadius: '20px', backgroundColor: user.status === 'Active' ? '#d4edda' : '#f8d7da', color: user.status === 'Active' ? '#155724' : '#721c24', marginRight: '1rem' }}>{user.status}</span>
                      <Button variant="primary" size="sm" onClick={() => { setSelectedUserId(user.admin_id); setUserStatus(user.status); setShowEditModal(true); }}>Edit</Button>
                    </div>
                  </div>
                ))
              ) : (<p>No users found.</p>)}
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '60px', backgroundColor: '#fff', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 1rem' }}>
              <Button variant="secondary" onClick={handlePrevious} disabled={currentPage === 1}>Previous</Button>
              <div>Page {currentPage} of {totalPages || 1}</div>
              <Button variant="secondary" onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0}>Next</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Status Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton><Modal.Title>Edit User Status</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group controlId="userStatus">
            <Form.Label>Select Status</Form.Label>
            <Form.Control as="select" value={userStatus} onChange={(e) => setUserStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
          <Button variant="primary" onClick={changeUserStatus}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      {/* Add User Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add User</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email" 
                name="email" 
                value={newUser.email} 
                onChange={handleInputChange} 
              />
              {errors.email && <div className="text-danger">{errors.email}</div>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                name="password" 
                value={newUser.password} 
                onChange={handleInputChange} 
              />
              {errors.password && <div className="text-danger">{errors.password}</div>}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control 
                type="text" 
                name="name" 
                value={newUser.name} 
                onChange={handleInputChange} 
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </Form.Group>
            <Form.Group className="mb-3">
  <Form.Label>Phone Number</Form.Label>
  <Form.Control 
    type="text" 
    name="phone" 
    value={newUser.phone} 
    onChange={handleInputChange} 
    maxLength={newUser.phone.startsWith('+') ? 13 : 10} // Dynamic maxLength
  />
  {errors.phone && <div className="text-danger">{errors.phone}</div>}
</Form.Group>
            <Form.Group className="mb-3">
    <Form.Label>Profile Image</Form.Label>
    <Form.Control 
        type="file" 
        accept="image/*" 
        onChange={(e) => setNewUser({ ...newUser, image: e.target.files[0] })} 
    />
    {errors.image && <div className="text-danger">{errors.image}</div>}
</Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddUser}>Add</Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default SAdminListAdmins;