'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Breadcrumb from '@/components/common/Breadcrumb';
import { apiUrl } from '@/lib/utils';
import GoogleMap from '@/components/common/GoogleMap';
import Select from '@/components/common/Select';
import SocialInfoManager from '@/components/add-listing/SocialInfoManager';
import FAQManager from '@/components/add-listing/FAQManager';
import ImageUploader from '@/components/add-listing/ImageUploader';
import VideoUploader from '@/components/add-listing/VideoUploader';

interface SocialField {
  id: string;
  platform: string;
  url: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

interface VideoData {
  url: string;
  platform: 'youtube' | 'vimeo' | 'other';
  videoId?: string;
  embedUrl?: string;
}

export default function AddListingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  
  const [mapCoords, setMapCoords] = useState({ lat: 37.387597, lng: -122.048102 });
  const [selectedTags, setSelectedTags] = useState<readonly { value: string; label: string }[]>([
    { value: 'orange', label: 'orange' },
    { value: 'purple', label: 'purple' },
  ]);
  const [selectedCategory, setSelectedCategory] = useState<{ value: string; label: string } | null>(null);
  const [socialFields, setSocialFields] = useState<SocialField[]>([]);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [uploadedImages, setUploadedImages] = useState<ImageFile[]>([]);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'loading') return; // Still loading
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, status, router]);

  const handleMarkerMove = (lat: number, lng: number) => {
    setMapCoords({ lat, lng });
    // Update the manual coordinate inputs if they exist
    const latInput = document.getElementById('manual_lat') as HTMLInputElement;
    const lngInput = document.getElementById('manual_lng') as HTMLInputElement;
    if (latInput) latInput.value = lat.toString();
    if (lngInput) lngInput.value = lng.toString();
  };

  const handleGenerateMap = () => {
    const latInput = document.getElementById('manual_lat') as HTMLInputElement;
    const lngInput = document.getElementById('manual_lng') as HTMLInputElement;
    if (latInput && lngInput) {
      const lat = parseFloat(latInput.value);
      const lng = parseFloat(lngInput.value);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMapCoords({ lat, lng });
      }
    }
  };

  const tagOptions = [
    { value: 'orange', label: 'orange' },
    { value: 'white', label: 'white' },
    { value: 'purple', label: 'purple' },
    { value: 'green', label: 'green' },
    { value: 'blue', label: 'blue' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select Category' },
    { value: 'restaurants', label: 'Restaurants' },
    { value: 'hotels', label: 'Hotels' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'services', label: 'Services' },
    { value: 'travel-tourism', label: 'Travel & Tourism' },
    { value: 'health-fitness', label: 'Health & Fitness' },
  ];

  const handleSocialFieldsChange = (fields: SocialField[]) => {
    setSocialFields(fields);
  };

  const handleFAQsChange = (faqs: FAQItem[]) => {
    setFaqItems(faqs);
  };

  const handleImagesChange = (images: ImageFile[]) => {
    setUploadedImages(images);
  };

  const handleVideoChange = (video: VideoData | null) => {
    setVideoData(video);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user || !(session.user as any).id) {
      setSubmitError('You must be logged in to submit a listing');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Collect all form data
      const formData = new FormData();
      
      // Basic information
      const title = (document.getElementById('title') as HTMLInputElement)?.value;
      const description = (document.getElementById('desc') as HTMLTextAreaElement)?.value;
      const shortDescription = (document.getElementById('short_desc') as HTMLTextAreaElement)?.value;
      const tagline = (document.getElementById('tagline') as HTMLInputElement)?.value;
      const price = (document.getElementById('price-input') as HTMLInputElement)?.value;
      
      // Contact information
      const address = (document.getElementById('address') as HTMLInputElement)?.value;
      const phone = (document.getElementById('phone_number') as HTMLInputElement)?.value;
      const email = (document.getElementById('contact_email') as HTMLInputElement)?.value;
      const website = (document.getElementById('website_address') as HTMLInputElement)?.value;
      
      // Business hours
      const businessHours: { [key: string]: { open: string; close: string } | 'closed' } = {};
      const days = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
      
      days.forEach(day => {
        const openTime = (document.getElementById(`bdbh_${day}`) as HTMLInputElement)?.value;
        const closeTime = (document.getElementById(`bdbh_${day}_cls`) as HTMLInputElement)?.value;
        const isClosed = (document.getElementById(`${day.slice(0, 3)}_cls`) as HTMLInputElement)?.checked;
        
        if (isClosed) {
          businessHours[day] = 'closed';
        } else if (openTime && closeTime) {
          businessHours[day] = { open: openTime, close: closeTime };
        }
      });

      // SEO fields
      const metaTitle = (document.getElementById('meta_title') as HTMLInputElement)?.value;
      const metaDescription = (document.getElementById('meta_description') as HTMLTextAreaElement)?.value;
      
      // Amenities
      const amenities = Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map((el: any) => el.value);
      
      // Currency
      const currency = (document.getElementById('currency') as HTMLSelectElement)?.value || 'USD';

      // Prepare data for submission
      const listingData = {
        title,
        description,
        shortDescription,
        tagline,
        price,
        priceType: 'hourly', // Default price type
        categoryId: selectedCategory?.value || 'restaurants', // Default category
        locationId: 'new-york', // Default location
        address,
        latitude: mapCoords.lat,
        longitude: mapCoords.lng,
        phone,
        email,
        website,
        socialFields,
        faqItems,
        businessHours,
        images: uploadedImages.map(img => ({ name: img.name, url: img.preview })),
        videoUrl: videoData?.url,
        tags: selectedTags.map(tag => tag.value),
        amenities,
        metaTitle,
        metaDescription,
        currency,
        customFields: {
          customField: (document.getElementById('custom-field') as HTMLSelectElement)?.value,
          cf1: (document.getElementById('cf1') as HTMLInputElement)?.value,
          cdate: (document.getElementById('cdate') as HTMLInputElement)?.value,
          customRadio: (document.querySelector('input[name="customRadioInline1"]:checked') as HTMLInputElement)?.value,
          location: (document.getElementById('location') as HTMLSelectElement)?.value,
        }
      };

      // Submit to API
      const response = await fetch(apiUrl('/api/listings/create'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include session cookies
        body: JSON.stringify(listingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create listing');
      }

      setSubmitSuccess(true);
      
      // Redirect to dashboard after successful submission
      setTimeout(() => {
        router.push('/dashboard-listings');
      }, 2000);

    } catch (error) {
      console.error('Error submitting listing:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Breadcrumb with Header */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Add Listing' },
        ]}
        title="Add Listing"
      />

      {/* Add Listing Section */}
      <section className="add-listing-wrapper border-bottom section-bg section-padding-strict">
        <div className="container">
          <div className="row">
            {/* Module 1: General Information */}
            <div className="col-lg-10 offset-lg-1 mb-4">
              <div className="atbd_content_module">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-user"></span>General Information
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <form action="/">
                    <div className="form-group">
                      <label htmlFor="title" className="form-label">
                        Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        placeholder="Enter Title"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="desc" className="form-label">
                        Long Description
                      </label>
                      <textarea
                        id="desc"
                        rows={8}
                        className="form-control"
                        placeholder="Description"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="tagline" className="form-label">
                        Tagline
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="tagline"
                        placeholder="Your Listing Motto or Tagline"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Pricing</label>
                      <div className="pricing-options">
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="price_one"
                            value="one"
                            defaultChecked
                          />
                          <label className="custom-control-label" htmlFor="price_one">
                            Price [USD]
                          </label>
                        </div>
                        <span>Or</span>
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="price_two"
                            value="two"
                          />
                          <label className="custom-control-label" htmlFor="price_two">
                            Price Range
                          </label>
                        </div>
                      </div>
                      <div className="pricing-option-inputs">
                        <input
                          type="text"
                          id="price-input"
                          className="form-control"
                          placeholder="Price of this listing Eg. 100"
                        />
                       
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="short_desc" className="form-label">
                        Short Description/Excerpt
                      </label>
                      <textarea
                        id="short_desc"
                        rows={5}
                        className="form-control"
                        placeholder="Short Description"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="custom-field" className="form-label">
                        Custom Select Option
                      </label>
                      <div className="select-basic">
                        <select className="form-control" id="custom-field">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="cf1" className="form-label">
                        Custom Field 1
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cf1"
                        placeholder="Enter Title"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="cdate" className="form-label">
                        Custom Date
                      </label>
                      <input type="date" className="form-control" id="cdate" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Custom Radio</label>
                      <div className="atbdp-radio-list">
                        <div className="custom-control custom-radio">
                          <input
                            type="radio"
                            id="customRadioOne"
                            name="customRadioInline1"
                            className="custom-control-input"
                          />
                          <label className="custom-control-label" htmlFor="customRadioOne">
                            Male
                          </label>
                        </div>
                        <div className="custom-control custom-radio">
                          <input
                            type="radio"
                            id="customRadioTwo"
                            name="customRadioInline1"
                            className="custom-control-input"
                          />
                          <label className="custom-control-label" htmlFor="customRadioTwo">
                            Female
                          </label>
                        </div>
                        <div className="custom-control custom-radio">
                          <input
                            type="radio"
                            id="customRadioThree"
                            name="customRadioInline1"
                            className="custom-control-input"
                          />
                          <label className="custom-control-label" htmlFor="customRadioThree">
                            Other
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="location" className="form-label">
                        Location
                      </label>
                      <div className="select-basic">
                        <select className="form-control" id="location">
                          <option>Australia</option>
                          <option>Sydney</option>
                          <option>Newyork</option>
                          <option>Los Angels</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="atbd_tags" className="form-label">
                          Tags
                        </label>
                      <Select
                        isMulti
                        options={tagOptions}
                        value={selectedTags}
                        onChange={(options) => setSelectedTags((options as readonly { value: string; label: string }[]) || [])}
                        placeholder="Select or add tags"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="ad_categroy" className="form-label">
                        Select Category
                      </label>
                      <Select
                        options={categoryOptions}
                        value={selectedCategory}
                        onChange={(option) => setSelectedCategory(option as { value: string; label: string } | null)}
                        placeholder="Select a category"
                        isClearable
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Module 2: Contact Information */}
            <div className="col-lg-10 offset-lg-1 mb-4">
              <div className="atbd_content_module">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-user"></span>Contact Information
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <form action="/">
                    <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary m-bottom-20">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id="hide_contace_info"
                      />
                      <label className="custom-control-label" htmlFor="hide_contace_info">
                        Check it to hide contact information for this listing
                      </label>
                    </div>
                    <div className="form-group">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="Listing Address eg. Houghton Street London WC2A 2AE UK"
                        id="address"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone_number" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="Phone Number"
                        id="phone_number"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact_email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        id="contact_email"
                        className="form-control"
                        placeholder="Enter Email"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="website_address" className="form-label">
                        Website
                      </label>
                      <input
                        type="text"
                        id="website_address"
                        className="form-control"
                        placeholder="Listing Website eg. http://example.com"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Social Information</label>
                      <SocialInfoManager onFieldsChange={handleSocialFieldsChange} />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Module 3: Opening/Business Hour Information */}
            <div className="col-lg-10 offset-lg-1 mb-4">
              <div className="atbd_content_module">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-calendar-check-o"></span> Opening/Business Hour
                      Information
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <div className="business-hour">
                    <div className="row">
                      <div className="col-md-12 m-bottom-20">
                        <div className="enable247hour custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            name="enable247hour"
                            value="1"
                            id="enable247hour"
                          />
                          <label
                            htmlFor="enable247hour"
                            className="not_empty custom-control-label"
                          >
                            {' '}
                            Is this listing open 24 hours 7 days a week?{' '}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-sm-12">
                        {/* Saturday */}
                        <div className="form-group">
                          <label htmlFor="bdbh_saturday" className="atbd_day_label form-label">
                            Saturday
                          </label>
                          <div className="row atbd_row_bg">
                            <div className="col-sm-6">
                              <label htmlFor="bdbh_saturday" className="not_empty">
                                Start time
                              </label>
                              <input
                                type="time"
                                id="bdbh_saturday"
                                className="form-control directory_field"
                              />
                            </div>
                            <div className="col-sm-6 mt-3 mt-sm-0">
                              <label htmlFor="bdbh_saturday_cls" className="not_empty">
                                Close time
                              </label>
                              <input
                                type="time"
                                id="bdbh_saturday_cls"
                                className="form-control directory_field"
                              />
                            </div>
                          </div>

                          <div className="atbd_mark_as_closed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              name="enable247hour"
                              value="1"
                              id="sat_cls"
                            />
                            <label htmlFor="sat_cls" className="not_empty custom-control-label">
                              {' '}
                              Mark as Closed{' '}
                            </label>
                          </div>
                        </div>

                        {/* Sunday */}
                        <div className="form-group">
                          <label htmlFor="bdbh_sunday" className="atbd_day_label form-label">
                            Sunday
                          </label>
                          <div className="row atbd_row_bg">
                            <div className="col-sm-6">
                              <label htmlFor="bdbh_sunday" className="not_empty">
                                Start time
                              </label>
                              <input
                                type="time"
                                id="bdbh_sunday"
                                className="form-control directory_field"
                              />
                            </div>

                            <div className="col-sm-6 mt-3 mt-sm-0">
                              <label htmlFor="bdbh_sunday_cls" className="not_empty">
                                Close time
                              </label>
                              <input
                                type="time"
                                id="bdbh_sunday_cls"
                                className="form-control directory_field"
                              />
                            </div>
                          </div>

                          <div className="atbd_mark_as_closed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              name="enable247hour"
                              value="1"
                              id="sun_cls"
                            />
                            <label htmlFor="sun_cls" className="not_empty custom-control-label">
                              {' '}
                              Mark as Closed{' '}
                            </label>
                          </div>
                        </div>

                        {/* Monday */}
                        <div className="form-group">
                          <label htmlFor="bdbh_monday" className="atbd_day_label form-label">
                            Monday
                          </label>
                          <div className="row atbd_row_bg">
                            <div className="col-sm-6">
                              <label htmlFor="bdbh_monday" className="not_empty">
                                Start time
                              </label>
                              <input
                                type="time"
                                id="bdbh_monday"
                                className="form-control directory_field"
                              />
                            </div>

                            <div className="col-sm-6 mt-3 mt-sm-0">
                              <label htmlFor="bdbh_monday_cls" className="not_empty">
                                Close time
                              </label>
                              <input
                                type="time"
                                id="bdbh_monday_cls"
                                className="form-control directory_field"
                              />
                            </div>
                          </div>

                          <div className="atbd_mark_as_closed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              name="enable247hour"
                              value="1"
                              id="mon_cls"
                            />
                            <label htmlFor="mon_cls" className="not_empty custom-control-label">
                              {' '}
                              Mark as Closed{' '}
                            </label>
                          </div>
                        </div>

                        {/* Tuesday */}
                        <div className="form-group">
                          <label htmlFor="bdbh_tuesday" className="atbd_day_label form-label">
                            Tuesday
                          </label>
                          <div className="row atbd_row_bg">
                            <div className="col-sm-6">
                              <label htmlFor="bdbh_tuesday" className="not_empty">
                                Start time
                              </label>
                              <input
                                type="time"
                                id="bdbh_tuesday"
                                className="form-control directory_field"
                              />
                            </div>

                            <div className="col-sm-6 mt-3 mt-sm-0">
                              <label htmlFor="bdbh_tuesday_cls" className="not_empty">
                                Close time
                              </label>
                              <input
                                type="time"
                                id="bdbh_tuesday_cls"
                                className="form-control directory_field"
                              />
                            </div>
                          </div>

                          <div className="atbd_mark_as_closed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              name="enable247hour"
                              value="1"
                              id="tue_cls"
                            />
                            <label htmlFor="tue_cls" className="not_empty custom-control-label">
                              {' '}
                              Mark as Closed{' '}
                            </label>
                          </div>
                        </div>

                        {/* Wednesday */}
                        <div className="form-group">
                          <label htmlFor="bdbh_wednesday" className="atbd_day_label form-label">
                            Wednesday
                          </label>
                          <div className="row atbd_row_bg">
                            <div className="col-sm-6">
                              <label htmlFor="bdbh_wednesday" className="not_empty">
                                Start time
                              </label>
                              <input
                                type="time"
                                id="bdbh_wednesday"
                                className="form-control directory_field"
                              />
                            </div>

                            <div className="col-sm-6 mt-3 mt-sm-0">
                              <label htmlFor="bdbh_wednesday_cls" className="not_empty">
                                Close time
                              </label>
                              <input
                                type="time"
                                id="bdbh_wednesday_cls"
                                className="form-control directory_field"
                              />
                            </div>
                          </div>

                          <div className="atbd_mark_as_closed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              name="enable247hour"
                              value="1"
                              id="wed_cls"
                            />
                            <label htmlFor="wed_cls" className="not_empty custom-control-label">
                              {' '}
                              Mark as Closed{' '}
                            </label>
                          </div>
                        </div>

                        {/* Thursday */}
                        <div className="form-group">
                          <label htmlFor="bdbh_thursday" className="atbd_day_label form-label">
                            Thursday
                          </label>
                          <div className="row atbd_row_bg">
                            <div className="col-sm-6">
                              <label htmlFor="bdbh_thursday" className="not_empty">
                                Start time
                              </label>
                              <input
                                type="time"
                                id="bdbh_thursday"
                                className="form-control directory_field"
                              />
                            </div>

                            <div className="col-sm-6 mt-3 mt-sm-0">
                              <label htmlFor="bdbh_thursday_cls" className="not_empty">
                                Close time
                              </label>
                              <input
                                type="time"
                                id="bdbh_thursday_cls"
                                className="form-control directory_field"
                              />
                            </div>
                          </div>

                          <div className="atbd_mark_as_closed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              name="enable247hour"
                              value="1"
                              id="thu_cls"
                            />
                            <label htmlFor="thu_cls" className="not_empty custom-control-label">
                              {' '}
                              Mark as Closed{' '}
                            </label>
                          </div>
                        </div>

                        {/* Friday */}
                        <div className="form-group">
                          <label htmlFor="bdbh_friday" className="atbd_day_label form-label">
                            Friday
                          </label>
                          <div className="row atbd_row_bg">
                            <div className="col-sm-6">
                              <label htmlFor="bdbh_friday" className="not_empty">
                                Start time
                              </label>
                              <input
                                type="time"
                                id="bdbh_friday"
                                className="form-control directory_field"
                              />
                            </div>

                            <div className="col-sm-6 mt-3 mt-sm-0">
                              <label htmlFor="bdbh_friday_cls" className="not_empty">
                                Close time
                              </label>
                              <input
                                type="time"
                                id="bdbh_friday_cls"
                                className="form-control directory_field"
                              />
                            </div>
                          </div>

                          <div className="atbd_mark_as_closed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              name="enable247hour"
                              value="1"
                              id="fri_cls"
                            />
                            <label htmlFor="fri_cls" className="not_empty custom-control-label">
                              {' '}
                              Mark as Closed{' '}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 4: Listing FAQs */}
            <div className="col-lg-10 offset-lg-1 mb-4">
              <div className="atbd_content_module">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-calendar-check-o"></span> Listing FAQs
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <FAQManager onFAQsChange={handleFAQsChange} />
                </div>
              </div>
            </div>

            {/* Module 5: Location (Map) */}
            <div className="col-lg-10 offset-lg-1 mb-4">
              <div className="atbd_content_module">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-calendar-check-o"></span> Location (Map)
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <label className="not_empty form-label">
                    Set the Marker by clicking anywhere on the Map
                  </label>
                  <GoogleMap 
                    mapId="map-one"
                    lat={mapCoords.lat}
                    lng={mapCoords.lng}
                    onMarkerMove={handleMarkerMove}
                  />
                  <div className="cor-wrap form-group">
                    <div className="atbd_mark_as_closed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        name="manual_coordinate"
                        value="1"
                        id="manual_coordinate"
                      />
                      <label htmlFor="manual_coordinate" className="not_empty custom-control-label">
                        Or Enter Coordinates (latitude and longitude) Manually.{' '}
                      </label>
                    </div>
                  </div>
                  <div className="cor-form">
                    <div id="hide_if_no_manual_cor" className="clearfix row m-bottom-30">
                      <div className="col-sm-6">
                        <div className="form-group">
                          <label htmlFor="manual_lat" className="not_empty">
                            {' '}
                            Latitude{' '}
                          </label>
                          <input
                            type="text"
                            name="manual_lat"
                            id="manual_lat"
                            className="form-control directory_field"
                            placeholder="Enter Latitude eg. 24.89904"
                          />
                        </div>
                      </div>
                      <div className="col-sm-6 mt-3 mt-sm-0">
                        <div className="form-group">
                          <label htmlFor="manual_lng" className="not_empty">
                            {' '}
                            Longitude{' '}
                          </label>
                          <input
                            type="text"
                            name="manual_lng"
                            id="manual_lng"
                            className="form-control directory_field"
                            placeholder="Enter Longitude eg. 91.87198"
                          />
                        </div>
                      </div>
                      <div className="col-md-12 col-sm-12">
                        <div className="form-group lat_btn_wrap m-top-15">
                          <button 
                            type="button"
                            className="btn btn-primary" 
                            id="generate_admin_map"
                            onClick={handleGenerateMap}
                          >
                            Generate on Map
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="atbd_mark_as_closed custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          name="hide_map"
                          value="1"
                          id="hide_map"
                        />
                        <label htmlFor="hide_map" className="not_empty custom-control-label">
                          Hide map for this listing.
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 6: SEO & Additional Information */}
            <div className="col-lg-10 offset-lg-1 mb-4">
              <div className="atbd_content_module">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-search"></span> SEO & Additional Information
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <div className="form-group">
                    <label htmlFor="meta_title" className="form-label">
                      Meta Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      id="meta_title"
                      className="form-control"
                      placeholder="Enter meta title for SEO"
                      maxLength={60}
                    />
                    <small className="form-text text-muted">Recommended: 50-60 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="meta_description" className="form-label">
                      Meta Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      id="meta_description"
                      className="form-control"
                      rows={3}
                      placeholder="Enter meta description for SEO"
                      maxLength={160}
                    />
                    <small className="form-text text-muted">Recommended: 150-160 characters</small>
                  </div>

                  <div className="form-group">
                    <label htmlFor="currency" className="form-label">
                      Currency <span className="text-danger">*</span>
                    </label>
                    <div className="select-basic">
                      <select className="form-control" id="currency">
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="CNY">CNY - Chinese Yuan</option>
                        <option value="INR">INR - Indian Rupee</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Amenities <span className="text-danger">*</span>
                    </label>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input type="checkbox" className="custom-control-input" id="wifi" name="amenities" value="wifi" />
                          <label className="custom-control-label" htmlFor="wifi">WiFi</label>
                        </div>
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input type="checkbox" className="custom-control-input" id="parking" name="amenities" value="parking" />
                          <label className="custom-control-label" htmlFor="parking">Parking</label>
                        </div>
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input type="checkbox" className="custom-control-input" id="air_conditioning" name="amenities" value="air_conditioning" />
                          <label className="custom-control-label" htmlFor="air_conditioning">Air Conditioning</label>
                        </div>
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input type="checkbox" className="custom-control-input" id="restroom" name="amenities" value="restroom" />
                          <label className="custom-control-label" htmlFor="restroom">Restroom</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input type="checkbox" className="custom-control-input" id="outdoor_seating" name="amenities" value="outdoor_seating" />
                          <label className="custom-control-label" htmlFor="outdoor_seating">Outdoor Seating</label>
                        </div>
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input type="checkbox" className="custom-control-input" id="delivery" name="amenities" value="delivery" />
                          <label className="custom-control-label" htmlFor="delivery">Delivery</label>
                        </div>
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input type="checkbox" className="custom-control-input" id="takeout" name="amenities" value="takeout" />
                          <label className="custom-control-label" htmlFor="takeout">Takeout</label>
                        </div>
                        <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                          <input type="checkbox" className="custom-control-input" id="wheelchair_accessible" name="amenities" value="wheelchair_accessible" />
                          <label className="custom-control-label" htmlFor="wheelchair_accessible">Wheelchair Accessible</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Module 7: Images & Video */}
            <div className="col-lg-10 offset-lg-1 mb-4">
              <div className="atbd_content_module">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-calendar-check-o"></span> Images & Video
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <div id="_listing_gallery">
                    <ImageUploader onImagesChange={handleImagesChange} />
                      </div>
                  <div className="form-group m-top-30">
                    <VideoUploader onVideoChange={handleVideoChange} />
                        </div>
                      </div>
                    </div>
                  </div>

            {/* Success/Error Messages */}
            {submitSuccess && (
              <div className="col-lg-10 offset-lg-1 mb-4">
                <div className="alert alert-success" role="alert">
                  <strong>Success!</strong> Your listing has been submitted successfully. Redirecting to dashboard...
                  </div>
                </div>
            )}
            
            {submitError && (
              <div className="col-lg-10 offset-lg-1 mb-4">
                <div className="alert alert-danger" role="alert">
                  <strong>Error!</strong> {submitError}
              </div>
            </div>
            )}

            {/* Terms & Conditions and Submit Button */}
            <div className="col-lg-10 offset-lg-1 text-center">
              <div className="atbd_term_and_condition_area custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  name="listing_t"
                  value="1"
                  id="listing_t"
                  required
                />
                <label htmlFor="listing_t" className="not_empty custom-control-label">
                  I Agree with all <a href="" id="listing_t_c">Terms & Conditions</a>
                </label>
              </div>

              <div className="btn_wrap list_submit m-top-25">
                <button
                  type="submit"
                  className="btn btn-primary listing_submit_btn"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !session}
                  style={{
                    backgroundColor: isSubmitting ? '#6c757d' : '#e83e8c',
                    borderColor: isSubmitting ? '#6c757d' : '#e83e8c',
                    color: '#fff',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    'Submit listing'
                  )}
                </button>
              </div>
              
              {!session && (
                <div className="mt-3">
                  <small className="text-muted">
                    You must be logged in to submit a listing. <a href="/auth/login">Login here</a>
                  </small>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
