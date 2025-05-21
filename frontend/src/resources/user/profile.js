import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);
  const [content, setContent] = useState({});
  const [userId] = useState(1); // Mock user_id - ensure this is the actual user's ID

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/userinfo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const fetchOrderHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/orderhistory/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order history");
        }
        const data = await response.json();
        setOrderHistory(data);
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    };

    const loadContent = () => {
      const englishContent = {
        profile_title: "My Profile",
        personal_information: "Personal Information",
        name: "Name",
        email: "Email",
        phone: "Phone Number",
        addresses: "Addresses",
        edit_profile: "Edit Profile",
        order_history: "Order History",
        order_id: "Order ID",
        order_date: "Order Date",
        order_status: "Order Status",
        total_amount: "Total Amount",
        view_details: "View Details",
        no_orders: "No orders yet.",
        change_password: "Change Password",
      };
      setContent(englishContent);
    };

    fetchUserInfo();
    fetchOrderHistory();
    loadContent();
  }, [userId]);

  return (
    <div className="container mt-5">
      <h6
        className="mb-4 text-center"
        style={{ fontSize: "2.5rem", color: "#333" }}
      >
        {content.profile_title || "My Profile"}
      </h6>

      <div className="row">
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                {content.personal_information || "Personal Information"}
              </h5>
            </div>
            <div className="card-body">
              {userInfo ? (
                <div>
                  {userInfo.name && (
                    <p>
                      <strong>{content.name || "Name"}:</strong> {userInfo.name}
                    </p>
                  )}
                  {userInfo.email && (
                    <p>
                      <strong>{content.email || "Email"}:</strong> {userInfo.email}
                    </p>
                  )}

                  {userInfo.addresses && userInfo.addresses.length > 0 && (
                    <div>
                      {userInfo.addresses.map((address) => (
                        <div key={address.address_id}>

                          <p>
                            <strong>{content.name || "Name"}:</strong>{" "}
                            {address.full_name}
                          </p>
                          <p>
                            <strong>Address:</strong> {address.city},{" "}
                            {address.state} {address.post}, {address.country}
                          </p>
                          <p>
                            <strong>{content.phone || "Phone Number"}:</strong>{" "}
                            {address.phone}
                          </p>
                          <hr />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p>Loading user information...</p>
              )}
            </div>
          </div>
        </div>

        {/* Order History Section */}
        <div className="col-md-6">
          <div className="card mb-4">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0">
                {content.order_history || "Order History"}
              </h5>
            </div>
            <div className="card-body">
              {orderHistory.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>{content.order_id || "Order ID"}</th>
                        <th>{content.order_date || "Order Date"}</th>
                        <th>{content.order_status || "Order Status"}</th>
                        <th>{content.total_amount || "Total Amount"}</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderHistory.map((order) => (
                        <tr key={order.order_id}>
                          <td>{order.order_id}</td>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>{order.order_status}</td>
                          <td>{order.total_paid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>{content.no_orders || "No orders yet."}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;