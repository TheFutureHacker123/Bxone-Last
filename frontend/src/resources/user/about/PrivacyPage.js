import React, { useState } from 'react';

function PrivacyPage() {
  const cardStyle = {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '30px 24px',
    background: 'linear-gradient(135deg, #fff 80%, #fbeee6 100%)',
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.10), 0 1.5px 3px rgba(0,0,0,0.04)',
    border: '1px solid #f3e9d2',
    transition: 'box-shadow 0.2s',
  };

  const sectionTitleStyle = {
    paddingBottom: '8px',
    marginBottom: '10px',
    cursor: 'pointer',
    fontWeight: 'bold',
    color: '#2c3e50',
    fontFamily: "'Merriweather', serif",
    fontSize: '1.15em',
    background: 'linear-gradient(90deg, #ffe082 0%, #fffde7 100%)',
    borderRadius: '6px',
    padding: '8px 12px',
    boxShadow: '0 1px 2px rgba(251,190,40,0.07)',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.2s, color 0.2s',
  };

  const sectionContentStyle = {
    paddingLeft: '18px',
    marginBottom: '15px',
    background: '#faf9f6',
    borderRadius: '6px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
    borderLeft: '3px solid #fbbe28',
    paddingTop: '10px',
    paddingBottom: '10px',
    transition: 'background 0.2s',
  };

  const paragraphStyle = {
    lineHeight: '1.7',
    marginBottom: '12px',
    fontSize: '1.05em',
    fontFamily: "'Open Sans', sans-serif",
    color: '#444',
    letterSpacing: '0.01em',
  };

  const listStyle = {
    paddingLeft: '25px',
    marginBottom: '12px',
    fontSize: '1em',
    fontFamily: "'Open Sans', sans-serif",
    color: '#444',
  };

  const headingStyle = {
    color: '#fbbe28',
    borderBottom: '2px solid #fbbe28',
    paddingBottom: '10px',
    marginBottom: '28px',
    fontFamily: "'Playfair Display', serif",
    fontSize: '2.3em',
    textAlign: 'center',
    letterSpacing: '1px',
    textShadow: '0 2px 8px #fbeee6',
  };

  const toggleButtonStyle = {
    marginLeft: 'auto',
    fontSize: '0.9em',
    fontFamily: 'sans-serif',
    fontWeight: 'normal',
    color: '#fbbe28',
    background: '#fffde7',
    borderRadius: '12px',
    padding: '2px 10px',
    border: '1px solid #ffe082',
    boxShadow: '0 1px 2px rgba(251,190,40,0.07)',
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
  };

  const iconStyle = {
    marginRight: '10px',
    color: '#fbbe28',
    fontSize: '1.2em',
    verticalAlign: 'middle',
  };

  const privacySections = [
    {
      title: 'Introduction',
      content: (
        <>
          <p style={paragraphStyle}>Last updated: <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>[Date]</span></p>
          <p style={paragraphStyle}>
            Your privacy is important to <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>Habesha Mart</span>. This Privacy Policy explains how we collect, use, and disclose your personal information when you use our platform.
          </p>
        </>
      ),
    },
    {
      title: '1. Information We Collect',
      content: (
        <p style={paragraphStyle}>
          We may collect personal information from you when you register on our platform, place an order, subscribe to our newsletter, or interact with our services. This information may include your name, email address, shipping address, payment information, and browsing activity.
        </p>
      ),
    },
    {
      title: '2. How We Use Your Information',
      content: (
        <>
          <p style={paragraphStyle}>We may use your personal information to:</p>
          <ul style={listStyle}>
            <li>Process and fulfill your orders.</li>
            <li>Communicate with you about your orders and our services.</li>
            <li>Personalize your experience on our platform.</li>
            <li>Send you marketing communications (if you have opted in).</li>
            <li>Improve our platform and services.</li>
          </ul>
        </>
      ),
    },
    {
      title: '3. Sharing Your Information',
      content: (
        <>
          <p style={paragraphStyle}>We may share your personal information with:</p>
          <ul style={listStyle}>
            <li>Vendors on our platform to fulfill your orders.</li>
            <li>Service providers who assist us with payment processing, shipping, and marketing.</li>
            <li>Legal authorities if required by law.</li>
          </ul>
        </>
      ),
    },
    {
      title: '4. Data Security',
      content: (
        <p style={paragraphStyle}>
          We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure.
        </p>
      ),
    },
    {
      title: '5. Your Rights',
      content: (
        <p style={paragraphStyle}>
          You may have certain rights regarding your personal information, including the right to access, correct, or delete your data. Please contact us at <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>[Your Contact Email Address]</span> if you wish to exercise these rights.
        </p>
      ),
    },
    {
      title: '6. Changes to this Privacy Policy',
      content: (
        <p style={paragraphStyle}>
          Habesha Mart may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on our platform.
        </p>
      ),
    },
    {
      title: 'Contact Us',
      content: (
        <p style={{ ...paragraphStyle, color: '#555', fontFamily: "'Open Sans', sans-serif" }}>
          If you have any questions about this Privacy Policy, please contact us at <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>[Your Contact Email Address]</span>.
        </p>
      ),
    },
  ];

  const [expandedSection, setExpandedSection] = useState(0);

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  // Optional: Add a lock icon for privacy
  const lockIcon = (
    <span style={iconStyle} role="img" aria-label="lock">
      <svg width="1em" height="1em" viewBox="0 0 16 16" fill="#fbbe28" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 1a4 4 0 0 0-4 4v3H3.5A1.5 1.5 0 0 0 2 9.5v4A1.5 1.5 0 0 0 3.5 15h9A1.5 1.5 0 0 0 14 13.5v-4A1.5 1.5 0 0 0 12.5 8H12V5a4 4 0 0 0-4-4zm-3 4a3 3 0 1 1 6 0v3H5V5zm-1.5 4h9A.5.5 0 0 1 13 9.5v4a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-4A.5.5 0 0 1 3.5 9z"/>
      </svg>
    </span>
  );

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(120deg, #fffbe7 0%, #fbeee6 100%)'
    }}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>{lockIcon} Privacy Policy</h1>
        {privacySections.map((section, index) => (
          <div key={index} style={{ marginBottom: '15px' }}>
            <h2
              style={{
                ...sectionTitleStyle,
                background: expandedSection === index
                  ? 'linear-gradient(90deg, #fbbe28 0%, #fffde7 100%)'
                  : sectionTitleStyle.background,
                color: expandedSection === index ? '#2c3e50' : '#2c3e50',
                boxShadow: expandedSection === index
                  ? '0 2px 8px rgba(251,190,40,0.10)'
                  : sectionTitleStyle.boxShadow,
              }}
              onClick={() => toggleSection(index)}
            >
              {index === 0 ? section.title : `${index}. ${section.title}`}
              <span style={toggleButtonStyle}>
                {expandedSection === index ? '▲ Hide' : '▼ Show'}
              </span>
            </h2>
            {(expandedSection === index || index === 0) && (
              <div style={sectionContentStyle}>
                {section.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PrivacyPage;