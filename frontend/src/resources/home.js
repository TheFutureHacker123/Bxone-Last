import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Translation from "./translations/lang.json";
import "react-toastify/dist/ReactToastify.css";
import "./user/styles/home.css";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEye } from "react-icons/fa";

function Home() {
  const [isNavOpen, setNavOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [productsToDisplay, setProductsToDisplay] = useState([]);
  const navigate = useNavigate();
  const [searchproduct, setSearchProduct] = useState("");
  const [searchresult, setSearchResult] = useState([]);
  const [categories, setCategories] = useState([]);
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [bestSellingVendors, setBestSellingVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [quickViewImage, setQuickViewImage] = useState(null);
  const [email, setEmail] = useState("");
  const [subscriptionMessage, setSubscriptionMessage] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState(""); // 'success' or 'error'

  // NEW: State for newly arrived products carousel
  const [newArrivals, setNewArrivals] = useState([]);
  const [currentNewArrival, setCurrentNewArrival] = useState(0);

  const defaultFontSize = "medium";
  const defaultFontColor = "#000000";
  const defaultLanguage = "english";

  const [fontSize, setFontSize] = useState(
    () => localStorage.getItem("fontSize") || defaultFontSize
  );
  const [fontColor, setFontColor] = useState(
    () => localStorage.getItem("fontColor") || defaultFontColor
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || defaultLanguage
  );
  const [content, setContent] = useState(Translation[language]);

  useEffect(() => {
    document.documentElement.style.setProperty("--font-size", fontSize);
    document.documentElement.style.setProperty("--font-color", fontColor);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("fontColor", fontColor);
    localStorage.setItem("language", language);
    setContent(Translation[language]);
  }, [fontSize, fontColor, language]);

  useEffect(() => {
    const user = localStorage.getItem("user-info");
    console.log("User Info:", user);
    if (user) {
      setLoggedInUser(JSON.parse(user));
    } else {
      setLoggedInUser(null);
    }
  }, []);

  const userInfo = localStorage.getItem("user-info");
  let userName = "User"; // fallback

  if (userInfo) {
    try {
      const userObj = JSON.parse(userInfo);
      if (userObj.name) userName = userObj.name;
    } catch (error) {
      console.error("Error parsing user-info from localStorage:", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          topProductsResponse,
          featuredVendorsResponse,
          bestSellingVendorsResponse,
          categoriesResponse,
          newArrivalsResponse,
        ] = await Promise.all([
          fetch("http://localhost:8000/api/topproduct", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }),
          fetch("http://localhost:8000/api/featured-vendors"),
          fetch("http://localhost:8000/api/best-selling-vendors"),
          fetch("http://localhost:8000/api/vendor/get-categories"),
          fetch("http://localhost:8000/api/new-arrivals"),
        ]);

        const responses = [
          topProductsResponse,
          featuredVendorsResponse,
          bestSellingVendorsResponse,
          categoriesResponse,
          newArrivalsResponse,
        ];

        // Check for HTTP errors
        responses.forEach((response, index) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        });

        const [
          topProductsData,
          featuredVendorsData,
          bestSellingVendorsData,
          categoriesData,
          newArrivalsData,
        ] = await Promise.all(responses.map((response) => response.json()));

        setSearchResult(Array.isArray(topProductsData) ? topProductsData : []);
        setProductsToDisplay(
          Array.isArray(topProductsData) ? topProductsData : []
        );
        setFeaturedVendors(featuredVendorsData.featured_vendors);
        setBestSellingVendors(bestSellingVendorsData.best_selling_vendors);
        setCategories(categoriesData);
        setNewArrivals(Array.isArray(newArrivalsData) ? newArrivalsData : []);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching data:", err);
        toast.error("Failed to load homepage data.");
        setSearchResult([]);
        setProductsToDisplay([]);
        setFeaturedVendors([]);
        setBestSellingVendors([]);
        setCategories([]);
        setNewArrivals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // NEW: Carousel auto-scroll logic for new arrivals
  useEffect(() => {
    if (newArrivals.length === 0) return;
    const interval = setInterval(() => {
      setCurrentNewArrival((prev) =>
        prev === newArrivals.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [newArrivals]);

  useEffect(() => {
    const safeSearchResult = Array.isArray(searchresult) ? searchresult : [];
    let filtered = [...safeSearchResult];
    if (selectedCategory !== "") {
      filtered = filtered.filter(
        (p) => p.category_id === parseInt(selectedCategory)
      );
    }
    if (sortOption === "priceLowToHigh") {
      filtered.sort((a, b) => a.product_price - b.product_price);
    } else if (sortOption === "priceHighToLow") {
      filtered.sort((a, b) => b.product_price - a.product_price);
    }
    setProductsToDisplay(filtered);
    console.log("Filtered Products to Display:", filtered);
  }, [searchresult, selectedCategory, sortOption]);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
    document.querySelector(".navbar").classList.toggle("open", !isNavOpen);
  };

  const addToCart = async (productid) => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      let items = { product_id: productid, user_id: parsedUser.user_id };

      try {
        let response = await fetch("http://localhost:8000/api/addtocart", {
          method: "POST",
          body: JSON.stringify(items),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        let result = await response.json();

        if (result.success) {
          toast.success("Product added to cart!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error(result.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error("An error occurred. Please try again later.");
      }
    } else {
      navigate("/login");
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const addToWishlist = async (productid) => {
    const storedUser = localStorage.getItem("user-info");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + JSON.parse(storedUser).token,
        },
        body: JSON.stringify({
          product_id: productid,
          user_id: JSON.parse(storedUser).user_id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Product added to wishlist!");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  async function search(e) {
    e.preventDefault();
    let items = { searchproduct };
    console.warn("Fuck", items);
    try {
      let response = await fetch("http://localhost:8000/api/search", {
        method: "POST",
        body: JSON.stringify(items),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      let result = await response.json();
      console.log("Search Result:", result);
      const products = Array.isArray(result) ? result : [];
      setSearchResult(products);
      setProductsToDisplay(products); // Update displayed products on search
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed.");
      setSearchResult([]);
      setProductsToDisplay([]);
    }
  }

  function logout() {
    localStorage.clear();
    toast.success("Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  const handleRateProduct = async (rating) => {
    setUserRating(rating);
    toast.success(`You rated this product ${rating} stars!`);
    // TODO: Send rating to backend here
  };

  const handleSubscription = async (event) => {
    event.preventDefault();
    if (!email) {
      setSubscriptionMessage("Please enter your email.");
      setSubscriptionStatus("error");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscriptionMessage(data.message || "Successfully subscribed!");
        setSubscriptionStatus("success");
        setEmail("");
      } else {
        setSubscriptionMessage(data.message || "Failed to subscribe.");
        setSubscriptionStatus("error");
      }
    } catch (error) {
      setSubscriptionMessage("An error occurred while subscribing.");
      setSubscriptionStatus("error");
    }
  };

  const styles = {
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f5f7fa",
    },
    spinner: {
      border: "8px solid #f3f3f3",
      borderTop: "8px solid #3498db",
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      marginTop: "20px",
      fontSize: "18px",
      color: "#555",
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div className="spinner"></div>

        <p style={styles.loadingText}>
          {" "}
          {content?.loading || "Please wait, loading..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        {content?.error || "Error"}: {error}
      </div>
    );
  }

  return (
    <div>
      {/* Fixed Top Bar */}
      <div className="fixed-top bg-light py-2">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 text-start d-flex align-items-center">
              {!loggedInUser && (
                <Link
                  to="/vendor/login"
                  className="text-dark text-decoration-none me-3"
                >
                  <i className="bi bi-shop me-1"></i>{" "}
                  {content?.login_as_vendor || "Vendor Log In"}
                </Link>
              )}
            </div>
            <div className="col-md-6 text-end d-flex align-items-center justify-content-end">
              {/* Search Bar, Category Dropdown, and Search Button */}

              {/* Notification Icon for logged in users */}
              {localStorage.getItem("user-info") && (
                <div className="d-inline-block me-3">
                  <Link
                    to="/notification"
                    className="text-decoration-none"
                    style={{
                      color: fontColor === "#000000" ? "#212529" : fontColor,
                    }}
                  >
                    <i className="bi bi-bell fs-5"></i>
                  </Link>
                </div>
              )}
              {localStorage.getItem("user-info") ? (
                <>
                  <div className="d-inline-block me-3">
                    <Link
                      to="/wishlist"
                      className="text-decoration-none"
                      style={{
                        color: fontColor === "#000000" ? "#212529" : fontColor,
                      }}
                    >
                      {content?.wishlist || "Wishlist"}{" "}
                      <i className="bi bi-heart ms-1 fs-sm"></i>
                    </Link>
                  </div>
                  <div className="d-inline-block me-3">
                    <Link
                      to="/cart"
                      className="text-decoration-none"
                      style={{
                        color: fontColor === "#000000" ? "#212529" : fontColor,
                      }}
                    >
                      {content?.carts || "Cart"}{" "}
                      <i className="bi bi-bag ms-1 fs-sm"></i>
                    </Link>
                  </div>
                </>
              ) : null}
              <div className="d-inline-block me-3">
                {/* <select
                  className="form-select form-select-sm border-0 bg-light"
                  style={{ width: "auto" }}
                >
                  <option value="usd">USD $</option>
                  <option value="etb">ETB</option>
                </select> */}

                {/* <Form.Group controlId="font-color">
          <Form.Control
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
          />
        </Form.Group> */}
              </div>
              <div className="d-inline-block">
                <select
                  className="form-select form-select-sm border-0 bg-light"
                  style={{ width: "auto" }}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="english">English</option>
                  <option value="amharic">Amharic</option>
                  <option value="afan_oromo">Oromo</option>
                  <option value="ethiopian_somali">Somali</option>
                  <option value="tigrinya">Tigrinya</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <nav
          className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top"
          style={{ marginTop: "5px" }}
        >
          <div className="container-fluid">
            <Link className="navbar-brand text-warning" to="/">
              Habesha Mart
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleNav}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className={`${isNavOpen ? "" : "collapse"} navbar-collapse`}
              id="navbarNav"
            >
              <ul className="navbar-nav mx-auto">
                <li className="nav-item">
                  <div className="enhanced-search-bar">
                    <select className="enhanced-select">
                      <option>
                        {content?.all_category || "All Categories"}
                      </option>
                      {categories.map((cat) => (
                        <option
                          key={cat.category_category_id}
                          value={cat.category_id}
                        >
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={searchproduct}
                      onChange={(e) => setSearchProduct(e.target.value)}
                      className="enhanced-input"
                      placeholder={
                        content?.search_products || "Search products..."
                      }
                    />
                    <button className="enhanced-search-button" onClick={search}>
                      {content?.search || "Search"}
                    </button>
                  </div>
                </li>
              </ul>

              <ul className="navbar-nav">
                {localStorage.getItem("user-info") ? (
                  <>
                    <li className="nav-item dropdown custom-profile">
                      <li className="nav-item custom-profile text-center text-lg-start w-100 w-lg-auto">
                        <a
                          className="nav-link dropdown-toggle d-flex align-items-center justify-content-center justify-content-lg-start"
                          role="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="bi bi-person-circle fs-4 me-2"></i>
                          <span className="profile-name">
                            {content?.hi || "Hi"}, {userName}
                          </span>
                        </a>
                      </li>

                      <ul className="dropdown-menu dropdown-menu-end shadow-sm rounded">
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            {content?.profile || "Profile"}
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/ordereditems">
                            {content?.ordereditems || "Orders"}
                          </Link>
                        </li>
                        <li>
                          <Link className="dropdown-item" to="/settings">
                            {content?.settings || "Settings"}
                          </Link>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <Link
                            className="dropdown-item text-danger"
                            to="#"
                            onClick={logout}
                          >
                            {content?.logout || "Logout"}
                          </Link>
                        </li>
                      </ul>
                    </li>
                  </>
                ) : (
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      {content?.login_register || "Log In / Register"}
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* Navigation Bar */}
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top"
        style={{ marginTop: "50px" }}
      >
        <div className="container-fluid">
          <Link className="navbar-brand text-warning" to="/">
            Habesha Marst
          </Link>
          <button className="navbar-toggler" type="button" onClick={toggleNav}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`${isNavOpen ? "" : "collapse"} navbar-collapse`}
            id="navbarNav"
          >
            {/* <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <div
                  className="search-bar d-flex align-items-center mt-2"
                  style={{ flexGrow: 1, padding: "10px" }} gap-4
                >
                  <select
                    className="form-select form-select-sm me-2"
                    style={{
                      maxWidth: "100px",
                      paddingLeft: "8px",
                    }} 
                  >
                    <option>{content?.all_category || "All Categories"}</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.category_category_id}
                        value={cat.category_id}
                      >
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={searchproduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="form-control flex-grow-1 me-2"
                    placeholder={
                      content?.search_products || "Search products..."
                    }
                    style={{
                      paddingLeft: "8px",
                    }} 
                  />
                  <button
                    className="btn btn-warning"
                    onClick={search}
                    style={{ padding: "8px 12px" }}
                  >
                    {content?.search || "Search"}
                  </button>
                </div>
              </li>
            </ul> */}

            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <div className="enhanced-search-bar">
                  <select className="enhanced-select">
                    <option>{content?.all_category || "All Categories"}</option>
                    {categories.map((cat) => (
                      <option
                        key={cat.category_category_id}
                        value={cat.category_id}
                      >
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={searchproduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="enhanced-input"
                    placeholder={
                      content?.search_products || "Search products..."
                    }
                  />
                  <button className="enhanced-search-button" onClick={search}>
                    {content?.search || "Search"}
                  </button>
                </div>
              </li>
            </ul>

            <ul className="navbar-nav">
              {localStorage.getItem("user-info") ? (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person-circle fs-5"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/ordereditems">
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/settings">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link className="dropdown-item" to="#" onClick={logout}>
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    {content?.login_register || "Log In / Register"}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* NEWLY ARRIVED PRODUCTS CAROUSEL */}
      {newArrivals.length > 0 && (
        <div className="new-arrivals-carousel mb-4 fade-in-section">
          <h2 className="section-heading">
            {content?.newly_arrived_products || "Newly Arrived Products"}
          </h2>
          <div className="carousel-container">
            {newArrivals.map((product, idx) => (
              <div
                key={product.product_id}
                className={`carousel-slide${
                  idx === currentNewArrival ? " active" : ""
                }`}
              >
                <div className="card mx-auto carousel-card">
                  <img
                    src={`http://localhost:8000/storage/${product.product_img1}`}
                    alt={product.product_name}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "cover" }}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title">{product.product_name}</h5>
                    <p className="card-text text-success fw-bold">
                      {product.product_price} Birr
                    </p>
                    <Link
                      to={`/productdetails/${product.product_id}`}
                      className="btn btn-primary btn-sm"
                      style={{
                        color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                      }}
                    >
                      {content?.view_product || "View Product"}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {/* Carousel Controls */}
            <button
              className="carousel-arrow left"
              onClick={() =>
                setCurrentNewArrival(
                  currentNewArrival === 0
                    ? newArrivals.length - 1
                    : currentNewArrival - 1
                )
              }
              aria-label="Previous"
            >
              &#8592;
            </button>
            <button
              className="carousel-arrow right"
              onClick={() =>
                setCurrentNewArrival(
                  currentNewArrival === newArrivals.length - 1
                    ? 0
                    : currentNewArrival + 1
                )
              }
              aria-label="Next"
            >
              &#8594;
            </button>
            {/* Indicators */}
            <div className="carousel-indicators">
              {newArrivals.map((_, idx) => (
                <span
                  key={idx}
                  className={`indicator-dot${
                    idx === currentNewArrival ? " active" : ""
                  }`}
                  onClick={() => setCurrentNewArrival(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className="toppush container-fluid mt-5 main-content-body"
        style={{ paddingTop: "60px" }}
      >
        <div className="bg-warning text-center p-4 rounded mb-4 fade-in-section">
          <h1 className="section-heading">
            {content?.welcome || "Welcome to Your E-Commerce Dashboard"}
          </h1>
        </div>

        {/* Featured Vendors Section */}
        {featuredVendors.length > 0 && (
          <div className="mb-4 fade-in-section">
            <h2 className="section-heading">
              {content?.featured_vendors || "Featured Vendors"}
            </h2>
            <div className="row g-4 justify-content-center">
              {featuredVendors.map((vendor) => (
                <div
                  className="col-lg-2 col-md-3 col-sm-4 col-6 d-flex align-items-stretch"
                  key={vendor.vendor_id}
                >
                  <div className="card vendor-card h-100 text-center p-3 w-100">
                    {vendor.logo && (
                      <img
                        src={`http://localhost:8000/storage/${vendor.logo}`}
                        alt={vendor.store_name}
                        className="card-img-top rounded-circle mx-auto"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div className="card-body">
                      <h6 className="card-title" style={{ color: "black" }}>
                        {vendor.store_name}
                      </h6>
                      {vendor.personalInfo &&
                        vendor.personalInfo.personal_name && (
                          <p className="card-text small text-muted">
                            {vendor.personalInfo.personal_name}
                          </p>
                        )}
                      <Link
                        to={`/vendor/${vendor.vendor_id}`}
                        className="btn btn-outline-info btn-sm"
                      >
                        {content?.visit_store || "Visit Store"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Selling Vendors Section */}
        {bestSellingVendors.length > 0 && (
          <div className="mb-4 fade-in-section">
            <h2 className="section-heading">
              {content?.best_selling_vendors || "Best Selling Vendors"}
            </h2>
            <div className="row g-4 justify-content-center">
              {bestSellingVendors.map((vendor) => (
                <div
                  className="col-lg-2 col-md-3 col-sm-4 col-6 d-flex align-items-stretch"
                  key={vendor.vendor_id}
                >
                  <div className="card vendor-card h-100 text-center p-3 w-100">
                    {vendor.logo && (
                      <img
                        src={`http://localhost:8000/storage/${vendor.logo}`}
                        alt={vendor.store_name}
                        className="card-img-top rounded-circle mx-auto"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div className="card-body">
                      <h6 className="card-title" style={{ color: "black" }}>
                        {vendor.store_name}
                      </h6>
                      {vendor.personalInfo &&
                        vendor.personalInfo.personal_name && (
                          <p className="card-text small text-muted">
                            {vendor.personalInfo.personal_name}
                          </p>
                        )}
                      <span
                        className="card-text small "
                        style={{
                          color:
                            fontColor === "#000000" ? "#FFFFFF" : fontColor,
                        }}
                      >
                        {content?.total_orders || "Orders"}:{" "}
                        {vendor.total_orders}
                      </span>
                      <Link
                        to={`/vendor/${vendor.vendor_id}`}
                        className="btn btn-outline-success btn-sm"
                      >
                        {content?.visit_store || "Visit Store"}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category and Sort Dropdowns */}
        {Array.isArray(productsToDisplay) && productsToDisplay.length > 0 && (
          <div className="d-flex flex-wrap justify-content-center align-items-center mb-3 fade-in-section">
            <div className="me-3 mb-2">
              <label htmlFor="categorySelect" className="me-2">
                {content?.category || "Category"}:
              </label>
              <select
                id="categorySelect"
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="form-select form-select-sm"
              >
                <option value="">{content?.all || "All"}</option>
                {categories.map((cat) => (
                  <option
                    key={cat.category_category_id}
                    value={cat.category_id}
                  >
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label htmlFor="sortSelect" className="me-2">
                {content?.sort_by || "Sort By"}:
              </label>
              <select
                id="sortSelect"
                value={sortOption}
                onChange={handleSortChange}
                className="form-select form-select-sm"
              >
                <option value="default">{content?.default || "Default"}</option>
                <option value="priceLowToHigh">
                  {content?.price_low_to_high || "Price: Low to High"}
                </option>
                <option value="priceHighToLow">
                  {content?.price_high_to_low || "Price: High to Low"}
                </option>
              </select>
            </div>
          </div>
        )}

        {/* Product Overview */}
        {Array.isArray(productsToDisplay) && productsToDisplay.length > 0 ? (
          <h2 className="section-heading fade-in-section">
            {content?.product_overview || "Product Overview"}
          </h2>
        ) : (
          <h2 className="section-heading fade-in-section">
            {content?.there_is_no || "There is no "}{" "}
            <strong>{searchproduct}</strong> {content?.product || "product"}
          </h2>
        )}

        <div className="row g-4 justify-content-center fade-in-section">
          {Array.isArray(productsToDisplay) &&
            productsToDisplay.map((product) => (
              <div
                className="col-lg-3 col-md-4 col-sm-6 col-12 d-flex align-items-stretch"
                key={product.product_id}
              >
                <div className="card product-card h-100 w-100">
                  <div className="img-container position-relative">
                    <Link
                      to={"/productdetails/" + product.product_id}
                      className="text-decoration-none"
                    >
                      <img
                        src={
                          "http://localhost:8000/storage/" +
                          product.product_img1
                        }
                        className="card-img-top product-image"
                        alt={product.product_name}
                      />
                    </Link>
                    <div className="overlay">
                      <div className="icon-container d-flex">
                        <div
                          className="action-icon"
                          title={content?.add_to_cart || "Add to Cart"}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product.product_id);
                          }}
                        >
                          <i className="bi bi-cart-plus"></i>
                        </div>
                        {loggedInUser && (
                          <div
                            className="action-icon"
                            title={
                              content?.add_to_wishlist || "Add to Wishlist"
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              addToWishlist(product.product_id);
                            }}
                          >
                            <i className="bi bi-heart"></i>
                          </div>
                        )}
                        {/* Quick View Icon */}
                        <div
                          className="action-icon"
                          title={content?.quick_view || "Quick View"}
                          style={{ position: "relative" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setQuickViewProduct(product);
                            setShowQuickView(true);
                            setUserRating(product.rating || 0);
                            setQuickViewImage(
                              "http://localhost:8000/storage/" +
                                product.product_img1
                            );
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.setAttribute(
                              "title",
                              content?.quick_view || "Quick View"
                            );
                          }}
                        >
                          <FaEye />
                          <span
                            className="quick-view-tooltip"
                            style={{
                              display: "none",
                              position: "absolute",
                              top: "100%",
                              left: "50%",
                              transform: "translateX(-50%)",
                              background: "#222",
                              color: "#fff",
                              padding: "2px 8px",
                              borderRadius: "4px",
                              fontSize: "0.85em",
                              whiteSpace: "nowrap",
                              zIndex: 10,
                            }}
                          >
                            {content?.quick_view || "Quick View"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body text-center">
                    <h5 className="card-title" style={{ color: "black" }}>
                      {product.product_name}
                    </h5>
                    <p className="card-text text-success fw-bold">
                      {product.product_price} Birr
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Quick View Modal */}
        <Modal
          show={showQuickView}
          onHide={() => setShowQuickView(false)}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{quickViewProduct?.product_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {quickViewProduct && (
              <div className="row">
                <div className="col-md-6">
                  {/* Main Image */}
                  <div className="mb-3 text-center">
                    <img
                      src={
                        quickViewImage ||
                        "http://localhost:8000/storage/" +
                          quickViewProduct.product_img1
                      }
                      alt={quickViewProduct.product_name}
                      className="img-fluid mb-2"
                      style={{ maxHeight: 250, cursor: "pointer" }}
                      onClick={() => {
                        // Open image in new tab for larger visibility
                        window.open(
                          quickViewImage ||
                            "http://localhost:8000/storage/" +
                              quickViewProduct.product_img1,
                          "_blank"
                        );
                      }}
                    />
                    <div className="d-flex flex-wrap gap-2 justify-content-center mt-2">
                      {[1, 2, 3, 4, 5].map((i) => {
                        const img = quickViewProduct[`product_img${i}`];
                        return (
                          img && (
                            <img
                              key={i}
                              src={"http://localhost:8000/storage/" + img}
                              alt={quickViewProduct.product_name + " " + i}
                              className="img-thumbnail"
                              style={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                border:
                                  quickViewImage ===
                                  "http://localhost:8000/storage/" + img
                                    ? "2px solid #ffc107"
                                    : "1px solid #ccc",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                setQuickViewImage(
                                  "http://localhost:8000/storage/" + img
                                )
                              }
                            />
                          )
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <p>
                    <strong>{content?.price || "Price"}:</strong> Birr
                    {quickViewProduct.product_price}
                  </p>
                  <p>
                    <strong>{content?.available || "Available"}:</strong>{" "}
                    {quickViewProduct.total_product}
                  </p>
                  <p>
                    <strong>{content?.description || "Description"}:</strong>{" "}
                    {quickViewProduct.product_desc}
                  </p>
                  {/* Rating display */}
                  <div className="mb-2">
                    <strong>{content?.rating || "Rating"}:</strong>{" "}
                    <span style={{ color: "#ffc107" }}>
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <i
                          key={idx}
                          className={
                            idx < (quickViewProduct.rating || 0)
                              ? "bi bi-star-fill"
                              : "bi bi-star"
                          }
                        ></i>
                      ))}
                    </span>
                    <span className="ms-2">
                      {quickViewProduct.rating
                        ? quickViewProduct.rating.toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                  {/* User can rate */}
                  <div>
                    <strong>{content?.your_rating || "Your Rating"}:</strong>{" "}
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <i
                        key={idx}
                        className={
                          idx < userRating ? "bi bi-star-fill" : "bi bi-star"
                        }
                        style={{ cursor: "pointer", color: "#ffc107" }}
                        onClick={() => handleRateProduct(idx + 1)}
                      ></i>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQuickView(false)}>
              {content?.close || "Close"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light py-5 mt-5 px-3 px-md-5">
        <div className="container-fluid">
          <div className="row g-4">
            {/* Customer Service Column */}
            <div className="col-md-3">
              <h5
                className="mb-3"
                style={{
                  color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                }}
              >
                {content?.customer_service || "Customer Service"}
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link
                    to="/contact"
                    className="text-decoration-none"
                    style={{
                      color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                    }}
                  >
                    <i className="bi bi-envelope me-2"></i>
                    {content?.contact_us || "Contact Us"}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/faq"
                    className="text-decoration-none"
                    style={{
                      color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                    }}
                  >
                    <i className="bi bi-question-circle me-2"></i>
                    {content?.faq || "FAQ"}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/shipping-policy"
                    className="text-decoration-none"
                    style={{
                      color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                    }}
                  >
                    <i className="bi bi-truck me-2"></i>
                    {content?.shipping_policy || "Shipping Policy"}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/returns-policy"
                    className="text-decoration-none"
                    style={{
                      color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                    }}
                  >
                    <i className="bi bi-arrow-left-right me-2"></i>
                    {content?.returns_policy || "Returns Policy"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* About Us Column */}
            <div className="col-md-3">
              <h5
                className="mb-3"
                style={{
                  color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                }}
              >
                {content?.about_us_title || "About Us"}
              </h5>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <Link
                    to="/about"
                    className="text-decoration-none"
                    style={{
                      color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                    }}
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    {content?.our_story || "Our Story"}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/careers"
                    className="text-decoration-none"
                    style={{
                      color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                    }}
                  >
                    <i className="bi bi-briefcase me-2"></i>
                    {content?.careers || "Careers"}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/terms"
                    className="text-decoration-none"
                    style={{
                      color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                    }}
                  >
                    <i className="bi bi-file-text me-2"></i>
                    {content?.terms_of_service || "Terms of Service"}
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/privacy"
                    className="text-decoration-none"
                    style={{
                      color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                    }}
                  >
                    <i className="bi bi-shield-lock me-2"></i>
                    {content?.privacy_policy || "Privacy Policy"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div
              className="col-md-3"
              style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
            >
              <h5
                className="mb-3"
                style={{
                  color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                }}
              >
                {content?.follow_us || "Follow Us"}
              </h5>
              <div className="d-flex gap-3">
                <Link
                  to="#"
                  className=" fs-4 "
                  aria-label="Facebook"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  <i className="bi bi-facebook"></i>
                </Link>

                <Link
                  to="#"
                  className="fs-4"
                  aria-label="Twitter"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  <i className="bi bi-twitter"></i>
                </Link>

                <Link
                  to="#"
                  className="fs-4"
                  aria-label="Instagram"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  <i className="bi bi-instagram"></i>
                </Link>
                <Link
                  to="#"
                  className="fs-4"
                  aria-label="LinkedIn"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  <i className="bi bi-linkedin"></i>
                </Link>
              </div>
            </div>

            {/* Newsletter Subscription Column (updated) */}
            <div className="col-md-3">
              <h5
                className="mb-3"
                style={{
                  color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                }}
              >
                {content?.newsletter || "Newsletter"}
              </h5>
              <div>
                <span
                  className="small mb-4"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.newsletter_signup_text ||
                    "Sign up for our latest news and offers."}
                </span>
                <form className="form-container" onSubmit={handleSubscription}>
                  <div className="subscription-component">
                    <div>
                      <input
                        type="email"
                        className="form-control form-control-sm rounded-0 me-2 flex-grow-1"
                        placeholder={content?.your_email || "Your email"}
                        aria-label="Email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div>
                      <button className="subscription-button" type="submit">
                        {content?.subscribe || "Subscribe"}
                      </button>
                    </div>
                  </div>
                </form>
                {subscriptionMessage && (
                  <p
                    className={
                      subscriptionStatus === "success"
                        ? "text-success mt-2"
                        : "text-danger mt-2"
                    }
                  >
                    {subscriptionMessage}
                  </p>
                )}
                {/* Payment Methods moved here */}
                <div className="mt-4">
                  <h6
                    className="mb-2"
                    style={{
                      color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                    }}
                  >
                    {content?.payment_methods || "Payment Methods"}
                  </h6>
                  <div className="d-flex flex-wrap gap-3 align-items-center">
                    {/* Telebirr SVG */}
                    <span
                      title="Telebirr"
                      style={{
                        background: "#fff",
                        borderRadius: 8,
                        padding: 4,
                        boxShadow: "0 1px 4px #e3f2fd",
                      }}
                    >
                      <img
                        src="https://ethiopianlogos.com/logos/tele_birr/tele_birr.svg"
                        alt="Telebirr"
                        style={{
                          height: 32,
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </span>
                    {/* CBE Birr SVG */}
                    <span
                      title="CBE Birr"
                      style={{
                        background: "#fff",
                        borderRadius: 8,
                        padding: 4,
                        boxShadow: "0 1px 4px #e3f2fd",
                      }}
                    >
                      <img
                        src="https://ethiopianlogos.com/logos/cbe_birr_light/cbe_birr_light.svg"
                        alt="CBE Birr"
                        style={{
                          height: 32,
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </span>
                    {/* Amole */}
                    <span
                      title="Amole"
                      style={{
                        background: "#fff",
                        borderRadius: 8,
                        padding: 4,
                        boxShadow: "0 1px 4px #e3f2fd",
                      }}
                    >
                      <img
                        src="https://ethiopianlogos.com/logos/amole/amole.svg"
                        alt="Amole"
                        style={{
                          height: 32,
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </span>
                    {/* HelloCash */}
                    <span
                      title="HelloCash"
                      style={{
                        background: "#fff",
                        borderRadius: 8,
                        padding: 4,
                        boxShadow: "0 1px 4px #e3f2fd",
                      }}
                    >
                      <img
                        src="https://z-p3-scontent.fadd1-1.fna.fbcdn.net/v/t39.30808-6/463868196_8595481737233725_797605725820873396_n.png?_nc_cat=109&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=yOJ3bDWbf-kQ7kNvwGqcKYj&_nc_oc=AdkG08NLdwCc8ZW3aA5gS9s1IQYwKsbVJvcsZxVLU5c6wDZysXToMn3gIqS-ICMMmZo&_nc_zt=23&_nc_ht=z-p3-scontent.fadd1-1.fna&_nc_gid=6zNEfKaJ-k0jCM0DvQvy_Q&oh=00_AfJ57nKezR2SUJjDwMJqRA9-gKKBZF1N6CtvH1YaxqNA0Q&oe=682F651C"
                        alt="HelloCash"
                        style={{
                          height: 32,
                          width: "auto",
                          objectFit: "contain",
                        }}
                      />
                    </span>
                    {/* Add more as needed */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="mt-5 pt-4 border-top border-secondary">
            <div className="row align-items-center">
              {/* Copyright */}
              <div className="col-md-6">
                <p className="small mb-0" style={{ color: "white" }}>
                  &copy; {new Date().getFullYear()}{" "}
                  {content?.habesha_mart || "Habesha Mart"}.
                  {content?.all_rights_reserved || "All rights reserved."}
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                {/* Consider moving other bottom elements here if needed */}
              </div>
            </div>
          </div>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
}

export default Home;
