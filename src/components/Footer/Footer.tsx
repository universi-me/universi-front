import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="footer-container">
      <div className="line"></div>
      <div className="buttons-container">
        <a href="" className="circular-button">
          <img src="/assets/icons/github-white.svg" alt="Icon Rede Social 1" />
        </a>
        <a href="" className="circular-button">
          <img src="/assets/icons/instagram-white.svg" alt="Icon Rede Social 2" />
        </a>
        <a href="" className="circular-button">
          <img src="/assets/icons/facebook-white.svg" alt="Icon Rede Social 3" />
        </a>
      </div>
      <button className="scroll-to-top-button" onClick={handleScrollToTop}>
        <img src="/assets/icons/chevron-up-1.svg" alt="Scroll to Top" />
      </button>
      <h3 className="copyright">© Copyright Universi.me. All Rights Reserved</h3>
    </div>
  );
};

export default Footer;
