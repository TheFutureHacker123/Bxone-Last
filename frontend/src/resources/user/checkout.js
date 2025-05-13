import React, { useState, useEffect } from 'react';
import Translation from "../translations/lang.json";
import './styles/checkout.css'; // Custom CSS file
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CheckOut() {
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState('123 Example St, Cityville, ST 12345');
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();

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


    const addresses = [
        '456 Another St, Townsville, ST 54321',
        '789 Sample Rd, Villageville, ST 67890',
        '101 Sample Ave, Citytown, ST 11112',
    ];

    const handleAddressChange = (address) => {
        setSelectedAddress(address);
        setShowAddressModal(false);
    };

    const handlePaymentSubmit = (event) => {
        event.preventDefault();
        // Handle payment submission logic here
        setShowPaymentModal(false);
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
                console.log(result.cart_items);
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

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.product_price * item.total_added, 0).toFixed(2);
    };

    const handleCompletePurchase = async () => {
        const storedUser = localStorage.getItem("user-info");
        if (!storedUser) {
            navigate("/login");
            return;
        }
        const parsedUser = JSON.parse(storedUser);

        try {
            const response = await fetch("http://localhost:8000/api/processOrder", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    user_id: parsedUser.user_id,
                    cartItems: cartItems,
                    totalAmount: parseFloat(calculateTotal()) + 5, // Include total amount
                    shippingAddress: selectedAddress, // Include shipping address
                    // You might want to include payment details if you collect them on the frontend
                }),
            });

            const result = await response.json();

            if (result.success) {
                toast.success(result.message || 'Order placed successfully!');
                // Optionally, redirect the user to an order confirmation page
                navigate('/order-confirmation');
            } else {
                toast.error(result.message || 'Failed to place order. Please try again.');
            }

        } catch (error) {
            toast.error('An error occurred while placing the order.');
        }
    };

    return (
        <div>
            {/* Navigation Bar (You might want to reuse your existing one) */}
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
                <div className="container-fluid">
                    <a className="navbar-brand text-warning" href="/">{content?.home || 'Dashboard'}</a>
                    {/* Add other navigation items if needed */}
                </div>
            </nav>

            {/* Checkout Form Container */}
            <div className="container mt-5">
                <div className="form-section">
                    <h2>Shipping Information</h2>
                    <div className="saved-info">
                        <p><strong>John Doe</strong></p>
                        <p>{selectedAddress}</p>
                        <div className="change-address">
                            <button className="btn btn-link text-warning" onClick={() => setShowAddressModal(true)}>{content?.change_address || 'Change Address'}</button>
                        </div>
                    </div>

                    <h2>Payment Information</h2>
                    <div className="saved-info">
                        <p><strong>Saved Card:</strong> **** **** **** 1234</p>
                        <p><strong>Expiry:</strong> 12/25</p>
                        <div className="change-address">
                            <button className="btn btn-link text-warning" onClick={() => setShowPaymentModal(true)}>{content?.add_payment_info || 'Add Payment Information'}</button>
                        </div>
                    </div>

                    {/* Processing Products */}
                    <h2>{content?.processing_products || 'Processing Products'}</h2>
                    <div className="product-list">
                        {cartItems.length > 0 ? (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>{content?.product || 'Product'}</th>
                                        <th>{content?.quantity || 'Quantity'}</th>
                                        <th>{content?.price || 'Price'}</th>
                                        <th>{content?.total || 'Subtotal'}</th>
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
                                                        style={{ maxWidth: '50px', marginRight: '10px' }}
                                                    />
                                                    <span>{item.product_name}</span>
                                                </div>
                                            </td>
                                            <td>{item.total_added}</td>
                                            <td>${item.product_price.toFixed(2)}</td>
                                            <td>${(item.product_price * item.total_added).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>{content?.cart_empty || 'Your cart is empty.'}</p>
                        )}
                    </div>

                    <button
                        type="button"
                        className="mt-5 checkout-button btn btn-warning"
                        disabled={cartItems.length === 0}
                        onClick={handleCompletePurchase}
                    >
                        {content?.complete_purchase || 'Complete Purchase'}
                    </button>
                </div>

                <div className="summary-section">
                    <h2>{content?.order_summary || 'Order Summary'}</h2>
                    {cartItems.length > 0 ? (
                        <>
                            {cartItems.map((item) => (
                                <p key={item.cart_id}>
                                    {item.product_name} ({item.total_added}): ${ (item.product_price * item.total_added).toFixed(2) }
                                </p>
                            ))}
                            <hr />
                            <p><strong>{content?.subtotal || 'Subtotal'}:</strong> ${calculateTotal()}</p>
                            <p><strong>{content?.shipping || 'Shipping'}:</strong> $5.00 (Fixed)</p>
                            <hr />
                            <p className="h5">
                                <strong>{content?.grand_total || 'Grand Total'}:</strong> ${(parseFloat(calculateTotal()) + 5).toFixed(2)}
                            </p>
                        </>
                    ) : (
                        <p>{content?.no_items_in_cart || 'No items in cart.'}</p>
                    )}
                </div>
            </div>

            {/* Address Change Modal */}
            <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{content?.select_address || 'Select an Address'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul className="list-group">
                        {addresses.map((address, index) => (
                            <li key={index} className="list-group-item" onClick={() => handleAddressChange(address)}>
                                {address}
                            </li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            {/* Payment Information Modal */}
            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{content?.add_payment_info || 'Add Payment Information'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handlePaymentSubmit}>
                        <div className="mb-3">
                            <label htmlFor="cardNumber" className="form-label">{content?.card_number || 'Card Number'}</label>
                            <input type="text" className="custom-form-control" id="cardNumber" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="expiry" className="form-label">{content?.expiry_date || 'Expiry Date'} (MM/YY)</label>
                            <input type="text" className="custom-form-control" id="expiry" required />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="cvc" className="form-label">CVC</label>
                            <input type="text" className="custom-form-control" id="cvc" required />
                        </div>
                        <button type="submit" className="checkout-button btn btn-warning">{content?.save_payment_info || 'Save Payment Information'}</button>
                    </form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    );
}

export default CheckOut;