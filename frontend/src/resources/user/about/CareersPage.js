import React from 'react';

function CareersPage() {
  const pageStyle = {
    background: 'linear-gradient(45deg, #ffecd2, #fcb69f)',
    minHeight: '100vh',
    padding: '60px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Poppins", sans-serif',
    color: '#333',
    overflow: 'hidden',
    position: 'relative',
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.92)',
    borderRadius: '18px',
    padding: '60px',
    width: '80%',
    maxWidth: '900px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.18)',
    position: 'relative',
    zIndex: 1,
    animation: 'fadeIn 1s ease-out',
    backdropFilter: 'blur(2px)',
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '3.8em',
    fontWeight: '700',
    marginBottom: '40px',
    color: '#e64a19',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.08)',
    animation: 'slideDown 0.8s ease-out',
    letterSpacing: '1px',
  };

  const paragraphStyle = {
    fontSize: '1.2em',
    lineHeight: '2',
    marginBottom: '30px',
    color: '#555',
    opacity: 0,
    transform: 'translateY(20px)',
    animation: 'slideUp 0.6s ease-out forwards',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: '8px',
    padding: '12px 18px',
    boxShadow: '0 1px 6px rgba(252,182,159,0.08)',
  };

  const emphasisStyle = {
    color: '#f4511e',
    fontWeight: '600',
    fontStyle: 'italic',
    letterSpacing: '0.5px',
    transition: 'color 0.3s',
  };

  const linkStyle = {
    color: '#f4511e',
    textDecoration: 'none',
    fontWeight: '700',
    transition: 'color 0.3s ease-in-out',
    borderBottom: '2px dotted #f4511e',
    paddingBottom: '2px',
  };

  const linkHoverStyle = {
    color: '#d84315',
    borderBottom: '2px solid #d84315',
  };

  // Animated floating icons for e-commerce/careers
  const floatingIconStyle = (x, y, rotate, delay) => ({
    position: 'absolute',
    fontSize: '2.7em',
    color: '#ff8a65',
    top: `${y}%`,
    left: `${x}%`,
    animation: `floatRotate 4.5s infinite alternate ${delay}s ease-in-out`,
    transform: `rotate(${rotate}deg)`,
    opacity: 0.7,
    zIndex: 0,
    filter: 'drop-shadow(0 2px 6px #fcb69f33)',
    pointerEvents: 'none',
  });

  const keyframes = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideDown {
      from { transform: translateY(-30px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes floatRotate {
      0% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(12px, -10px) rotate(12deg); }
      100% { transform: translate(0, 0) rotate(0deg); }
    }
  `;

  // E-commerce/careers themed icons
  const icons = [
    { icon: '🛒', x: 10, y: 20, rotate: 15, delay: 0 },
    { icon: '📦', x: 85, y: 15, rotate: -10, delay: 1 },
    { icon: '🚀', x: 5, y: 80, rotate: 25, delay: 0.5 },
    { icon: '💼', x: 90, y: 85, rotate: -5, delay: 1.5 },
    { icon: '🌟', x: 45, y: 5, rotate: 0, delay: 0.8 },
    { icon: '🤝', x: 60, y: 90, rotate: 0, delay: 1.2 },
    { icon: '💡', x: 25, y: 90, rotate: 0, delay: 1.7 },
  ].map((item, index) => (
    <div key={index} style={floatingIconStyle(item.x, item.y, item.rotate, item.delay)}>{item.icon}</div>
  ));

  return (
    <div style={pageStyle}>
      <style>{keyframes}</style>
      {icons}
      <div style={cardStyle}>
        <h1 style={headingStyle}>Shape the Future of Habesha Mart</h1>
        <p style={{ ...paragraphStyle, animationDelay: '0.2s' }}>
          Join our <em style={emphasisStyle}>dynamic</em> team and be a part of revolutionizing the online marketplace for Ethiopian goods. If you're passionate about e-commerce and ready to <em style={emphasisStyle}>innovate</em>, we'd love to hear from you.
        </p>
        <p style={{ ...paragraphStyle, animationDelay: '0.4s' }}>
          While we may not have specific openings listed right now, we are always looking for talented individuals in areas such as development, marketing, sales, and operations. Send us your expression of interest and resume to{' '}
          <a
            href="mailto:[Your Careers Email Address]"
            style={linkStyle}
            onMouseOver={e => Object.assign(e.target.style, linkHoverStyle)}
            onMouseOut={e => Object.assign(e.target.style, linkStyle)}
          >
            martcareer@gmail.com
          </a>.
        </p>
        <p style={{ ...paragraphStyle, animationDelay: '0.6s' }}>
          At Habesha Mart, we value <em style={emphasisStyle}>creativity</em>, collaboration, and a drive to make a real impact. We are committed to building a diverse and inclusive workplace.
        </p>
        {/* Future job listings can be added here */}
      </div>
    </div>
  );
}

export default CareersPage;