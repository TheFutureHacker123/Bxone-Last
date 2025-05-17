import React from 'react';

function Contact() {
  const containerStyle = {
    maxWidth: '850px',
    margin: '60px auto',
    padding: '40px 32px',
    background: 'linear-gradient(135deg, #fffbe7 80%, #e3f2fd 100%)',
    borderRadius: '18px',
    boxShadow: '0 8px 36px rgba(30,136,229,0.09), 0 2px 8px rgba(0,0,0,0.04)',
    fontFamily: "'Open Sans', sans-serif",
    color: '#333',
    border: '1px solid #e3f2fd',
    position: 'relative',
    overflow: 'hidden',
    animation: 'fadeInContact 1s ease',
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
    background: `url('data:image/svg+xml;utf8,<svg width="400" height="200" xmlns="http://www.w3.org/2000/svg"><text x="10" y="60" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128222;</text><text x="120" y="120" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128231;</text><text x="220" y="80" font-size="60" fill="%23fbbe28" font-family="Segoe UI Emoji">&#128179;</text><text x="320" y="150" font-size="60" fill="%231e88e5" font-family="Segoe UI Emoji">&#128722;</text></svg>') repeat`,
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
    animation: 'slideDownContact 0.8s ease',
  };

  const paragraphStyle = {
    lineHeight: '1.8',
    marginBottom: '22px',
    fontSize: '1.13em',
    color: '#444',
    background: '#fafdff',
    borderRadius: '6px',
    padding: '12px 18px',
    boxShadow: '0 1px 2px rgba(30,136,229,0.04)',
    borderLeft: '3px solid #90caf9',
    animation: 'fadeInContact 1.2s',
  };

  const contactInfoStyle = {
    marginTop: '30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    animation: 'fadeInContact 1.4s',
  };

  const contactItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '1.13em',
    background: '#fffde7',
    borderRadius: '8px',
    padding: '12px 18px',
    boxShadow: '0 1px 2px rgba(251,190,40,0.04)',
    borderLeft: '3px solid #fbbe28',
    fontWeight: '500',
    animation: 'slideInContact 1.6s',
  };

  const labelStyle = {
    fontWeight: '700',
    marginRight: '10px',
    color: '#fbbe28',
    fontSize: '1.2em',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  // Animated icons for contact methods
  const emailIcon = (
    <span
      style={{
        fontSize: '1.4em',
        color: '#1e88e5',
        animation: 'iconBounceContact 1.2s infinite alternate',
        display: 'inline-block',
      }}
      role="img"
      aria-label="email"
    >📧</span>
  );
  const phoneIcon = (
    <span
      style={{
        fontSize: '1.4em',
        color: '#fbbe28',
        animation: 'iconBounceContact 1.4s infinite alternate',
        display: 'inline-block',
      }}
      role="img"
      aria-label="phone"
    >📞</span>
  );

  // Keyframes for animation
  const keyframes = `
    @keyframes fadeInContact {
      from { opacity: 0; transform: translateY(30px);}
      to { opacity: 1; transform: translateY(0);}
    }
    @keyframes slideDownContact {
      from { opacity: 0; transform: translateY(-30px);}
      to { opacity: 1; transform: translateY(0);}
    }
    @keyframes slideInContact {
      from { opacity: 0; transform: translateX(-30px);}
      to { opacity: 1; transform: translateX(0);}
    }
    @keyframes iconBounceContact {
      0% { transform: translateY(0);}
      100% { transform: translateY(-8px);}
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{keyframes}</style>
      <div style={iconsBgStyle}></div>
      <h1 style={headingStyle}>Contact Us</h1>
      <p style={paragraphStyle}>
        Do you have any questions, feedback, or concerns? Please feel free to reach out to us using the information below. Our team is always happy to help you with your e-commerce experience!
      </p>

      <div style={contactInfoStyle}>
        <div style={contactItemStyle}>
          <span style={labelStyle}>{emailIcon} Email:</span>
          <a href="mailto:support@habeshamart.com" style={{color:'#1e88e5', fontWeight:'bold', textDecoration:'underline'}}>support@habeshamart.com</a>
        </div>
        <div style={contactItemStyle}>
          <span style={labelStyle}>{phoneIcon} Phone:</span>
          <span style={{color:'#e65100', fontWeight:'bold'}}>+251-XX-XXX-XXXX</span>
        </div>
        {/* You can add a physical address here if applicable */}
      </div>
    </div>
  );
}

export default Contact;