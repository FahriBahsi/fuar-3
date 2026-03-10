'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Category } from '@/types/category';
import { useState, Suspense } from 'react';
import RangeSlider from '@/components/common/RangeSlider';

interface ListingFiltersProps {
  categories: Category[];
}

function ListingFiltersForm({ categories }: ListingFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    parseInt(searchParams.get('price_min') || '0'),
    parseInt(searchParams.get('price_max') || '1000'),
  ]);

  // Feature filters
  const selectedFeatures = searchParams.get('features')?.split(',') || [];
  const [features, setFeatures] = useState<Set<string>>(new Set(selectedFeatures));

  // Tag filters
  const selectedTags = searchParams.get('tags')?.split(',') || [];
  const [tags, setTags] = useState<Set<string>>(new Set(selectedTags));

  // Rating filter
  const selectedRating = searchParams.get('rating');
  const [rating, setRating] = useState(selectedRating ? parseFloat(selectedRating) : undefined);

  // Open Now filter
  const [openNow, setOpenNow] = useState(searchParams.get('open_now') === 'true');

  // Offering Deal filter
  const [offeringDeal, setOfferingDeal] = useState(searchParams.get('offering_deal') === 'true');

  // Show More/Less for Features
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  // Build URL with filters
  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Reset to page 1 when filters change
    params.set('page', '1');
    
    // Keep the current view (grid or list)
    // Check if pathname ends with /list (for list view)
    const isListView = pathname.endsWith('/list');
    const basePath = isListView ? '/listings/list' : '/listings';
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      search,
      category,
      location,
      price_min: priceRange[0].toString(),
      price_max: priceRange[1].toString(),
      features: features.size > 0 ? Array.from(features).join(',') : null,
      tags: tags.size > 0 ? Array.from(tags).join(',') : null,
      rating: rating ? rating.toString() : null,
      open_now: openNow ? 'true' : null,
      offering_deal: offeringDeal ? 'true' : null,
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
    updateFilters({ category: e.target.value });
  };

  const handlePriceChange = (values: [number, number]) => {
    setPriceRange(values);
    updateFilters({
      price_min: values[0].toString(),
      price_max: values[1].toString(),
    });
  };

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = new Set(features);
    if (newFeatures.has(feature)) {
      newFeatures.delete(feature);
    } else {
      newFeatures.add(feature);
    }
    setFeatures(newFeatures);
    updateFilters({
      features: newFeatures.size > 0 ? Array.from(newFeatures).join(',') : null,
    });
  };

  const handleTagToggle = (tag: string) => {
    const newTags = new Set(tags);
    if (newTags.has(tag)) {
      newTags.delete(tag);
    } else {
      newTags.add(tag);
    }
    setTags(newTags);
    updateFilters({
      tags: newTags.size > 0 ? Array.from(newTags).join(',') : null,
    });
  };

  const handleRatingChange = (selectedRating: number) => {
    const newRating = rating === selectedRating ? undefined : selectedRating;
    setRating(newRating);
    updateFilters({
      rating: newRating ? newRating.toString() : null,
    });
  };

  const handleOpenNowToggle = () => {
    const newOpenNow = !openNow;
    setOpenNow(newOpenNow);
    updateFilters({
      open_now: newOpenNow ? 'true' : null,
    });
  };

  const handleOfferingDealToggle = () => {
    const newOfferingDeal = !offeringDeal;
    setOfferingDeal(newOfferingDeal);
    updateFilters({
      offering_deal: newOfferingDeal ? 'true' : null,
    });
  };

  // Define available features based on the template
  const availableFeatures = [
    { id: 'wifi', label: 'WiFi Internet' },
    { id: 'parking', label: 'Parking Street' },
    { id: 'wheelchair', label: 'Wheelchair' },
    { id: 'cards', label: 'Accepts Cards' },
    { id: 'bike', label: 'Bike Parking' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'clothing', label: 'Clothing' },
    { id: 'travel', label: 'Travel Booking' },
    { id: 'support', label: 'Fast Support' },
  ];

  // Define available tags based on the template
  const availableTags = [
    { id: 'restaurant', label: 'Restaurant' },
    { id: 'food', label: 'Food' },
    { id: 'launch', label: 'Launch' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'travel', label: 'Travel' },
  ];

  // Define available ratings
  const availableRatings = [5, 4, 3, 2, 1, 0];

  // Render stars with proper colors
  const renderStars = (ratingValue: number, maxStars: number = 5) => {
    return Array.from({ length: maxStars }, (_, i) => (
      <i
        key={i}
        className={`la la-star ${i < ratingValue ? 'filled' : 'empty'}`}
        style={{
          color: '#ffffff',
          backgroundColor: i < ratingValue ? '#FF69B4' : '#FFC0CB',
          borderRadius: '50%',
          fontSize: '12px',
          width: '20px',
          height: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
        }}
      />
    ));
  };

  return (
    <div className="search-area default-ad-search">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <div className="select-basic">
            <select 
              className="form-control ad_search_category"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-group">
          <div className="position-relative">
            <input
              type="text"
              placeholder="City, state or zip code"
              className="form-control location-name"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button type="submit" className="locator">
              <span className="la la-crosshairs"></span>
            </button>
          </div>
        </div>
        
        <div className="form-group p-bottom-10">
          <div className="price-range rs-primary">
            <p className="d-flex justify-content-between">
              <span>Price Range: </span>
              <span>${priceRange[0]} - ${priceRange[1]}</span>
            </p>
            <RangeSlider
              min={0}
              max={1000}
              defaultValue={priceRange}
              onChange={handlePriceChange}
              formatLabel={(value) => `$${value}`}
            />
          </div>
        </div>
        
        {/* Open Now / Offering Deal - NOW FUNCTIONAL */}
        <div className="check-btn">
          <div className="btn-checkbox active-color-secondary">
            <label>
              <input
                type="checkbox"
                value="1"
                checked={openNow}
                onChange={handleOpenNowToggle}
              />
              <span className="color-success">
                <i className="la la-clock-o"></i> Open Now
              </span>
            </label>
          </div>
          
          <div className="btn-checkbox active-color-secondary">
            <label>
              <input
                type="checkbox"
                value="1"
                checked={offeringDeal}
                onChange={handleOfferingDealToggle}
              />
              <span className="color-primary">
                <i className="la la-tags"></i> Offering Deal
              </span>
            </label>
          </div>
        </div>
        
        {/* Filter by Features - NOW FUNCTIONAL */}
        <div className="filter-checklist">
          <h5>Filter by Features</h5>
          <div className="checklist-items feature-checklist hideContent">
            {(showAllFeatures ? availableFeatures : availableFeatures.slice(0, 5)).map((feature) => (
              <div key={feature.id} className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`feature-${feature.id}`}
                  checked={features.has(feature.id)}
                  onChange={() => handleFeatureToggle(feature.id)}
                />
                <label className="custom-control-label" htmlFor={`feature-${feature.id}`}>
                  {feature.label}
                </label>
              </div>
            ))}
          </div>
          {availableFeatures.length > 5 && (
            <a 
              href="#" 
              className="show-link" 
              onClick={(e) => {
                e.preventDefault();
                setShowAllFeatures(!showAllFeatures);
              }}
            >
              {showAllFeatures ? 'Show Less' : 'Show More'}
            </a>
          )}
        </div>
        
        

        {/* Filter by Tags - NOW FUNCTIONAL */}
        <div className="filter-checklist">
          <h5>Filter by Tags</h5>
          <div className="checklist-items tags-checklist">
            {availableTags.map((tag, idx) => (
              <div key={tag.id} className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`tag-${idx}`}
                  checked={tags.has(tag.id)}
                  onChange={() => handleTagToggle(tag.id)}
                />
                <label className="custom-control-label" htmlFor={`tag-${idx}`}>
                  {tag.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Filter by Ratings - NOW FUNCTIONAL */}
        <div className="filter-checklist">
          <h5>Filter by Ratings</h5>
          <div className="checklist-items rating-checklist">
            {availableRatings.map((ratingValue) => (
              <div key={ratingValue} className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`rating-${ratingValue}`}
                  checked={rating === ratingValue}
                  onChange={() => handleRatingChange(ratingValue)}
                />
                <label className="custom-control-label" htmlFor={`rating-${ratingValue}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {renderStars(ratingValue)}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Search Filter Button */}
        {/* <div className="form-group mt-3">
          <button type="submit" className="btn btn-primary btn-block btn-search-filter" style={{
            background: 'linear-gradient(to right, #f5548e, #fa8b0c)',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            padding: '4px',
            cursor: 'pointer',
          }}>
            Search Filter
            <i className="la la-arrow-right" style={{ marginLeft: '8px' }}></i>
          </button>
        </div> */}
      </form>
    </div>
  );
}

export default function ListingFilters({ categories }: ListingFiltersProps) {
  return (
    <Suspense fallback={<div>Loading filters...</div>}>
      <ListingFiltersForm categories={categories} />
    </Suspense>
  );
}
