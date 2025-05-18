import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../translations/lang.json";
import 'react-toastify/dist/ReactToastify.css';
import './styles/shippeditem.css'; // Custom CSS file
import 'bootstrap/dist/css/bootstrap.min.css';

function ShippedItems() {
  const [isNavOpen, setNavOpen] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate
  const [shippeditems, setOrderdItems] = useState([]);

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

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  const fetchShippedItems = async () => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      let items = { user_id: parsedUser.user_id };

      try {
        let response = await fetch("http://localhost:8000/api/shippeditems", {
          method: 'POST',
          body: JSON.stringify(items),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });

        let result = await response.json();
        console.warn("Fuck Order:", result);
        setOrderdItems(result.shipped_items || []);

      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchShippedItems();
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand text-warning" href="/">
             Habesha Mart
          </a>
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNav}
            aria-expanded={isNavOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`${isNavOpen ? 'show' : 'collapse'} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                {/* <div className="search-bar d-flex align-items-center">
                  <input type="text" className="form-control" placeholder={`${content?.search_products || 'Search products...'}`} />
                  <button className="btn btn-warning ms-2">{content?.search || 'Search'}</button>
                </div> */}
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">{content?.home || 'Home'}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/cart">{content?.cart || 'Cart'}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/ordereditems">{content?.ordereditems || 'Ordered'}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/refunditems">{content?.refunditems || 'Refunded'}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/completeditems">{content?.completeditems || 'Completed'}</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="toppush container-fluid mt-5">
        <div className="bg-warning text-center p-4 rounded mb-4">
          <h1 className="text-dark">{content?.shippeditems || 'Your Shipped Items'}</h1>
        </div>

        {/* Ordered Items List */}
        <ul className="ordered-list">
          {
            shippeditems.map((listshippeditems) => (
              <li key={listshippeditems.order_id} className="d-flex justify-content-between align-items-center mb-3">
                <div className="product-info d-flex align-items-center">
                  <img src={`http://localhost:8000/storage/${listshippeditems.product_img1}`} alt={listshippeditems.product_name} />
                  <span className="product-name">{listshippeditems.product_name}</span>
                </div>
                <div className="details text-end">
                  <p>{content?.price || 'Price'}: {listshippeditems.total_paid}</p>
                  <p>{content?.quantity || 'Quantity'}: {listshippeditems.orderd_quantity}</p>
                  <p>{content?.total || 'Subtotal'}: {listshippeditems.total_paid}</p>
                  <a href="#" className="view-details btn btn-warning">{content?.view_details || 'View Details'}</a>
                  <button className="refund-button btn btn-danger ms-2">{content?.request_refund || 'Request Refund'}</button>
                </div>
              </li>
            ))
          }

          {shippeditems.length === 0 && (
            <div className="empty-cart-message mt-5 text-center">
              <h3 className="no-products-text">{content?.no_shipped_items || 'There are no Shipped products!'}</h3>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default ShippedItems;