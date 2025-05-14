import React, { useState, useEffect } from "react";
import { FaBars, FaChartLine, FaStore, FaUsers, FaUser } from "react-icons/fa";
import { Bar } from 'react-chartjs-2';
import Translation from "../translations/admin.json";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./style/admindashboard.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function AdminDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [analytics, setAnalytics] = useState({
    total_orders: 0,
    pending_orders: 0,
    shipped_orders: 0,
    completed_orders: 0,
    daily_orders: {
      dates: [],
      counts: [],
    },
  });

  const defaultFontSize = 'medium';
  const defaultFontColor = '#000000';
  const defaultLanguage = 'english';

  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || defaultFontSize);
  const [fontColor, setFontColor] = useState(() => localStorage.getItem('fontColor') || defaultFontColor);
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || defaultLanguage);
  const [content, setContent] = useState(Translation[language]);

  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.style.setProperty('--font-size', fontSize);
    document.documentElement.style.setProperty('--font-color', fontColor);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('fontColor', fontColor);
    localStorage.setItem('language', language);
    setContent(Translation[language]);
  }, [fontSize, fontColor, language]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/admin/analytics", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        toast.error("Failed to fetch analytics data");
      }
    };

    fetchAnalytics();
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  function logout() {
    localStorage.clear();
    toast.success(content?.logout || "Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
    });
    setTimeout(() => {
      navigate("/admin/login");
    }, 1000);
  }

  const chartData = {
    labels: analytics.daily_orders.dates,
    datasets: [
      {
        label: content?.daily_orders || 'Daily Orders',
        data: analytics.daily_orders.counts,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: content?.daily_orders_title || 'Daily Orders Analytics',
      },
    },
  };

  return (
    <div className="admin-dashboard-wrapper">
      <button className="admin-hamburger-btn" onClick={toggleSidebar}>
        <FaBars style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
      </button>

      <div className={`admin-custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <div className="d-flex align-items-center mb-3">
          <span className="text-center admin-custom-css flex-grow-1 mt-2 ms-4" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
            {content?.admin_dashboard_title || "Admin Dashboard"}
          </span>
        </div>

        <Link to="/admin/" className="admin-custom-link">
          <FaChartLine className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
          <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
            {content?.dashboard || "Dashboard"}
          </span>
        </Link>

        {/* User Management Dropdown */}
        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("products")}>
            <FaUsers className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
              {content?.user_management || "User Management"}
            </span>
          </div>
          {openDropdown === "products" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li>
                <Link to="/admin/list-users" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.list_users || "List Users"}
                </Link>
              </li>
              <li>
                <Link to="/admin/user-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.user_messages || "User Messages"}
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Vendor Management Dropdown */}
        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("orders")}>
            <FaStore className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
              {content?.vendor_management || "Vendor Management"}
            </span>
          </div>
          {openDropdown === "orders" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li>
                <Link to="/admin/new-vendors" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.new_vendors || "New Vendors"}
                </Link>
              </li>
              <li>
                <Link to="/admin/list-vendors" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.list_of_vendors || "List of Vendors"}
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-products" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.manage_products || "Manage Products"}
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-orders" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.manage_orders || "Manage Orders"}
                </Link>
              </li>
              <li>
                <Link to="/admin/approve-payout" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.approve_payout || "Approve Payout"}
                </Link>
              </li>
              <li>
                <Link to="/admin/vendor-messages" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.vendor_messages || "Vendor Messages"}
                </Link>
              </li>
            </ul>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="dropdown">
          <div className="admin-custom-link" onClick={() => handleDropdown("profile")}>
            <FaUser className="me-2" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }} />
            <span style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
              {content?.profile || "Profile"}
            </span>
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu admin-custom-dropdown-menu">
              <li>
                <Link to="/admin/manage-password" className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.update_password || "Update Password"}
                </Link>
              </li>
              <li>
                <a onClick={logout} className="dropdown-item-admin" style={{ color: fontColor === '#000000' ? '#FFFFFF' : fontColor }}>
                  {content?.logout || "Logout"}
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div className={`admin-main-content ${sidebarVisible ? "with-sidebar" : "full-width"}`}>
        <div className="admin-custom-header text-center">
          <h1 className="h4 mb-0">{content?.welcome || "Welcome to the Admin Dashboard"}</h1>
        </div>

        <div className="analytics-section">
          <h2 className="h5">{content?.analytics_dashboard || "Analytics Dashboard"}</h2>
          <div className="analytics-cards">
            <div className="analytics-card">
              <h3>{content?.total_orders || "Total Orders"}</h3>
              <p>{analytics.total_orders}</p>
            </div>
            <div className="analytics-card">
              <h3>{content?.pending_orders || "Pending Orders"}</h3>
              <p>{analytics.pending_orders}</p>
            </div>
            <div className="analytics-card">
              <h3>{content?.shipped || "Shipped"}</h3>
              <p>{analytics.shipped_orders}</p>
            </div>
            <div className="analytics-card">
              <h3>{content?.complete_orders || "Complete Orders"}</h3>
              <p>{analytics.completed_orders}</p>
            </div>
          </div>
          <div className="analytics-chart">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AdminDashboard;