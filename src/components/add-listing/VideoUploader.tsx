'use client';

import { useState } from 'react';

interface VideoData {
  url: string;
  platform: 'youtube' | 'vimeo' | 'other';
  videoId?: string;
  embedUrl?: string;
}

interface VideoUploaderProps {
  onVideoChange?: (video: VideoData | null) => void;
}

export default function VideoUploader({ onVideoChange }: VideoUploaderProps) {
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const extractVideoInfo = (url: string): VideoData | null => {
    // YouTube URL patterns
    const youtubePatterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ];

    // Vimeo URL patterns
    const vimeoPatterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/,
    ];

    // Check for YouTube
    for (const pattern of youtubePatterns) {
      const match = url.match(pattern);
      if (match) {
        const videoId = match[1];
        return {
          url,
          platform: 'youtube',
          videoId,
          embedUrl: `https://www.youtube.com/embed/${videoId}`,
        };
      }
    }

    // Check for Vimeo
    for (const pattern of vimeoPatterns) {
      const match = url.match(pattern);
      if (match) {
        const videoId = match[1];
        return {
          url,
          platform: 'vimeo',
          videoId,
          embedUrl: `https://player.vimeo.com/video/${videoId}`,
        };
      }
    }

    return null;
  };

  const validateUrl = (url: string): boolean => {
    const urlPattern = /^https?:\/\/.+/;
    return urlPattern.test(url);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!url.trim()) {
      setError('Please enter a video URL');
      return;
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }

    const videoInfo = extractVideoInfo(url);

    if (!videoInfo) {
      setError('Please enter a valid YouTube or Vimeo URL');
      return;
    }

    setVideoData(videoInfo);
    onVideoChange?.(videoInfo);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  const clearVideo = () => {
    setVideoData(null);
    setUrl('');
    setError('');
    onVideoChange?.(null);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'la-youtube';
      case 'vimeo':
        return 'la-vimeo';
      default:
        return 'la-video';
    }
  };

  const getPlatformName = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return 'YouTube';
      case 'vimeo':
        return 'Vimeo';
      default:
        return 'Video';
    }
  };

  return (
    <div className="video-uploader">
      <form onSubmit={handleUrlSubmit}>
        <div className="form-group">
          <label htmlFor="videourl" className="form-label">
            Video URL
          </label>
          <input
            type="url"
            id="videourl"
            name="videourl"
            className="form-control directory_field"
            placeholder="Enter YouTube or Vimeo URL (e.g., https://youtube.com/watch?v=...)"
            value={url}
            onChange={handleUrlChange}
          />
          {error && <div className="text-danger mt-2">{error}</div>}
          <small className="form-text text-muted">
            Only YouTube & Vimeo URLs are supported
          </small>
        </div>
        <button type="submit" className="btn btn-primary">
          <i className="la la-plus"></i> Add Video
        </button>
      </form>

      {videoData && (
        <div className="video-preview mt-4">
          <div className="video-preview-card">
            <div className="video-preview-header">
              <div className="video-info">
                <i className={`la ${getPlatformIcon(videoData.platform)}`}></i>
                <span>{getPlatformName(videoData.platform)} Video</span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-danger"
                onClick={clearVideo}
                title="Remove video"
              >
                <i className="la la-times"></i>
              </button>
            </div>
            
            <div className="video-preview-content">
              <div className="video-thumbnail">
                {videoData.platform === 'youtube' && (
                  <img
                    src={`https://img.youtube.com/vi/${videoData.videoId}/hqdefault.jpg`}
                    alt="YouTube thumbnail"
                    className="img-fluid"
                  />
                )}
                {videoData.platform === 'vimeo' && (
                  <div className="vimeo-placeholder">
                    <i className="la la-vimeo" style={{ fontSize: '48px' }}></i>
                    <p>Vimeo Video</p>
                  </div>
                )}
                <div className="play-overlay">
                  <i className="la la-play" style={{ fontSize: '24px' }}></i>
                </div>
              </div>
              
              <div className="video-details">
                <p className="video-url">
                  <strong>URL:</strong> {videoData.url}
                </p>
                <p className="video-id">
                  <strong>Video ID:</strong> {videoData.videoId}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
