import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaUsers, FaUser } from "react-icons/fa";
import { Row, Col, Button, Form, Modal } from "react-bootstrap";
import { Link,useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Translation from "../../translations/admin.json";
import "../style/new-vendors.css";

function NewVendors() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [userStatus, setUserStatus] = useState("Pending");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [vendors, setVendors] = useState([]);
  const [vendorDetails, setVendorDetails] = useState(null);
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

  async function fetchVendors() {
    try {
      const response = await fetch(`http://localhost:8000/api/admin/listnewvendors`, {
        method: 'POST',
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });

      const result = await response.json();
      if (result.success) {
        setVendors(result.data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }

  useEffect(() => {
    fetchVendors();
  }, []);

  async function handleSeeDetails(userId) {
    try {
      const response = await fetch('http://localhost:8000/api/admin/newvendorrequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ vendor_id: userId }),
      });

      const result = await response.json();
      setVendorDetails(result);
      setShowDetailModal(true);
      setCurrentSlide(0);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
    }
  }

  const slides = vendorDetails ? [
    {
      title: content?.personal_info || "Personal Info",
      content: (
        <ul>
          <li>Name: {vendorDetails["Personal Info"].personal_name}</li>
          <li>Address: {vendorDetails["Personal Info"].personal_address}</li>
          <li>City: {vendorDetails["Personal Info"].personal_city}</li>
          <li>State: {vendorDetails["Personal Info"].personal_state}</li>
          <li>Phone: {vendorDetails["Personal Info"].personal_phone}</li>
          <li>ID: {vendorDetails["Personal Info"].personal_unique_id}</li>
          <li>
            ID Photo (Front):
            <img
              src={"http://localhost:8000/storage/" + vendorDetails["Personal Info"].id_front_side}
              alt="ID Front"
              onClick={() => {
                setSelectedImage(vendorDetails["Personal Info"].id_front_side);
                setShowImageModal(true);
              }}
            />
          </li>
          <li>
            ID Photo (Back):
            <img
              src={"http://localhost:8000/storage/" + vendorDetails["Personal Info"].id_back_side}
              alt="ID Back"
              onClick={() => {
                setSelectedImage(vendorDetails["Personal Info"].id_back_side);
                setShowImageModal(true);
              }}
            />
          </li>
        </ul>
      ),
    },
    {
      title: content?.business_info || "Business Information",
      content: (
        <ul>
          <li>Business Name: {vendorDetails["Business Information"].business_name}</li>
          <li>Address: {vendorDetails["Business Information"].business_address}</li>
          <li>City: {vendorDetails["Business Information"].business_city}</li>
          <li>State: {vendorDetails["Business Information"].business_state}</li>
          <li>Phone: {vendorDetails["Business Information"].business_phone}</li>
          <li>License Number: {vendorDetails["Business Information"].blicense_number}</li>
          <li>
            Address Proof:
            <img
              src={"http://localhost:8000/storage/" + vendorDetails["Business Information"].address_proof_img}
              alt="Address Proof"
              onClick={() => {
                setSelectedImage(vendorDetails["Business Information"].address_proof_img);
                setShowImageModal(true);
              }}
            />
          </li>
          <li>
            Other Proof Images:
            {vendorDetails["Business Information"].other_proof_images.map((img, index) => (
              <img
                key={index}
                src={"http://localhost:8000/storage/" + img}
                alt={`Proof ${index + 1}`}
                onClick={() => {
                  setSelectedImage(img);
                  setShowImageModal(true);
                }}
                style={{ margin: '5px', cursor: 'pointer', width: '50px', height: 'auto' }}
              />
            ))}
          </li>
        </ul>
      ),
    },
    {
      title: content?.bank_info || "Bank Info",
      content: (
        <ul>
          <li>Bank Name: {vendorDetails["Bank Info"].bank_name}</li>
          <li>Account Holder Name: {vendorDetails["Bank Info"].account_name}</li>
          <li>Account Number: {vendorDetails["Bank Info"].account_number}</li>
        </ul>
      ),
    },
  ] : [];

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePreviousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleDropdown = (menu) => setOpenDropdown(openDropdown === menu ? null : menu);
  const handleEntriesChange = (newEntries) => {
    setEntries(newEntries);
    setCurrentPage(1);
  };

  const filteredVendors = vendors.filter(vendor =>
    vendor.personal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredVendors.length / entries);
  const indexOfLastVendor = currentPage * entries;
  const indexOfFirstVendor = indexOfLastVendor - entries;
  const currentVendors = filteredVendors.slice(indexOfFirstVendor, indexOfLastVendor);

  const changeUserStatus = async () => {
    const payload = {
      vendor_id: selectedUserId,
      status: userStatus,
    };

    try {
      const response = await fetch("http://localhost:8000/api/admin/changevendorstatus", {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json',
        },
      });

      const result = await response.json();
      if (result.success) {
        toast.success(content?.change_success || "Vendor status updated successfully!");
        setShowEditModal(false);
        fetchVendors();
      } else {
        toast.error(content?.change_failed || "Failed to update status.");
      }
    } catch {
      toast.error(content?.change_failed || "An error occurred. Please try again.");
    }
  };

  function logout() {
    localStorage.clear();
    toast.success(content?.logout || "Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate("/admin/login");
    }, 1000);
  }

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
              {/* <li>
                <Link to="/admin/user-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.user_messages || "User Messages"}
                </Link>
              </li> */}
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
          <h1 className="h4 mb-0">{content?.new_vendor_requests || "New Vendor Requests"}</h1>
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
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
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
                  setCurrentPage(1);
                }}
                style={{ width: '150px' }}
              />
            </Col>
          </Row>
        </div>

        <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <div style={{ height: '440px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#f9f9f9' }}>
            <div style={{ overflowY: 'auto', height: 'calc(100% - 60px)', padding: '1rem' }}>
              {currentVendors.length > 0 ? (
                currentVendors.map((vendor) => (
                  <div
                    key={vendor.vendor_id}
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
                      <h5 style={{ margin: 0 }}>{vendor.personal_name}</h5>
                      <p style={{ margin: 0, color: '#666' }}>{vendor.email}</p>
                    </div>
                    <div>
                      <span
                        className="see-details-button"
                        onClick={() => {
                          handleSeeDetails(vendor.vendor_id);
                        }}
                      >
                        {content?.see_details || "See Details"}
                      </span>
                      <Button variant="primary" size="sm" onClick={() => {
                        setSelectedUserId(vendor.vendor_id);
                        setUserStatus("Pending");
                        setShowEditModal(true);
                      }}>{content?.edit || "Edit"}</Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>{content?.no_vendors_found || "No vendors found."}</p>
              )}
            </div>

            {/* Pagination Controls */}
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
              <Button variant="secondary" onClick={() => {
                if (currentPage > 1) setCurrentPage(currentPage - 1);
              }} disabled={currentPage === 1}>
                {content?.previous || "Previous"}
              </Button>
              <div>
                {content?.page || "Page"} {currentPage} {content?.of || "of"} {totalPages}
              </div>
              <Button variant="secondary" onClick={() => {
                if (currentPage < totalPages) setCurrentPage(currentPage + 1);
              }} disabled={currentPage === totalPages || totalPages === 0}>
                {content?.next || "Next"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit User Status Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{content?.user_status || "User Status"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="userStatus">
              <Form.Label>{content?.select_status || "Select Status"}</Form.Label>
              <Form.Control as="select" value={userStatus} onChange={(e) => setUserStatus(e.target.value)}>
                <option value="Pending">{content?.pending || "Pending"}</option>
                <option value="Verified">{content?.verified || "Verified"}</option>
                <option value="Rejected">{content?.rejected || "Rejected"}</option>
                <option value="Suspended">{content?.suspended || "Suspended"}</option>
              </Form.Control>
            </Form.Group>
          </Form>
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

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{slides.length > 0 ? slides[currentSlide].title : content?.vendor_details || "Vendor Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {slides.length > 0 ? slides[currentSlide].content : <p>{content?.no_details_available || "No details available."}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePreviousSlide} disabled={currentSlide === 0}>
            {content?.previous || "Previous"}
          </Button>
          <Button variant="secondary" onClick={handleNextSlide} disabled={currentSlide === slides.length - 1}>
            {content?.next || "Next"}
          </Button>
          <Button variant="primary" onClick={() => setShowDetailModal(false)}>
            {content?.close || "Close"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Image Modal */}
      <Modal show={showImageModal} onHide={() => setShowImageModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{content?.image_preview || "Image Preview"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={"http://localhost:8000/storage/" + selectedImage} alt="Large View" style={{ width: '100%', height: 'auto' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImageModal(false)}>
            {content?.close || "Close"}
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default NewVendors;