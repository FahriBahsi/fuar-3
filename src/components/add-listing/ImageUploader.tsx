'use client';

import { useState, useRef, useCallback } from 'react';
import { assetUrl } from '@/lib/utils';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface ImageUploaderProps {
  onImagesChange?: (images: ImageFile[]) => void;
}

export default function ImageUploader({ onImagesChange }: ImageUploaderProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only image files (JPEG, PNG, GIF, WebP)');
      return false;
    }

    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return false;
    }

    return true;
  };

  const createImagePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);

    if (validFiles.length === 0) return;

    setUploading(true);

    try {
      const newImages: ImageFile[] = [];
      
      for (const file of validFiles) {
        const preview = await createImagePreview(file);
        const imageFile: ImageFile = {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
          name: file.name,
          size: file.size,
        };
        newImages.push(imageFile);
      }

      const updatedImages = [...images, ...newImages];
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Error processing images. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [images, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (id: string) => {
    const updatedImages = images.filter(img => img.id !== id);
    setImages(updatedImages);
    onImagesChange?.(updatedImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="image-uploader">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        style={{ display: 'none' }}
      />

      {/* Preview Image Upload */}
      <div className="form-group text-center">
        <p className="hide-if-no-js">
          <button
            type="button"
            className="upload-header btn btn-outline-secondary"
            onClick={openFileDialog}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Preview Image'}
          </button>
        </p>
      </div>

      {/* Image Container */}
      <div className="form-group text-center">
        <div className="listing-img-container">
          {images.length > 0 ? (
            <div className="image-preview-grid">
              {images.map((image) => (
                <div key={image.id} className="image-preview-item">
                  <img src={image.preview} alt={image.name} />
                  <div className="image-overlay">
                    <button
                      type="button"
                      className="btn btn-sm btn-danger remove-image-btn"
                      onClick={() => removeImage(image.id)}
                      title="Remove image"
                    >
                      <i className="la la-times"></i>
                    </button>
                    <div className="image-info">
                      <small>{image.name}</small>
                      <small>{formatFileSize(image.size)}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-images-placeholder">
              <img src={assetUrl('/images/picture.png')} alt="No Image Found" />
              <p>No Images</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <p className="hide-if-no-js">
          <button
            type="button"
            className="btn btn-outline-primary m-right-10"
            onClick={openFileDialog}
            disabled={uploading}
          >
            <span className="la la-plus"></span> Upload Slider Images
          </button>
          {images.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => {
                setImages([]);
                onImagesChange?.([]);
              }}
            >
              <span className="la la-trash"></span> Remove All Images
            </button>
          )}
        </p>
      </div>

      {/* Drag & Drop Zone */}
      <div
        className={`drag-drop-zone ${dragActive ? 'drag-active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="drag-drop-content">
          <i className="la la-cloud-upload" style={{ fontSize: '48px', color: '#667eea' }}></i>
          <p>Drag and drop images here, or click to browse</p>
          <small>Supports: JPEG, PNG, GIF, WebP (Max 5MB each)</small>
        </div>
      </div>
    </div>
  );
}
