import React, { useState } from 'react';
import './style/support.css'; // Your existing vendor styles

const VendorSupport = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can replace this with an API call to send support request
    alert("Your support request has been submitted.");
  };

  return (
    <div className="vendor-main-container">
      <div className="vendor-center-box">
        <div className="vendor-card vendor-review-card">
          <h1 className="vendor-heading">Vendor Support</h1>
          <p className="vendor-text">Need help? Fill out the form below and our support team will get back to you within 24-48 hours.</p>

          <form className="vendor-form" onSubmit={handleSubmit}>
            <div className="vendor-form-group">
              <label className="vendor-label">Subject</label>
              <input
                type="text"
                name="subject"
                className="vendor-input"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="vendor-form-group">
              <label className="vendor-label">Message</label>
              <textarea
                name="message"
                className="vendor-input"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button type="submit" className="vendor-btn">Submit Request</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorSupport;
