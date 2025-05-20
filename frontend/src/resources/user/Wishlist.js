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
        const userId = JSON.parse(storedUser).user_id;
        const response = await fetch(`http://localhost:8000/api/wishlist?user_id=${userId}`, {
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
      console.warn("Removing product with ID:", productId, "for user:", JSON.parse(storedUser).user_id);
      const response = await fetch("http://localhost:8000/api/wishlist/remove", {
         method: 'POST',
        body: JSON.stringify({ product_id: productId , user_id: JSON.parse(storedUser).user_id }),
                headers: {
                    "Content-Type": 'application/json',
                    "Accept": 'application/json'
                }
      });

      let result = await response.json();
      if (result.success) {
       toast.success(result.message);
      setWishlistItems(wishlistItems.filter(item => item.product_id !== productId));
      }else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error removing from wishlist: " + error.message);
    }
  };

  // --- Styling ---
  const pageStyle = {
    maxWidth: "1200px",
    margin: "60px auto",
    padding: "36px 24px",
    background: "linear-gradient(120deg, #fdf4e5 80%, #e3f2fd 100%)",
    borderRadius: "18px",
    boxShadow: "0 8px 36px rgba(30,136,229,0.09), 0 2px 8px rgba(0,0,0,0.04)",
    fontFamily: "'Open Sans', sans-serif",
    color: "#333",
    border: "1px solid #e3f2fd",
    position: "relative",
    minHeight: "70vh",
  };

  const backArrowStyle = {
    display: "inline-flex",
    alignItems: "center",
    color: "#1976d2",
    fontWeight: 600,
    fontSize: "1.1em",
    textDecoration: "none",
    marginBottom: "18px",
    transition: "color 0.2s",
    cursor: "pointer",
    background: "none",
    border: "none",
    outline: "none",
    padding: 0,
  };

  const arrowIconStyle = {
    fontSize: "2em",
    marginRight: "8px",
    transition: "transform 0.2s",
    display: "inline-block",
  };

  const cardStyle = {
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(30,136,229,0.07)",
    border: "1px solid #e3f2fd",
    transition: "box-shadow 0.2s",
    background: "#fff",
    position: "relative",
    overflow: "hidden",
    minHeight: "340px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const cardImgStyle = {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px 10px 0 0",
    background: "#fafdff",
    borderBottom: "1px solid #e3f2fd",
  };

  const cardBodyStyle = {
    padding: "18px 12px 8px 12px",
    flexGrow: 1,
    textAlign: "center",
  };

  const cardFooterStyle = {
    background: "#fffde7",
    borderTop: "1px solid #fbbe28",
    borderRadius: "0 0 12px 12px",
    padding: "10px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  };

  const removeBtnStyle = {
    background: "#e53935",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 14px",
    fontWeight: 600,
    fontSize: "0.98em",
    cursor: "pointer",
    transition: "background 0.2s",
  };

  const addToCartBtnStyle = {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "6px 14px",
    fontWeight: 600,
    fontSize: "0.98em",
    cursor: "pointer",
    transition: "background 0.2s",
  };



const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f7fa',
  },
  spinner: {
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #3498db',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '20px',
    fontSize: '18px',
    color: '#555',
  }
};

if (loading) {
  return (
    <div style={styles.loadingContainer}>
      <div className="spinner"></div>

      <p style={styles.loadingText}>Please wait, loading...</p>
    </div>
  );
}




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

  return (
    <div style={pageStyle}>
      <Link to="/" style={backArrowStyle}>
        <span style={arrowIconStyle}>&#8592;</span>
      </Link>
      <h2 className="mb-4" style={{ color: "#1976d2", fontWeight: 700 }}>
        My Wishlist
      </h2>

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
              <div style={cardStyle}>
                <Link to={`/productdetails/${product.product_id}`} className="text-decoration-none">
                  <img
                    src={`http://localhost:8000/storage/${product.product_img1}`}
                    style={cardImgStyle}
                    alt={product.product_name}
                  />
                  <div style={cardBodyStyle}>
                    <h5 className="card-title" style={{ color: "#222", fontWeight: 600 }}>
                      {product.product_name}
                    </h5>
                    <p className="card-text" style={{ color: "#1976d2", fontWeight: 700 }}>
                      ${product.product_price}
                    </p>
                  </div>
                </Link>
                <div style={cardFooterStyle}>
                  <button
                    style={removeBtnStyle}
                    onClick={() => removeFromWishlist(product.product_id)}
                  >
                    Remove
                  </button>
                  <button style={addToCartBtnStyle} onClick={() => addToCart(product.product_id)}>
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