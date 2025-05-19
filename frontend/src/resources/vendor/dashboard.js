import React, { useState, useEffect } from "react";
import {
  FaBars,
  FaChartLine,
  FaBox,
  FaShoppingCart,
  FaComments,
  FaUser,
} from "react-icons/fa";
import { Card } from "react-bootstrap";
import { Bar } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import Translation from "../translations/vendor.json";
import "./style/dashboard.css";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

function VendorDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();

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

  const [vendorInfo, setVendorInfo] = useState(null);

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
  }, [fontSize, fontColor, language]);

  useEffect(() => {
    // Fetch vendor info from backend or localStorage
    const info = JSON.parse(localStorage.getItem("vendor-info"));
    setVendorInfo(info);
  }, []);

  useEffect(() => {
    if (vendorInfo && !vendorInfo.has_completed_info) {
      // Redirect or show message
      navigate("/vendor/dashboard");
      toast.error("Your account must be approved by admin to add coupons.");
    }
  }, [vendorInfo]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const vendorInfo = JSON.parse(localStorage.getItem("vendor-info"));
        const vendorId = vendorInfo?.vendor_id;

        if (!vendorId) {
          toast.error("Vendor ID not found");
          return;
        }

        const response = await fetch(
          "http://localhost:8000/api/vendor/analytics",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ vendor_id: vendorId }),
          }
        );

        if (!response.ok) throw new Error("Network response was not ok");

        const data = await response.json();
        setAnalytics(data);
      } catch (error) {
        toast.error("Failed to fetch analytics data");
      }
    };

    fetchAnalytics();
  }, []);

  const data = {
    labels: analytics.daily_orders.dates,
    datasets: [
      {
        label: content?.sales || "Sales ($)",
        data: analytics.daily_orders.counts,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: content?.monthly_sales || "Monthly Sales Analytics",
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
        <FaBars
          style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
        />
      </button>

      <div className={`custom-sidebar ${sidebarVisible ? "show" : "hide"}`}>
        <div className="d-flex align-items-center ">
          <span
            className="text-center custom-css flex-grow-1 mt-1 ms-3"
            style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
          >
            {content?.vendor_dashboard || "Vendor Dashboard"}
          </span>
        </div>

        <Link to="/vendor" className="custom-link">
          <FaChartLine
            className="me-2"
            style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
          />
          <span
            style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
          >
            {content?.analytics || "Analytics"}
          </span>
        </Link>

        <div className="dropdown">
          <div
            className="custom-link"
            onClick={() => handleDropdown("products")}
          >
            <FaBox
              className="me-2"
              style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
            />
            <span
              style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
            >
              {content?.manage_products || "Manage Products"}
            </span>
          </div>
          {openDropdown === "products" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li>
                <Link
                  to="/vendor/add-products"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.add_products || "Add Products"}
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor/add-coupons"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.add_coupons || "Add Coupons"}
                </Link>
              </li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div className="custom-link" onClick={() => handleDropdown("orders")}>
            <FaShoppingCart
              className="me-2"
              style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
            />
            <span
              style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
            >
              {content?.manage_orders || "Manage Orders"}
            </span>
          </div>
          {openDropdown === "orders" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li>
                <Link
                  to="/vendor/new-orders"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.new_order || "New Order"}
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor/shipped"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.shipped || "Shipped"}
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor/refunds"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.refund || "Refund"}
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor/completed"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.completed || "Completed"}
                </Link>
              </li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div
            className="custom-link"
            onClick={() => handleDropdown("messages")}
          >
            <FaComments
              className="me-2"
              style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
            />
            <span
              style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
            >
              {content?.manage_messages || "Manage Messages"}
            </span>
          </div>
          {openDropdown === "messages" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              {/* <li>
                <Link
                  to="/vendor/user-messages"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.user_message || "User Message"}
                </Link>
              </li> */}
              <li>
                <Link
                  to="/vendor/admin-messages"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.admin_message || "Admin Message"}
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor/review-messages"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.review_message || "Review Message"}
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor/notifications"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.notifications || "Notification"}
                </Link>
              </li>
            </ul>
          )}
        </div>

        <div className="dropdown">
          <div
            className="custom-link"
            onClick={() => handleDropdown("profile")}
          >
            <FaUser
              className="me-2"
              style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
            />
            <span
              style={{ color: fontColor === "#000000" ? "#FFFFFF" : fontColor }}
            >
              {content?.profile || "Profile"}
            </span>
          </div>
          {openDropdown === "profile" && (
            <ul className="dropdown-menu custom-dropdown-menu">
              <li>
                <Link
                  to="/vendor/setting"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.settings || "Settings"}
                </Link>
              </li>
              <li>
                <Link
                  to="/vendor/manage-profile"
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.update_password || "Updated Password"}
                </Link>
              </li>
              <li>
                <a
                  onClick={logout}
                  className="dropdown-item-vendor"
                  style={{
                    color: fontColor === "#000000" ? "#FFFFFF" : fontColor,
                  }}
                >
                  {content?.logout || "Logout"}
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>

      <div
        className={`main-content ${
          sidebarVisible ? "with-sidebar" : "full-width"
        }`}
      >
        <div className="custom-header text-center">
          <h1 className="h4 mb-0">
            {content?.welcome_vendor_dashboard ||
              "Welcome to the Vendor Dashboard"}
          </h1>
        </div>

        <div id="analytics" className="analytics-section">
          <h2 className="h5">
            {content?.analytics_dashboard || "Analytics Dashboard"}
          </h2>
          <div className="analytics-cards">
            <Card className="analytics-card">
              <Card.Body>
                <Card.Title>
                  {content?.total_orders || "Total Orders"}
                </Card.Title>
                <Card.Text>{analytics.total_orders}</Card.Text>
              </Card.Body>
            </Card>
            <Card className="analytics-card">
              <Card.Body>
                <Card.Title>
                  {content?.pending_orders || "Pending Orders"}
                </Card.Title>
                <Card.Text>{analytics.pending_orders}</Card.Text>
              </Card.Body>
            </Card>
            <Card className="analytics-card">
              <Card.Body>
                <Card.Title>{content?.shipped || "Shipped"}</Card.Title>
                <Card.Text>{analytics.shipped_orders}</Card.Text>
              </Card.Body>
            </Card>
            <Card className="analytics-card">
              <Card.Body>
                <Card.Title>
                  {content?.complete_orders || "Complete Orders"}
                </Card.Title>
                <Card.Text>{analytics.completed_orders}</Card.Text>
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
