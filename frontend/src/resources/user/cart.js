import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/cart.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Cart() {
  const [isNavOpen, setNavOpen] = useState(true);
  const [cartitems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const toggleNav = () => {
    setNavOpen(!isNavOpen);
  };

  const fetchCartItems = async () => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      let items = { user_id: parsedUser.user_id };

      try {
        let response = await fetch("http://localhost:8000/api/listcartitems", {
          method: 'POST',
          body: JSON.stringify(items),
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

  async function removeItems(cart_id) {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      let items = { cart_id: cart_id, user_id: parsedUser.user_id };

      try {
        let response = await fetch("http://localhost:8000/api/removecartitems", {
          method: 'POST',
          body: JSON.stringify(items),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });

        let result = await response.json();

        if (result.success) {
          toast.success("Product Removed!", {
            position: "top-right",
            autoClose: 3000,
          });

          // Refresh cart
          fetchCartItems();
        } else {
          toast.error(result.message, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    } else {
      navigate("/login");
    }
  }

  function checkoutProcess() {
    navigate('/checkout');
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand text-warning" href="/">Dashboard</a>
          <button className="navbar-toggler" type="button" onClick={toggleNav}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`${isNavOpen ? 'show' : 'collapse'} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <div className="search-bar d-flex align-items-center flex-grow-1 mt-2">
                  <input type="text" className="form-control" placeholder="Search products..." />
                  <button className="btn btn-warning ms-2">Search</button>
                </div>
              </li>
            </ul>
            <ul className="navbar-nav">
              <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/ordereditems">Ordered</a></li>
              <li className="nav-item"><a className="nav-link" href="/shippeditems">Shipped</a></li>
              <li className="nav-item"><a className="nav-link" href="/refunditems">Refunded</a></li>
              <li className="nav-item"><a className="nav-link" href="/completeditems">Completed</a></li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="main-content mt-5">
        <div className="headers mt-5">
          <h1>Your Shopping Cart</h1>
        </div>

        <table className="cart-table">
          {cartitems.length > 0 && (
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Coupon</th>
                <th>Action</th>
              </tr>
            </thead>
          )}
          <tbody>
            {cartitems.map((item) => (
              <tr key={item.cart_id}>
                <td>
                  <div className="product-info">
                    <img src={`http://localhost:8000/storage/${item.product_img1}`} alt={item.product_name} />
                    <span className="product-name">{item.product_name}</span>
                  </div>
                </td>
                <td>${item.product_price}</td>
                <td>
                  <div className="quantity-container">
                    <button className="quantity-btn">-</button>
                    <span className="quantity-value">{item.total_added}</span>
                    <button className="quantity-btn">+</button>
                  </div>
                </td>
                <td>
                  <div className="coupon-container">
                    <input type="text" placeholder="Enter coupon code" />
                    <button>Apply</button>
                  </div>
                </td>
                <td>
                  <button className="remove-btn" onClick={() => removeItems(item.cart_id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cartitems.length > 0 ? (
          <div className="summary">
            <h2 className="summary-title">Order Summary</h2>
            <p className="summary-total">Total: <strong>${(20.00 * 2 + 30.00 * 1 + 15.00 * 3).toFixed(2)}</strong></p>
            <button onClick={checkoutProcess} className="btn btn-warning proceed-btn">Proceed to Checkout</button>
          </div>
        ) : (
          <div className="empty-cart-message mt-5 text-center">
            <h3 className="no-products-text">There are no products in the cart!</h3>
          </div>
        )}



      </div>

      <ToastContainer />
    </div>
  );
}

export default Cart;
