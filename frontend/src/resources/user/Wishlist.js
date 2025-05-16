import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/home.css"; // Reuse your existing styles

function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      const storedUser = localStorage.getItem("user-info");
      if (!storedUser) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/wishlist", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Bearer " + JSON.parse(storedUser).token,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch wishlist");
        }

        const data = await response.json();
        setWishlistItems(data.wishlist || []);
      } catch (error) {
        toast.error("Error loading wishlist: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const removeFromWishlist = async (productId) => {
    try {
      const storedUser = localStorage.getItem("user-info");
      const response = await fetch("http://localhost:8000/api/wishlist/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: "Bearer " + JSON.parse(storedUser).token,
        },
        body: JSON.stringify({ product_id: productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove from wishlist");
      }

      setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
      toast.success("Product removed from wishlist");
    } catch (error) {
      toast.error("Error removing from wishlist: " + error.message);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading your wishlist...</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Wishlist</h2>
      
      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <h4>Your wishlist is empty</h4>
          <p>Start adding products to your wishlist!</p>
          <Link to="/" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          {wishlistItems.map((product) => (
            <div className="col-md-3 col-sm-6 mb-4" key={product.product_id}>
              <div className="card h-100">
                <Link to={`/productdetails/${product.product_id}`} className="text-decoration-none">
                  <img
                    src={`http://localhost:8000/storage/${product.product_img1}`}
                    className="card-img-top"
                    alt={product.product_name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.product_name}</h5>
                    <p className="card-text">${product.product_price}</p>
                  </div>
                </Link>
                <div className="card-footer bg-white border-top-0">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromWishlist(product.product_id)}
                  >
                    Remove
                  </button>
                  <button className="btn btn-primary btn-sm ms-2">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Wishlist;