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
          <img src="/assets/icons/github-black.svg" alt="Icon Rede Social 1" />
        </a>
        <a href="" className="circular-button">
          <img src="/assets/icons/instagram-black.svg" alt="Icon Rede Social 2" />
        </a>
        <a href="" className="circular-button">
          <img src="/assets/icons/facebook-black.svg" alt="Icon Rede Social 3" />
        </a>
      </div>
      <button className="scroll-to-top-button" onClick={handleScrollToTop}>
        <img src="/assets/icons/chevron-up-black.svg" alt="Scroll to Top" />
      </button>
      <h3 className="copyright">© Copyright Universi.me. All Rights Reserved</h3>
    </div>
  );
};

export default Footer;
