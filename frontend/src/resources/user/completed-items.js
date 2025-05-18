import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../translations/lang.json";
import 'react-toastify/dist/ReactToastify.css';
import './styles/itemstyle.css'; // Custom CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function CompletedItems() {
  const [isNavOpen, setNavOpen] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate
  const [completeditems, setCompletedItems] = useState([]);

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

  const fetchCompletedItems = async () => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      let items = { user_id: parsedUser.user_id };

      try {
        let response = await fetch("http://localhost:8000/api/completeditems", {
          method: 'POST',
          body: JSON.stringify(items),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });

        let result = await response.json();
        console.warn("Fuck Order:", result);
        setCompletedItems(result.completed_items || []);

      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchCompletedItems();
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
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`${content?.search_products || 'Search products...'}`}
                  />
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
                <a className="nav-link" href="/shippeditems">{content?.shippeditems || 'Shipped'}</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/refunditems">{content?.refunditems || 'Refunded'}</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="toppush container-fluid mt-5">
        <div className="bg-warning text-center p-4 rounded mb-4">
          <h1 className="text-dark">{content?.completeditems || 'Your Completed Items'}</h1>
        </div>

        {/* Ordered Items List */}
        <ul className="ordered-list list-unstyled">
          {
            completeditems.map((listcompleteditems) => (
              <li key={listcompleteditems.order_id} className="d-flex justify-content-between align-items-center mb-3">
                <div className="product-info d-flex align-items-center">
                  <img src={`http://localhost:8000/storage/${listcompleteditems.product_img1}`} alt={listcompleteditems.product_name} />
                  <span className="product-name">{listcompleteditems.product_name}</span>
                </div>
                <div className="details text-end">
                  <p>{content?.price || 'Price'}: {listcompleteditems.total_paid}</p>
                  <p>{content?.quantity || 'Quantity'}: {listcompleteditems.orderd_quantity}</p>
                  <p>{content?.total || 'Subtotal'}: {listcompleteditems.total_paid}</p>
                  <a href="#" className="view-details btn btn-warning">{content?.view_details || 'View Details'}</a>
                </div>
              </li>
            ))
          }

          {completeditems.length === 0 && (
            <div className="empty-cart-message mt-5 text-center">
              <h3 className="no-products-text">{content?.no_completed_items || 'There are no Completed products!'}</h3>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}

export default CompletedItems;