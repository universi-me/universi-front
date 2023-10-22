import React, { useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { ProfileCurriculum } from './ProfileCurriculum';
import CurriculumDownload from './CurriculumDownload/CurriculumDownload';

function ConfigButtonDownload() {
  const [isOpen, setIsOpen] = useState(false);
  const [clickedOnce, setClickedOnce] = useState(false);

  useEffect(() => {
    if (isOpen && !clickedOnce) {
      setClickedOnce(false);
      handleButtonClick();
    }
  }, [isOpen, clickedOnce]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);

    if (isOpen) {
      const node = document.getElementById('config-button-download');
      if (node) {
        html2canvas(node).then(function (canvas) {
          if (canvas) {
            canvas.toBlob(function (blob) {
              if (blob) {
                const url = URL.createObjectURL(blob);

                const downloadLink = document.createElement('a');
                downloadLink.href = url;
                downloadLink.download = 'config-button-download.png';

                downloadLink.click();
              } else {
                console.error('Erro ao criar blob');
              }
            });
          } else {
            console.error('Erro ao criar canvas');
          }
        });
      }
    }
  };

  return (
    <div id="config-button-download">
      <button className="curriculum-settings" onClick={handleButtonClick}>
        <img style={{ filter: 'brightness(0) invert(1)' }} src="/assets/icons/download.svg" alt="Download" />
      </button>
      {isOpen && <CurriculumDownload />}
    </div>
  );
}

export default ConfigButtonDownload;
