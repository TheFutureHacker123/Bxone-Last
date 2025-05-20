import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaUser, FaPen, FaTimes, FaShoppingCart, FaComments } from "react-icons/fa";
import { Container, Row, Col, Card, Button, Modal, Form, Image } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../../translations/vendor.json";

import { Link, useNavigate } from "react-router-dom";
import "../style/add-coupons.css";

function AddCoupons() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [showAddCouponModal, setShowAddCouponModal] = useState(false);
    const [showEditCouponModal, setShowEditCouponModal] = useState(false);
    const [coupons, setCoupons] = useState([]);
    const [products, setProducts] = useState([]);
    const [productName, setProductName] = useState("");
    const [productId, setProductId] = useState(""); // New state for product ID
    const [couponCode, setCouponCode] = useState("");
    const [discountPrice, setDiscountPrice] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [status, setStatus] = useState("active");
    const [selectedCoupon, setSelectedCoupon] = useState(null);
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
        const vendorInfo = JSON.parse(localStorage.getItem('vendor-info'));
        const vendorId = vendorInfo?.vendor_id;

        if (vendorId) {
            fetchCoupons(vendorId);
            fetchProducts(vendorId);
        }
    }, []);

    const fetchCoupons = async (vendorId) => {
        try {
            const response = await fetch("http://localhost:8000/api/product/listcoupon", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ vendor_id: vendorId })
            });
            const data = await response.json();
            if (response.ok) {
                setCoupons(data.coupons);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
            toast.error("Failed to fetch coupons.");
        }
    };

    const fetchProducts = async (vendorId) => {
        try {
            const response = await fetch("http://localhost:8000/api/product/onevendorproducts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ vendor_id: vendorId })
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            toast.error("Failed to fetch products.");
        }
    };

    const handleCloseAddCouponModal = () => {
        setShowAddCouponModal(false);
        resetForm();
    };

    const handleCloseEditCouponModal = () => {
        setShowEditCouponModal(false);
        resetForm();
    };

    const resetForm = () => {
        setProductName("");
        setProductId(""); // Reset product ID
        setCouponCode("");
        setDiscountPrice("");
        setExpiryDate("");
        setStatus("active");
        setSelectedCoupon(null);
    };

    const addCoupon = async (e) => {
  e.preventDefault();
  const vendorInfo = JSON.parse(localStorage.getItem('vendor-info'));
  const vendorId = vendorInfo?.vendor_id;

  // Validations
  if (!productName ) {
    toast.error("Select product name.");
    return;
  }
if (!couponCode || !/^[A-Za-z0-9]+$/.test(couponCode)) {
  toast.error("Enter a valid coupon code (letters and numbers only).");
  return;
}

  if (!discountPrice || isNaN(discountPrice) || Number(discountPrice) <= 0) {
    toast.error("Discount price must be a positive number.");
    return;
  }

  if (!expiryDate) {
    toast.error("Please select an expiry date.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/product/addcoupon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        product_id: productId,
        vendor_id: vendorId,
        product_name: productName,
        coupon_code: couponCode,
        discount_price: discountPrice,
        expiry_date: expiryDate,
        status: status
      })
    });

    const data = await response.json();
    if (response.ok) {
      fetchCoupons(vendorId); // Refresh list
      toast.success(data.message);
      handleCloseAddCouponModal();
    } else {
      toast.error(data.message || "Failed to add coupon.");
    }
  } catch (error) {
    console.error("Error adding coupon:", error);
    toast.error("An error occurred while adding the coupon.");
  }
};


    const handleDropdown = (menu) => {
        setOpenDropdown(openDropdown === menu ? null : menu);
    };

    const handleEditClick = (coupon) => {
        setSelectedCoupon(coupon);
        setProductName(coupon.product_name || "");
        setProductId(coupon.product_id || ""); // Set product ID
        setCouponCode(coupon.coupon_code || "");
        setDiscountPrice(coupon.discount_price || "");
        setExpiryDate(coupon.expiry_date || "");
        setStatus(coupon.status || "active");
        setShowEditCouponModal(true);
    };

    const handleProductChange = (e) => {
        const selectedProduct = products.find(product => product.product_name === e.target.value);
        setProductName(e.target.value);
        setProductId(selectedProduct ? selectedProduct.product_id : ""); // Update product ID based on selection
    };

    const editCoupon = async (e) => {
  e.preventDefault();

  if (!selectedCoupon) {
    toast.error("Selected coupon is invalid.");
    return;
  }

  const vendorInfo = JSON.parse(localStorage.getItem('vendor-info'));
  const vendorId = vendorInfo?.vendor_id;

  // Validations
  if (!productName) {
    toast.error("Select product name.");
    return;
  }

  if (!couponCode || !/^[A-Za-z0-9]+$/.test(couponCode)) {
    toast.error("Enter a valid coupon code (letters and numbers only).");
    return;
  }

  if (!discountPrice || isNaN(discountPrice) || Number(discountPrice) <= 0) {
    toast.error("Discount price must be a positive number.");
    return;
  }

  if (!expiryDate) {
    toast.error("Please select an expiry date.");
    return;
  }

  try {
    const response = await fetch("http://localhost:8000/api/product/editcoupon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        vendor_id: vendorId,
        coupon_id: selectedCoupon.coupon_id,
        product_id: productId,
        product_name: productName,
        coupon_code: couponCode,
        discount_price: discountPrice,
        expiry_date: expiryDate,
        status: status
      })
    });

    const data = await response.json();
    if (response.ok) {
      fetchCoupons(vendorId); // Refresh the coupons list after a successful update
      toast.success(data.message);
      handleCloseEditCouponModal();
    } else {
      toast.error(data.message || "Failed to edit coupon.");
    }
  } catch (error) {
    console.error("Error editing coupon:", error);
    toast.error("Failed to edit coupon.");
  }
};


    const deleteCoupon = async (couponId) => {
        try {
            const response = await fetch("http://localhost:8000/api/product/deletecoupon", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ coupon_id: couponId })
            });

            const data = await response.json();

            if (response.ok) {
                setCoupons(coupons.filter(coupon => coupon.coupon_id !== couponId));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
            toast.error("Failed to delete coupon.");
        }
    };

   function logout() {
       localStorage.clear();
       toast.success(content?.logout_success || "Logout Successful!", {
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
            <button className="hamburger-btn" onClick={() => setSidebarVisible(!sidebarVisible)}>
                <FaBars style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            </button>

            <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
                    <div className="d-flex align-items-center ">
                      <span className="text-center custom-css flex-grow-1 mt-1 ms-3" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.vendor_dashboard || "Vendor Dashboard"}
                      </span>
                    </div>
            
                    <Link to="/vendor" className="custom-link">
                      <FaChartLine className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                      <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.analytics || "Analytics"}
                      </span>
                    </Link>
            
                    <div className="dropdown">
                      <div className="custom-link" onClick={() => handleDropdown("products")}>
                        <FaBox className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.manage_products || "Manage Products"}
                        </span>
                      </div>
                      {openDropdown === "products" && (
                        <ul className="dropdown-menu custom-dropdown-menu">
                          <li>
                            <Link to="/vendor/add-products" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.add_products || "Add Products"}
                            </Link>
                          </li>
                          <li>
                            <Link to="/vendor/add-coupons" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.add_coupons || "Add Coupons"}
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
            
                    <div className="dropdown">
                      <div className="custom-link" onClick={() => handleDropdown("orders")}>
                        <FaShoppingCart className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.manage_orders || "Manage Orders"}
                        </span>
                      </div>
                      {openDropdown === "orders" && (
                        <ul className="dropdown-menu custom-dropdown-menu">
                          <li>
                            <Link to="/vendor/new-orders" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.new_order || "New Order"}
                            </Link>
                          </li>
                          <li>
                            <Link to="/vendor/shipped" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.shipped || "Shipped"}
                            </Link>
                          </li>
                          <li>
                            <Link to="/vendor/refunds" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.refund || "Refund"}
                            </Link>
                          </li>
                          <li>
                            <Link to="/vendor/completed" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.completed || "Completed"}
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
            
                    <div className="dropdown">
                      <div className="custom-link" onClick={() => handleDropdown("messages")}>
                        <FaComments className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.manage_messages || "Manage Messages"}
                        </span>
                      </div>
                      {openDropdown === "messages" && (
                        <ul className="dropdown-menu custom-dropdown-menu">
                          {/* <li>
                            <Link to="/vendor/user-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.user_message || "User Message"}
                            </Link>
                          </li> */}
                          <li>
                            <Link to="/vendor/admin-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.admin_message || "Admin Message"}
                            </Link>
                          </li>
                          <li>
                            <Link to="/vendor/review-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.review_message || "Review Message"}
                            </Link>
                          </li>
                          <li>
                            <Link to="/vendor/notifications" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.notifications || "Notification"}
                            </Link>
                          </li>
                        </ul>
                      )}
                    </div>
            
                    <div className="dropdown">
                      <div className="custom-link" onClick={() => handleDropdown("profile")}>
                        <FaUser className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                        <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                          {content?.profile || "Profile"}
                        </span>
                      </div>
                      {openDropdown === "profile" && (
                        <ul className="dropdown-menu custom-dropdown-menu">
                          <li>
                            <Link to="/vendor/setting" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.settings || "Settings"}
                            </Link>
                          </li>
                          <li>
                            <Link to="/vendor/manage-profile" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.update_password || "Updated Password"}
                            </Link>
                          </li>
                          <li>
                            <a onClick={logout} className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                              {content?.logout || "Logout"}
                            </a>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>

            <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
                <div className="custom-header text-center">
                    <h1 className="h4 mb-0">{content?.coupon_lists || "Coupon Lists"}</h1>
                </div>
                <Container fluid>
                    <Row>
                        <Col lg={12} className="p-4">
                            <Row className="mt-3">
                                <Col lg={12} className="d-flex justify-content-end">
                                    <Button
                                        variant="primary"
                                        className="add-product-btn"
                                        onClick={() => setShowAddCouponModal(true)}
                                    >
                                        {content?.add_coupon || "Add Coupon"}
                                    </Button>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                {coupons.map((coupon) => (
                                    <Col xs={12} md={6} lg={3} key={coupon.coupon_id}>
                                        <Card className="shadow-sm rounded-4 p-3 product-card-vendor">
                                            <Image
                                                src={`http://localhost:8000/storage/${coupon.product?.product_img1}`}
                                                alt={coupon.product?.product_name || content?.unknown_product || "Product Image"}
                                                fluid
                                                rounded
                                                className="mb-3"
                                                style={{ height: "150px", objectFit: "contain" }}
                                            />
                                            <h5 className="fw-bold">{coupon.product?.product_name || content?.unknown_product || "Unknown Product"}</h5>
                                            <p>{content?.coupon_code || "Coupon Code:"} {coupon.coupon_code}</p>
                                            <p>{content?.discount_price || "Discount Price:"} ${coupon.discount_price}</p>
                                            <p>{content?.expiry_date || "Expiry Date:"} {coupon.expiry_date}</p>
                                            <p>{content?.status || "Status:"} {coupon.status}</p>
                                            <div className="d-flex justify-content-between mt-3">
                                                <Button variant="warning" size="sm" onClick={() => handleEditClick(coupon)}>
                                                    <FaPen />
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => deleteCoupon(coupon.coupon_id)}>
                                                    <FaTimes />
                                                </Button>
                                            </div>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>

                    {/* Add Coupon Modal */}
                    <Modal show={showAddCouponModal} onHide={handleCloseAddCouponModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>{content?.add_new_coupon || "Add New Coupon"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={addCoupon}>
                                <Form.Group controlId="productName">
                                    <Form.Label>{content?.product_name || "Product Name"}</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={productName}
                                        onChange={handleProductChange}
                                    >
                                        <option value="">{content?.select_product || "Select a product"}</option>
                                        {products.map((product) => (
                                            <option key={product.product_id} value={product.product_name}>
                                                {product.product_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="couponCode">
  <Form.Label>{content?.coupon_code || "Coupon Code"}</Form.Label>
  <Form.Control
    type="text"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value.toUpperCase())} // force uppercase
    placeholder={content?.enter_coupon_code || "Enter coupon code"}
  />
</Form.Group>

<Form.Group controlId="discountPrice">
  <Form.Label>{content?.discount_price || "Discount Price"}</Form.Label>
  <Form.Control
    type="number"
    min="1" // restrict value in UI
    value={discountPrice}
    onChange={(e) => {
      const val = Number(e.target.value);
      if (val >= 1 || e.target.value === "") {
        setDiscountPrice(e.target.value);
      }
    }}
    placeholder={content?.enter_discount_price || "Enter discount price"}
  />
</Form.Group>

                               <Form.Group controlId="expiryDate">
  <Form.Label>{content?.expiry_date || "Expiry Date"}</Form.Label>
  <Form.Control
    type="date"
    value={expiryDate}
    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Set min to tomorrow
    onChange={(e) => setExpiryDate(e.target.value)}
  />
</Form.Group>

                                <Form.Group controlId="status">
                                    <Form.Label>{content?.status || "Status"}</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="active">{content?.active || "Active"}</option>
                                        <option value="inactive">{content?.inactive || "Inactive"}</option>
                                    </Form.Control>
                                </Form.Group>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseAddCouponModal}>{content?.close || "Close"}</Button>
                                    <Button variant="primary" type="submit">{content?.save_coupon || "Save Coupon"}</Button>
                                </Modal.Footer>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {/* Edit Coupon Modal */}
                    <Modal show={showEditCouponModal} onHide={handleCloseEditCouponModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>{content?.edit_coupon || "Edit Coupon"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="productName">
                                    <Form.Label>{content?.product_name || "Product Name"}</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={productName}
                                        onChange={handleProductChange}
                                    >
                                        <option value="">{content?.select_product || "Select a product"}</option>
                                        {products.map((product) => (
                                            <option key={product.product_id} value={product.product_name}>
                                                {product.product_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="couponCode">
  <Form.Label>{content?.coupon_code || "Coupon Code"}</Form.Label>
  <Form.Control
    type="text"
    value={couponCode}
    onChange={(e) => setCouponCode(e.target.value.toUpperCase())} // Enforce uppercase
    placeholder={content?.enter_coupon_code || "Enter coupon code"}
  />
</Form.Group>

<Form.Group controlId="discountPrice">
  <Form.Label>{content?.discount_price || "Discount Price"}</Form.Label>
  <Form.Control
    type="number"
    min="1" // Prevent inputting 0 or negative numbers
    value={discountPrice}
    onChange={(e) => {
      const val = Number(e.target.value);
      if (val >= 1 || e.target.value === "") {
        setDiscountPrice(e.target.value);
      }
    }}
    placeholder={content?.enter_discount_price || "Enter discount price"}
  />
</Form.Group>

                               <Form.Group controlId="expiryDate">
  <Form.Label>{content?.expiry_date || "Expiry Date"}</Form.Label>
  <Form.Control
    type="date"
    value={expiryDate}
    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]} // Only allow future dates
    onChange={(e) => setExpiryDate(e.target.value)}
  />
</Form.Group>

                                <Form.Group controlId="status">
                                    <Form.Label>{content?.status || "Status"}</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="active">{content?.active || "Active"}</option>
                                        <option value="inactive">{content?.inactive || "Inactive"}</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEditCouponModal}>{content?.close || "Close"}</Button>
                            <Button variant="primary" onClick={editCoupon} type="submit">{content?.save_changes || "Save Changes"}</Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>
            
                    <ToastContainer />
        </div>
    );
}

export default AddCoupons;