// VendorStore.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style/vendorstore.css'; // Create this CSS file

function VendorStore() {
    const { id } = useParams();
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVendorData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch Vendor Details
                const vendorResponse = await fetch(`http://localhost:8000/api/vendor/${id}`);
                if (!vendorResponse.ok) {
                    throw new Error(`HTTP error! status: ${vendorResponse.status}`);
                }
                const vendorData = await vendorResponse.json();
                setVendor(vendorData);

                // Fetch Vendor Products using /vendor/productlist/ (POST)
                const productsResponse = await fetch(`http://localhost:8000/api/vendor/productlist/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({ vendor_id: id }) // Send the vendor ID in the body
                });
                if (!productsResponse.ok) {
                    throw new Error(`HTTP error! status: ${productsResponse.status}`);
                }
                const productsData = await productsResponse.json();
                setProducts(productsData);

            } catch (err) {
                setError(err.message);
                console.error("Error fetching vendor store data:", err);
                toast.error("Failed to load vendor store.");
            } finally {
                setLoading(false);
            }
        };

        fetchVendorData();
    }, [id]);

    const addToCart = async (productId) => {
        const storedUser = localStorage.getItem("user-info");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            let items = { product_id: productId, user_id: parsedUser.user_id };

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

    if (loading) {
        return <div>Loading vendor store...</div>;
    }

    if (error) {
        return <div>Error loading vendor store: {error}</div>;
    }

    if (!vendor) {
        return <div>Vendor not found.</div>;
    }

    return (
        <div className="vendor-store-page container mt-5">
            <div className="vendor-header bg-light p-4 rounded mb-4 text-center">
                {vendor.logo && (
                    <img
                        src={`http://localhost:8000/storage/${vendor.logo}`}
                        alt={vendor.store_name}
                        className="vendor-logo rounded-circle mb-3"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                )}
                <h1>{vendor.store_name}</h1>
                {vendor.personalInfo && vendor.personalInfo.personal_name && (
                    <p className="text-muted">Owner: {vendor.personalInfo.personal_name}</p>
                )}
                {/* You can add more vendor details here if needed */}
            </div>

            <h2>Products from {vendor.store_name}</h2>
            <div className="row g-4">
                {products.map((product) => (
                    <div className="col-md-3 col-sm-6" key={product.product_id}>
                        <div className="card product-card h-100">
                            <Link to={`/productdetails/${product.product_id}`} className="text-decoration-none">
                                <img
                                    src={`http://localhost:8000/storage/${product.product_img1}`}
                                    className="card-img-top"
                                    alt={product.product_name}
                                />
                                <div className="card-body text-center">
                                    <h5 className="card-title" style={{ color: 'black' }}>{product.product_name}</h5>
                                    <p className="card-text">${product.product_price}</p>
                                </div>
                            </Link>
                            <button
                                className="btn btn-warning"
                                onClick={() => addToCart(product.product_id)}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
                {products.length === 0 && <p>No products available from this vendor.</p>}
            </div>
            <ToastContainer />
        </div>
    );
}

export default VendorStore;