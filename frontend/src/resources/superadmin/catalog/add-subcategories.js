import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaThList, FaUsers, FaUser, FaUserShield, FaTools, FaEdit, FaTrash, } from "react-icons/fa";
import { Button, Modal, Form, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import Translation from "../../translations/superadmin.json";
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
  if (!subcategoryName.trim() || !selectedCategory) {
    toast.error("Please fill in all fields");
    return;
  }

  const validSubcategoryName = /^[a-zA-Z0-9 ]+$/;
  if (!validSubcategoryName.test(subcategoryName.trim())) {
    toast.error("Subcategory name must only contain letters, numbers, and spaces.");
    return;
  }

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
    if (response.ok && result.success) {
      await fetchSubcategories();
      toast.success(result.message || "Subcategory added successfully");
      setSubcategoryName("");
      setSelectedCategory("");
      setShowAddSubcategoryModal(false);
    } else {
      toast.error(result.message || "Failed to add subcategory");
    }
  } catch (error) {
    console.error("Error adding subcategory:", error);
    toast.error("Error adding subcategory");
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
  if (subcategoryToEdit === null) {
    toast.error("No subcategory selected for editing.");
    return;
  }

  if (!subcategoryName.trim()) {
    toast.error("Subcategory name cannot be empty.");
    return;
  }

  const validSubcategoryName = /^[a-zA-Z0-9 ]+$/;
  if (!validSubcategoryName.test(subcategoryName.trim())) {
    toast.error("Subcategory name must only contain letters, numbers, and spaces.");
    return;
  }

  if (!selectedCategory) {
    toast.error("Please select a category.");
    return;
  }

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

    if (response.ok && result.success) {
      await fetchSubcategories();
      toast.success("Subcategory updated successfully");
      setShowEditSubcategoryModal(false);
      setSubcategoryName("");
      setSelectedCategory("");
      setSubcategoryToEdit(null);
    } else {
      toast.error(result.message || "Failed to update subcategory.");
    }
  } catch (error) {
    console.error("Error editing subcategory:", error);
    toast.error("Error editing subcategory");
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

          <h1 className="h4 mb-0">{content?.add_subcategory || "Add Subcategories"}</h1>
        </div>

        <div className="admin-category-container">
          <Button
            variant="primary"
            className="my-3"
            onClick={() => setShowAddSubcategoryModal(true)}
            style={{ float: "right" }}
          >
            {content?.add_subcategory || "Add Subcategory"}
          </Button>

          {/* Add Subcategory Modal */}
          <Modal show={showAddSubcategoryModal} onHide={() => setShowAddSubcategoryModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{content?.add_subcategory || "Add Subcategory"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label> {content?.select_category || "Select Category"}</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">{content?.select_category || "Select a category"}</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>{content?.subcategory_name || "Subcategory Name"}</Form.Label>
                  <Form.Control
                    type="text"
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                    placeholder={content?.subcategory_name || "Enter subcategory name"}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddSubcategoryModal(false)}>{content?.close || "Close"}</Button>
              <Button variant="primary" onClick={handleAddSubcategory}>{content?.add_subcategory || "Add Subcategory"}</Button>
            </Modal.Footer>
          </Modal>

          {/* Edit Subcategory Modal */}
          <Modal show={showEditSubcategoryModal} onHide={() => setShowEditSubcategoryModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title> {content?.edit_subcategory || "Edit Subcategory"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group>
                  <Form.Label>{content?.select_category || "Select Category"}</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">{content?.select_category || "Select a category"}</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>{content?.subcategory_name || "Subcategory Name"}</Form.Label>
                  <Form.Control
                    type="text"
                    value={subcategoryName}
                    onChange={(e) => setSubcategoryName(e.target.value)}
                    placeholder={content?.subcategory_name || "Edit subcategory name"}
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowEditSubcategoryModal(false)}>{content?.close || "Close"}</Button>
              <Button variant="primary" onClick={handleEditSubcategory}>{content?.save_changes || "Save Changes"}</Button>
            </Modal.Footer>
          </Modal>

          {/* Confirm Delete Modal */}
          <Modal show={showConfirmDeleteModal} onHide={() => setShowConfirmDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>{content?.delete_subcategory || "Delete Subcategory"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{content?.delete_subcategory_confirmation || "Are you sure you want to delete this subcategory?"}</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowConfirmDeleteModal(false)}>{content?.cancel || "Cancel"}</Button>
              <Button variant="danger" onClick={handleDeleteSubcategory}>{content?.delete || "Delete"}</Button>
            </Modal.Footer>
          </Modal>

          {/* Subcategory List */}
          <div className="category-list mt-4">
            <h3> {content?.sub_categories || "Subcategories"}</h3>
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