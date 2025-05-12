import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaBox, FaShoppingCart, FaComments, FaUser } from "react-icons/fa";
import { Card } from "react-bootstrap";
import { Bar } from 'react-chartjs-2';
import { ToastContainer, toast } from 'react-toastify';
import { Link, useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import Translation from "../translations/vendor.json";
import "./style/dashboard.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function VendorDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
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

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: content?.sales || 'Sales ($)',
        data: [1500, 2000, 1800, 2200, 3000, 2500],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: content?.monthly_sales || 'Monthly Sales Analytics',
      },
    },
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  function logout() {
    localStorage.clear();
    toast.success(content?.logout_success || "Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setTimeout(() => {
      navigate("/vendor/login");
    }, 1000);
  }

  return (
    <div className="dashboard-wrapper">
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <FaBars />
      </button>

      <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <h2 className="text-center custom-css flex-grow-1 mt-2 ms-4">{content?.vendor_dashboard || "Vendor Dashboard"}</h2>
        <Link to="/vendor" className="custom-link">
          <FaChartLine className="me-2" /> {content?.analytics || "Analytics"}
        </Link>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("products")}>
            <FaBox className="me-2" /> {content?.manage_products || "Manage Products"}
          </div>
          {openDropdown === "products" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><Link to="/vendor/add-products" className="dropdown-item-vendor">{content?.add_products || "Add Products"}</Link></li>
              <li><Link to="/vendor/add-coupons" className="dropdown-item-vendor">{content?.add_coupons || "Add Coupons"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("orders")}>
            <FaShoppingCart className="me-2" /> {content?.manage_orders || "Manage Orders"}
          </div>
          {openDropdown === "orders" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><Link to="/vendor/new-orders" className="dropdown-item-vendor">{content?.new_orders || "New Order"}</Link></li>
              <li><Link to="/vendor/shipped" className="dropdown-item-vendor">{content?.shipped || "Shipped"}</Link></li>
              <li><Link to="/vendor/refunds" className="dropdown-item-vendor">{content?.refunds || "Refund"}</Link></li>
              <li><Link to="/vendor/completed" className="dropdown-item-vendor">{content?.completed || "Completed"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("messages")}>
            <FaComments className="me-2" /> {content?.manage_messages || "Manage Messages"}
          </div>
          {openDropdown === "messages" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><Link to="/vendor/user-messages" className="dropdown-item-vendor">{content?.user_message || "User Message"}</Link></li>
              <li><Link to="/vendor/admin-messages" className="dropdown-item-vendor">{content?.admin_message || "Admin Message"}</Link></li>
              <li><Link to="/vendor/review-messages" className="dropdown-item-vendor">{content?.review_message || "Review Message"}</Link></li>
              <li><Link to="/vendor/notifications" className="dropdown-item-vendor">{content?.notifications || "Notification"}</Link></li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("profile")}>
            <FaUser className="me-2" /> {content?.profile || "Profile"}
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li><Link to="/vendor/manage-profile" className="dropdown-item-vendor">{content?.update_password || "Updated Password"}</Link></li>
              <li><a onClick={logout} className="dropdown-item-vendor">{content?.logout || "Logout"}</a></li>
            </ul>
          )}
        </div>
      </div>

      <div className={`main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="custom-header text-center">
          <h1 className="h4 mb-0">{content?.welcome || "Welcome to the Vendor Dashboard"}</h1>
        </div>

        <div id="analytics" className="analytics-section">
          <h2 className="h5">{content?.analytics_dashboard || "Analytics Dashboard"}</h2>
          <div className="analytics-cards">
            <Card className="analytics-card">
              <Card.Body>
                <Card.Title>{content?.total_orders || "Total Orders"}</Card.Title>
                <Card.Text>1,500</Card.Text>
              </Card.Body>
            </Card>
            <Card className="analytics-card">
              <Card.Body>
                <Card.Title>{content?.pending_orders || "Pending Orders"}</Card.Title>
                <Card.Text>200</Card.Text>
              </Card.Body>
            </Card>
            <Card className="analytics-card">
              <Card.Body>
                <Card.Title>{content?.complete_orders || "Complete Orders"}</Card.Title>
                <Card.Text>1,200</Card.Text>
              </Card.Body>
            </Card>
            <Card className="analytics-card">
              <Card.Body>
                <Card.Title>{content?.reviews || "Reviews"}</Card.Title>
                <Card.Text>350</Card.Text>
              </Card.Body>
            </Card>
          </div>
          <div className="analytics-chart">
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default VendorDashboard;