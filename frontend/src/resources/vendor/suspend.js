import React from 'react';
import './style/suspended.css'; // Your existing vendor styles

const VendorSuspended = () => {
  return (
    <div className="vendor-main-container">
      <div className="vendor-center-box">
        <div className="vendor-card vendor-review-card">
          <h1 className="vendor-heading vendor-text-danger">Account Suspended</h1>
          <p className="vendor-text">
            Your vendor account has been <strong>suspended</strong> due to a violation of our platform policies or missing required information.
          </p>
          <p className="vendor-text">
            Please contact our support team to resolve the issue and restore access to your dashboard.
          </p>
          <button className="vendor-btn vendor-btn-danger" onClick={() => window.location.href = "/vendor/support"}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorSuspended;
