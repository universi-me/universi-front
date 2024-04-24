import React, { useRef, useState, useEffect, createRef } from 'react';
import Cropper, { ReactCropperElement, ReactCropperProps } from "react-cropper";
import { Buffer } from 'buffer';
import "cropperjs/dist/cropper.css";
import './ImageCropper.css';
import Compressor from "compressorjs";

type ImageCropperProps = {
  title?: string;
  compression?: number;
} & ReactCropperProps;

const CropperPopup = ({ src, onClose, options }: { src: string, onClose: (imageBlob: Blob) => void, options: ImageCropperProps }) => {
  const cropperRef = createRef<ReactCropperElement>();

  const onApply = () => {
    cropperRef!.current!?.cropper!?.getCroppedCanvas().toBlob((blob) => {
      onClose(blob as Blob);
    }, src.startsWith('http') ? 'image/jpeg' : src.split(";")[0].split(":")[1]);
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
          src={src}
          viewMode={1}
          dragMode='move'
          zoomable= {true}
          movable= {true}
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
  
const CropperComponent = ({ src, selectImage, show, willClose, options }: { src: string, selectImage: (imageBlob: Blob) => void, show: boolean, willClose: () => void, options?: ImageCropperProps }) => {

    const onClose = (imageBlob: Blob) => {
      willClose();
      if(imageBlob) {
        if(imageBlob.type != 'image/png') {
          // compress image if not png
          new Compressor(new File([imageBlob], '', {type: 'image/jpeg'}), {
            quality: (options ?? {}).compression ?? 0.7,
            success: (result) => selectImage(result),
            error: () => selectImage(imageBlob)
          });
        } else {
          selectImage(imageBlob);
        }
      }
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
