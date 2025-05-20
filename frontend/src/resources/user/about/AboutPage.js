import React, { useState, useEffect, useRef } from 'react';

function AboutPage() {
  const pageStyle = {
    background: 'linear-gradient(120deg, #fdf4e5, #ffc107)',
    minHeight: '100vh',
    padding: '60px',
    fontFamily: '"Nunito Sans", sans-serif',
    color: '#333',
    position: 'relative',
    overflowX: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const contentCardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '15px',
    padding: '40px',
    width: '80%',
    maxWidth: '900px',
    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
    position: 'relative',
  };

  const headingStyle = {
    textAlign: 'center',
    fontSize: '4.5em',
    fontWeight: '800',
    marginBottom: '70px',
    color: '#e65100',
    fontFamily: '"Pacifico", cursive',
    letterSpacing: '1.5px',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
    animation: 'fadeInHeading 1s ease-out forwards',
    opacity: 0,
    transformStyle: 'preserve-3d',
    transition: 'transform 0.3s ease-in-out',
  };

  const headingHoverStyle = {
    transform: 'rotateY(10deg)',
  };

  const paragraphStyle = {
    fontSize: '1.2em',
    lineHeight: '2.0',
    fontFamily: '"Open Sans", sans-serif',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.03)',
    marginBottom: '40px',
    opacity: 0,
    transform: 'translateY(20px)',
    transition: 'opacity 0.7s ease-in-out, transform 0.7s ease-in-out',
  };

  const paragraphVisibleStyle = {
    opacity: 1,
    transform: 'translateY(0)',
  };

  const emphasisStyle = {
    color: '#d84315',
    fontWeight: '700',
    fontStyle: 'italic',
    textShadow: '1px 1px 1px rgba(0, 0, 0, 0.1)',
    display: 'inline-block',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.2s ease-in-out',
  };

  const emphasisHoverStyle = {
    transform: 'rotateX(15deg)',
  };

  const cartStyle = (position) => ({
    fontSize: '2.2em',
    position: 'absolute',
    bottom: '30px',
    left: `${position}px`,
    transition: 'left 1s ease-in-out',
    color: '#f48fb1',
    zIndex: 10,
  });

  // --- User Support Box Styling ---
  const supportBoxStyle = {
    background: 'linear-gradient(90deg, #fffde7 0%, #ffe082 100%)',
    border: '2px solid #fbbe28',
    borderRadius: '12px',
    padding: '28px 24px',
    margin: '55px 0 0 0',
    color: '#333',
    fontWeight: 'bold',
    fontSize: '1.13em',
    boxShadow: '0 2px 12px rgba(251,190,40,0.09)',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    position: 'relative',
    zIndex: 1,
    animation: 'slideInSupport 1s 0.5s ease-out both',
  };

  const supportIconStyle = {
    fontSize: '2.2em',
    color: '#fbbe28',
    filter: 'drop-shadow(0 2px 6px #ffe08288)',
    marginRight: '10px',
  };

  const supportLinkStyle = {
    color: '#e65100',
    textDecoration: 'underline',
    fontWeight: 'bold',
    marginLeft: '6px',
    transition: 'color 0.2s',
  };

  const supportLinkHoverStyle = {
    color: '#d84315',
  };

  const aboutContent = [
    { text: "Welcome to ", emphasis: "Habesha Mart!", rest: " Our journey began with a simple idea: to create a vibrant online marketplace that celebrates the rich culture and diverse products of Ethiopia. We envisioned a platform where talented artisans, local businesses, and unique creators could connect directly with customers, both within Ethiopia and around the world." },
    { text: "Founded in 2025 GC, Habesha Mart started as a small initiative driven by a ", emphasis: "passion", rest: " for Ethiopian craftsmanship and entrepreneurship. We saw the incredible potential of bringing traditional artistry and modern innovation together in one accessible space." },
    { text: "Over time, our community has grown, welcoming a wide array of vendors offering everything from ", emphasis: "handcrafted goods", rest: " and fashion to agricultural products and digital services. We are committed to fostering a supportive ecosystem where vendors can thrive and customers can discover unique, high-quality items." },
    { text: "Our core values revolve around ", emphasis: "authenticity", rest: ", community, and empowerment. We strive to ensure that every transaction on Habesha Mart reflects the genuine spirit of Ethiopian commerce and creativity." },
    { text: "Thank you for being a part of the Habesha Mart story. Whether you're a buyer, a seller, or just curious, we're delighted to have you with us on this journey." },
  ];

  const [visibleParagraphs, setVisibleParagraphs] = useState([]);
  const [cartPosition, setCartPosition] = useState(-100);
  const contentRefs = useRef(aboutContent.map(() => React.createRef()));
  const [isHeadingHovered, setIsHeadingHovered] = useState(false);
  const [isSupportLinkHovered, setIsSupportLinkHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      aboutContent.forEach((_, index) => {
        const elementTop = contentRefs.current[index].current ? contentRefs.current[index].current.offsetTop : windowHeight;
        const elementVisible = 200;

        if (elementTop < scrollY + windowHeight - elementVisible && visibleParagraphs.indexOf(index) === -1) {
          setVisibleParagraphs((prev) => [...prev, index]);
        }
      });

      setCartPosition(Math.min(20 + scrollY / 5, window.innerWidth / 2));
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [visibleParagraphs, aboutContent]);

  const keyframes = `
    @keyframes fadeInHeading {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInParagraph {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes slideInSupport {
      from {
        opacity: 0;
        transform: translateY(40px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `;

  return (
    <div style={pageStyle}>
      <style>
        {`
          ${keyframes}
        `}
      </style>
      <div style={contentCardStyle}>
        <h1
          style={{
            ...headingStyle,
            ...(isHeadingHovered && headingHoverStyle),
          }}
          onMouseEnter={() => setIsHeadingHovered(true)}
          onMouseLeave={() => setIsHeadingHovered(false)}
        >
          Our Story
        </h1>
        {aboutContent.map((item, index) => (
          <p
            key={index}
            ref={contentRefs.current[index]}
            style={{
              ...paragraphStyle,
              ...(visibleParagraphs.includes(index) ? paragraphVisibleStyle : {}),
              animation: visibleParagraphs.includes(index) ? 'slideInParagraph 0.7s ease-out forwards' : 'none',
            }}
          >
            {item.text}
            <em
              style={emphasisStyle}
              onMouseEnter={(e) => Object.assign(e.target.style, emphasisHoverStyle)}
              onMouseLeave={(e) => e.target.style.transform = 'rotateX(0deg)'}
            >
              {item.emphasis}
            </em>
            {item.rest}
          </p>
        ))}
        {/* User Support Box */}
        <div style={supportBoxStyle}>
          <span style={supportIconStyle} role="img" aria-label="support">💬</span>
          <span>
            Need help or have questions? Our <span style={{ color: '#e65100', fontWeight: 'bold' }}>User Support Team</span> is here for you!
            <a
              href="mailto:support@habeshamart.com"
              style={{
                ...supportLinkStyle,
                ...(isSupportLinkHovered ? supportLinkHoverStyle : {}),
              }}
              onMouseEnter={() => setIsSupportLinkHovered(true)}
              onMouseLeave={() => setIsSupportLinkHovered(false)}
            >
              support@habeshamart.com
            </a>
          </span>
        </div>
        <div style={cartStyle(cartPosition)}>🛒</div>
      </div>
    </div>
  );
}

export default AboutPage;