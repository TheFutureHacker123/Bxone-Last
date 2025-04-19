import React, { useState } from "react";
import {
  FaBars,
  FaChartLine,
  FaStore,
  FaThList,
  FaUsers,
  FaUser,
  FaUserShield,
  FaTools,
} from "react-icons/fa";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Button,
  Modal,
  Form,
  Image,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "./testone.css";

function TestOne() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [category, setCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [totalProduct, setTotalProduct] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState({ selectedproductImages: [] });
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const totalProducts = 100;
  const totalPages = Math.ceil(totalProducts / entries);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (name === "selectedproductImages") {
      setProductImages({
        ...productImages,
        selectedproductImages: Array.from(files).slice(0, 5)
      });
    }
  };

  const addProduct = (e) => {
    e.preventDefault();
    const newProduct = { category, productName, totalProduct, productPrice, productDescription, productImages };
    console.log("Product Added:", newProduct);
    handleCloseAddProductModal();
  };

  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
    setCategory("");
    setProductName("");
    setTotalProduct("");
    setProductPrice("");
    setProductDescription("");
    setProductImages({ selectedproductImages: [] });
  };

  return (
    <div className="admin-dashboard-wrapper">
      <button className="admin-hamburger-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`admin-custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <div className="d-flex align-items-center mb-3">
          <h2 className="text-center admin-custom-css flex-grow-1 mt-2 ms-4">Admin Dashboard</h2>
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
              <li><a href="#add-products" className="dropdown-item-admin">List Users</a></li>
              <li><a href="#add-coupons" className="dropdown-item-admin">User Messages</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("orders")}>
            <FaStore className="me-2" /> Vendor Management
          </div>
          {openDropdown === "orders" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="#new-order" className="dropdown-item-admin">List of Vendors</a></li>
              <li><a href="#shipped" className="dropdown-item-admin">Manage Products</a></li>
              <li><a href="#refund" className="dropdown-item-admin">Manage Orders</a></li>
              <li><a href="#completed" className="dropdown-item-admin">Approve Payout</a></li>
              <li><a href="#completed" className="dropdown-item-admin">Vendor Messages</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("admin management")}>
            <FaUserShield className="me-2" /> Admin Management
          </div>
          {openDropdown === "admin management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="#new-order" className="dropdown-item-admin">List of Admins</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("catalog management")}>
            <FaThList className="me-2" /> Catalog Management
          </div>
          {openDropdown === "catalog management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="#new-order" className="dropdown-item-admin">Add Categories</a></li>
              <li><a href="#new-order" className="dropdown-item-admin">Sub Categories</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("platform management")}>
            <FaTools className="me-2" /> Platform Management
          </div>
          {openDropdown === "platform management" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="#new-order" className="dropdown-item-admin">List Banner</a></li>
              <li><a href="#new-order" className="dropdown-item-admin">Payment Method</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("profile")}>
            <FaUser className="me-2" /> Profile
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li><a href="#updated-password" className="dropdown-item-admin">Updated Password</a></li>
              <li><a href="#logout" className="dropdown-item-admin">Logout</a></li>
            </ul>
          )}
        </div>
      </div>

      <div className={`admin-main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="admin-custom-header text-center">
          <h1 className="h4 mb-0">Catalog Management</h1>
        </div>

        {/* Main content for Add Category */}
<Container className="mt-4">
  <Row>
    <Col md={6} className="mx-auto">
      <div className="add-category-form">
        <h3>Add Category</h3>
        <Form onSubmit={(e) => { e.preventDefault(); console.log("Category Added:", category); }}>
          <Form.Group controlId="categoryName">
            <Form.Label>Category Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="form-input"  // Added class for styling
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-3 form-button"> 
            
            Add Category
          </Button>
        </Form>
      </div>
    </Col>
  </Row>
</Container>
      </div>
    </div>
  );
}

export default TestOne;