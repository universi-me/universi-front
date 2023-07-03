import React, { useState, useEffect } from 'react';
import "./UniversiFooter.css"

export const UniversiFooter = () => {

    const [isHomePage, setIsHomePage] = useState(true);

    useEffect(() => {
        const currentPage = window.location.pathname;
        setIsHomePage(currentPage === '/');
    });

    function ScrollToTop() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
    };

return(

    <footer className={`footer ${isHomePage ? 'home-page' : 'other-page'}`}>

    <div></div>

    <div className="middle">

        <div className="bar"></div>

        <div className="icons">
            
            <a href="https://github.com/universi-me" target="_blank">

                <button>
                    <img src="/assets/icons/github.svg" alt="github"/>
                </button>

            </a>

            <a href="https://www.instagram.com/ayty.ufpb/" target="_blank">

                <button>
                    <img src="/assets/icons/instagram.svg" alt="instagram"/>
                </button>

            </a>

            <a href="" target="_blank">

                <button>
                    <img src="/assets/icons/facebook.svg" alt="facebook"/>
                </button>

            </a>

        </div>

        <div className="copyright">
            <p>&copy;Copyright Universi.me. All Rights Reserved </p>
        </div>

    </div>

    <div className="scrollbutton">
        <button onClick={ScrollToTop}> 
            <img src="/assets/icons/chevron-up.svg" alt="up" />
        </button>
    </div>
   
  
  </footer>
)};
  