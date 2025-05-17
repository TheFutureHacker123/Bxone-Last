import React from 'react';

function ReturnsPolicy() {
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
    animation: 'fadeInReturns 1s ease',
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
    background: `url('data:image/svg+xml;utf8,<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><text x="10" y="60" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128230;</text><text x="120" y="120" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128179;</text><text x="220" y="80" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128666;</text><text x="320" y="150" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128176;</text></svg>') repeat`,
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
    animation: 'slideDownReturns 0.8s ease',
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
    animation: 'fadeInReturns 1.2s',
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
    animation: 'fadeInReturns 1.4s',
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
    animation: 'fadeInReturns 1.6s',
  };

  // Animated e-commerce icon for the heading
  const returnIcon = (
    <span
      style={{
        fontSize: '2.1em',
        marginRight: '12px',
        color: '#fbbe28',
        verticalAlign: 'middle',
        filter: 'drop-shadow(0 2px 6px #ffe08288)',
        animation: 'iconBounce 1.2s infinite alternate',
        display: 'inline-block',
      }}
      role="img"
      aria-label="return"
    >
      🔄
    </span>
  );

  // Keyframes for animation
  const keyframes = `
    @keyframes fadeInReturns {
      from { opacity: 0; transform: translateY(30px);}
      to { opacity: 1; transform: translateY(0);}
    }
    @keyframes slideDownReturns {
      from { opacity: 0; transform: translateY(-30px);}
      to { opacity: 1; transform: translateY(0);}
    }
    @keyframes iconBounce {
      0% { transform: translateY(0);}
      100% { transform: translateY(-10px);}
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{keyframes}</style>
      <div style={iconsBgStyle}></div>
      <h1 style={headingStyle}>{returnIcon} Returns Policy</h1>

      <section>
        <h2 style={sectionHeadingStyle}>Our Commitment</h2>
        <p style={paragraphStyle}>
          At Habesha Mart, we want you to be completely satisfied with your purchase. If you are not satisfied for any reason, please review our return policy below.
        </p>
      </section>

      <section>
        <h2 style={sectionHeadingStyle}>Eligibility for Returns</h2>
        <p style={paragraphStyle}>
          To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You’ll also need the receipt or proof of purchase.
        </p>
      </section>

      <section>
        <h2 style={sectionHeadingStyle}>How to Initiate a Return</h2>
        <p style={paragraphStyle}>
          To start a return, you can contact us at <a href="mailto:returns@habeshamart.com" style={{color:'#1e88e5', fontWeight:'bold'}}>returns@habeshamart.com</a>. Please include your order number and the reason for the return. We will provide you with instructions on where to send your return.
        </p>
      </section>

      <section>
        <h2 style={sectionHeadingStyle}>Refunds</h2>
        <p style={paragraphStyle}>
          Once your return is received and inspected, we will notify you whether your refund was approved or not. If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund.
        </p>
      </section>

      <section>
        <h2 style={sectionHeadingStyle}>Exchanges</h2>
        <p style={paragraphStyle}>
          We currently do not offer direct exchanges. If you need a different size or color, please return the item you have, and once the return is accepted, make a separate purchase for the new item.
        </p>
      </section>

      <section>
        <h2 style={sectionHeadingStyle}>Non-Returnable Items</h2>
        <p style={paragraphStyle}>
          Certain types of items cannot be returned, such as perishable goods, custom-made products, and personal care goods. Please get in touch if you have questions about a specific item.
        </p>
      </section>
    </div>
  );
}

export default ReturnsPolicy;