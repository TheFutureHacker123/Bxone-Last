import React from 'react';
import './style/underreview.css'; // Your existing vendor styles

const VendorUnderReview = () => {
  return (
    <div className="vendor-main-container">
      <div className="vendor-center-box">
        <div className="vendor-card vendor-review-card">
          <h1 className="vendor-heading">Account Under Review</h1>
          <p className="vendor-text">
            Your vendor account is currently under review by our team. We are verifying your information to ensure everything is set up correctly.
          </p>
          <p className="vendor-text">
            It will take up to <strong>3 working days</strong> to complete the review process.
          </p>
          <p className="vendor-text">
            You will be notified once your account has been approved.
          </p>
          <button className="vendor-btn" onClick={() => window.location.href = "/vendor/support"}>
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorUnderReview;
