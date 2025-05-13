import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Translation from "./translations/lang.json";
import "react-toastify/dist/ReactToastify.css";
import "./user/styles/home.css";

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
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch Top Products
                const topProductsResponse = await fetch("http://localhost:8000/api/topproduct", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                });
                if (!topProductsResponse.ok) {
                    throw new Error(`HTTP error! status: ${topProductsResponse.status}`);
                }
                const topProductsData = await topProductsResponse.json();
                console.log("Top Products Result:", topProductsData);
                const products = Array.isArray(topProductsData) ? topProductsData : [];
                setSearchResult(products);
                setProductsToDisplay(products);

                // Fetch Featured Vendors
                const featuredVendorsResponse = await fetch("http://localhost:8000/api/featured-vendors");
                if (!featuredVendorsResponse.ok) {
                    throw new Error(`HTTP error! status: ${featuredVendorsResponse.status}`);
                }
                const featuredVendorsData = await featuredVendorsResponse.json();
                console.log("Featured Vendors:", featuredVendorsData.featured_vendors);
                setFeaturedVendors(featuredVendorsData.featured_vendors);

                // Fetch Best Selling Vendors
                const bestSellingVendorsResponse = await fetch('http://localhost:8000/api/best-selling-vendors');
                if (!bestSellingVendorsResponse.ok) {
                    throw new Error(`HTTP error! status: ${bestSellingVendorsResponse.status}`);
                }
                const bestSellingVendorsData = await bestSellingVendorsResponse.json();
                console.log("Best Selling Vendors:", bestSellingVendorsData.best_selling_vendors);
                setBestSellingVendors(bestSellingVendorsData.best_selling_vendors);

                // Fetch Categories
                const categoriesResponse = await fetch("http://localhost:8000/api/vendor/get-categories");
                if (!categoriesResponse.ok) {
                    throw new Error(`HTTP error! status: ${categoriesResponse.status}`);
                }
                const categoriesData = await categoriesResponse.json();
                setCategories(categoriesData);

            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
                toast.error("Failed to load homepage data.");
                setSearchResult([]);
                setProductsToDisplay([]);
                setFeaturedVendors([]);
                setBestSellingVendors([]);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    async function search(e) {
        e.preventDefault();
        let items = { searchproduct };
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

    if (loading) {
        return <div>{content?.loading || "Loading..."}</div>;
    }

    if (error) {
        return <div>{content?.error || "Error"}: {error}</div>;
    }

    return (
        <div>
            {/* Navigation Bar */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container-fluid">
                    <Link className="navbar-brand text-warning" to="/">
                        Habesha Mart
                    </Link>
                    <button className="navbar-toggler" type="button" onClick={toggleNav}>
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div
                        className={`${isNavOpen ? "" : "collapse"} navbar-collapse`}
                        id="navbarNav"
                    >
                        <ul className="navbar-nav mx-auto">
                            <li className="nav-item">
                                <div className="search-bar d-flex align-items-center flex-grow-1 mt-2">
                                    <input
                                        type="text"
                                        value={searchproduct}
                                        onChange={(e) => setSearchProduct(e.target.value)}
                                        className="form-control"
                                        placeholder={
                                            content?.search_products || "Search products..."
                                        }
                                    />
                                    <button className="btn btn-warning ms-2" onClick={search}>
                                        {content?.search || "Search"}
                                    </button>
                                </div>
                            </li>
                        </ul>
                        <ul className="navbar-nav">
                            {localStorage.getItem("user-info") ? (
                                <li className="nav-item">
                                    <Link className="nav-link" to="/cart">
                                        {content?.carts || "Carts"}
                                    </Link>
                                </li>
                            ) : (
                                <>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/login">
                                            {content?.login || "Login"}
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/cart">
                                            {content?.carts || "Carts"}
                                        </Link>
                                    </li>
                                </>
                            )}
                            <li className="nav-item dropdown">
                                <a
                                    className="nav-link dropdown-toggle"
                                    role="button"
                                    data-bs-toggle="dropdown"
                                >
                                    {content?.settings || "Settings"}
                                </a>
                                <ul className="dropdown-menu">
                                    {localStorage.getItem("user-info") ? (
                                        <>
                                            <li>
                                                <Link className="dropdown-item" to="/ordereditems">
                                                    {content?.orders || "Orders"}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/settings">
                                                    {content?.settings || "Setting"}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/notification">
                                                    {content?.notifications || "Notification"}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/helpcenter">
                                                    {content?.help_center || "Help Center"}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="#" onClick={logout}>
                                                    {content?.logout || "Logout"}
                                                </Link>
                                            </li>
                                        </>
                                    ) : (
                                        <>
                                            <li>
                                                <Link className="dropdown-item" to="/login">
                                                    {content?.login || "Login"}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/signup">
                                                    {content?.register || "Register"}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/ordereditems">
                                                    {content?.orders || "Orders"}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/settings">
                                                    {content?.setting || "Setting"}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link className="dropdown-item" to="/helpcenter">
                                                    {content?.help_center || "Help Center"}
                                                </Link>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="toppush container-fluid mt-5">
                <div className="bg-warning text-center p-4 rounded mb-4">
                    <h1>
                        {content?.welcome || "Welcome to Your E-Commerce Dashboard"}
                    </h1>
                </div>

                {/* Featured Vendors Section */}
                {featuredVendors.length > 0 && (
                    <div className="mb-4">
                        <h2>{content?.featured_vendors || "Featured Vendors"}</h2>
                        <div className="row g-3">
                            {featuredVendors.map((vendor) => (
                                <div className="col-md-2 col-sm-4" key={vendor.vendor_id}>
                                    <div className="card vendor-card h-100 text-center p-3">
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
                    <div className="mb-4">
                        <h2>{content?.best_selling_vendors || "Best Selling Vendors"}</h2>
                        <div className="row g-3">
                            {bestSellingVendors.map((vendor) => (
                                <div className="col-md-2 col-sm-4" key={vendor.vendor_id}>
                                    <div className="card vendor-card h-100 text-center p-3">
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
                                            <p className="card-text small text-muted">
                                                {content?.total_orders || "Orders"}: {vendor.total_orders}
                                            </p>
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
                <div className="category-container">
                    <label htmlFor="categorySelect">
                        {content?.category || "Category"}:
                    </label>
                    <select
                        id="categorySelect"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">{content?.all || "All"}</option>
                        {categories.map((cat) => (
                            <option key={cat.category_category_id} value={cat.category_id}>
                                {cat.category_name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="sort-container">
                    <label htmlFor="sortSelect">{content?.sort_by || "Sort By"}:</label>
                    <select
                        id="sortSelect"
                        value={sortOption}
                        onChange={handleSortChange}
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

                {/* Product Overview */}
                <h2>{content?.product_overview || "Product Overview"}</h2>
                <div className="row g-4">
                    {Array.isArray(productsToDisplay) &&
                        productsToDisplay.map((product) => (
                            <div className="col-md-3 col-sm-6" key={product.product_id}>
                                <div className="card product-card h-100">
                                    <Link
                                        to={"/productdetails/" + product.product_id}
                                        className="text-decoration-none"
                                    >
                                        <img
                                            src={
                                                "http://localhost:8000/storage/" + product.product_img1
                                            }
                                            className="card-img-top"
                                            alt={product.product_name}
                                        />
                                        <div className="card-body text-center">
                                            <h5 className="card-title" style={{ color: "black" }}>
                                                {product.product_name}
                                            </h5>
                                            <p className="card-text">${product.product_price}</p>
                                        </div>
                                    </Link>
                                    <button
                                        className="btn btn-warning"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            addToCart(product.product_id);
                                        }}
                                    >
                                        {content?.add_to_cart || "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        ))}
                    {!Array.isArray(productsToDisplay) && (
                        <p>{content?.no_products_found || "No products found."}</p>
                    )}
                    {Array.isArray(productsToDisplay) &&
                        productsToDisplay.length === 0 &&
                        selectedCategory !== "" && (
                            <p>
                                {content?.no_products_in_category ||
                                    `No products in the selected category.`}
                            </p>
                        )}
                    {Array.isArray(productsToDisplay) &&
                        productsToDisplay.length === 0 &&
                        searchproduct !== "" && (
                            <p>
                                {content?.no_search_results ||
                                    `No search results for "${searchproduct}".`}
                            </p>
                        )}
                    {Array.isArray(productsToDisplay) &&
                        productsToDisplay.length === 0 &&
                        selectedCategory === "" &&
                        searchproduct === "" && (
                            <p>
                                {content?.no_products_available || "No products available."}
                            </p>
                        )}
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}

export default Home;