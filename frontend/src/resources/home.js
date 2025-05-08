import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Translation from "./translations/lang.json";
import 'react-toastify/dist/ReactToastify.css';
import './user/styles/home.css';

function Home() {
  const [isNavOpen, setNavOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const [searchproduct, setSearchProduct] = useState("");
  const [searchresult, setSearchResult] = useState([]);
  const [categories, setCategories] = useState([]);

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
    const fetchTopProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/topproduct", {
          method: 'POST',
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });
        const result = await response.json();
        setSearchResult(result);
      } catch (error) {
        console.error("Error fetching top products:", error);
      }
    };
    fetchTopProducts();
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/vendor/get-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  }, []);

  useEffect(() => {
    let filtered = [...searchresult];
    if (selectedCategory !== '') {
      filtered = filtered.filter(p => p.category_id === parseInt(selectedCategory));
    }
    if (sortOption === 'priceLowToHigh') {
      filtered.sort((a, b) => a.product_price - b.product_price);
    } else if (sortOption === 'priceHighToLow') {
      filtered.sort((a, b) => b.product_price - a.product_price);
    }
    setFilteredProducts(filtered);
  }, [searchresult, selectedCategory, sortOption]);

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
    document.querySelector('.navbar').classList.toggle('open', !isNavOpen);
  };

  const addToCart = async (productid) => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      let items = { product_id: productid, user_id: parsedUser.user_id };

      try {
        let response = await fetch("http://localhost:8000/api/addtocart", {
          method: 'POST',
          body: JSON.stringify(items),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });

        let result = await response.json();

        if (result.success) {
          toast.success("Product added to cart!", {
            position: "top-right",
            autoClose: 3000
          });
        } else {
          toast.error(result.message, {
            position: "top-right",
            autoClose: 3000
          });
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
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
        method: 'POST',
        body: JSON.stringify(items),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });
      let result = await response.json();
      setSearchResult(result);
    } catch (error) {
      console.error("Search error:", error);
    }
  }

  function logout() {
    localStorage.clear();
    toast.success("Logout Successful!", {
      position: "top-right",
      autoClose: 3000
    });
    setTimeout(() => {
      navigate("/");
    }, 1000);
  }

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand text-warning" href="/">Habesha Mart</a>
          <button className="navbar-toggler" type="button" onClick={toggleNav}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`${isNavOpen ? '' : 'collapse'} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <div className="search-bar d-flex align-items-center flex-grow-1 mt-2">
                  <input
                    type="text"
                    value={searchproduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="form-control"
                    placeholder="Search products..."
                  />
                  <button className="btn btn-warning ms-2" onClick={search}>Search</button>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav">
              {
                localStorage.getItem('user-info') ? (
                  <li className="nav-item">
                    <a className="nav-link" href="/cart">Carts</a>
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <a className="nav-link" href="/login">Login</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/cart">Carts</a>
                    </li>
                  </>
                )
              }
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown">
                  Settings
                </a>
                <ul className="dropdown-menu">
                  {
                    localStorage.getItem('user-info') ? (
                      <>
                        <li><a className="dropdown-item" href="/ordereditems">Orders</a></li>
                        <li><a className="dropdown-item" href="/settings">Setting</a></li>
                        <li><a className="dropdown-item" href="/notification">Notification</a></li>
                        <li><a className="dropdown-item" href="/helpcenter">Help Center</a></li>
                        <li><a className="dropdown-item" onClick={logout}>Logout</a></li>
                      </>
                    ) : (
                      <>
                        <li><a className="dropdown-item" href="/login">Login</a></li>
                        <li><a className="dropdown-item" href="/signup">Register</a></li>
                        <li><a className="dropdown-item" href="/orderditems">Orders</a></li>
                        <li><a className="dropdown-item" href="/settings">Setting</a></li>
                        <li><a className="dropdown-item" href="/helpcenter">Help Center</a></li>
                      </>
                    )
                  }
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="toppush container-fluid mt-5">
        <div className="bg-warning text-center p-4 rounded mb-4">
          <h1 className="text-dark">{content?.welcome || "Welcome to Your E-Commerce Dashboard"}</h1>
        </div>

        {/* Category and Sort Dropdowns */}
        <div className="category-container">
          <label htmlFor="categorySelect">Category:</label>
          <select id="categorySelect" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat.category_id} value={cat.category_id}>
                {cat.category_name}
              </option>
            ))}
          </select>
        </div>
        <div className="sort-container">
          <label htmlFor="sortSelect">Sort By:</label>
          <select id="sortSelect" value={sortOption} onChange={handleSortChange}>
            <option value="default">Default</option>
            <option value="priceLowToHigh">Price: Low to High</option>
            <option value="priceHighToLow">Price: High to Low</option>
          </select>
        </div>

        {/* Product Overview */}
        <h2>Product Overview</h2>
        <div className="row g-4">
          {filteredProducts.map((searchlist) => (
            <div className="col-md-3 col-sm-6" key={searchlist.product_id}>
              <div className="card product-card h-100">
                <Link to={"/productdetails/" + searchlist.product_id} className="text-decoration-none">
                  <img
                    src={"http://localhost:8000/storage/" + searchlist.product_img1}
                    className="card-img-top"
                    alt={searchlist.product_name}
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title" style={{ color: 'black' }}>{searchlist.product_name}</h5>
                    <p className="card-text">${searchlist.product_price}</p>
                  </div>
                </Link>
                <button
                  className="btn btn-warning"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(searchlist.product_id);
                  }}
                >
                  {content?.add_to_cart || "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default Home;
