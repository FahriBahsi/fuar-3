'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Select from '@/components/common/Select';
import { Category } from '@/types/category';
import { Location } from '@/types/common';
import { assetUrl } from '@/lib/utils';

interface HeroSectionProps {
  topCategories: Category[];
  popularLocations: Location[];
}

export default function HeroSection({ topCategories, popularLocations }: HeroSectionProps) {
  const bgHolderRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<{ value: string; label: string } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ value: string; label: string } | null>(null);

  useEffect(() => {
    // Apply background image after mount
    if (bgHolderRef.current) {
      const img = bgHolderRef.current.querySelector('img');
      if (img) {
        const imgSrc = img.getAttribute('src');
        if (imgSrc) {
          bgHolderRef.current.style.backgroundImage = `url(${imgSrc})`;
          bgHolderRef.current.style.opacity = '1';
          bgHolderRef.current.setAttribute('data-bg-processed', 'true');
        }
      }
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (selectedCategory) params.set('category', selectedCategory.value);
    if (selectedLocation) params.set('location', selectedLocation.value);
    
    router.push(`/listings?${params.toString()}`);
  };

  // Transform categories and locations for react-select
  const categoryOptions = [
    { value: '', label: 'Select a category' },
    ...topCategories.map((cat) => ({
      value: cat.slug,
      label: cat.name,
    })),
  ];

  const locationOptions = [
    { value: '', label: 'Select a location' },
    ...popularLocations.map((loc) => ({
      value: loc.slug,
      label: loc.name,
    })),
  ];

  return (
    <section className="intro-wrapper bgimage overlay overlay--dark">
      <div 
        className="bg_image_holder" 
        ref={bgHolderRef}
        style={{ opacity: 0 }}
        data-bg-processed="false"
      >
        <img src={assetUrl('/images/intro.jpg')} alt="" />
      </div>
      <div className="mainmenu-wrapper">
        {/* Header with white logo and white text for hero */}
        <Header variant="light" sticky={false} />
      </div>

      <div className="directory_content_area">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="search_title_area">
                <h2 className="title">Find the Best Places to Be</h2>
                <p className="sub_title">All the top locations – from restaurants and clubs, to galleries, famous places and more..</p>
              </div>

              {/* Search Form */}
              <form action="/listings" method="get" className="search_form" onSubmit={handleSearch}>
                <div className="atbd_seach_fields_wrapper">
                  {/* Search Input */}
                  <div className="single_search_field search_query">
                    <input
                      type="text"
                      name="search"
                      placeholder="What are you looking for?"
                      className="form-control search_fields"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Category Select - React Select */}
                  <div className="single_search_field search_category">
                    <Select
                      options={categoryOptions}
                      value={selectedCategory}
                      onChange={(option) => setSelectedCategory(option as { value: string; label: string } | null)}
                      placeholder="Select a category"
                      isClearable
                    />
                  </div>

                  {/* Location Select - React Select */}
                  <div className="single_search_field search_location">
                    <Select
                      options={locationOptions}
                      value={selectedLocation}
                      onChange={(option) => setSelectedLocation(option as { value: string; label: string } | null)}
                      placeholder="Select a location"
                      isClearable
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="atbd_submit_btn">
                    <button
                      type="submit"
                      className="btn btn-block btn-gradient btn-gradient-one btn-md btn_search"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </form>

              {/* Popular Categories */}
              <div className="directory_home_category_area">
                <ul className="categories">
                  {/* Use exact same categories and icons as original template */}
                  <li>
                    <Link href="/listings?category=restaurants">
                      <span className="color-primary"><i className="la la-cutlery"></i></span>
                      Restaurants
                    </Link>
                  </li>
                  <li>
                    <Link href="/listings?category=places">
                      <span className="color-success"><i className="la la-map-marker"></i></span>
                      Places
                    </Link>
                  </li>
                  <li>
                    <Link href="/listings?category=shopping">
                      <span className="color-warning"><i className="la la-shopping-cart"></i></span>
                      Shopping
                    </Link>
                  </li>
                  <li>
                    <Link href="/listings?category=hotels">
                      <span className="color-danger"><i className="la la-bed"></i></span>
                      Hotels
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
