'use client';

import { useState } from 'react';
import { Draggable } from 'react-beautiful-dnd';

interface SocialInfoFieldProps {
  id: string;
  index: number;
  platform: string;
  url: string;
  onPlatformChange: (id: string, platform: string) => void;
  onUrlChange: (id: string, url: string) => void;
  onRemove: (id: string) => void;
}

const socialPlatforms = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'pinterest', label: 'Pinterest' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'snapchat', label: 'Snapchat' },
  { value: 'github', label: 'GitHub' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'behance', label: 'Behance' },
  { value: 'flickr', label: 'Flickr' },
  { value: 'google-plus', label: 'Google+' },
  { value: 'reddit', label: 'Reddit' },
  { value: 'soundcloud', label: 'SoundCloud' },
  { value: 'stack-overflow', label: 'StackOverflow' },
  { value: 'tumblr', label: 'Tumblr' },
  { value: 'vimeo', label: 'Vimeo' },
  { value: 'vine', label: 'Vine' },
];

export default function SocialInfoField({
  id,
  index,
  platform,
  url,
  onPlatformChange,
  onUrlChange,
  onRemove,
}: SocialInfoFieldProps) {
  const formatUrl = (value: string, platform: string) => {
    if (!value || !platform) return value;
    
    // Add protocol if missing
    if (!value.startsWith('http://') && !value.startsWith('https://')) {
      return `https://${value}`;
    }
    return value;
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = formatUrl(e.target.value, platform);
    onUrlChange(id, newUrl);
  };

  const getPlaceholder = () => {
    switch (platform) {
      case 'facebook':
        return 'eg. https://facebook.com/yourpage';
      case 'twitter':
        return 'eg. https://twitter.com/yourhandle';
      case 'instagram':
        return 'eg. https://instagram.com/yourhandle';
      case 'linkedin':
        return 'eg. https://linkedin.com/in/yourprofile';
      case 'youtube':
        return 'eg. https://youtube.com/c/yourchannel';
      default:
        return 'eg. https://example.com';
    }
  };
  return (
    <Draggable draggableId={id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`directorist atbdp_social_field_wrapper ${
            snapshot.isDragging ? 'is-dragging' : ''
          }`}
          id={`socialID-${index}`}
        >
          <div className="row m-bottom-20" id="social-form-fields">
            <div className="col-sm-4">
              <div className="form-group">
                <div className="select-basic">
                  <select
                    className="form-control"
                    value={platform}
                    onChange={(e) => onPlatformChange(id, e.target.value)}
                  >
                    <option value="">Select Platform</option>
                    {socialPlatforms.map((social) => (
                      <option key={social.value} value={social.value}>
                        {social.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="col-sm-6">
              <div className="form-group">
                <input
                  type="url"
                  className="form-control directory_field atbdp_social_input"
                  placeholder={getPlaceholder()}
                  value={url}
                  onChange={handleUrlChange}
                  required
                />
              </div>
            </div>
            <div className="col-sm-2 d-flex align-items-center justify-content-center">
              <span
                className="removeSocialField btn-danger"
                id={`removeSocial-${id}`}
                title="Remove this item"
                onClick={() => onRemove(id)}
                style={{ cursor: 'pointer', marginRight: '8px' }}
              >
                <i className="la la-times"></i>
              </span>
              <div
                className="adl-move-icon btn-secondary"
                title="Drag to reorder"
              >
                <i className="la la-arrows"></i>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
