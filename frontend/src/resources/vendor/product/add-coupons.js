import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaUser, FaPen, FaTimes } from "react-icons/fa";
import { Container, Row, Col, Card, Button, Modal, Form, Image } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
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
                // Fetch coupons again to refresh the list
                fetchCoupons(vendorId);
                toast.success(data.message);
                handleCloseAddCouponModal();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error adding coupon:", error);
            toast.error("Failed to add coupon.");
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
        try {
            const vendorInfo = JSON.parse(localStorage.getItem('vendor-info'));
            const vendorId = vendorInfo?.vendor_id;
            const response = await fetch("http://localhost:8000/api/product/editcoupon", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    vendor_id: vendorId,
                    coupon_id: selectedCoupon.coupon_id,
                    product_id: productId, // Use updated product ID
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
                toast.error(data.message);
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
            <button className="hamburger-btn" onClick={() => setSidebarVisible(!sidebarVisible)}>
                <FaBars />
            </button>

            <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
                <div className="d-flex align-items-center mb-3">
                    <h2 className="text-center custom-css flex-grow-1 mt-2 ms-4">Vendor Dashboard</h2>
                </div>

                <a href="/vendor" className="custom-link">
                    <FaChartLine className="me-2" /> Analytics
                </a>

                <div className="dropdown">
                    <div className="custom-link" onClick={() => handleDropdown("products")}>
                        <FaBox className="me-2" /> Manage Products
                    </div>
                    {openDropdown === "products" && (
                        <ul className="dropdown-menu custom-dropdown-menu">
                            <li><a href="/vendor/add-products" className="dropdown-item-vendor">Add Products</a></li>
                            <li><a href="/vendor/add-coupons" className="dropdown-item-vendor">Add Coupons</a></li>
                        </ul>
                    )}
                </div>

                <div className="dropdown">
                    <div className="custom-link" onClick={() => handleDropdown("profile")}>
                        <FaUser className="me-2" /> Profile
                    </div>
                    {openDropdown === "profile" && (
                        <ul className="dropdown-menu custom-dropdown-menu">
                            <li><a href="/vendor/manage-profile" className="dropdown-item-vendor">Update Password</a></li>
                            <li><a onClick={logout} className="dropdown-item-vendor">Logout</a></li>
                        </ul>
                    )}
                </div>
            </div>

            <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
                <div className="custom-header text-center">
                    <h1 className="h4 mb-0">Coupon Lists</h1>
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
                                        Add Coupon
                                    </Button>
                                </Col>
                            </Row>

                            <Row className="mt-3">
                                {coupons.map((coupon) => (
                                    <Col xs={12} md={6} lg={3} key={coupon.coupon_id}>
                                        <Card className="shadow-sm rounded-4 p-3 product-card-vendor">
                                            <Image
                                                src={`http://localhost:8000/storage/${coupon.product?.product_img1}`}
                                                alt={coupon.product?.product_name || "Product Image"}
                                                fluid
                                                rounded
                                                className="mb-3"
                                                style={{ height: "150px", objectFit: "contain" }}
                                            />
                                            <h5 className="fw-bold">{coupon.product?.product_name || "Unknown Product"}</h5>
                                            <p>Coupon Code: {coupon.coupon_code}</p>
                                            <p>Discount Price: ${coupon.discount_price}</p>
                                            <p>Expiry Date: {coupon.expiry_date}</p>
                                            <p>Status: {coupon.status}</p>
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
                            <Modal.Title>Add New Coupon</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={addCoupon}> {/* Call addCoupon on form submit */}
                                <Form.Group controlId="productName">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={productName}
                                        onChange={handleProductChange}
                                    >
                                        <option value="">Select a product</option>
                                        {products.map((product) => (
                                            <option key={product.product_id} value={product.product_name}>
                                                {product.product_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="couponCode">
                                    <Form.Label>Coupon Code</Form.Label>
                                    <Form.Control type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" />
                                </Form.Group>
                                <Form.Group controlId="discountPrice">
                                    <Form.Label>Discount Price</Form.Label>
                                    <Form.Control type="text" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="Enter discount price" />
                                </Form.Group>
                                <Form.Group controlId="expiryDate">
                                    <Form.Label>Expiry Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="status">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Form.Control>
                                </Form.Group>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleCloseAddCouponModal}>Close</Button>
                                    <Button variant="primary" type="submit">Save Coupon</Button>
                                </Modal.Footer>
                            </Form>
                        </Modal.Body>
                    </Modal>

                    {/* Edit Coupon Modal */}
                    <Modal show={showEditCouponModal} onHide={handleCloseEditCouponModal} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Coupon</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form >
                                <Form.Group controlId="productName">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={productName}
                                        onChange={handleProductChange} // Update handler
                                    >
                                        <option value="">Select a product</option>
                                        {products.map((product) => (
                                            <option key={product.product_id} value={product.product_name}>
                                                {product.product_name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="couponCode">
                                    <Form.Label>Coupon Code</Form.Label>
                                    <Form.Control type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code" />
                                </Form.Group>
                                <Form.Group controlId="discountPrice">
                                    <Form.Label>Discount Price</Form.Label>
                                    <Form.Control type="text" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="Enter discount price" />
                                </Form.Group>
                                <Form.Group controlId="expiryDate">
                                    <Form.Label>Expiry Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={expiryDate}
                                        onChange={(e) => setExpiryDate(e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="status">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseEditCouponModal}>Close</Button>
                            <Button variant="primary" onClick={editCoupon} type="submit">Save Changes</Button>
                        </Modal.Footer>
                    </Modal>
                </Container>
            </div>
        </div>
    );
}

export default AddCoupons;