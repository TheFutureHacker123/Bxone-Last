import React from 'react';

function ShippingPolicyPage() {
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
    background: `url('data:image/svg+xml;utf8,<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><text x="10" y="60" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128666;</text><text x="120" y="120" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128230;</text><text x="220" y="80" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128230;</text><text x="320" y="150" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128666;</text></svg>') repeat`,
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

  const listStyle = {
    paddingLeft: '25px',
    marginBottom: '18px',
    fontSize: '1.08em',
    fontFamily: "'Open Sans', sans-serif",
    color: '#444',
    background: '#fffde7',
    borderRadius: '6px',
    boxShadow: '0 1px 2px rgba(251,190,40,0.04)',
    borderLeft: '3px solid #fbbe28',
    padding: '10px 18px',
    position: 'relative',
    zIndex: 1,
  };

  // Shipping truck icon for visual interest
  const truckIcon = (
    <span style={{
      fontSize: '2.1em',
      marginRight: '12px',
      color: '#fbbe28',
      verticalAlign: 'middle',
      filter: 'drop-shadow(0 2px 6px #ffe08288)',
    }} role="img" aria-label="truck">🚚</span>
  );

  // Box icon for shipping methods
  const boxIcon = (
    <span style={{
      fontSize: '1.5em',
      marginRight: '8px',
      color: '#1e88e5',
      verticalAlign: 'middle',
    }} role="img" aria-label="box">📦</span>
  );

  return (
    <div style={containerStyle}>
      <div style={iconsBgStyle}></div>
      <h1 style={headingStyle}>{truckIcon} Shipping Policy</h1>

      <section>
        <h2 style={sectionHeadingStyle}>Shipping Costs</h2>
        <p style={paragraphStyle}>
          Shipping costs are calculated based on the weight of your order and your shipping destination. You will see the shipping cost at checkout before you complete your purchase. We may also offer free shipping for orders over a certain amount.
        </p>
      </section>

      <section>
        <h2 style={sectionHeadingStyle}>Estimated Delivery Times</h2>
        <p style={paragraphStyle}>
          Estimated delivery times vary depending on your location within Ethiopia:
        </p>
        <ul style={listStyle}>
          <li><span role="img" aria-label="city">🏙️</span> Addis Ababa: 1-3 business days</li>
          <li><span role="img" aria-label="city">🏢</span> Other Major Cities: 3-5 business days</li>
          <li><span role="img" aria-label="village">🏞️</span> Remote Areas: 5-7 business days</li>
        </ul>
        <p style={paragraphStyle}>
          Please note that these are estimates, and actual delivery times may vary.
        </p>
      </section>

      <section>
        <h2 style={sectionHeadingStyle}>Shipping Methods</h2>
        <p style={paragraphStyle}>
          {boxIcon}
          We primarily use <span style={{ color: '#1e88e5', fontWeight: 'bold' }}>[Name of local courier service]</span> for our deliveries within Ethiopia. Once your order has shipped, you will receive a tracking number to monitor its progress.
        </p>
      </section>

      <section>
        <h2 style={sectionHeadingStyle}>Areas We Ship To</h2>
        <p style={paragraphStyle}>
          We currently ship to all regions within Ethiopia.
        </p>
      </section>

      <section>
        <h2 style={sectionHeadingStyle}>Handling Time</h2>
        <p style={paragraphStyle}>
          Orders are typically processed and shipped within 1-2 business days after payment confirmation.
        </p>
      </section>
    </div>
  );
}

export default ShippingPolicyPage;