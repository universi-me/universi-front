import React from 'react';
import { ICON_CHEVRON_UP_BLACK, ICON_GITHUB_WHITE, ICON_INSTAGRAM_WHITE } from '@/utils/assets';
import './Footer.css';

const Footer: React.FC = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="footer-container">
      <div className="line"></div>
      <div className="buttons-container">
        <FooterLink owner="Universi.me" href="https://github.com/universi-me" imgSrc={ICON_GITHUB_WHITE} social="GitHub" />
        <FooterLink owner="AYTY" href="https://www.instagram.com/ayty.ufpb/" imgSrc={ICON_INSTAGRAM_WHITE} social="Instagram" />
      </div>
      <button className="scroll-to-top-button" onClick={handleScrollToTop}>
        <img src={ICON_CHEVRON_UP_BLACK} alt="Scroll to Top" />
      </button>
      <h3 className="copyright">© Copyright Universi.me. All Rights Reserved</h3>
    </div>
  );
};

export default Footer;

type FooterLinkProps = {
    owner:  string;
    href:   string;
    imgSrc: string;
    social: string;
};

function FooterLink(props: FooterLinkProps) {
    return (
        <a href={props.href} target="_blank" title={`${props.social} - ${props.owner}`} className="circular-button">
          <img src={props.imgSrc} alt={props.social} />
        </a>
    );
}
