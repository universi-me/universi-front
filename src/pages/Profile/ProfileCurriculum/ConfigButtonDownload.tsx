import { ICON_DOWNLOAD_WHITE } from '@/utils/assets';
import React, { useState } from 'react';
import { colors } from 'react-select/dist/declarations/src/theme';

function ConfigButtonDownload() {
  const [isOpen, setIsOpen] = useState(false);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);

  };

  return (
    <div>
      <button className="curriculum-settings" onClick={handleButtonClick}>
        <img style={{filter: 'brightness(0) invert(1)'}} src={ICON_DOWNLOAD_WHITE} />
      </button>

      {isOpen && (
        <div>Baixou</div>
      )}
    </div>
  );
}

export default ConfigButtonDownload;
