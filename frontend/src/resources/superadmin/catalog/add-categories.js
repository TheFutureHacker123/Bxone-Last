import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaThList, FaUsers, FaUser, FaUserShield, FaTools, FaEdit, FaTrash } from "react-icons/fa";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import Translation from "../../translations/superadmin.json";
import "../style/add-category.css";

function AddCategory() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [adminId, setAdminId] = useState(null);
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



  const handleDropdown = (menu) => setOpenDropdown(openDropdown === menu ? null : menu);
  useEffect(() => {
    // Fetch admin_id from localStorage on component mount
    const fetchAdminId = () => {
      try {
        const adminInfo = localStorage.getItem("admin-info");
        if (adminInfo) {
          const parsed = JSON.parse(adminInfo);
          setAdminId(parsed.admin_id);
        }
      } catch (error) {
        console.error("Failed to parse admin-info from localStorage", error);
      }
    };

    fetchAdminId();
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchCategories(); // Fetch categories when admin_id is available
    }
  }, [adminId]); // Trigger fetchCategories when adminId is set or changes

  const fetchCategories = async () => {
    if (!adminId) return;

    try {
      const response = await fetch("http://localhost:8000/api/get-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ admin_id: adminId }),
      });

      const data = await response.json();
      if (data) {
        setCategories(data); // Set categories state if data is returned
      }
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };


  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };



 const handleAddCategory = async () => {
  if (!categoryName) {
    toast.error("Category name cannot be empty.");
    return;
  }

  const validCategoryName = /^[a-zA-Z0-9 ]+$/;
  if (!validCategoryName.test(categoryName)) {
    toast.error("Category name must only contain letters, numbers, and spaces.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/add-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_id: adminId,
        category_name: categoryName,
      }),
    });

    const data = await response.json();
    if (response.ok && data.success) {
      toast.success("Category added successfully!");
      fetchCategories(); // Reload categories
      handleCloseAddCategoryModal();
    } else {
      toast.error(data.message || "Failed to add category.");
    }
  } catch (err) {
    toast.error("An error occurred. Please try again.");
  }
};


  const handleEditCategory = async () => {

  if (!categoryName) {
    toast.error("Category name cannot be empty.");
    return;
  }
    const categoryId = categories[categoryToEdit]?.category_id;

    if (!categoryId) {
      toast.error("Invalid category selected.");
      return;
    }

  const validCategoryName = /^[a-zA-Z0-9 ]+$/;

  if (!validCategoryName.test(categoryName)) {
    toast.error("Category name must only contain letters, numbers, and spaces.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/edit-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        admin_id: adminId,
        category_id: categoryId,
        category_name: categoryName,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Category updated successfully!");
      handleCloseEditCategoryModal();
      fetchCategories(); // Optional: refresh category list
    } else {
      toast.error(data.message || "Failed to update category.");
    }
  } catch (error) {
    toast.error("An error occurred. Please try again.");
  }
};


  const handleDeleteCategory = async () => {
    if (categoryToDelete === null) return;

    try {
      // Send request to delete category
      const response = await fetch("http://localhost:8000/api/delete-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_id: adminId,
          category_id: categories[categoryToDelete].category_id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Category deleted successfully!");
        fetchCategories(); // Reload categories
        handleCloseConfirmDeleteModal();
      } else {
        toast.error("Failed to delete category");
      }
    } catch (err) {
      toast.error("Failed to delete category");
    }
  };

  const handleCloseAddCategoryModal = () => {
    setShowAddCategoryModal(false);
    setCategoryName("");
  };

  const handleCloseConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleCloseEditCategoryModal = () => {
    setShowEditCategoryModal(false);
    setCategoryName("");
    setCategoryToEdit(null);
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
                    {/* <li><Link to="/superadmin/user-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.user_messages || "User Messages"}</Link></li> */}
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
                    {/* <li><Link to="/superadmin/approve-payout" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>{content?.approve_payout || "Approve Payout"}</Link></li> */}
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
      
              {/* <div className="dropdown">
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
              </div> */}
      
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

      <div className={`admin-main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="admin-custom-header text-center">
          <h1 className="h4 mb-0">{content?.add_category || "Add Category"}</h1>
        </div>

        <div className="admin-category-container">
          <Button
            variant="primary"
            className="my-3"
            onClick={() => setShowAddCategoryModal(true)}
            style={{ float: 'right' }}
          >
            {content?.add_category || "Add Category"}
          </Button>

          {/* Add Category Modal */}
          <Modal show={showAddCategoryModal} onHide={handleCloseAddCategoryModal}>
            <Modal.Header closeButton>
              <Modal.Title>{content?.add_category || "Add Category"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formCategoryName">
                  <Form.Label>{content?.category_name || "Category Name"}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={content?.category_name || "Enter category name"}
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseAddCategoryModal}>
                {content?.close || "Close"}
              </Button>
              <Button variant="primary" onClick={handleAddCategory}>
                {content?.add_category || "Add Category"}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Category Modal */}
          <Modal show={showEditCategoryModal} onHide={handleCloseEditCategoryModal}>
            <Modal.Header closeButton>
              <Modal.Title>{content?.edit_category || "Edit Category"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formEditCategoryName">
                  <Form.Label>{content?.category_name || "Category Name"}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={content?.category_name || "Edit category name"}
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditCategoryModal}>
                {content?.close || "Close"}
              </Button>
              <Button variant="primary" onClick={handleEditCategory}>
                {content?.save_changes || "Save Changes"}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Confirm Delete Category Modal */}
          <Modal show={showConfirmDeleteModal} onHide={handleCloseConfirmDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title>{content?.confirm_deletion || "Confirm Deletion"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content?.delete_category || "Do you want to delete this category?"}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseConfirmDeleteModal}>
                {content?.cancel || "Cancel"}
              </Button>
              <Button variant="danger" onClick={handleDeleteCategory}>
                {content?.delete || "Delete"}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Category List */}
          <div className="category-list mt-4">
            <h3>{content?.added_categories || "Added Categories"}</h3>
            <ListGroup>
              {categories.map((category, index) => (
                <ListGroup.Item key={index}>
                  <span>{category.category_name}</span>
                  <div className="action-buttons">
                    <Button
                      variant="link"
                      onClick={() => {
                        setCategoryToEdit(index);
                        setCategoryName(category.category_name);
                        setShowEditCategoryModal(true);
                      }}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => {
                        setCategoryToDelete(index);
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
        <ToastContainer />
      </div>
    </div>
  );
}

export default AddCategory;
