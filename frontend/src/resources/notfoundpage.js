// NotFound.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './not-found.css';

const NotFound = () => {
    const navigate = useNavigate();

    const handleRedirect = () => {
        const userInfo = JSON.parse(localStorage.getItem("user-info"));
        const vendorInfo = JSON.parse(localStorage.getItem("vendor-info"));
        const adminInfo = JSON.parse(localStorage.getItem("admin-info"));

        if (adminInfo && adminInfo.admin_id && adminInfo.admin_role_id === "Admin") {
            navigate("/admin/");
        } else if (vendorInfo && vendorInfo.vendor_id && vendorInfo.vendor_role_id === "Vendor") {
            const status = vendorInfo.status;
            if (status === "Pending") {
                navigate("/vendor/underreview/");
            } else if (status === "Verified" || status === "Active") {
                navigate("/vendor/");
            } else if (status === "Rejected" || status === "UnVerified") {
                navigate("/vendor/vendor-info/");
            } else if (status === "Suspended") {
                navigate("/vendor/suspend/");
            } else {
                navigate("/vendor/");
            }
        } else if (userInfo && userInfo.user_id && userInfo.user_role_id === "User") {
            navigate("/");
        } else {
            // If no role found, go to homepage
            navigate("/");
        }
    };

    return (
        <div className="not-found-container">
            <h1 className="not-found-title">404</h1>
            <p className="not-found-message">Oops! Page Not Found</p>
            <p className="not-found-description">The page you are looking for does not exist.</p>
            <button onClick={handleRedirect} className="not-found-link">Go Back Home</button>
        </div>
    );
};

export default NotFound;
