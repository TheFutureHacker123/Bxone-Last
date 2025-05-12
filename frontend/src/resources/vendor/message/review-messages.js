import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import { Container, Row, Col, Card, ListGroup, Button, Modal } from "react-bootstrap";
import Translation from "../../translations/vendor.json";
import "../style/review-messages.css";

function ReviewMessages() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProducts] = useState([]);
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

  useEffect(() => {
    const vendorInfo = JSON.parse(localStorage.getItem("vendor-info"));
    const vendorId = vendorInfo ? vendorInfo.vendor_id : null;

    if (vendorId) {
      // Fetch products from the API
      fetch('http://localhost:8000/api/vendor/listproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vendor_id: vendorId })
      })
        .then(response => response.json())
        .then(data => {
          setProducts(data);
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const handleShow = (product) => {
    setSelectedProduct(product);
    // Fetch reviews for the selected product
    fetch('http://localhost:8000/api/vendor/listreview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: product.product_id })
    })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
          setSelectedProduct(prev => ({ ...prev, reviews: data.data }));
        } else {
          setSelectedProduct(prev => ({ ...prev, reviews: [] })); // No reviews found
        }
      })
      .catch(error => {
        console.error('Error fetching reviews:', error);
      });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

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
    }, 1000);
  }

  return (
    <div className="dashboard-wrapper">
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <h2 className="text-center custom-css flex-grow-1 mt-2 ms-4">{content?.vendor_dashboard || "Vendor Dashboard"}</h2>
        <Link to="/vendor" className="custom-link">
          <FaChartLine className="me-2" /> {content?.analytics || "Analytics"}
        </Link>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("products")}>
            <FaBox className="me-2" /> {content?.manage_products || "Manage Products"}
          </div>
          {openDropdown === "products" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><Link to="/vendor/add-products" className="dropdown-item-vendor">{content?.add_products || "Add Products"}</Link></li>
              <li><Link to="/vendor/add-coupons" className="dropdown-item-vendor">{content?.add_coupons || "Add Coupons"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("orders")}>
            <FaShoppingCart className="me-2" /> {content?.manage_orders || "Manage Orders"}
          </div>
          {openDropdown === "orders" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><Link to="/vendor/new-orders" className="dropdown-item-vendor">{content?.new_orders || "New Order"}</Link></li>
              <li><Link to="/vendor/shipped" className="dropdown-item-vendor">{content?.shipped || "Shipped"}</Link></li>
              <li><Link to="/vendor/refunds" className="dropdown-item-vendor">{content?.refunds || "Refund"}</Link></li>
              <li><Link to="/vendor/completed" className="dropdown-item-vendor">{content?.completed || "Completed"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("messages")}>
            <FaComments className="me-2" /> {content?.manage_messages || "Manage Messages"}
          </div>
          {openDropdown === "messages" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><Link to="/vendor/user-messages" className="dropdown-item-vendor">{content?.user_message || "User Message"}</Link></li>
              <li><Link to="/vendor/admin-messages" className="dropdown-item-vendor">{content?.admin_message || "Admin Message"}</Link></li>
              <li><Link to="/vendor/review-messages" className="dropdown-item-vendor">{content?.review_message || "Review Message"}</Link></li>
              <li><Link to="/vendor/notifications" className="dropdown-item-vendor">{content?.notifications || "Notification"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("profile")}>
            <FaUser className="me-2" /> {content?.profile || "Profile"}
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><Link to="/vendor/manage-profile" className="dropdown-item-vendor">{content?.update_password || "Updated Password"}</Link></li>
              <li><a onClick={logout} className="dropdown-item-vendor">{content?.logout || "Logout"}</a></li>
            </ul>
          )}
        </div>
      </div>

      <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="custom-header text-center">
          <h1 className="h4 mb-0">Product Review Messages</h1>
        </div>

        <Container fluid>
          <Row>
            <Col lg={10} className="p-4 d-flex justify-content-center align-items-center" style={{ width: '100%' }}>
              <Card style={{ width: '80%', maxWidth: '1200px' }}>
                <Card.Header>
                  <h4 className="text-center">Product Reviews</h4>
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    {products.map(product => (
                      <ListGroup.Item key={product.product_id} className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{product.product_name}</strong>
                        </div>
                        <Button variant="outline-primary" size="sm" onClick={() => handleShow(product)}>
                          View Reviews
                        </Button>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Modal for Viewing Reviews */}
          <Modal show={showModal} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct ? selectedProduct.product_name : ''} Reviews</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ListGroup>
                {selectedProduct && selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                  selectedProduct.reviews.map((review, index) => (
                    <ListGroup.Item key={index} className="d-flex align-items-center">
                      <FaUserCircle className="me-2" size={30} />
                      <div>
                        <strong>{review.user.name}</strong>: {review.review_txt}
                        <br />
                        <small className="text-muted">{new Date(review.created_at).toLocaleString()} | Rating: {Array(review.rate).fill('⭐')}</small>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item className="text-center">
                    No reviews available for this product.
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </div>
    </div>
  );
}

export default ReviewMessages;