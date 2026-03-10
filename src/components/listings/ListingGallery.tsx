'use client';

import { useState } from 'react';
import { assetUrl } from '@/lib/utils';

interface ListingGalleryProps {
  images: string[];
  title: string;
}

export default function ListingGallery({ images, title }: ListingGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextImage();
    } else if (e.key === 'ArrowLeft') {
      prevImage();
    }
  };

  return (
    <>
      <div className="atbd_content_module atbd_listing_gallery">
        <div className="atbd_content_module__tittle_area">
          <div className="atbd_area_title">
            <h4>
              <span className="la la-image"></span>Gallery
            </h4>
          </div>
        </div>
        <div className="atbdb_content_module_contents">
          <div className="gallery-wrapper">
            <div className="row">
              {images.map((img, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-sm-6">
                  <div 
                    className="single-image cursor-pointer" 
                    data-index={`${index + 1}/${images.length}`}
                    onClick={() => openLightbox(index)}
                   
                  >
                    <img
                      src={assetUrl(img)}
                      alt={`${title} - Image ${index + 1}`}
                      className="gallery-image"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '30px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '30px',
              cursor: 'pointer',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              zIndex: 10000,
              display: 'flex',
              // alignItems: 'center',
              justifyContent: 'center',
              // lineHeight: '1',
            }}
          >
            ×
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '40px',
              cursor: 'pointer',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              zIndex: 10000,
              display: 'flex',
              // alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1',
            }}
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              color: 'white',
              fontSize: '40px',
              cursor: 'pointer',
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              zIndex: 10000,
              display: 'flex',
              // alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1',
            }}
          >
            ›
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              position: 'relative',
            }}
          >
            <img
              src={assetUrl(images[currentImageIndex])}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain',
              }}
            />
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: '20px',
              color: 'white',
              fontSize: '16px',
            }}
          >
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}