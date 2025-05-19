import React, { useState, useEffect } from "react";
import Translation from "../translations/lang.json";
import "./styles/checkout.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CheckOut() {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [bankInfo, setBankInfo] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

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
  }, [fontSize, fontColor, language]); // Fetch user addresses and bank info

  useEffect(() => {
    const fetchUserInfo = async () => {
      const storedUser = localStorage.getItem("user-info");
      if (!storedUser) {
        navigate("/login");
        return;
      }
      const parsedUser = JSON.parse(storedUser);
      try {
        const response = await fetch("http://localhost:8000/api/userinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ user_id: parsedUser.user_id }),
        });
        const result = await response.json();
        setAddresses(result.addresses || []);
        setSelectedAddress((result.addresses && result.addresses[0]) || null);
        setBankInfo(result.bank_info || null);
      } catch (error) {
        toast.error("Failed to fetch user information.");
      }
    };
    fetchUserInfo();
  }, [navigate]);

  const handleAddressChange = (address) => {
    setSelectedAddress(address);
    setShowAddressModal(false);
  };

  const handlePaymentSubmit = (event) => {
    event.preventDefault(); // Handle payment submission logic here
    setShowPaymentModal(false);
  };

  useEffect(() => {
    if (
      location.state &&
      location.state.items &&
      Array.isArray(location.state.items)
    ) {
      setCartItems(location.state.items);
      console.log("Cart items received from Cart:", location.state.items);
    }
  }, [location.state]);

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        const price = item.product_price - (item.discount_price || 0);
        return total + price * item.total_added;
      }, 0)
      .toFixed(2);
  };

  const handleCompletePurchase = async () => {
    const storedUser = localStorage.getItem("user-info");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsedUser = JSON.parse(storedUser);
    console.log("Items being sent to processOrder:", cartItems);

    try {
      const response = await fetch("http://localhost:8000/api/processOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user_id: parsedUser.user_id,
          cartItems: cartItems,
          totalAmount: parseFloat(calculateTotal()) + 5,
          shippingAddress: selectedAddress,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "Order placed successfully!");
        navigate("/order-confirmation");
      } else {
        toast.error(
          result.message || "Failed to place order. Please try again."
        );
      }
    } catch (error) {
      toast.error("An error occurred while placing the order.");
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
        <div className="container-fluid">
          <a className="navbar-brand text-warning" href="/">
            {content?.home || "Dashboard"}
          </a>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="form-section">
          <h2>Shipping Information</h2>
          <div className="saved-info">
            {selectedAddress ? (
              <>
                <p>
                  <strong>{selectedAddress.full_name}</strong>
                </p>
                <p>
                  {selectedAddress.phone}
                  <br />
                  {selectedAddress.city}, {selectedAddress.state},{" "}
                  {selectedAddress.country} - {selectedAddress.post}
                </p>
              </>
            ) : (
              <p>{content?.no_address_found || "No address found."}</p>
            )}
            <div className="change-address">
              <button
                className="btn btn-link text-warning"
                onClick={() => setShowAddressModal(true)}
              >
                {content?.change_address || "Change Address"}
              </button>
            </div>
          </div>
          <h2>Payment Information</h2>
          <div className="saved-info">
            {bankInfo ? (
              <>
                <p>
                  <strong>{content?.bank_name || "Bank Name"}:</strong>{" "}
                  {bankInfo.bank_name}
                </p>
                <p>
                  <strong>{content?.account_name || "Account Name"}:</strong>{" "}
                  {bankInfo.account_name}
                </p>
                <p>
                  <strong>
                    {content?.account_number || "Account Number"}:
                  </strong>{" "}
                  {bankInfo.account_number}
                </p>
                {bankInfo.branch && (
                  <p>
                    <strong>{content?.branch || "Branch"}:</strong>{" "}
                    {bankInfo.branch}
                  </p>
                )}
              </>
            ) : (
              <p>
                {content?.no_payment_info || "No payment information saved."}
              </p>
            )}
            <div className="change-address">
              <button
                className="btn btn-link text-warning"
                onClick={() => setShowPaymentModal(true)}
              >
                {content?.add_payment_info || "Add Payment Information"}
              </button>
            </div>
          </div>
          {/* Processing Products */}
          <h2>{content?.processing_products || "Processing Products"}</h2>
          <div className="product-list">
            {cartItems.length > 0 ? (
              <table className="table">
                <thead>
                  <tr>
                    <th>{content?.product || "Product"}</th>
                    <th>{content?.quantity || "Quantity"}</th>
                    <th>{content?.price || "Price"}</th>
                    <th>{content?.total || "Subtotal"}</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.cart_id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={`http://localhost:8000/storage/${item.product_img1}`}
                            alt={item.product_name}
                            style={{ maxWidth: "50px", marginRight: "10px" }}
                          />
                          <span>{item.product_name}</span>
                        </div>
                      </td>
                      <td>{item.total_added}</td>
                      <td>${item.product_price.toFixed(2)}</td>
                      <td>
                        ${(item.product_price * item.total_added).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>{content?.cart_empty || "Your cart is empty."}</p>
            )}
          </div>
          <button
            type="button"
            className="mt-5 checkout-button btn btn-warning"
            disabled={cartItems.length === 0}
            onClick={handleCompletePurchase}
          >
            {content?.complete_purchase || "Complete Purchase"}
          </button>
        </div>
        <div className="summary-section">
          <h2>{content?.order_summary || "Order Summary"}</h2>
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <p key={item.cart_id}>
                  {item.product_name} ({item.total_added}): $
                  {(item.product_price * item.total_added).toFixed(2)}
                </p>
              ))}
              <hr />
              <p>
                <strong>{content?.subtotal || "Subtotal"}:</strong> $
                {calculateTotal()}
              </p>
              <p>
                <strong>{content?.shipping || "Shipping"}:</strong> $5.00 (Fixed)
              </p>
              <hr />
              <p className="h5">
                <strong>{content?.grand_total || "Grand Total"}:</strong> $
                {(parseFloat(calculateTotal()) + 5).toFixed(2)}
              </p>
            </>
          ) : (
            <p>{content?.no_items_in_cart || "No items in cart."}</p>
          )}
        </div>
      </div>
      {/* Address Change Modal */}
      <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {content?.select_address || "Select an Address"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul className="list-group">
            {addresses.map((address, index) => (
              <li
                key={index}
                className="list-group-item"
                onClick={() => handleAddressChange(address)}
                style={{ cursor: "pointer" }}
              >
                <strong>{address.full_name}</strong>, {address.phone}
                <br />
                {address.city}, {address.state}, {address.country} -{" "}
                {address.post}
              </li>
            ))}
          </ul>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
      {/* Payment Information Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {content?.add_payment_info || "Add Payment Information"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handlePaymentSubmit}>
            <div className="mb-3">
              <label htmlFor="cardNumber" className="form-label">
                {content?.card_number || "Card Number"}
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="cardNumber"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="expiry" className="form-label">
                {content?.expiry_date || "Expiry Date"} (MM/YY)
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="expiry"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="cvc" className="form-label">
                CVC
              </label>
              <input
                type="text"
                className="custom-form-control"
                id="cvc"
                required
              />
            </div>
            <button type="submit" className="checkout-button btn btn-warning">
              {content?.save_payment_info || "Save Payment Information"}
            </button>
          </form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default CheckOut;
