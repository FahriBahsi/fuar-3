import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';
import ListingGallery from '@/components/listings/ListingGallery';
import { getListingBySlug } from '@/lib/api';
import { formatPrice, formatDate, assetUrl } from '@/lib/utils';
import type { Listing } from '@/types/listing';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const listing = await getListingBySlug(resolvedParams.slug);

  if (!listing) {
    return {
      title: 'Listing Not Found',
    };
  }

  return {
    title: `${listing.title} - ${listing.category.name}`,
    description: listing.description,
    openGraph: {
      title: listing.title,
      description: listing.description,
      images: [listing.image],
    },
  };
}

export default async function ListingDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const listing = await getListingBySlug(resolvedParams.slug);

  if (!listing) {
    notFound();
  }

  return (
    <div className="single-listing-page">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Listings', href: '/listings' },
          { label: listing.category.name, href: `/categories/${listing.category.slug}` },
          { label: listing.title },
        ]}
      />

      {/* Hero Section with Background Image */}
      <section className="listing-details-wrapper bgimage">
        <div className="bg_image_holder">
          <img src={assetUrl(listing.image)} alt={listing.title} />
        </div>

        {/* Listing Info Overlay */}
        <div className="listing-info content_above">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 col-md-7">
                {/* Badges */}
                <ul className="list-unstyled listing-info--badges">
                  {listing.featured && (
                    <li>
                      <span className="atbd_badge atbd_badge_featured">Featured</span>
                    </li>
                  )}
                  {listing.popular && (
                    <li>
                      <span className="atbd_badge atbd_badge_popular">Popular</span>
                    </li>
                  )}
                  {listing.verified && (
                    <li>
                      <span className="atbd_badge atbd_badge_verified">Verified</span>
                    </li>
                  )}
                </ul>

                {/* Meta Information */}
                <ul className="list-unstyled listing-info--meta">
                  <li>
                    <div className="average-ratings">
                      <span className="atbd_meta atbd_listing_rating">
                        {listing.rating}
                        <i className="la la-star"></i>
                      </span>
                      <span>
                        <strong>{listing.reviews}</strong> Reviews
                      </span>
                    </div>
                  </li>
                  <li>
                    <div className="atbd_listing_category">
                      <Link href={`/categories/${listing.category.slug}`}>
                        <span className={`la la-${listing.category.icon}`}></span>
                        {listing.category.name}
                      </Link>
                    </div>
                  </li>
                </ul>

                <h1>{listing.title}</h1>
                <p className="subtitle">{listing.description.substring(0, 100)}...</p>
              </div>

              <div className="col-lg-4 col-md-5 d-flex align-items-end justify-content-start justify-content-md-end">
                <div className="atbd_listing_action_area">
                  <div className="atbd_action atbd_save">
                    <div className="action_button">
                      <a href="#" className="atbdp-favourites">
                        <span className="la la-heart-o"></span> Save
                      </a>
                    </div>
                  </div>
                  <div className="atbd_action atbd_share">
                    <span>
                      <span className="la la-share"></span>Share
                    </span>
                  </div>
                  <div className="atbd_action atbd_report">
                    <div className="action_button">
                      <a href="#">
                        <span className="la la-flag-o"></span> Report
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="directory_listiing_detail_area single_area section-bg section-padding-strict">
        <div className="container">
          <div className="row">
            {/* Main Content */}
            <div className="col-lg-8">
              {/* Listing Details */}
              <div className="atbd_content_module atbd_listing_details">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-file-text-o"></span>Listing Details
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <p>{listing.description}</p>
                </div>
              </div>

              {/* Gallery */}
              {listing.images.length > 0 && (
                <ListingGallery images={listing.images} title={listing.title} />
              )}

              {/* Features/Amenities */}
              {listing.amenities.length > 0 && (
                <div className="atbd_content_module atbd_listing_features">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <span className="la la-list-alt"></span>Features
                      </h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    <ul className="atbd_custom_fields features-table">
                      {listing.amenities.map((amenity, index) => (
                        <li key={index}>
                          <div className="atbd_custom_field_title">
                            <p>
                              <span className="la la-check"></span>
                            </p>
                          </div>
                          <div className="atbd_custom_field_content">
                            <p>{amenity}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="atbd_content_module">
                <div className="atbd_content_module__tittle_area">
                  <div className="atbd_area_title">
                    <h4>
                      <span className="la la-map-o"></span>Location
                    </h4>
                  </div>
                </div>
                <div className="atbdb_content_module_contents">
                  <div className="map" id="map-one">
                    <div className="map-placeholder-wrapper">
                      <div className="map-placeholder">
                        <i className="la la-map-marker map-placeholder-icon"></i>
                        <p className="map-placeholder-text">
                          {listing.location.address}
                          <br />
                          {listing.location.city}, {listing.location.state} {listing.location.zip}
                        </p>
                        <small className="map-placeholder-hint">Map integration available with Google Maps API</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="col-lg-4 mt-5 mt-lg-0">
              {/* Contact Information Widget */}
              <div className="widget-wrapper">
                <div className="widget-default">
                  <div className="widget-header">
                    <h6 className="widget-title">Contact Information</h6>
                  </div>
                  <div className="widget-content">
                    <ul className="atbd_contact_info list-unstyled">
                      <li>
                        <div className="atbd_info_title">
                          <span className="la la-map-marker"></span>Address:
                        </div>
                        <div className="atbd_info">
                          {listing.location.address}, {listing.location.city}, {listing.location.state} {listing.location.zip}
                        </div>
                      </li>
                      {listing.contact.phone && (
                        <li>
                          <div className="atbd_info_title">
                            <span className="la la-phone"></span>Phone:
                          </div>
                          <div className="atbd_info">
                            <a href={`tel:${listing.contact.phone}`}>{listing.contact.phone}</a>
                          </div>
                        </li>
                      )}
                      {listing.contact.email && (
                        <li>
                          <div className="atbd_info_title">
                            <span className="la la-envelope"></span>Email:
                          </div>
                          <div className="atbd_info">
                            <a href={`mailto:${listing.contact.email}`}>{listing.contact.email}</a>
                          </div>
                        </li>
                      )}
                      {listing.contact.website && (
                        <li>
                          <div className="atbd_info_title">
                            <span className="la la-globe"></span>Website:
                          </div>
                          <div className="atbd_info">
                            <a href={listing.contact.website} target="_blank" rel="noopener noreferrer">
                              Visit Website
                            </a>
                          </div>
                        </li>
                      )}
                    </ul>
                    <button className="atbd_btn atbd_btn-primary atbd_btn-block mt-3">
                      <span className="la la-envelope"></span> Send Message
                    </button>
                  </div>
                </div>
              </div>

              {/* Author Info Widget */}
              <div className="widget-wrapper">
                <div className="widget-default">
                  <div className="widget-header">
                    <h6 className="widget-title">Listed By</h6>
                  </div>
                  <div className="widget-content">
                    <div className="atbd_author_info text-center">
                      <div className="atbd_author_avatar">
                        <img
                          src={assetUrl(listing.author.avatar)}
                          alt={listing.author.name}
                          className="atbd_avatar img-avatar-2xl"
                         
                        />
                        {listing.author.verified && (
                          <span className="atbd_author_verified">
                            <i className="la la-check"></i>
                          </span>
                        )}
                      </div>
                      <div className="atbd_author_details">
                        <h6 className="atbd_author_name">{listing.author.name}</h6>
                        <p className="atbd_author_meta">
                          Member since {formatDate(listing.createdAt)}
                        </p>
                        <Link
                          href={`/author/${listing.author.id}`}
                          className="atbd_btn atbd_btn-outline-primary atbd_btn-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours Widget */}
              <div className="widget-wrapper">
                <div className="widget-default">
                  <div className="widget-header">
                    <h6 className="widget-title">Business Hours</h6>
                  </div>
                  <div className="widget-content">
                    <ul className="atbd_contact_info list-unstyled">
                      {Object.entries(listing.hours).map(([day, hours]) => (
                        <li key={day}>
                          <div className="atbd_info_title text-capitalize">{day}:</div>
                          <div className="atbd_info">
                            {hours === 'closed' ? (
                              <span className="badge badge-danger">Closed</span>
                            ) : (
                              <span>
                                {hours.open} - {hours.close}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Price Widget */}
              <div className="widget-wrapper">
                <div className="widget-default">
                  <div className="widget-header">
                    <h6 className="widget-title">Pricing</h6>
                  </div>
                  <div className="widget-content">
                    <div className="atbd_pricing_info">
                      <h3 className="atbd_price_amount">{formatPrice(listing.price)}</h3>
                      <span className="atbd_price_period">per {listing.priceType}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Widget */}
              <div className="widget-wrapper">
                <div className="widget-default">
                  <div className="widget-header">
                    <h6 className="widget-title">Share This Listing</h6>
                  </div>
                  <div className="widget-content">
                    <div className="atbd_social_share">
                      <button className="atbd_btn atbd_btn-outline-primary atbd_btn-block">
                        <i className="fab fa-facebook-f"></i> Share on Facebook
                      </button>
                      <button className="atbd_btn atbd_btn-outline-info atbd_btn-block">
                        <i className="fab fa-twitter"></i> Share on Twitter
                      </button>
                      <button className="atbd_btn atbd_btn-outline-danger atbd_btn-block">
                        <i className="fab fa-pinterest"></i> Pin It
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
