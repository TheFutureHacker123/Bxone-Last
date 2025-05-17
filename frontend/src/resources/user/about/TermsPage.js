import React from 'react';

function TermsPage() {
  const containerStyle = {
    maxWidth: '900px',
    margin: '48px auto',
    padding: '38px 30px',
    background: 'linear-gradient(135deg, #fff 80%, #e3f2fd 100%)',
    borderRadius: '20px',
    boxShadow: '0 8px 36px rgba(30,136,229,0.09), 0 2px 8px rgba(0,0,0,0.04)',
    fontFamily: "'Open Sans', sans-serif",
    color: '#333',
    border: '1px solid #e3f2fd',
    transition: 'box-shadow 0.2s',
    position: 'relative',
    overflow: 'hidden',
  };

  // E-commerce icons background (subtle, decorative)
  const iconsBgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.08,
    pointerEvents: 'none',
    zIndex: 0,
    background: `url('data:image/svg+xml;utf8,<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><text x="10" y="60" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128722;</text><text x="120" y="120" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128179;</text><text x="220" y="80" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128717;</text><text x="320" y="150" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128100;</text></svg>') repeat`,
  };

  const headingStyle = {
    color: '#1e88e5',
    fontSize: '2.5em',
    fontWeight: '800',
    marginBottom: '22px',
    borderBottom: '2px solid #90caf9',
    paddingBottom: '12px',
    fontFamily: "'Playfair Display', serif",
    letterSpacing: '1px',
    textAlign: 'center',
    textShadow: '0 2px 8px #e3f2fd',
    background: 'linear-gradient(90deg, #e3f2fd 0%, #fff 100%)',
    borderRadius: '8px',
    position: 'relative',
    zIndex: 1,
  };

  const sectionHeadingStyle = {
    color: '#fbbe28',
    fontSize: '1.35em',
    fontWeight: '700',
    marginTop: '28px',
    marginBottom: '12px',
    fontFamily: "'Merriweather', serif",
    background: 'linear-gradient(90deg, #fffde7 0%, #fff 100%)',
    borderRadius: '6px',
    padding: '7px 14px',
    boxShadow: '0 1px 2px rgba(251,190,40,0.07)',
    display: 'inline-block',
    position: 'relative',
    zIndex: 1,
  };

  const paragraphStyle = {
    fontSize: '1.13em',
    lineHeight: '1.85',
    color: '#444',
    marginBottom: '18px',
    letterSpacing: '0.01em',
    background: '#fafdff',
    borderRadius: '6px',
    padding: '10px 16px',
    boxShadow: '0 1px 2px rgba(30,136,229,0.04)',
    borderLeft: '3px solid #90caf9',
    transition: 'background 0.2s',
    position: 'relative',
    zIndex: 1,
  };

  const lastUpdatedStyle = {
    color: '#777',
    fontSize: '1em',
    marginBottom: '24px',
    textAlign: 'right',
    fontStyle: 'italic',
    letterSpacing: '0.03em',
    position: 'relative',
    zIndex: 1,
  };

  const iconStyle = {
    marginRight: '10px',
    color: '#1e88e5',
    fontSize: '1.3em',
    verticalAlign: 'middle',
  };

  // Optional: contract icon for visual interest
  const contractIcon = (
    <span style={iconStyle} role="img" aria-label="contract">
      <svg width="1em" height="1em" viewBox="0 0 20 20" fill="#1e88e5" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="3" width="14" height="14" rx="3" fill="#e3f2fd"/>
        <rect x="6" y="7" width="8" height="1.5" rx="0.75" fill="#1e88e5"/>
        <rect x="6" y="10" width="8" height="1.5" rx="0.75" fill="#1e88e5"/>
        <rect x="6" y="13" width="5" height="1.5" rx="0.75" fill="#1e88e5"/>
      </svg>
    </span>
  );

  // Multi-vendor e-commerce highlight box
  const vendorBoxStyle = {
    background: 'linear-gradient(90deg, #fffde7 0%, #e3f2fd 100%)',
    border: '2px dashed #fbbe28',
    borderRadius: '10px',
    padding: '18px 20px',
    margin: '28px 0 18px 0',
    color: '#1e88e5',
    fontWeight: 'bold',
    fontSize: '1.13em',
    boxShadow: '0 2px 8px rgba(251,190,40,0.07)',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    zIndex: 1,
  };

  return (
    <div style={containerStyle}>
      <div style={iconsBgStyle}></div>
      <h1 style={headingStyle}>{contractIcon} Terms of Service</h1>
      <p style={lastUpdatedStyle}>Last updated: <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>[Date]</span></p>
      <div style={vendorBoxStyle}>
        <span role="img" aria-label="store" style={{ fontSize: '1.7em' }}>🏬</span>
        <span>
          <span style={{ color: '#fbbe28' }}>Habesha Mart</span> is a multi-vendor e-commerce platform. Both buyers and independent vendors are part of our marketplace community. Please review the terms below for both customers and vendors.
        </span>
      </div>
      <p style={paragraphStyle}>
        Please read these Terms of Service ("Terms") carefully before using the <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>Habesha Mart</span> platform. By accessing or using our platform, you agree to be bound by these Terms.
      </p>

      <h2 style={sectionHeadingStyle}>1. Acceptance of Terms</h2>
      <p style={paragraphStyle}>
        These Terms constitute a legally binding agreement between you and <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>Habesha Mart</span>. If you do not agree to these Terms, please do not use our platform.
      </p>

      <h2 style={sectionHeadingStyle}>2. Use of the Platform</h2>
      <p style={paragraphStyle}>
        You agree to use the <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>Habesha Mart</span> platform only for lawful purposes and in a manner that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the platform.
      </p>

      <h2 style={sectionHeadingStyle}>3. User Accounts</h2>
      <p style={paragraphStyle}>
        If you create an account on <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>Habesha Mart</span>, you are responsible for maintaining the security of your account and for all activities that occur under the account.
      </p>

      <h2 style={sectionHeadingStyle}>4. Vendor Responsibilities</h2>
      <p style={paragraphStyle}>
        Vendors are responsible for the accuracy of their listings, timely fulfillment of orders, and compliance with all applicable laws and platform policies. Habesha Mart is not a party to transactions between buyers and vendors, but we may assist in dispute resolution.
      </p>

      <h2 style={sectionHeadingStyle}>5. Termination</h2>
      <p style={paragraphStyle}>
        We may terminate or suspend your access to the platform at any time, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
      </p>

      <h2 style={sectionHeadingStyle}>6. Changes to Terms</h2>
      <p style={paragraphStyle}>
        <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>Habesha Mart</span> reserves the right to modify or replace these Terms at any time. We will try to provide at least <span style={{ color: '#1e88e5', fontWeight: 'bold' }}>5</span> days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
      </p>

      <p style={{ ...paragraphStyle, color: '#777', background: '#fffde7', borderLeft: '3px solid #fbbe28' }}>
        If you have any questions about these Terms, please contact us at <span style={{ color: '#fbbe28', fontWeight: 'bold' }}>[Your Contact Email Address]</span>.
      </p>
    </div>
  );
}

export default TermsPage;