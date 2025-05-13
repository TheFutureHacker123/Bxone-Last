import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser, FaPen, FaTimes, } from "react-icons/fa";
import { Container, Row, Col, Card, ListGroup, Button, Modal, Form, Image, } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../../translations/vendor.json";
import "../style/add-products.css";

function AddProduct() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [productName, setProductName] = useState("");
  const [totalProduct, setTotalProduct] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState({ selectedproductImages: [] });
  const [entries, setEntries] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();
  const totalProducts = 100; // Example total product count
  const totalPages = Math.ceil(totalProducts / entries);
  const [selectedFilesCount, setSelectedFilesCount] = useState(0);
  const [productlist, setProductList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditProductModal, setShowEditProductModal] = useState(false);


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



  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [productData, setProductData] = useState({
    product_name: "",
    total_product: "",
    product_price: "",
    product_desc: "",
    product_img1: null,
    product_img2: null,
    product_img3: null,
    product_img4: null,
    product_img5: null,
  });

  // Load categories
  useEffect(() => {
    fetch("http://localhost:8000/api/vendor/get-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  const [selectedImages, setSelectedImages] = useState([]);
  // Load subcategories when a category selected
  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://localhost:8000/api/get-subcategories-by-category/${selectedCategory}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => setSubcategories(data))
        .catch((err) => console.error("Error loading subcategories:", err));
    } else {
      setSubcategories([]);
    }
  }, [selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProductData((prev) => ({ ...prev, [name]: files[0] }));
  };

  const handleFileChangeEdit = (e) => {
    const { name, files } = e.target;
    const file = files[0]; // Get the first file

    setSelectedImages((prev) => {
      const newImages = [...prev];
      if (name === 'product_img1') newImages[0] = file;
      if (name === 'product_img2') newImages[1] = file;
      if (name === 'product_img3') newImages[2] = file;
      if (name === 'product_img4') newImages[3] = file;
      if (name === 'product_img5') newImages[4] = file;
      return newImages;
    });


  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const vendorInfo = JSON.parse(localStorage.getItem("vendor-info")); // Get vendor info
    const vendor_id = vendorInfo?.vendor_id;

    if (!vendor_id) {
      toast.error(content?.vendor_id_not_found || "Vendor ID not found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("product_name", productData.product_name);
    formData.append("total_product", productData.total_product);
    formData.append("product_price", productData.product_price);
    formData.append("product_desc", productData.product_desc);
    formData.append("vendor_id", vendor_id); // Important
    formData.append("category_id", selectedCategory);
    formData.append("sub_category_id", selectedSubCategory);
    formData.append("product_img1", productData.product_img1);

    // Optional images (can be null)
    if (productData.product_img2) formData.append("product_img2", productData.product_img2);
    if (productData.product_img3) formData.append("product_img3", productData.product_img3);
    if (productData.product_img4) formData.append("product_img4", productData.product_img4);
    if (productData.product_img5) formData.append("product_img5", productData.product_img5);

    try {
      console.log("Submitting product data:", productData);
      console.log("Submitting formData:", formData);

      const res = await fetch("http://localhost:8000/api/vendor/addproduct", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log("Response from server:", result);

      if (result.status === "success") {
        toast.success(content?.product_added_success || "Product added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setProductData({
          product_name: "",
          total_product: "",
          product_price: "",
          product_desc: "",
          product_img1: null,
          product_img2: null,
          product_img3: null,
          product_img4: null,
          product_img5: null,
        });
        setSelectedCategory("");
        setSelectedSubCategory("");
      } else {
        toast.error(content?.product_add_failed || "Failed to add product!");
      }
    } catch (err) {
      toast.error(content?.error_occurred || "An error occurred. Try again.");
    }
  };


  const openEditProductModal = (product) => {
    setSelectedProduct({
      id: product.product_id,
      name: product.product_name,
      totalProduct: product.total_product,
      price: product.product_price,
      description: product.product_desc,
    });
    setSelectedCategory(product.category_id); // Set the selected category
    setSelectedSubCategory(product.sub_category_id); // Set the selected subcategory
    setShowEditProductModal(true);

    // Optionally fetch subcategories if needed
    fetchSubcategories(product.category_id);
  };

  const handleDeleteClick = (productId) => {
    setProductToDelete(productId); // Set the product ID to be deleted
    setShowDeleteModal(true); // Show the confirmation modal
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setProductToDelete(null);
  };

  const handleCloseEditProductModal = () => {
    setShowEditProductModal(false);
    setSelectedProduct(null);
  };
  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };


  const addProduct = (e) => {
    e.preventDefault();
    const newProduct = { category, subCategory, productName, totalProduct, productPrice, productDescription, productImages };
    console.log("Product Added:", newProduct);
    handleCloseAddProductModal();
  };


  const handleCloseAddProductModal = () => {
    setShowAddProductModal(false);
    setCategory("");
    setSubCategory("");
    setProductName("");
    setTotalProduct("");
    setProductPrice("");
    setProductDescription("");
    setProductImages({ selectedproductImages: [] });
  };

  useEffect(() => {
    async function listProductDetail() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("vendor-info"));
        const vendorId = storedUser?.vendor_id;

        let response = await fetch(`http://localhost:8000/api/vendor/productlist`, {
          method: 'POST',
          body: JSON.stringify({
            vendor_id: vendorId
          }),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });

        let result = await response.json();
        setProductList(result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    listProductDetail();
  }, []);

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/vendor/delete-product`, {
        method: 'DELETE',
        body: JSON.stringify({
          product_id: productToDelete,
        }),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });

      if (response.ok) {
        toast.success("Product deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        // Update state to remove the deleted product from the list
        setProductList(productlist.filter(product => product.product_id !== productToDelete));
        handleCloseDeleteModal(); // Close the modal

      } else {
        toast.error("Failed to delete the product.");

      }
    } catch (error) {
      toast.error("Error while deleting product:", error);
    }
  };





  const handleEditProduct = async (e) => {
    e.preventDefault();

    const vendorInfo = JSON.parse(localStorage.getItem("vendor-info"));
    const vendor_id = vendorInfo?.vendor_id;

    if (!vendor_id) {
      alert("Vendor ID not found. Please login again.");
      return;
    }

    const formData = new FormData();
    formData.append("product_id", selectedProduct.id);
    formData.append("product_name", selectedProduct.name);
    formData.append("total_product", selectedProduct.totalProduct);
    formData.append("product_price", selectedProduct.price);
    formData.append("product_desc", selectedProduct.description);
    formData.append("vendor_id", vendor_id);
    formData.append("category_id", selectedCategory);
    formData.append("sub_category_id", selectedSubCategory);

    // Log the selected images
    selectedImages.forEach((image, index) => {
      if (image) {
        console.log(`Image ${index + 1}:`, image.name);
        formData.append(`product_img${index + 1}`, image);
      }
    });

    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const res = await fetch("http://localhost:8000/api/vendor/editproduct", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.status === "success") {
        toast.success("Product updated successfully!");

        // Update local product list
        setProductList((prev) =>
          prev.map((product) =>
            product.product_id === selectedProduct.id ? { ...product, ...selectedProduct } : product
          )
        );

        handleCloseEditProductModal();
      } else {
        toast.error("Failed to update product.");
      }
    } catch (err) {
      console.error("Error while updating product:", err);
      toast.error("An error occurred. Please try again.");
    }
  };




  const fetchSubcategories = (categoryId) => {
    if (categoryId) {
      fetch(`http://localhost:8000/api/get-subcategories-by-category/${categoryId}`, {
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => setSubcategories(data))
        .catch((err) => console.error("Error loading subcategories:", err));
    } else {
      setSubcategories([]);
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
    }, 1000); // Delay the navigation for 3 seconds
  }


  return (
    <div className="dashboard-wrapper">
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <FaBars style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
      </button>

      <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <text className="text-center custom-css flex-grow-1 mt-2 ms-4" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
          {content?.vendor_dashboard || "Vendor Dashboard"}
        </text>
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
                  {content?.new_orders || "New Order"}
                </Link>
              </li>
              <li>
                <Link to="/vendor/shipped" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.shipped || "Shipped"}
                </Link>
              </li>
              <li>
                <Link to="/vendor/refunds" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.refunds || "Refund"}
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
              <li>
                <Link to="/vendor/user-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.user_message || "User Message"}
                </Link>
              </li>
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
          <h1 className="h4 mb-0">{content?.product_lists || "Product Lists"}</h1>
        </div>

        <Container fluid>
          <Row>
            <Col lg={12} className="p-4">
              <Row className="mt-3">
                <Col lg={12} className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    className="add-product-btn"
                    onClick={() => setShowAddProductModal(true)}
                  >
                    {content?.add_product || "Add Product"}
                  </Button>
                </Col>
              </Row>

              <Row className="mt-3">
                {productlist.map((product) => (
                  <Col xs={12} md={6} lg={3} key={product.product_id}>
                    <Card className="shadow-sm rounded-4 p-3 product-card-vendor">
                      <Image
                        src={`http://localhost:8000/storage/${product.product_img1}`}
                        alt={product.product_name}
                        fluid
                        rounded
                        className="mb-3"
                        style={{ height: "150px", objectFit: "contain" }}
                      />
                      <h5 className="fw-bold">{product.product_name}</h5>
                      <p>{content?.total_product || "Total Product:"} {product.total_product}</p>
                      <p>{content?.product_price || "Product Price:"} {product.product_price}</p>
                      <p>{content?.category || "Category:"} {product.category_name}</p>
                      <p>{content?.subcategory || "Subcategory:"} {product.sub_category_name}</p>
                      <div className="d-flex justify-content-between mt-3">
                        <Button variant="warning" size="sm" onClick={() => openEditProductModal(product)}>
                          <FaPen />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteClick(product.product_id)}>
                          <FaTimes />
                        </Button>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>

          <Modal show={showAddProductModal} onHide={() => setShowAddProductModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>{content?.add_new_product || "Add New Product"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="category">
                  <Form.Label>{content?.select_category || "Select Category"}</Form.Label>
                  <Form.Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} required>
                    <option value="">{content?.select_category_prompt || "Select a Category"}</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="subCategory">
                  <Form.Label>{content?.select_subcategory || "Select Subcategory"}</Form.Label>
                  <Form.Select value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} required>
                    <option value="">{content?.select_subcategory_prompt || "Select a Subcategory"}</option>
                    {subcategories.map((sub) => (
                      <option key={sub.sub_category_id} value={sub.sub_category_id}>
                        {sub.sub_category_name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group controlId="productName">
                  <Form.Label>{content?.product_name || "Product Name"}</Form.Label>
                  <Form.Control type="text"
                    name="product_name"
                    value={productData.product_name}
                    onChange={handleInputChange}
                    required placeholder={content?.enter_product_name || "Enter product name"} />
                </Form.Group>
                <Form.Group controlId="totalProduct">
                  <Form.Label>{content?.total_product || "Total Product"}</Form.Label>
                  <Form.Control type="number"
                    name="total_product"
                    value={productData.total_product}
                    onChange={handleInputChange}
                    required placeholder={content?.enter_total_product || "Enter total product"} />
                </Form.Group>
                <Form.Group controlId="productPrice">
                  <Form.Label>{content?.product_price || "Product Price"}</Form.Label>
                  <Form.Control type="number"
                    name="product_price"
                    value={productData.product_price}
                    onChange={handleInputChange}
                    required placeholder={content?.enter_product_price || "Enter product price"} />
                </Form.Group>
                <Form.Group controlId="productDescription">
                  <Form.Label>{content?.product_description || "Product Description"}</Form.Label>
                  <Form.Control as="textarea" name="product_desc"
                    value={productData.product_desc}
                    onChange={handleInputChange}
                    required rows={3} placeholder={content?.enter_product_description || "Enter product description"} />
                </Form.Group>
                <Form.Group controlId="selectedproductImages">
                  <Form.Label>{content?.product_images || "Product Images (Max 5)"}</Form.Label>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="file"
                      name={`product_img${i}`}
                      onChange={handleFileChange}
                      accept="image/*"
                      required={i === 1}
                    />
                  ))}
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowAddProductModal(false)}>{content?.close || "Close"}</Button>
              <Button variant="primary" onClick={handleSubmit}>{content?.save_product || "Save Product"}</Button>
            </Modal.Footer>
          </Modal>
        </Container>






        <Modal show={showEditProductModal} onHide={handleCloseEditProductModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{content?.edit_product || "Edit Product"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="category">
                <Form.Label>{content?.select_category || "Select Category"}</Form.Label>
                <Form.Select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                  }}
                  required
                >
                  <option value="">{content?.select_category_prompt || "Select a Category"}</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.category_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="subCategory">
                <Form.Label>{content?.select_subcategory || "Select Subcategory"}</Form.Label>
                <Form.Select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  required
                >
                  <option value="">{content?.select_subcategory_prompt || "Select a Subcategory"}</option>
                  {subcategories.map((sub) => (
                    <option key={sub.sub_category_id} value={sub.sub_category_id}>
                      {sub.sub_category_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="productName">
                <Form.Label>{content?.product_name || "Product Name"}</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedProduct?.name || ""}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })}
                  placeholder={content?.enter_product_name || "Enter product name"}
                  required
                />
              </Form.Group>

              <Form.Group controlId="totalProduct">
                <Form.Label>{content?.total_product || "Total Product"}</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedProduct?.totalProduct || ""}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, totalProduct: e.target.value })}
                  placeholder={content?.enter_total_product || "Enter total product"}
                  required
                />
              </Form.Group>

              <Form.Group controlId="productPrice">
                <Form.Label>{content?.product_price || "Product Price"}</Form.Label>
                <Form.Control
                  type="number"
                  value={selectedProduct?.price || ""}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, price: e.target.value })}
                  placeholder={content?.enter_product_price || "Enter product price"}
                  required
                />
              </Form.Group>

              <Form.Group controlId="productDescription">
                <Form.Label>{content?.product_description || "Product Description"}</Form.Label>
                <Form.Control
                  as="textarea"
                  value={selectedProduct?.description || ""}
                  onChange={(e) => setSelectedProduct({ ...selectedProduct, description: e.target.value })}
                  rows={3}
                  placeholder={content?.enter_product_description || "Enter product description"}
                  required
                />
              </Form.Group>

              <Form.Group controlId="selectedproductImages">
                <Form.Label>{content?.product_images || "Product Images (Max 5)"}</Form.Label>
                {[1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    type="file"
                    name={`product_img${i}`}
                    onChange={handleFileChangeEdit}
                    accept="image/*"
                  />
                ))}
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditProductModal}>{content?.close || "Close"}</Button>
            <Button variant="primary" onClick={handleEditProduct}>{content?.save_changes || "Save Changes"}</Button>
          </Modal.Footer>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{content?.confirm_deletion || "Confirm Deletion"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{content?.delete_confirmation || "Are you sure you want to delete this product?"}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDeleteModal}>{content?.no || "No"}</Button>
            <Button variant="danger" onClick={handleDeleteProduct}>{content?.yes_delete || "Yes, Delete"}</Button>
          </Modal.Footer>
        </Modal>

        <ToastContainer />
      </div>
    </div>
  );
}

export default AddProduct;


