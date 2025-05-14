import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser, FaPen, } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import Translation from "../../translations/vendor.json";
import "../style/new-orders.css";

function ShippedItems() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderDetail, setOrderDetail] = useState([]);
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");


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


  useEffect(() => {
    async function listProductDetail() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("vendor-info"));
        const vendorId = storedUser?.vendor_id;

        let response = await fetch(`http://localhost:8000/api/vendor/orderlist`, {
          method: 'POST',
          body: JSON.stringify({
            vendor_id: vendorId,
            order_status: "Shipped"
          }),
          headers: {
            "Content-Type": 'application/json',
            "Accept": 'application/json'
          }
        });

        let result = await response.json();
        setOrderDetail(result);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }

    listProductDetail();
  }, []);

  const totalProducts = orderDetail.length;
  const totalPages = Math.ceil(totalProducts / entries);

  const filteredProducts = orderDetail.filter(product =>
    product.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.order_status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedProducts = filteredProducts.slice(
    (currentPage - 1) * entries,
    currentPage * entries
  );

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const handleDropdown = (menu) => setOpenDropdown(openDropdown === menu ? null : menu);

  const handleDetailClick = (product) => {
    setSelectedProduct(product);
    setPopupVisible(true);
  };

  const handlePrint = () => {
    const printContent = `
      <h1>Order Details</h1>
      <p><strong>Address:</strong> ${selectedProduct.address}</p>
      <p><strong>Phone:</strong> ${selectedProduct.phone}</p>
      <p><strong>Total Paid:</strong> ${selectedProduct.total_paid}</p>
      <p><strong>Ordered Quantity:</strong> ${selectedProduct.ordered_quantity}</p>
    `;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setNewStatus(product.order_status);
    setEditPopupVisible(true);
  };

  function logout() {
    localStorage.clear();
    toast.success("Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTimeout(() => {
      navigate("/vendor/login");
    }, 1000); // Delay the navigation for 3 seconds
  }


  return (
    <div className="dashboard-wrapper">
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <FaBars style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
      </button>

      <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
              <div className="d-flex align-items-center ">
                <span className="text-center custom-css flex-grow-1 mt-1 ms-3" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.vendor_dashboard || "Vendor Dashboard"}
                </span>
              </div>
      
              <Link to="/vendor" className="custom-link">
                <FaChartLine className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.analytics || "Analytics"}
                </span>
              </Link>
      
              <div className="dropdown">
                <div className="custom-link" onClick={() => handleDropdown("products")}>
                  <FaBox className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.manage_products || "Manage Products"}
                  </span>
                </div>
                {openDropdown === "products" && (
                  <ul className="dropdown-menu custom-dropdown-menu">
                    <li>
                      <Link to="/vendor/add-products" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.add_products || "Add Products"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/add-coupons" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.add_coupons || "Add Coupons"}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
      
              <div className="dropdown">
                <div className="custom-link" onClick={() => handleDropdown("orders")}>
                  <FaShoppingCart className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.manage_orders || "Manage Orders"}
                  </span>
                </div>
                {openDropdown === "orders" && (
                  <ul className="dropdown-menu custom-dropdown-menu">
                    <li>
                      <Link to="/vendor/new-orders" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.new_order || "New Order"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/shipped" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.shipped || "Shipped"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/refunds" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.refund || "Refund"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/completed" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.completed || "Completed"}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
      
              <div className="dropdown">
                <div className="custom-link" onClick={() => handleDropdown("messages")}>
                  <FaComments className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.manage_messages || "Manage Messages"}
                  </span>
                </div>
                {openDropdown === "messages" && (
                  <ul className="dropdown-menu custom-dropdown-menu">
                    <li>
                      <Link to="/vendor/user-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.user_message || "User Message"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/admin-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.admin_message || "Admin Message"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/review-messages" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.review_message || "Review Message"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/notifications" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.notifications || "Notification"}
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
      
              <div className="dropdown">
                <div className="custom-link" onClick={() => handleDropdown("profile")}>
                  <FaUser className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
                  <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                    {content?.profile || "Profile"}
                  </span>
                </div>
                {openDropdown === "profile" && (
                  <ul className="dropdown-menu custom-dropdown-menu">
                    <li>
                      <Link to="/vendor/setting" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.settings || "Settings"}
                      </Link>
                    </li>
                    <li>
                      <Link to="/vendor/manage-profile" className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.update_password || "Updated Password"}
                      </Link>
                    </li>
                    <li>
                      <a onClick={logout} className="dropdown-item-vendor" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                        {content?.logout || "Logout"}
                      </a>
                    </li>
                  </ul>
                )}
              </div>
            </div>

      <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="custom-header text-center">
          <h1 className="h4 mb-0">Completed Items</h1>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by product name or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="custom-table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product Name</th>
                <th>Product Image</th>
                <th>Payment Method</th>
                <th>Order Time</th>
                <th>Status</th>
                <th>Buyer Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts.map((product, index) => (
                <tr key={product.order_id}>
                  <td>{(currentPage - 1) * entries + index + 1}</td>

                  <td>{product.product_name}</td>
                  <td>
                    <img
                      src={`http://localhost:8000/storage/${product.product_image}`}
                      className="product-image"
                      alt={product.product_name}
                    />
                  </td>
                  <td>{product.payment_method}</td>
                  <td>{product.order_time}</td>
                  <td>{product.order_status}</td>
                  <td>
                    <button className="see-detail" onClick={() => handleDetailClick(product)}>
                      See Detail
                    </button>
                  </td>
                  <td>
                    <button className="edit-button" onClick={() => handleEditClick(product)}>
                      <FaPen />
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {popupVisible && selectedProduct && (
          <div className="popup-overlay">
            <div className="popup-content">

              <h2>Order Details</h2>
              <p><strong>Address:</strong> {selectedProduct.address}</p>
              <p><strong>Phone:</strong> {selectedProduct.phone}</p>
              <p><strong>Total Paid:</strong> {selectedProduct.total_paid}</p>
              <p><strong>Ordered Quantity:</strong> {selectedProduct.ordered_quantity}</p>
              <div className="popup-buttons">

                <button onClick={() => setPopupVisible(false)}>Close</button>
                <button onClick={handlePrint}>🖨️ Print</button>
              </div>
            </div>
          </div>
        )}


        {totalPages > 1 && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
            <span>Page {currentPage} of {totalPages}</span>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </div>
        )}
        {editPopupVisible && editingProduct && (
          <div className="popup-overlay">
            <div className="popup-content">

              <h2>Edit Order Status</h2>
              <p><strong>Product:</strong> {editingProduct.product_name}</p>

              <label>Status:</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="custom-dropdown"
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Shipped">Shipped</option>
              </select>

              <div className="popup-buttons mt-3">
                <button onClick={() => setEditPopupVisible(false)}>Cancel</button>
                <button
                  onClick={async () => {
                    try {
                      const response = await fetch("http://localhost:8000/api/vendor/update-order-status", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Accept: "application/json"
                        },
                        body: JSON.stringify({
                          order_id: editingProduct.order_id,
                          new_status: newStatus
                        }),
                      });

                      if (response.ok) {
                        toast.success("Status updated successfully!", {
                          position: "top-right",
                          autoClose: 3000,
                        });
                        setTimeout(() => window.location.reload(), 1000);
                      } else {
                        toast.error("Error updating status.");
                      }
                    } catch (error) {
                      toast.error("Failed to update status.");
                    }
                  }}
                >
                  Save
                </button>

              </div>
            </div>
          </div>
        )}


        <ToastContainer />
      </div>
    </div>
  );
}

export default ShippedItems;
