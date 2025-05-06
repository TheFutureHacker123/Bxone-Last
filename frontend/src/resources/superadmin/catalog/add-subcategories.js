import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaThList, FaUsers, FaUser, FaUserShield, FaTools, FaEdit, FaTrash, } from "react-icons/fa";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Translation from "../../translations/lang.json";
import "../style/add-subcategory.css";

function AddSubCategory() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditSubcategoryModal, setShowEditSubcategoryModal] = useState(false);
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategoryToEdit, setSubcategoryToEdit] = useState(null);
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const adminInfo = localStorage.getItem('admin-info');
      const parsedInfo = JSON.parse(adminInfo);
      const admin_id = parsedInfo.admin_id;

      const response = await fetch('http://localhost:8000/api/get-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: admin_id,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch categories");
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Error fetching categories");
    }
  };


  const fetchSubcategories = async () => {
    try {
      const adminInfo = localStorage.getItem('admin-info');

      const parsedInfo = JSON.parse(adminInfo);
      const admin_id = parsedInfo.admin_id;

      const response = await fetch('http://localhost:8000/api/get-subcategories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin_id: admin_id,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch subcategories");
      const data = await response.json();
      setSubcategories(data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      toast.error("Error fetching subcategories");
    }
  };


  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleDropdown = (menu) => setOpenDropdown(openDropdown === menu ? null : menu);

  const handleAddSubcategory = async () => {
    if (subcategoryName.trim() && selectedCategory) {
      const adminInfo = localStorage.getItem('admin-info');
      const parsedInfo = JSON.parse(adminInfo);
      const admin_id = parsedInfo.admin_id;

      const newSubcategory = {
        admin_id,
        sub_category_name: subcategoryName.trim(),
        category_id: selectedCategory,
      };

      try {
        const response = await fetch('http://localhost:8000/api/add-subcategories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSubcategory),
        });
        const result = await response.json();
        if (result.success) {
          // Fetch updated subcategories after adding
          await fetchSubcategories();
          toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error adding subcategory:", error);
        toast.error("Error adding subcategory");
      }

      setSubcategoryName("");
      setSelectedCategory("");
      setShowAddSubcategoryModal(false);
    } else {
      toast.error("Please fill in all fields");
    }
  };


  const handleDeleteSubcategory = async () => {
    if (subcategoryToDelete === null) return;
    try {
      const response = await fetch('http://localhost:8000/api/delete-subcategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sub_category_id: subcategoryToDelete }),
      });
      const result = await response.json();
      if (result.success) {
        // Remove the subcategory with matching ID
        setSubcategories(subcategories.filter((s) => s.sub_category_id !== subcategoryToDelete));
        toast.success("Subcategory deleted successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Error deleting subcategory");
    }
    setShowConfirmDeleteModal(false);
    setSubcategoryToDelete(null);
  };


  const handleEditSubcategory = async () => {
    if (subcategoryToEdit !== null && subcategoryName.trim() && selectedCategory) {
      const updatedSubcategory = {
        sub_category_id: subcategoryToEdit,
        sub_category_name: subcategoryName.trim(),
        category_id: selectedCategory,
      };
      try {
        const response = await fetch('http://localhost:8000/api/edit-subcategory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSubcategory),
        });
        const result = await response.json();
        if (result.success) {
          // Fetch updated subcategories after editing
          await fetchSubcategories();
          toast.success("Subcategory updated successfully");
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        console.error("Error editing subcategory:", error);
        toast.error("Error editing subcategory");
      }
      setShowEditSubcategoryModal(false);
      setSubcategoryName("");
      setSelectedCategory("");
      setSubcategoryToEdit(null);
    }
  };


  const logout = () => {
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
      navigate("/admin/login");
    }, 1000);
  };

  return (
    <div className="admin-dashboard-wrapper">
      <button className="admin-hamburger-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`admin-custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <div className="d-flex align-items-center mb-3">
          <h2 className="text-center admin-custom-css flex-grow-1 mt-2 ms-4">SAdmin Dashboard</h2>
        </div>

        <a href="/superadmin/dashboard" className="admin-custom-link">
          <FaChartLine className="me-2" /> Dashboard
        </a>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("products")}>
            <FaUsers className="me-2" /> User Management
          </div>
          {openDropdown === "products" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/list-users" className="dropdown-item-admin">List Users</a></li>
              <li><a href="/superadmin/user-messages" className="dropdown-item-admin">User Messages</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("orders")}>
            <FaStore className="me-2" /> Vendor Management
          </div>
          {openDropdown === "orders" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/new-Vendors" className="dropdown-item-admin">New Vendors</a></li>
              <li><a href="/superadmin/list-vendors" className="dropdown-item-admin">List of Vendors</a></li>
              <li><a href="/superadmin/manage-products" className="dropdown-item-admin">Manage Products</a></li>
              <li><a href="/superadmin/manage-orders" className="dropdown-item-admin">Manage Orders</a></li>
              <li><a href="/superadmin/approve-payout" className="dropdown-item-admin">Approve Payout</a></li>
              <li><a href="/superadmin/vendor-messages" className="dropdown-item-admin">Vendor Messages</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("admin management")}>
            <FaUserShield className="me-2" /> Admin Management
          </div>
          {openDropdown === "admin management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/list-admins" className="dropdown-item-admin">List of Admins</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("catalog management")}>
            <FaThList className="me-2" /> Catalog Management
          </div>
          {openDropdown === "catalog management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/add-category" className="dropdown-item-admin">Add Categories</a></li>
              <li><a href="/superadmin/add-subcategory" className="dropdown-item-admin">Sub Categories</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("platform management")}>
            <FaTools className="me-2" /> Platform Management
          </div>
          {openDropdown === "platform management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/add-banner" className="dropdown-item-admin">List Banner</a></li>
              <li><a href="/superadmin/add-payment" className="dropdown-item-admin">Payment Method</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("profile")}>
            <FaUser className="me-2" /> Profile
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="/superadmin/manage-profile" className="dropdown-item-admin">Manage Profile</a></li>
              <li><a href="/superadmin/login" className="dropdown-item-admin">Logout</a></li>
            </ul>
          )}
        </div>
      </div>

      <div className={`admin-main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="admin-custom-header text-center">
          <h1 className="h4 mb-0">Welcome to Super Admin Dashboard</h1>
        </div>

        <div className="admin-category-container">
          <Button
            variant="primary"
            className="my-3"
            onClick={() => setShowAddSubcategoryModal(true)}
            style={{ float: "right" }}
          >
            Add Subcategory
          </Button>

          {/* Add Subcategory Modal */}
          <Modal show={showAddSubcategoryModal} onHide={() => setShowAddSubcategoryModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Add Subcategory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Select Category</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Subcategory Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                    placeholder="Enter subcategory name"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddSubcategoryModal(false)}>Close</Button>
              <Button variant="primary" onClick={handleAddSubcategory}>Add Subcategory</Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Subcategory Modal */}
          <Modal show={showEditSubcategoryModal} onHide={() => setShowEditSubcategoryModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Subcategory</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>Select Category</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>Subcategory Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                    placeholder="Edit subcategory name"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditSubcategoryModal(false)}>Close</Button>
              <Button variant="primary" onClick={handleEditSubcategory}>Save Changes</Button>
            </Modal.Footer>
          </Modal>

          {/* Confirm Delete Modal */}
          <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Subcategory</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you want to delete this subcategory?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeleteSubcategory}>Delete</Button>
            </Modal.Footer>
          </Modal>

          {/* Subcategory List */}
          <div className="category-list mt-4">
            <h3>Subcategories</h3>
            <ListGroup>
              {subcategories.map((sub) => (
                <ListGroup.Item key={sub.sub_category_id}>
                  <div>
                    <strong>{sub.sub_category_name}</strong> <small className="text-muted">({sub.category_name})</small>
                  </div>
                  <div className="action-buttons">
                    <Button
                      variant="link"
                      onClick={() => {
                        setSubcategoryToEdit(sub.sub_category_id);
                        setSubcategoryName(sub.sub_category_name);
                        setSelectedCategory(sub.category_id);
                        setShowEditSubcategoryModal(true);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => {
                        setSubcategoryToDelete(sub.sub_category_id);
                        setShowConfirmDeleteModal(true);
                      }}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddSubCategory;