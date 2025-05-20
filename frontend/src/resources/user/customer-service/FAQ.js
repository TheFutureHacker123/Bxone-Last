import React from 'react';

function FAQ() {
  const containerStyle = {
    maxWidth: '900px',
    margin: '48px auto',
    padding: '38px 30px',
    background: 'linear-gradient(135deg, #fffbe7 80%, #e3f2fd 100%)',
    borderRadius: '18px',
    boxShadow: '0 8px 36px rgba(30,136,229,0.09), 0 2px 8px rgba(0,0,0,0.04)',
    fontFamily: "'Open Sans', sans-serif",
    color: '#333',
    border: '1px solid #e3f2fd',
    position: 'relative',
    overflow: 'hidden',
  };

  // Decorative e-commerce icons background
  const iconsBgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0.07,
    pointerEvents: 'none',
    zIndex: 0,
    background: `url('data:image/svg+xml;utf8,<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><text x="10" y="60" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128722;</text><text x="120" y="120" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128179;</text><text x="220" y="80" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128230;</text><text x="320" y="150" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128666;</text></svg>') repeat`,
  };

  const headingStyle = {
    color: '#1e88e5',
    fontSize: '2.5em',
    fontWeight: '800',
    marginBottom: '28px',
    borderBottom: '2px solid #fbbe28',
    paddingBottom: '12px',
    fontFamily: "'Playfair Display', serif",
    letterSpacing: '1px',
    textAlign: 'center',
    textShadow: '0 2px 8px #e3f2fd',
    background: 'linear-gradient(90deg, #fffde7 0%, #fff 100%)',
    borderRadius: '8px',
    position: 'relative',
    zIndex: 1,
  };

  const questionBoxStyle = {
    background: '#fffde7',
    borderRadius: '10px',
    boxShadow: '0 1px 6px rgba(251,190,40,0.08)',
    borderLeft: '5px solid #fbbe28',
    marginBottom: '28px',
    padding: '22px 28px',
    position: 'relative',
    zIndex: 1,
    transition: 'box-shadow 0.2s',
  };

  const questionStyle = {
    color: '#1e88e5',
    fontSize: '1.25em',
    fontWeight: '700',
    marginTop: 0,
    marginBottom: '10px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  };

  const answerStyle = {
    lineHeight: '1.8',
    marginBottom: 0,
    fontSize: '1.08em',
    color: '#444',
    background: '#fafdff',
    borderRadius: '6px',
    padding: '10px 16px',
    boxShadow: '0 1px 2px rgba(30,136,229,0.04)',
    borderLeft: '3px solid #90caf9',
    marginTop: '5px',
  };

  // E-commerce icon for each question
  const icons = [
    <span key="cart" role="img" aria-label="cart" style={{fontSize: '1.2em'}}>🛒</span>,
    <span key="card" role="img" aria-label="card" style={{fontSize: '1.2em'}}>💳</span>,
    <span key="truck" role="img" aria-label="truck" style={{fontSize: '1.2em'}}>🚚</span>,
    <span key="return" role="img" aria-label="return" style={{fontSize: '1.2em'}}>🔄</span>,
    <span key="support" role="img" aria-label="support" style={{fontSize: '1.2em'}}>💬</span>,
  ];

  return (
    <div style={containerStyle}>
      <div style={iconsBgStyle}></div>
      <h1 style={headingStyle}>Frequently Asked Questions</h1>

      <div style={questionBoxStyle}>
        <h3 style={questionStyle}>{icons[0]} How do I place an order?</h3>
        <p style={answerStyle}>
          You can browse our products, select the items you want, and click <span style={{color:'#fbbe28', fontWeight:'bold'}}>Add to Cart</span>. Once you have all the items you need, proceed to the checkout page to complete your order.
        </p>
      </div>

      <div style={questionBoxStyle}>
        <h3 style={questionStyle}>{icons[1]} What payment methods do you accept?</h3>
        <p style={answerStyle}>
          We currently accept <span style={{color:'#1e88e5', fontWeight:'bold'}}>CBE Birr</span>, <span style={{color:'#1e88e5', fontWeight:'bold'}}>Telebirr</span>, and credit/debit cards if applicable.
        </p>
      </div>

      <div style={questionBoxStyle}>
        <h3 style={questionStyle}>{icons[2]} What are your shipping times?</h3>
        <p style={answerStyle}>
          Shipping times vary depending on your location within Ethiopia. Generally, it takes <span style={{color:'#fbbe28', fontWeight:'bold'}}>1-3 business days</span> for Addis Ababa and <span style={{color:'#fbbe28', fontWeight:'bold'}}>3-5 business days</span> for other major cities. Remote areas may take longer. Please refer to our <a href="/shipping-policy" style={{color:'#1e88e5', textDecoration:'underline'}}>Shipping Policy</a> for more details.
        </p>
      </div>

      <div style={questionBoxStyle}>
        <h3 style={questionStyle}>{icons[3]} What is your returns policy?</h3>
        <p style={answerStyle}>
          Please see our <a href="/returns-policy" style={{color:'#1e88e5', textDecoration:'underline'}}>Returns Policy</a> page for detailed information on how to initiate a return, eligibility, and refunds.
        </p>
      </div>

      <div style={questionBoxStyle}>
        <h3 style={questionStyle}>{icons[4]} How can I contact customer support?</h3>
        <p style={answerStyle}>
          You can contact our customer support team via email at <a href="mailto:support@habeshamart.com" style={{color:'#e65100', fontWeight:'bold'}}>support@habeshamart.com</a> or by phone at <span style={{color:'#e65100', fontWeight:'bold'}}>+251-90-000-0000</span>.
        </p>
      </div>
    </div>
  );
}

export default FAQ;