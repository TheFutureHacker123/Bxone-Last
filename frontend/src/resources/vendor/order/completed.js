import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser, FaPen, } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import "../style/new-orders.css";

function CompletedOrders() {
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

  useEffect(() => {
    async function listProductDetail() {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user-info"));
        const vendorId = storedUser?.vendor_id;

        let response = await fetch(`http://localhost:8000/api/vendor/orderlist`, {
          method: 'POST',
          body: JSON.stringify({
            vendor_id: vendorId,
            order_status: "Completed"
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


  return (
    <div className="dashboard-wrapper">
      <button className="hamburger-btn" onClick={toggleSidebar}><FaBars /></button>

      <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <h2 className="text-center custom-css mt-2 ms-4">Vendor Dashboard</h2>

        <a href="/vendor" className="custom-link">
          <FaChartLine className="me-2" /> Analytics
        </a>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("products")}>
            <FaBox className="me-2" /> Manage Products
          </div>
          {openDropdown === "products" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><a href="/vendor/add-products" className="dropdown-item-vendor">Add Products</a></li>
              <li><a href="/vendor/add-coupons" className="dropdown-item-vendor">Add Coupons</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("orders")}>
            <FaShoppingCart className="me-2" /> Manage Orders
          </div>
          {openDropdown === "orders" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><a href="/vendor/new-orders" className="dropdown-item-vendor">New Order</a></li>
              <li><a href="/vendor/shipped" className="dropdown-item-vendor">Shipped</a></li>
              <li><a href="/vendor/refunds" className="dropdown-item-vendor">Refund</a></li>
              <li><a href="/vendor/completed" className="dropdown-item-vendor">Completed</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("messages")}>
            <FaComments className="me-2" /> Manage Messages
          </div>
          {openDropdown === "messages" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><a href="/vendor/user-messages" className="dropdown-item-vendor">User Message</a></li>
              <li><a href="/vendor/admin-messages" className="dropdown-item-vendor">Admin Message</a></li>
              <li><a href="/vendor/review-messages" className="dropdown-item-vendor">Review Message</a></li>
              <li><a href="/vendor/notifications" className="dropdown-item-vendor">Notification</a></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("profile")}>
            <FaUser className="me-2" /> Profile
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><a href="/vendor/manage-profile" className="dropdown-item-vendor">Updated Password</a></li>
              <li><a href="#logout" className="dropdown-item-vendor">Logout</a></li>
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

export default CompletedOrders;
