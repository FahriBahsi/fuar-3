'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ImageCropper from '@/components/profile/ImageCropper';
import { assetUrl, apiUrl, userImageUrl } from '@/lib/utils';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  phone: string;
  website: string;
  location: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [cropperImageSrc, setCropperImageSrc] = useState<string>('');

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    phone: '',
    website: '',
    location: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
    email: '',
  });

  // Password form data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Fetch user profile
  useEffect(() => {
    // Wait for session to load
    if (status === 'loading') {
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(apiUrl('/api/profile/update'));
        
        if (response.status === 401) {
          setError('Please log in to view your profile');
          setIsLoading(false);
          return;
        }
        
        const result = await response.json();
        
        if (result.success) {
          setProfile(result.user);
          setFormData({
            name: result.user.name || '',
            bio: result.user.bio || '',
            phone: result.user.phone || '',
            website: result.user.website || '',
            location: result.user.location || '',
            facebook: result.user.facebook || '',
            twitter: result.user.twitter || '',
            instagram: result.user.instagram || '',
            linkedin: result.user.linkedin || '',
            email: result.user.email || '',
          });
        } else {
          setError(result.error || 'Failed to load profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to fetch profile');
      } finally {
        setIsLoading(false);
      }
    };

    if (status === 'authenticated' && session) {
      fetchProfile();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [session, status]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(apiUrl('/api/profile/update'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setProfile(result.user);
        setSuccess('Profile updated successfully');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(apiUrl('/api/profile/update'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordForm(false);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Failed to update password');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle image selection for cropping
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    setSelectedImageFile(file);
    
    // Create preview and show cropper
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageSrc = e.target?.result as string;
      setCropperImageSrc(imageSrc);
      setShowImageCropper(true);
    };
    reader.readAsDataURL(file);
  };

  // Handle cropped image upload
  const handleCroppedImageUpload = async (croppedImageBlob: Blob) => {
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('image', croppedImageBlob, 'profile-image.jpg');

      const response = await fetch(apiUrl('/api/profile/upload-image'), {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setProfile(result.user);
        setSuccess('Profile image updated successfully!');
      } else {
        setError(result.message || 'Failed to update profile image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      setShowImageCropper(false);
      setSelectedImageFile(null);
      setCropperImageSrc('');
    }
  };

  // Handle cropper cancellation
  const handleCropperCancel = () => {
    setShowImageCropper(false);
    setSelectedImageFile(null);
    setCropperImageSrc('');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="dashboard-content">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="dashboard-content">
        <div className="alert alert-warning">
          You must be logged in to view your profile.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header with Breadcrumb */}
      <section className="header-breadcrumb bgimage overlay overlay--dark">
        <div className="bg_image_holder">
          <img src="/images/breadcrumb1.jpg" alt="" />
        </div>
        
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Profile' },
          ]}
          title="My Profile"
        />
      </section>

      {/* Dashboard Wrapper */}
      <section className="dashboard-wrapper section-bg p-bottom-70 pt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
                {/* Success/Error Messages */}
                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {success}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setSuccess(null)}
                    ></button>
                  </div>
                )}
                
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setError(null)}
                    ></button>
                  </div>
                )}

                {/* Profile Content */}
                <div className="row">
                  <div className="col-lg-4 col-md-4 mb-5 mb-lg-0">
                    <div className="user_pro_img_area">
                      <img
                        src={profile?.image ? userImageUrl(profile.image) : assetUrl("/images/author-profile.jpg")}
                        alt="Profile"
                        style={{
                          width: '120px',
                          height: '120px',
                          borderRadius: '50%',
                          border: '2px solid #ddd',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          objectFit: 'cover'
                        }}
                      />
                      <div className="image-info">
                        <h6>Profile Image</h6>
                        <span>JPG, PNG or GIF (max 5MB)</span>
                      </div>
                      <div className="custom-file-upload">
                        <input
                          type="file"
                          id="profile-image-upload"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="profile-image-upload" className="btn btn-sm btn-secondary">
                          {isUploading ? 'Uploading...' : 'Upload New Image'}
                        </label>
                      </div>
                      <div className="profile-info mt-3">
                        <h6>{profile?.name || 'User'}</h6>
                        <p className="text-muted small">
                          Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}
                        </p>
                        <span className={`badge ${profile?.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>
                          <i className="la la-check"></i> {profile?.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-8 col-md-8">
                    <div className="atbd_author_module">
                      <div className="atbd_content_module">
                        <div className="atbd_content_module__tittle_area">
                          <div className="atbd_area_title">
                            <h4><span className="la la-user"></span>My Profile</h4>
                          </div>
                        </div>
                        <div className="atbdb_content_module_contents">
              <form onSubmit={handleProfileUpdate}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="name">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="website">Website</label>
                      <input
                        type="url"
                        className="form-control"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, Country"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    className="form-control"
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>

                <h6 className="mt-4 mb-3">Social Links</h6>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="facebook">Facebook</label>
                      <input
                        type="url"
                        className="form-control"
                        id="facebook"
                        name="facebook"
                        value={formData.facebook}
                        onChange={handleInputChange}
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="twitter">Twitter</label>
                      <input
                        type="url"
                        className="form-control"
                        id="twitter"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="instagram">Instagram</label>
                      <input
                        type="url"
                        className="form-control"
                        id="instagram"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="linkedin">LinkedIn</label>
                      <input
                        type="url"
                        className="form-control"
                        id="linkedin"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group mt-4">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      'Update Profile'
                    )}
                  </button>
                </div>
              </form>

              {/* Password Change Section */}
              <div className="mt-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-light border-0">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="la la-lock text-primary me-3"></i> &nbsp;
                        <h6 className="mb-0 font-weight-bold">Security Settings</h6>
                      </div>
                      <button
                        type="button"
                        className={`btn btn-sm ${showPasswordForm ? 'btn-outline-danger' : 'btn-outline-primary'}`}
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                      >
                        <i className={`la ${showPasswordForm ? 'la-times' : 'la-key'} me-2`}></i>
                        &nbsp; {showPasswordForm ? 'Cancel' : 'Change Password'}
                      </button>
                    </div>
                  </div>
                  
                  {showPasswordForm && (
                    <div className="card-body">
                      <div className="alert alert-info border-0 mb-4">
                        <i className="la la-info-circle me-3"></i>&nbsp;
                        <strong>Password Requirements:</strong> Minimum 6 characters, include uppercase, lowercase, and numbers for better security.
                      </div>
                      
                      <form onSubmit={handlePasswordUpdate}>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="currentPassword" className="form-label font-weight-bold">
                                <i className="la la-key text-muted me-2"></i>&nbsp;
                                Current Password
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter your current password"
                                required
                              />
                              <small className="form-text text-muted">
                                <i className="la la-shield me-2"></i>&nbsp;
                                Required to verify your identity
                              </small>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="newPassword" className="form-label font-weight-bold">
                                <i className="la la-key text-success me-2"></i>&nbsp;
                                New Password
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                placeholder="Enter your new password"
                                required
                                minLength={6}
                              />
                              <small className="form-text text-muted">
                                <i className="la la-info-circle me-2"></i>&nbsp;
                                Minimum 6 characters required
                              </small>
                            </div>
                          </div>
                        </div>
                        
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label htmlFor="confirmPassword" className="form-label font-weight-bold">
                                <i className="la la-check-circle text-primary me-2"></i>&nbsp;
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                className={`form-control ${passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword ? 'is-invalid' : ''}`}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="Confirm your new password"
                                required
                                minLength={6}
                              />
                              {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                                <div className="invalid-feedback">
                                  <i className="la la-exclamation-triangle me-2"></i>&nbsp;
                                  Passwords do not match
                                </div>
                              )}
                              <small className="form-text text-muted">
                                <i className="la la-shield me-2"></i>&nbsp;
                                Must match the new password above
                              </small>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label className="form-label font-weight-bold text-muted">
                                <i className="la la-chart-bar text-info me-2"></i>&nbsp;
                                Password Strength
                              </label>
                              <div className="password-strength-indicator">
                                <div className="progress" style={{ height: '8px' }}>
                                  <div 
                                    className={`progress-bar ${passwordData.newPassword.length >= 6 ? 'bg-success' : passwordData.newPassword.length >= 4 ? 'bg-warning' : 'bg-danger'}`}
                                    style={{ 
                                      width: `${Math.min((passwordData.newPassword.length / 8) * 100, 100)}%` 
                                    }}
                                  ></div>
                                </div>
                                <small className={`form-text ${passwordData.newPassword.length >= 6 ? 'text-success' : passwordData.newPassword.length >= 4 ? 'text-warning' : 'text-danger'}`}>
                                  {passwordData.newPassword.length >= 6 ? 'Strong' : passwordData.newPassword.length >= 4 ? 'Medium' : 'Weak'}
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-group mt-4">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="text-muted">
                              <small>
                                <i className="la la-clock me-2"></i>&nbsp;
                                Password changes take effect immediately
                              </small>
                            </div>
                            <button
                              type="submit"
                              className="btn btn-success px-4"
                              disabled={isUpdating || (!!passwordData.newPassword && !!passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword)}
                            >
                              {isUpdating ? (
                                <>
                                  <span className="spinner-border spinner-border-sm me-3" role="status"></span>
                                  Updating Password...
                                </>
                              ) : (
                                <>
                                  <i className="la la-save me-3"></i>&nbsp;
                                  Update Password
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}
                  
                  {!showPasswordForm && (
                    <div className="card-body text-center py-4">
                      <i className="la la-lock text-muted" style={{ fontSize: '2rem' }}></i> &nbsp;
                      <p className="text-muted mt-2 mb-0">
                        Click "Change Password" to update your security settings
                      </p>
                    </div>
                  )}
                </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Cropper Modal */}
      {showImageCropper && cropperImageSrc && (
        <ImageCropper
          imageSrc={cropperImageSrc}
          onCropComplete={handleCroppedImageUpload}
          onCancel={handleCropperCancel}
        />
      )}
    </>
  );
}