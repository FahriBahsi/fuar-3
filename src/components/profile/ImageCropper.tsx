'use client';

import React, { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageBlob: Blob) => void;
  onCancel: () => void;
}

export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    const cropSize = Math.min(width, height) * 0.8; // 80% of the smaller dimension
    const cropX = (width - cropSize) / 2;
    const cropY = (height - cropSize) / 2;
    
    setCrop({
      unit: 'px',
      width: cropSize,
      height: cropSize,
      x: cropX,
      y: cropY,
    });
  }, []);

  const getCroppedImg = useCallback(
    (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
      const canvas = canvasRef.current;
      if (!canvas || !crop.width || !crop.height) {
        return Promise.reject(new Error('Canvas or crop dimensions not available'));
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return Promise.reject(new Error('Canvas context not available'));
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob'));
          }
        }, 'image/jpeg', 0.9);
      });
    },
    []
  );

  const handleCropComplete = useCallback(async () => {
    if (!completedCrop || !imgRef.current) {
      return;
    }

    try {
      const croppedImageBlob = await getCroppedImg(imgRef.current, completedCrop);
      onCropComplete(croppedImageBlob);
    } catch (error) {
      console.error('Error cropping image:', error);
    }
  }, [completedCrop, getCroppedImg, onCropComplete]);

  return (
    <div className="image-cropper-modal">
      <div className="image-cropper-overlay" onClick={onCancel}></div>
      <div className="image-cropper-container">
        <div className="image-cropper-header">
          <h4>Crop Your Image</h4>
          <button type="button" className="btn-close" onClick={onCancel}>
            <span>&times;</span>
          </button>
        </div>
        
        <div className="image-cropper-content">
          <div className="crop-instructions">
            <p>Drag the corners to adjust the crop area. The image will be cropped to a square.</p>
          </div>
          
          <div className="crop-area">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop={false}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={imageSrc}
                onLoad={onImageLoad}
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </ReactCrop>
          </div>
          
          <div className="crop-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCropComplete}
              disabled={!completedCrop}
            >
              Crop & Use
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for cropping */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />
      
      <style jsx>{`
        .image-cropper-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .image-cropper-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
        }
        
        .image-cropper-container {
          position: relative;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          max-width: 90vw;
          max-height: 90vh;
          overflow: hidden;
        }
        
        .image-cropper-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
        }
        
        .image-cropper-header h4 {
          margin: 0;
          font-size: 1.25rem;
        }
        
        .btn-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }
        
        .btn-close:hover {
          background-color: #f8f9fa;
        }
        
        .image-cropper-content {
          padding: 1rem;
        }
        
        .crop-instructions {
          margin-bottom: 1rem;
          text-align: center;
          color: #6c757d;
        }
        
        .crop-area {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }
        
        .crop-actions {
          display: flex;
          justify-content: center;
          gap: 1rem;
        }
        
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        
        .btn-secondary {
          background-color: #6c757d;
          color: white;
        }
        
        .btn-secondary:hover {
          background-color: #545b62;
        }
        
        .btn-primary {
          background-color: #007bff;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #0056b3;
        }
        
        .btn-primary:disabled {
          background-color: #6c757d;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
