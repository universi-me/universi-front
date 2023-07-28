import React, { useState, useEffect } from 'react';
import './InfoButton.css';

const InfoButton: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (showInfo) {
      timeout = setTimeout(() => setShowInfo(false), 5000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [showInfo]);

  return (
    <div className="info-button-container">
      <button className="info-button" onClick={() => setShowInfo(!showInfo)}>
        ?
      </button>
      {showInfo && <div className="info-tooltip">Valor aproximado</div>}
    </div>
  );
};

export default InfoButton;
