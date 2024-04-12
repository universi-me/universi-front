import React, { useRef, useState, useEffect, createRef } from 'react';
import Cropper, { ReactCropperElement } from "react-cropper";
import { Buffer } from 'buffer';
import "cropperjs/dist/cropper.css";
import './ImageCropper.css';

type ImageCropperProps = {
  title?: string;
  aspectRatio?: number;
}

const CropperPopup = ({ src, onClose, options }: { src: string, onClose: (imageBuffer: ArrayBuffer) => void, options: ImageCropperProps }) => {
  const cropperRef = createRef<ReactCropperElement>();

  const onApply = () => {
    onClose(Buffer.from(cropperRef!.current!?.cropper!?.getCroppedCanvas().toDataURL().split(",")[1], 'base64').buffer as ArrayBuffer);
  };
  
  const onCancel = () => {
    onClose(null as any);
  };

  return (
    <div className="cropper-popup container-radius" style={{ height: '60%' , width: '60%'}}>

      <div className='header header-radius'>
        <h1 className='bi bi-crop'></h1>
        <h1 className='title'>{options?.title ?? 'Ajustar Imagem'}</h1>
      </div>

      <div className='cropper-container'>
        
        <br/>
        
        <Cropper
          ref={cropperRef}
          style={{ height: '100%' , width: '100%'}}
          zoomTo={0.5}
          src={src}
          viewMode={1}
          minCropBoxHeight={100}
          minCropBoxWidth={100}
          background={false}
          responsive={true}
          autoCropArea={1}
          checkOrientation={false}
          guides={true}

          {...options}
        />
        
        <br/>
        <br/>
        <div style={{float: 'right'}}>
          <div className='btn cancel' onClick={onCancel}>Cancelar</div>
          <div className='btn' onClick={onApply}>Selecionar</div>
        </div>
      </div>
    </div> 
  );
  };
  
const CropperComponent = ({ src, selectImage, show, willClose, options }: { src: string, selectImage: (imageBuffer: ArrayBuffer) => void, show: boolean, willClose: () => void, options?: ImageCropperProps }) => {

    const onClose = (imageArr: ArrayBuffer) => {
      willClose();
      selectImage(imageArr);
    };
  
    return (
      <div>
        {show && (
          <div className="cropper-overlay">
            <CropperPopup
              src={src}
              onClose={onClose}
              options={options ?? {}}
            />
          </div>
        )}
      </div>
    );
  };
  
  export default CropperComponent;
