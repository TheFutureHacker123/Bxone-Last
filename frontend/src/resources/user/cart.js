import React, { useState, useEffect } from 'react';
import Translation from "../translations/lang.json";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/cart.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Cart() {
  const [isNavOpen, setNavOpen] = useState(true);
  const [cartitems, setCartItems] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [couponInputs, setCouponInputs] = useState({});
  const [appliedCoupons, setAppliedCoupons] = useState({});
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

  const toggleNav = () => setNavOpen(!isNavOpen);

  const fetchCartItems = async () => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      try {
        let response = await fetch("http://localhost:8000/api/listcartitems", {
          method: 'POST',
          body: JSON.stringify({ user_id: parsedUser.user_id }),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });
        let result = await response.json();
        setCartItems(result.cart_items || []);
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const removeItems = async (cart_id) => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      try {
        let response = await fetch("http://localhost:8000/api/removecartitems", {
          method: 'POST',
          body: JSON.stringify({ cart_id, user_id: parsedUser.user_id }),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });
        let result = await response.json();
        if (result.success) {
          toast.success("Product Removed!");
          fetchCartItems();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  const updateCartQuantity = async (cart_id, newQuantity) => {
    const storedUser = localStorage.getItem("user-info");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUpdating(true);
    try {
      let response = await fetch("http://localhost:8000/api/updateCartQuantity", {
        method: 'POST',
        body: JSON.stringify({ user_id: parsedUser.user_id, cart_id, total_added: newQuantity }),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });
      let result = await response.json();
      if (result.success) {
        setCartItems(prev =>
          prev.map(item => item.cart_id === cart_id ? { ...item, total_added: newQuantity } : item)
        );
      } else {
        toast.error(result.message || "Failed to update quantity");
      }
    } catch {
      toast.error('An error occurred. Please try again later.');
    }
    setUpdating(false);
  };

  const handleQuantityChange = (cart_id, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) return;
    updateCartQuantity(cart_id, newQuantity);
  };

  const checkoutProcess = () => navigate('/checkout');

  const calculateTotal = () => {
    return cartitems.reduce((total, item) => {
      const price = item.product_price-item.discount_price || item.product_price;
      return total + price * item.total_added;
    }, 0).toFixed(2);
  };

  const couponCodeCheck = async (couponCode, productId) => {
    const storedUser = localStorage.getItem("user-info");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsedUser = JSON.parse(storedUser);

    try {
      let response = await fetch("http://localhost:8000/api/applyCoupon", {
        method: 'POST',
        body: JSON.stringify({ user_id: parsedUser.user_id, coupon_code: couponCode, product_id: productId }),
        headers: {
          "Content-Type": 'application/json',
          "Accept": 'application/json'
        }
      });
      let result = await response.json();
      if (result.success) {
        setCartItems(prev =>
          prev.map(item =>
            item.product_id === productId ? { ...item, discount_price: result.data.discount_price } : item
          )
        );
        setAppliedCoupons(prev => ({ ...prev, [productId]: couponCode }));
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to apply coupon");
      }
    } catch {
      toast.error('An error occurred. Please try again later.');
    }
  };

  const removeCoupon = (productId) => {
    setAppliedCoupons(prev => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
    setCouponInputs(prev => ({ ...prev, [productId]: '' }));
    setCartItems(prev => prev.map(item =>
      item.product_id === productId ? { ...item, discount_price: null } : item
    ));
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand text-warning" href="/">{content?.home || 'Dashboard'}</a>
          <button className="navbar-toggler" type="button" onClick={toggleNav}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`${isNavOpen ? 'show' : 'collapse'} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <div className="search-bar d-flex align-items-center flex-grow-1 mt-2">
                  <input type="text" className="form-control" placeholder={`${content?.search_products || 'Search products...'}`} />
                  <button className="btn btn-warning ms-2">{content?.search || 'Search'}</button>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link" href="/">{content?.home || 'Home'}</a></li>
              <li className="nav-item"><a className="nav-link" href="/ordereditems">{content?.ordereditems || 'Ordered'}</a></li>
              <li className="nav-item"><a className="nav-link" href="/shippeditems">{content?.shippeditems || 'Shipped'}</a></li>
              <li className="nav-item"><a className="nav-link" href="/refunditems">{content?.refunditems || 'Refunded'}</a></li>
              <li className="nav-item"><a className="nav-link" href="/completeditems">{content?.completeditems || 'Completed'}</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="main-content mt-5">
        <div className="headers mt-5">
          <h1>{content?.cart || 'Your Shopping Cart'}</h1>
        </div>

        <table className="cart-table">
          {cartitems.length > 0 && (
            <thead>
              <tr>
                <th>{content?.product_name || 'Product'}</th>
                <th>{content?.price || 'Price'}</th>
                <th>{content?.quantity || 'Quantity'}</th>
                <th>{content?.discount || 'Coupon'}</th>
                <th>{content?.remove || 'Action'}</th>
              </tr>
            </thead>
          )}
          <tbody>
            {cartitems.map(item => (
              <tr key={item.cart_id}>
                <td>
                  <div className="product-info">
                    <img src={`http://localhost:8000/storage/${item.product_img1}`} alt={item.product_name} />
                    <span className="product-name">{item.product_name}</span>
                  </div>
                </td>
                <td>${((item.product_price-item.discount_price || item.product_price) * item.total_added).toFixed(2)}</td>
                <td>
                  <div className="quantity-container">
                    <button
                      className="quantity-btn"
                      disabled={item.total_added <= 1 || updating}
                      onClick={() => handleQuantityChange(item.cart_id, item.total_added, -1)}
                    >-</button>
                    <span className="quantity-value">{item.total_added}</span>
                    <button
                      className="quantity-btn"
                      disabled={updating}
                      onClick={() => handleQuantityChange(item.cart_id, item.total_added, 1)}
                    >+</button>
                  </div>
                </td>
                <td>
                  <div className="coupon-container">
                    <input
                      type="text"
                      value={couponInputs[item.product_id] || ''}
                      onChange={(e) => setCouponInputs(prev => ({ ...prev, [item.product_id]: e.target.value }))}
                      placeholder="Enter coupon code"
                      disabled={!!appliedCoupons[item.product_id]}
                    />
                    <button
                      onClick={() => couponCodeCheck(couponInputs[item.product_id], item.product_id)}
                      disabled={!!appliedCoupons[item.product_id]}
                    >
                      {content?.apply || 'Apply'}
                    </button>
                    {appliedCoupons[item.product_id] && (
                      <span
                        className="remove-coupon"
                        onClick={() => removeCoupon(item.product_id)}
                        style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                      >
                        X
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <button className="remove-btn" onClick={() => removeItems(item.cart_id)}>
                    {content?.remove || 'Remove'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cartitems.length > 0 ? (
          <div className="summary">
            <h2>{content?.order_summary || 'Order Summary'}</h2>
            <p>{content?.total || 'Total'}: <strong>${calculateTotal()}</strong></p>
            <button onClick={checkoutProcess} className="btn btn-warning proceed-btn">
              {content?.checkout || 'Proceed to Checkout'}
            </button>
          </div>
        ) : (
          <div className="empty-cart-message mt-5 text-center">
            <h3 className="no-products-text">{content?.cart_empty || 'There are no products in the cart!'}</h3>
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default Cart;
