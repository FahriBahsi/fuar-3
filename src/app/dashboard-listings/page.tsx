'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';
import ImageCropper from '@/components/profile/ImageCropper';
import { getAuthCallbackUrl, assetUrl, apiUrl, userImageUrl } from '@/lib/utils';

export default function DashboardListingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    bio: '',
    facebook: '',
    twitter: '',
    instagram: '',
    linkedin: '',
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState<string>('');

  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: getAuthCallbackUrl('/') });
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    // Load profile data when switching to profile tab
    if (tabId === 'profile' && session) {
      loadProfileData();
    }
  };

  // Load profile data
  const loadProfileData = async () => {
    try {
      const response = await fetch(apiUrl('/api/profile/update'));
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.user) {
          setProfileData({
            name: result.user.name || '',
            email: result.user.email || '',
            phone: result.user.phone || '',
            website: result.user.website || '',
            address: result.user.location || '',
            bio: result.user.bio || '',
            facebook: result.user.facebook || '',
            twitter: result.user.twitter || '',
            instagram: result.user.instagram || '',
            linkedin: result.user.linkedin || '',
          });
          
          // Set current profile image if it exists
          if (result.user.image) {
            setImagePreview(result.user.image);
          } else {
            setImagePreview('');
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  // Handle profile input changes
  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle password input changes
  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setProfileMessage('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setProfileMessage('Image size must be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      
      // Create preview and show cropper
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target?.result as string;
        setCropperImageSrc(imageSrc);
        setShowCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle cropper completion
  const handleCropperComplete = (croppedImageBlob: Blob) => {
    // Create a new file from the cropped blob
    const croppedFile = new File([croppedImageBlob], 'cropped-image.jpg', {
      type: 'image/jpeg'
    });
    
    setSelectedImage(croppedFile);
    
    // Create preview from cropped image
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(croppedFile);
    
    setShowCropper(false);
    setCropperImageSrc('');
  };

  // Handle cropper cancel
  const handleCropperCancel = () => {
    setShowCropper(false);
    setCropperImageSrc('');
    setSelectedImage(null);
    // Clear the file input
    const fileInput = document.getElementById('customFile') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedImage) {
      setProfileMessage('Please select an image first');
      return;
    }

    setIsUploadingImage(true);
    setProfileMessage('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch(apiUrl('/api/profile/upload-image'), {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setProfileMessage('Image uploaded successfully!');
        setSelectedImage(null);
        setImagePreview('');
        // Reload profile data to get updated image URL
        loadProfileData();
      } else {
        setProfileMessage(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setProfileMessage('Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle image removal
  const handleImageRemove = async () => {
    if (!confirm('Are you sure you want to remove your profile image?')) {
      return;
    }

    setIsUploadingImage(true);
    setProfileMessage('');

    try {
      const response = await fetch(apiUrl('/api/profile/update'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: null }),
      });

      const result = await response.json();

      if (result.success) {
        setProfileMessage('Profile image removed successfully!');
        setImagePreview('');
        loadProfileData();
      } else {
        setProfileMessage(result.error || 'Failed to remove image');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      setProfileMessage('Failed to remove image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle profile form submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileMessage('');

    try {
      const updateData: any = {
        ...profileData,
        location: profileData.address,
      };

      // Add password data if provided
      if (passwordData.newPassword && passwordData.confirmPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          setProfileMessage('Passwords do not match');
          setIsUpdatingProfile(false);
          return;
        }
        updateData.password = passwordData.newPassword;
      }

      const response = await fetch(apiUrl('/api/profile/update'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        setProfileMessage('Profile updated successfully!');
        // Clear password fields
        setPasswordData({ newPassword: '', confirmPassword: '' });
        // Reload profile data
        loadProfileData();
      } else {
        setProfileMessage(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setProfileMessage('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="dashboard-loading">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
                <p className="mt-3">Loading dashboard...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <>
      {/* Header with Breadcrumb */}
      <section className="header-breadcrumb bgimage overlay overlay--dark">
        <div className="bg_image_holder">
          <img src={assetUrl("/images/breadcrumb1.jpg")} alt="" />
        </div>
        
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'All Listings' },
          ]}
          title="Dashboard Listings"
        />
      </section>

      {/* Dashboard Wrapper */}
      <section className="dashboard-wrapper section-bg p-bottom-70">
        <div className="dashboard-nav">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="dashboard-nav-area">
                  <ul className="nav" id="dashboard-tabs" role="tablist">
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'listings' ? 'active' : ''}`}
                        onClick={() => handleTabChange('listings')}
                        role="tab"
                        aria-selected={activeTab === 'listings'}
                      >
                        My Listings
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => handleTabChange('profile')}
                        role="tab"
                        aria-selected={activeTab === 'profile'}
                      >
                        My Profile
                      </button>
                    </li>
                    <li className="nav-item">
                      <button 
                        className={`nav-link ${activeTab === 'favorite' ? 'active' : ''}`}
                        onClick={() => handleTabChange('favorite')}
                        role="tab"
                        aria-selected={activeTab === 'favorite'}
                      >
                        Favorite Listing
                      </button>
                    </li>
                  </ul>

                  <div className="nav_button">
                    <Link href="/add-listing" className="btn btn-primary mr-2">
                      <span className="la la-plus"></span> Add Listing
                    </Link>
                    <button 
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="btn btn-secondary"
                    >
                      {isLoggingOut ? (
                        <>
                          <span className="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
                          Logging Out...
                        </>
                      ) : (
                        <>
                          <span className="la la-sign-out"></span> Log Out
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-content p-top-100" id="dashboard-tabs-content">
          {activeTab === 'listings' && (
          <div className="tab-pane fade show active" id="listings" role="tabpanel" aria-labelledby="all-listings">
            <div className="container">
              <div className="row">
                <div className="col-lg-4 col-sm-6">
                  <div className="atbd_single_listing atbd_listing_card">
                    <article className="atbd_single_listing_wrapper">
                      <figure className="atbd_listing_thumbnail_area">
                        <div className="atbd_listing_image">
                          <Link href="#">
                            <img src={assetUrl("/images/p1.jpg")} alt="listing image" />
                          </Link>
                        </div>

                        <figcaption className="atbd_thumbnail_overlay_content">
                          <div className="atbd_upper_badge">
                            <span className="atbd_badge atbd_badge_featured">Featured</span>
                          </div>
                        </figcaption>
                      </figure>

                      <div className="atbd_listing_info">
                        <div className="atbd_content_upper">
                          <div className="atbd_dashboard_tittle_metas">
                            <h4 className="atbd_listing_title">
                              <Link href="#">Flanders Heat & Air Systems</Link>
                            </h4>
                          </div>
                          <div className="atbd_card_action">
                            <div className="atbd_listing_meta">
                              <span className="atbd_meta atbd_listing_rating">4.5<i className="la la-star"></i></span>
                            </div>
                            <div className="db_btn_area">
                              <div className="dropup edit_listing">
                                <a href="#" role="button" className="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Edit</a>
                                <div className="dropdown-menu">
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-edit color-primary"></span> Edit Your Listing
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-money color-secondary"></span> Change Your Plan
                                  </a>
                                </div>
                              </div>
                              <a href="#" className="directory_remove_btn btn btn-sm btn-outline-danger" data-toggle="modal" data-target="#modal-item-remove">Delete</a>
                            </div>
                          </div>
                        </div>

                        <div className="atbd_listing_bottom_content">
                          <div className="listing-meta">
                            <p><span>Plan Name:</span> Basic Plan</p>
                            <p><span>Expiration:</span> February 13, 2020</p>
                            <p><span>Listing Status:</span> Published</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="col-lg-4 col-sm-6">
                  <div className="atbd_single_listing atbd_listing_card">
                    <article className="atbd_single_listing_wrapper">
                      <figure className="atbd_listing_thumbnail_area">
                        <div className="atbd_listing_image">
                          <Link href="#">
                            <img src={assetUrl("/images/p2.jpg")} alt="listing image" />
                          </Link>
                        </div>

                        <figcaption className="atbd_thumbnail_overlay_content">
                          <div className="atbd_upper_badge">
                            <span className="atbd_badge atbd_badge_featured">Featured</span>
                          </div>
                        </figcaption>
                      </figure>

                      <div className="atbd_listing_info">
                        <div className="atbd_content_upper">
                          <div className="atbd_dashboard_tittle_metas">
                            <h4 className="atbd_listing_title">
                              <Link href="#">Sample Restaurant</Link>
                            </h4>
                          </div>
                          <div className="atbd_card_action">
                            <div className="atbd_listing_meta">
                              <span className="atbd_meta atbd_listing_rating">4.2<i className="la la-star"></i></span>
                            </div>
                            <div className="db_btn_area">
                              <div className="dropup edit_listing">
                                <a href="#" role="button" className="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Edit</a>
                                <div className="dropdown-menu">
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-edit color-primary"></span> Edit Your Listing
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-money color-secondary"></span> Change Your Plan
                                  </a>
                                </div>
                              </div>
                              <a href="#" className="directory_remove_btn btn btn-sm btn-outline-danger" data-toggle="modal" data-target="#modal-item-remove">Delete</a>
                            </div>
                          </div>
                        </div>

                        <div className="atbd_listing_bottom_content">
                          <div className="listing-meta">
                            <p><span>Plan Name:</span> Professional Plan</p>
                            <p><span>Expiration:</span> March 15, 2020</p>
                            <p><span>Listing Status:</span> Published</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="col-lg-4 col-sm-6">
                  <div className="atbd_single_listing atbd_listing_card">
                    <article className="atbd_single_listing_wrapper">
                      <figure className="atbd_listing_thumbnail_area">
                        <div className="atbd_listing_image">
                          <Link href="#">
                            <img src={assetUrl("/images/p3.jpg")} alt="listing image" />
                          </Link>
                        </div>

                        <figcaption className="atbd_thumbnail_overlay_content">
                          <div className="atbd_upper_badge">
                            <span className="atbd_badge atbd_badge_featured">Featured</span>
                          </div>
                        </figcaption>
                      </figure>

                      <div className="atbd_listing_info">
                        <div className="atbd_content_upper">
                          <div className="atbd_dashboard_tittle_metas">
                            <h4 className="atbd_listing_title">
                              <Link href="#">Sample Hotel</Link>
                            </h4>
                          </div>
                          <div className="atbd_card_action">
                            <div className="atbd_listing_meta">
                              <span className="atbd_meta atbd_listing_rating">4.8<i className="la la-star"></i></span>
                            </div>
                            <div className="db_btn_area">
                              <div className="dropup edit_listing">
                                <a href="#" role="button" className="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Edit</a>
                                <div className="dropdown-menu">
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-edit color-primary"></span> Edit Your Listing
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-money color-secondary"></span> Change Your Plan
                                  </a>
                                </div>
                              </div>
                              <a href="#" className="directory_remove_btn btn btn-sm btn-outline-danger" data-toggle="modal" data-target="#modal-item-remove">Delete</a>
                            </div>
                          </div>
                        </div>

                        <div className="atbd_listing_bottom_content">
                          <div className="listing-meta">
                            <p><span>Plan Name:</span> Enterprise Plan</p>
                            <p><span>Expiration:</span> April 20, 2020</p>
                            <p><span>Listing Status:</span> Published</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="col-lg-4 col-sm-6">
                  <div className="atbd_single_listing atbd_listing_card">
                    <article className="atbd_single_listing_wrapper">
                      <figure className="atbd_listing_thumbnail_area">
                        <div className="atbd_listing_image">
                          <Link href="#">
                            <img src={assetUrl("/images/p1.jpg")} alt="listing image" />
                          </Link>
                        </div>

                        <figcaption className="atbd_thumbnail_overlay_content">
                          <div className="atbd_upper_badge">
                            <span className="atbd_badge atbd_badge_featured">Featured</span>
                          </div>
                        </figcaption>
                      </figure>

                      <div className="atbd_listing_info">
                        <div className="atbd_content_upper">
                          <div className="atbd_dashboard_tittle_metas">
                            <h4 className="atbd_listing_title">
                              <Link href="#">Flanders Heat & Air Systems</Link>
                            </h4>
                          </div>
                          <div className="atbd_card_action">
                            <div className="atbd_listing_meta">
                              <span className="atbd_meta atbd_listing_rating">4.5<i className="la la-star"></i></span>
                            </div>
                            <div className="db_btn_area">
                              <div className="dropup edit_listing">
                                <a href="#" role="button" className="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Edit</a>
                                <div className="dropdown-menu">
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-edit color-primary"></span> Edit Your Listing
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-money color-secondary"></span> Change Your Plan
                                  </a>
                                </div>
                              </div>
                              <a href="#" className="directory_remove_btn btn btn-sm btn-outline-danger" data-toggle="modal" data-target="#modal-item-remove">Delete</a>
                            </div>
                          </div>
                        </div>

                        <div className="atbd_listing_bottom_content">
                          <div className="listing-meta">
                            <p><span>Plan Name:</span> Basic Plan</p>
                            <p><span>Expiration:</span> February 13, 2020</p>
                            <p><span>Listing Status:</span> Published</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="col-lg-4 col-sm-6">
                  <div className="atbd_single_listing atbd_listing_card">
                    <article className="atbd_single_listing_wrapper">
                      <figure className="atbd_listing_thumbnail_area">
                        <div className="atbd_listing_image">
                          <Link href="#">
                            <img src={assetUrl("/images/p2.jpg")} alt="listing image" />
                          </Link>
                        </div>

                        <figcaption className="atbd_thumbnail_overlay_content">
                          <div className="atbd_upper_badge">
                            <span className="atbd_badge atbd_badge_featured">Featured</span>
                          </div>
                        </figcaption>
                      </figure>

                      <div className="atbd_listing_info">
                        <div className="atbd_content_upper">
                          <div className="atbd_dashboard_tittle_metas">
                            <h4 className="atbd_listing_title">
                              <Link href="#">Sample Restaurant</Link>
                            </h4>
                          </div>
                          <div className="atbd_card_action">
                            <div className="atbd_listing_meta">
                              <span className="atbd_meta atbd_listing_rating">4.2<i className="la la-star"></i></span>
                            </div>
                            <div className="db_btn_area">
                              <div className="dropup edit_listing">
                                <a href="#" role="button" className="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Edit</a>
                                <div className="dropdown-menu">
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-edit color-primary"></span> Edit Your Listing
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-money color-secondary"></span> Change Your Plan
                                  </a>
                                </div>
                              </div>
                              <a href="#" className="directory_remove_btn btn btn-sm btn-outline-danger" data-toggle="modal" data-target="#modal-item-remove">Delete</a>
                            </div>
                          </div>
                        </div>

                        <div className="atbd_listing_bottom_content">
                          <div className="listing-meta">
                            <p><span>Plan Name:</span> Professional Plan</p>
                            <p><span>Expiration:</span> March 15, 2020</p>
                            <p><span>Listing Status:</span> Published</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>

                <div className="col-lg-4 col-sm-6">
                  <div className="atbd_single_listing atbd_listing_card">
                    <article className="atbd_single_listing_wrapper">
                      <figure className="atbd_listing_thumbnail_area">
                        <div className="atbd_listing_image">
                          <Link href="#">
                            <img src={assetUrl("/images/p3.jpg")} alt="listing image" />
                          </Link>
                        </div>

                        <figcaption className="atbd_thumbnail_overlay_content">
                          <div className="atbd_upper_badge">
                            <span className="atbd_badge atbd_badge_featured">Featured</span>
                          </div>
                        </figcaption>
                      </figure>

                      <div className="atbd_listing_info">
                        <div className="atbd_content_upper">
                          <div className="atbd_dashboard_tittle_metas">
                            <h4 className="atbd_listing_title">
                              <Link href="#">Sample Hotel</Link>
                            </h4>
                          </div>
                          <div className="atbd_card_action">
                            <div className="atbd_listing_meta">
                              <span className="atbd_meta atbd_listing_rating">4.8<i className="la la-star"></i></span>
                            </div>
                            <div className="db_btn_area">
                              <div className="dropup edit_listing">
                                <a href="#" role="button" className="btn btn-sm btn-outline-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Edit</a>
                                <div className="dropdown-menu">
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-edit color-primary"></span> Edit Your Listing
                                  </a>
                                  <a className="dropdown-item" href="#">
                                    <span className="la la-money color-secondary"></span> Change Your Plan
                                  </a>
                                </div>
                              </div>
                              <a href="#" className="directory_remove_btn btn btn-sm btn-outline-danger" data-toggle="modal" data-target="#modal-item-remove">Delete</a>
                            </div>
                          </div>
                        </div>

                        <div className="atbd_listing_bottom_content">
                          <div className="listing-meta">
                            <p><span>Plan Name:</span> Enterprise Plan</p>
                            <p><span>Expiration:</span> April 20, 2020</p>
                            <p><span>Listing Status:</span> Published</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* My Profile Tab */}
          {activeTab === 'profile' && (
          <div className="tab-pane fade show active p-bottom-30" id="profile" role="tabpanel" aria-labelledby="profile-tab">
            <div className="container">
              <div className="row">
                <div className="col-lg-3 col-md-4 mb-5 mb-lg-0">
                  <div className="user_pro_img_area">
                    <img 
                      src={imagePreview?.startsWith('data:') ? imagePreview : userImageUrl(imagePreview) || assetUrl("/images/author-profile.jpg")} 
                      alt="Profile" 
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #ddd',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = assetUrl("/images/author-profile.jpg");
                      }}
                      onLoad={() => {
                        // Image loaded successfully
                      }}
                    />
                    <div className="image-info">
                      <h6>Profile Image</h6>
                      <span>JPG, PNG or GIF (max 5MB)</span>
                    </div>
                    <div className="custom-file-upload">
                      <input 
                        type="file" 
                        id="customFile" 
                        accept="image/*"
                        onChange={handleImageSelect}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="customFile" className="btn btn-sm btn-secondary">
                        {selectedImage ? 'Change Image' : 'Upload New Image'}
                      </label>
                    </div>
                    {selectedImage && (
                      <button 
                        className="btn btn-sm btn-primary mt-2"
                        onClick={handleImageUpload}
                        disabled={isUploadingImage}
                        style={{ display: 'block', width: '100%' }}
                      >
                        {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                      </button>
                    )}
                    {(imagePreview || profileData.name) && (
                      <button 
                        className="btn btn-sm btn-danger mt-2"
                        onClick={handleImageRemove}
                        disabled={isUploadingImage}
                        style={{ display: 'block', width: '100%' }}
                      >
                        {isUploadingImage ? 'Removing...' : 'Delete Image'}
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-lg-9 col-md-8">
                  <div className="atbd_author_module">
                    <div className="atbd_content_module">
                      <div className="atbd_content_module__tittle_area">
                        <div className="atbd_area_title">
                          <h4><span className="la la-user"></span>My Profile</h4>
                        </div>
                      </div>
                      <div className="atbdb_content_module_contents">
                        {profileMessage && (
                          <div className={`alert ${profileMessage.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">
                            {profileMessage}
                          </div>
                        )}
                        <form onSubmit={handleProfileSubmit}>
                        <div className="user_info_wrap">
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-group">
                                  <label htmlFor="name" className="not_empty">Full Name</label>
                                  <input 
                                    className="form-control" 
                                    type="text" 
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleProfileInputChange}
                                    placeholder="Full name" 
                                    id="name" 
                                  />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                  <label htmlFor="email" className="not_empty">Email (required)</label>
                                  <input 
                                    className="form-control" 
                                    id="email" 
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleProfileInputChange}
                                    type="email" 
                                    placeholder="mail@example.com" 
                                    required 
                                  />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="phone" className="not_empty">Cell Number</label>
                                  <input 
                                    className="form-control" 
                                    type="tel" 
                                    name="phone"
                                    value={profileData.phone}
                                    onChange={handleProfileInputChange}
                                    placeholder="Phone number" 
                                    id="phone" 
                                  />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="website" className="not_empty">Website</label>
                                  <input 
                                    className="form-control" 
                                    id="website" 
                                    name="website"
                                    value={profileData.website}
                                    onChange={handleProfileInputChange}
                                    type="url" 
                                    placeholder="Website" 
                                  />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="address" className="not_empty">Address</label>
                                  <input 
                                    className="form-control" 
                                    id="address" 
                                    name="address"
                                    value={profileData.address}
                                    onChange={handleProfileInputChange}
                                    type="text" 
                                    placeholder="Address" 
                                  />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                  <label htmlFor="newPassword" className="not_empty">New Password</label>
                                  <input 
                                    id="newPassword" 
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordInputChange}
                                    className="form-control" 
                                    type="password" 
                                    placeholder="Password" 
                                  />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                  <label htmlFor="confirmPassword" className="not_empty">Confirm New Password</label>
                                  <input 
                                    id="confirmPassword" 
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordInputChange}
                                    className="form-control" 
                                    type="password" 
                                    placeholder="Re-enter Password" 
                                  />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="facebook" className="not_empty">Facebook</label>
                                  <input 
                                    id="facebook" 
                                    name="facebook"
                                    value={profileData.facebook}
                                    onChange={handleProfileInputChange}
                                    className="form-control" 
                                    type="url" 
                                    placeholder="Facebook URL" 
                                  />
                                <p>Leave it empty to hide</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label htmlFor="twitter" className="not_empty">Twitter</label>
                                  <input 
                                    id="twitter" 
                                    name="twitter"
                                    value={profileData.twitter}
                                    onChange={handleProfileInputChange}
                                    className="form-control" 
                                    type="url" 
                                    placeholder="Twitter URL" 
                                  />
                                <p>Leave it empty to hide</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                  <label htmlFor="instagram" className="not_empty">Instagram</label>
                                  <input 
                                    id="instagram" 
                                    name="instagram"
                                    value={profileData.instagram}
                                    onChange={handleProfileInputChange}
                                    className="form-control" 
                                    type="url" 
                                    placeholder="Instagram URL" 
                                  />
                                <p>Leave it empty to hide</p>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                  <label htmlFor="linkedin" className="not_empty">LinkedIn</label>
                                  <input 
                                    id="linkedin" 
                                    name="linkedin"
                                    value={profileData.linkedin}
                                    onChange={handleProfileInputChange}
                                    className="form-control" 
                                    type="url" 
                                    placeholder="Linkedin URL" 
                                  />
                                <p>Leave it empty to hide</p>
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group">
                                <label htmlFor="bio" className="not_empty">About Author</label>
                                  <textarea 
                                    className="form-control" 
                                    rows={6} 
                                    id="bio" 
                                    name="bio"
                                    value={profileData.bio}
                                    onChange={handleProfileInputChange}
                                    placeholder="Describe yourself"
                                  ></textarea>
                              </div>
                            </div>
                          </div>
                            <button 
                              type="submit" 
                              className="btn btn-primary" 
                              id="update_user_profile"
                              disabled={isUpdatingProfile}
                            >
                              {isUpdatingProfile ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Favorite Listing Tab */}
          {activeTab === 'favorite' && (
          <div className="tab-pane fade show active p-bottom-30" id="favorite" role="tabpanel" aria-labelledby="faborite-listings">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="atbd_saved_items_wrapper">
                    <div className="atbd_content_module">
                      <div className="atbd_content_module__tittle_area">
                        <div className="atbd_area_title">
                          <h4><span className="la la-list"></span>My Favorite Listings</h4>
                        </div>
                      </div>
                      <div className="atbdb_content_module_contents">
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th scope="col">Listing Name</th>
                                <th scope="col">Category</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td><Link href="">Double Broccoli Quinoa</Link></td>
                                <td><span className="la la-glass"></span> <Link href="">Restaurant</Link></td>
                                <td><Link href="" className="remove-favorite"><span className="la la-times"></span></Link></td>
                              </tr>
                              <tr>
                                <td><Link href="">Easy Brazilian Cheese Bread</Link></td>
                                <td><span className="la la-glass"></span> <Link href="">Restaurant</Link></td>
                                <td><Link href="" className="remove-favorite"><span className="la la-times"></span></Link></td>
                              </tr>
                              <tr>
                                <td><Link href="">Hilton Hawaiian Village</Link></td>
                                <td><span className="la la-bed"></span> <Link href="">Hotel</Link></td>
                                <td><Link href="" className="remove-favorite"><span className="la la-times"></span></Link></td>
                              </tr>
                              <tr>
                                <td><Link href="">Sample Business Center</Link></td>
                                <td><span className="la la-building"></span> <Link href="">Business</Link></td>
                                <td><Link href="" className="remove-favorite"><span className="la la-times"></span></Link></td>
                              </tr>
                              <tr>
                                <td><Link href="">Local Coffee Shop</Link></td>
                                <td><span className="la la-coffee"></span> <Link href="">Cafe</Link></td>
                                <td><Link href="" className="remove-favorite"><span className="la la-times"></span></Link></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>
      
      {/* Image Cropper Modal */}
      {showCropper && (
        <ImageCropper
          imageSrc={cropperImageSrc}
          onCropComplete={handleCropperComplete}
          onCancel={handleCropperCancel}
        />
      )}
    </>
  );
}