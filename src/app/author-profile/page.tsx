'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ListingCard from '@/components/listings/ListingCard';
import Pagination from '@/components/common/Pagination';
import { getFeaturedListings } from '@/lib/api';
import { apiUrl, userImageUrl, assetUrl } from '@/lib/utils';
import { Listing } from '@/types/listing';

interface AuthorProfile {
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
  memberSince: string;
}

export default function AuthorProfilePage() {
  const { data: session, status } = useSession();
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);
  const [authorListings, setAuthorListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        // Fetch user profile data if authenticated
        if (session?.user) {
          const response = await fetch(apiUrl('/api/profile/update'), {
            method: 'GET',
            credentials: 'include',
          });
          
          if (response.ok) {
            const profileData = await response.json();
            setAuthorProfile(profileData);
          }
        }
        
        // Fetch listings
        const listings = await getFeaturedListings(6);
        setAuthorListings(listings);
      } catch (error) {
        console.error('Error fetching author data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthorData();
  }, [session]);
  
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
            { label: 'Author Profile' },
          ]}
          title={`${authorProfile?.name || session?.user?.name || 'Author'} Profile`}
        />
      </section>

      {/* Author Info Area */}
      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="atbd_auhor_profile_area">
                <div className="atbd_author_avatar">
                  <img 
                    src={userImageUrl(authorProfile?.image || session?.user?.image) || assetUrl("/images/author-profile.jpg")} 
                    alt={authorProfile?.name || session?.user?.name || "Author Image"} 
                  />
                  <div className="atbd_auth_nd">
                    <h2>{authorProfile?.name || session?.user?.name || "Kenneth Frazier"}</h2>
                    <p>
                      Joined in {authorProfile?.memberSince || 
                        (authorProfile?.createdAt ? new Date(authorProfile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 
                        "March 2019")}
                    </p>
                  </div>
                </div>

                <div className="atbd_author_meta">
                  <div className="atbd_listing_meta">
                    <span className="atbd_meta atbd_listing_rating">4.5 <i className="la la-star"></i></span>
                    <p className="meta-info"><span>22</span>Reviews</p>
                  </div>
                  <p className="meta-info"><span>{authorListings.length}</span>Listings</p>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-md-7 m-bottom-30">
              <div className="atbd_author_module">
                <div className="atbd_content_module">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4><span className="la la-user"></span>About Seller</h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    <p>
                      {authorProfile?.bio || 
                        "Welcome to my profile! I'm passionate about creating amazing listings and helping people discover great places. With years of experience in the industry, I strive to provide accurate and helpful information about local businesses and services."
                      }
                      <br /> <br />
                      {!authorProfile?.bio && 
                        "I believe in quality over quantity and always ensure that every listing I create meets the highest standards. Feel free to reach out if you have any questions or need assistance with your listings."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-5 m-bottom-30">
              <div className="widget atbd_widget widget-card">
                <div className="atbd_widget_title">
                  <h4><span className="la la-phone"></span>Contact Info</h4>
                </div>
                <div className="widget-body atbd_author_info_widget">
                  <div className="atbd_widget_contact_info">
                    <ul>
                      <li>
                        <span className="la la-map-marker"></span>
                        <span className="atbd_info">
                          {authorProfile?.location || "25 East Valley Road, Michigan"}
                        </span>
                      </li>
                      <li>
                        <span className="la la-phone"></span>
                        <span className="atbd_info">
                          {authorProfile?.phone || "(213) 995-7799"}
                        </span>
                      </li>
                      <li>
                        <span className="la la-envelope"></span>
                        <span className="atbd_info">
                          {authorProfile?.email || session?.user?.email || "support@aazztech.com"}
                        </span>
                      </li>
                      <li>
                        <span className="la la-globe"></span>
                        <a 
                          href={authorProfile?.website || "#"} 
                          className="atbd_info"
                          target={authorProfile?.website ? "_blank" : "_self"}
                          rel={authorProfile?.website ? "noopener noreferrer" : ""}
                        >
                          {authorProfile?.website || "www.aazztech.com"}
                        </a>
                      </li>
                    </ul>
                  </div>

                  <div className="atbd_social_wrap">
                    {authorProfile?.facebook && (
                      <p><a href={authorProfile.facebook} target="_blank" rel="noopener noreferrer"><span className="fab fa-facebook-f"></span></a></p>
                    )}
                    {authorProfile?.twitter && (
                      <p><a href={authorProfile.twitter} target="_blank" rel="noopener noreferrer"><span className="fab fa-twitter"></span></a></p>
                    )}
                    {authorProfile?.instagram && (
                      <p><a href={authorProfile.instagram} target="_blank" rel="noopener noreferrer"><span className="fab fa-instagram"></span></a></p>
                    )}
                    {authorProfile?.linkedin && (
                      <p><a href={authorProfile.linkedin} target="_blank" rel="noopener noreferrer"><span className="fab fa-linkedin-in"></span></a></p>
                    )}
                    {(!authorProfile?.facebook && !authorProfile?.twitter && !authorProfile?.instagram && !authorProfile?.linkedin) && (
                      <>
                        <p><a href="#" onClick={(e) => e.preventDefault()}><span className="fab fa-facebook-f"></span></a></p>
                        <p><a href="#" onClick={(e) => e.preventDefault()}><span className="fab fa-twitter"></span></a></p>
                        <p><a href="#" onClick={(e) => e.preventDefault()}><span className="fab fa-google-plus-g"></span></a></p>
                        <p><a href="#" onClick={(e) => e.preventDefault()}><span className="fab fa-linkedin-in"></span></a></p>
                        <p><a href="#" onClick={(e) => e.preventDefault()}><span className="fab fa-dribbble"></span></a></p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="atbd_author_listings_area m-bottom-30">
                <h1>
                  {authorProfile?.name || session?.user?.name || 'Author'} Listings
                  {isLoading && <span className="ml-2">Loading...</span>}
                </h1>
                <div className="atbd_author_filter_area">
                  <div className="dropdown">
                    <a className="btn btn-outline-primary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      Filter by Category <span className="caret"></span>
                    </a>

                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <a className="dropdown-item" href="">Restaurant</a>
                      <a className="dropdown-item" href="">Education</a>
                      <a className="dropdown-item" href="">Event</a>
                      <a className="dropdown-item" href="">Food</a>
                      <a className="dropdown-item" href="">Service</a>
                      <a className="dropdown-item" href="">Travel</a>
                      <a className="dropdown-item" href="">Others</a>
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  <p className="mt-3">Loading listings...</p>
                </div>
              ) : (
                <>
                  <div className="row">
                    {authorListings.length > 0 ? (
                      authorListings.map((listing) => (
                        <div key={listing.id} className="col-lg-4 col-sm-6">
                          <ListingCard
                            listing={listing}
                            variant="grid"
                          />
                        </div>
                      ))
                    ) : (
                      <div className="col-12">
                        <div className="text-center py-5">
                          <i className="la la-list empty-state-icon"></i>
                          <h3 className="mt-3">No Listings Found</h3>
                          <p className="text-muted">
                            {authorProfile?.name || session?.user?.name || 'This author'} hasn't created any listings yet.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {authorListings.length > 0 && (
                    <div className="pagination-wrapper text-center">
                      <Suspense fallback={<div>Loading...</div>}>
                        <Pagination
                          currentPage={1}
                          totalPages={Math.ceil(authorListings.length / 6)}
                          baseUrl="/author-profile"
                        />
                      </Suspense>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
