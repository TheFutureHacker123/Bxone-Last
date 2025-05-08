import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../translations/lang.json";
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/ProductDetail.css';

function ProductDetail() {
  const [mainImage, setMainImage] = useState('');
  const [productInfo, setProductInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();
  const { product_id } = useParams();

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
    async function listProductDetail(product_id) {
      try {
        let response = await fetch(`http://localhost:8000/api/productdetails`, {
          method: 'POST',
          body: JSON.stringify({ product_id }),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });
        let result = await response.json();
        if (result.success && result.data.length > 0) {
          setProductInfo(result.data[0]); // Use first item for product info
          setReviews(result.data);
          setMainImage(`http://localhost:8000/storage/${result.data[0].product_images}`);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    listProductDetail(product_id);
  }, [product_id]);

  const changeImage = (src) => {
    setMainImage(src);
  };

  const handleContactSeller = () => {
    navigate('/ChatVendor');
  };

  const thumbnails = [
    productInfo?.product_images && `http://localhost:8000/storage/${productInfo.product_images}`,
    productInfo?.product_img2 && `http://localhost:8000/storage/${productInfo.product_img2}`,
    productInfo?.product_img3 && `http://localhost:8000/storage/${productInfo.product_img3}`,
    productInfo?.product_img4 && `http://localhost:8000/storage/${productInfo.product_img4}`,
    productInfo?.product_img5 && `http://localhost:8000/storage/${productInfo.product_img5}`
  ].filter(Boolean);




  const addToCart = async (productid) => {
    const storedUser = localStorage.getItem("user-info");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);



      let items = { product_id: productid, user_id: parsedUser.user_id };
      console.warn("Fuck Items", items)

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
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        } else {
          toast.error(result.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } catch (error) {
        toast.error('An error occurred. Please try again later.');
      }
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="container my-5 p-4 bg-white rounded shadow">
      <div className="row">
        <div className="d-flex justify-content-end">
          <button className="btn btn-warning contact-seller" onClick={handleContactSeller}>Contact Seller</button>
        </div>
        <div className="col-md-6 mt-5">
          <div className="product-image text-center">
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <img src={mainImage} alt="Main Product" style={{ width: '250px', height: '300px', objectFit: 'contain' }} />
            </div>

            <div className="thumbnails d-flex justify-content-center mt-2">
              {thumbnails.map((src, index) => (
                <img key={index} src={src} alt={`Thumbnail ${index + 1}`} className="img-thumbnail me-2" onClick={() => changeImage(src)} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-md-6 mt-4">
          <h3 className="mt-3">Product Name</h3>
          <p><strong>{productInfo?.product_name || "Loading..."}</strong></p>
          <div className="description mt-3 text-start">
            <h3>Description</h3>
            <p>{productInfo?.product_desc || "No description available."}</p>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h3>Product Reviews</h3>
            <div className="rating">★ {Math.round((reviews.reduce((acc, r) => acc + r.rate, 0) / reviews.length) * 10) / 10 || 0} / 5</div>
          </div>
          <div className="reviews-section mt-4 text-start">
            {reviews.map((review, index) => (
              <div key={index} className="review mb-2">
                <p><strong>{review.user_name}:</strong> {review.review_txt} ({'★'.repeat(review.rate)}{'☆'.repeat(5 - review.rate)})</p>
              </div>
            ))}
          </div>
        </div>
        <div className="product-info mt-4 d-flex flex-column align-items-center text-center">
          <h2>Product Price</h2>
          <p><strong>Price:</strong> ${productInfo?.product_price || 'N/A'}</p>
          <button
            className="btn btn-warning add-to-cart-button"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(productInfo?.product_id); // Use productInfo or correct object
            }}
          >
            Add to Cart
          </button>

        </div>
        <ToastContainer />
      </div>
    </div>
  );
}

export default ProductDetail;
