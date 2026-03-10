import Link from 'next/link';
import { Listing } from '@/types/listing';
import { formatPrice, assetUrl } from '@/lib/utils';

interface ListingCardProps {
  listing: Listing;
  variant?: 'grid' | 'list';
}

export default function ListingCard({ listing, variant = 'grid' }: ListingCardProps) {
  const {
    id,
    title,
    slug,
    category,
    location,
    price,
    priceType,
    rating,
    reviews,
    image,
    featured,
    popular,
    new: isNew,
    verified,
    status,
    description,
  } = listing;

  if (variant === 'list') {
    return (
      <div className="atbd_single_listing atbd_listing_list">
        <article className="atbd_single_listing_wrapper">
          <figure className="atbd_listing_thumbnail_area">
            <div className="atbd_listing_image">
              <Link href={`/listings/${slug}`}>
                <img src={assetUrl(image)} alt="listing image" />
              </Link>
            </div>

            <div className="atbd_thumbnail_overlay_content">
              <ul className="atbd_upper_badge">
                {featured && (
                  <li>
                    <span className="atbd_badge atbd_badge_featured">Featured</span>
                  </li>
                )}
              </ul>
            </div>
          </figure>

          <div className="atbd_listing_info">
            <div className="atbd_content_upper">
              <h4 className="atbd_listing_title">
                <Link href={`/listings/${slug}`}>{title}</Link>
              </h4>

              <div className="atbd_listing_meta">
                <span className="atbd_meta atbd_listing_rating">
                  {rating}
                  <i className="la la-star"></i>
                </span>
                <span className="atbd_meta atbd_listing_price">
                  {typeof price === 'string' ? price : formatPrice(price)}
                </span>
                <span className={`atbd_meta ${status === 'open' ? 'atbd_badge_open' : 'atbd_badge_close'}`}>
                  {status === 'open' ? 'Open Now' : 'Closed'}
                </span>
              </div>

              <div className="atbd_listing_data_list">
                <ul>
                  <li>
                    <p>
                      <span className="la la-map-marker"></span>
                      {location.city}, {location.state}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="la la-phone"></span>
                      {listing.contact?.phone || '(555) 123-4567'}
                    </p>
                  </li>
                  <li>
                    <p>
                      <span className="la la-calendar-check-o"></span>
                      Posted 2 months ago
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="atbd_listing_bottom_content">
              <div className="atbd_content_left">
                <div className="atbd_listing_category">
                  <Link href={`/categories/${category.slug}`}>
                    <span className={`la la-${category.icon}`}></span>
                    {category.name}
                  </Link>
                </div>
              </div>
              <ul className="atbd_content_right">
                <li className="atbd_count">
                  <span className="la la-eye"></span>
                  {listing.views || 900}+
                </li>
                <li className="atbd_save">
                  <span className="la la-heart-o"></span>
                </li>
                <li>
                  <div className="atbd_author atbd_author--thumb">
                    <Link href={`/author/${listing.author.id}`}>
                      <img src={assetUrl(listing.author.avatar)} alt="Author Image" />
                      <span className="custom-tooltip">{listing.author.name}, Owner</span>
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // Grid variant - matches original template structure
  return (
    <div className="atbd_single_listing">
      <article className="atbd_single_listing_wrapper">
        <figure className="atbd_listing_thumbnail_area">
          <div className="atbd_listing_image">
            <Link href={`/listings/${slug}`}>
              <img src={assetUrl(image)} alt={title} />
            </Link>
          </div>
          <div className="atbd_author atbd_author--thumb">
            <Link href={`/author/${listing.author.id}`}>
              <img src={assetUrl(listing.author.avatar)} alt={listing.author.name} />
              <span className="custom-tooltip">{listing.author.name}, Owner</span>
            </Link>
          </div>
          <div className="atbd_thumbnail_overlay_content">
            <ul className="atbd_upper_badge">
              {featured && (
                <li>
                  <span className="atbd_badge atbd_badge_featured">Featured</span>
                </li>
              )}
              {popular && (
                <li>
                  <span className="atbd_badge atbd_badge_popular">Popular</span>
                </li>
              )}
              {isNew && (
                <li>
                  <span className="atbd_badge atbd_badge_new">New</span>
                </li>
              )}
            </ul>
          </div>
        </figure>

        <div className="atbd_listing_info">
          <div className="atbd_content_upper">
            <h4 className="atbd_listing_title">
              <Link href={`/listings/${slug}`}>{title}</Link>
            </h4>

            <div className="atbd_listing_meta">
              <span className="atbd_meta atbd_listing_rating">
                {rating}
                <i className="la la-star"></i>
              </span>
              <span className="atbd_meta atbd_listing_price">
                {typeof price === 'string' ? price : formatPrice(price)}
              </span>
              <span className={`atbd_meta ${status === 'open' ? 'atbd_badge_open' : 'atbd_badge_close'}`}>
                {status === 'open' ? 'Open Now' : 'Closed'}
              </span>
            </div>

            <div className="atbd_listing_data_list">
              <ul>
                <li>
                  <p>
                    <span className="la la-map-marker"></span>
                    {location.city}, {location.state}
                  </p>
                </li>
                <li>
                  <p>
                    <span className="la la-phone"></span>
                    {listing.contact?.phone || '(555) 123-4567'}
                  </p>
                </li>
                <li>
                  <p>
                    <span className="la la-calendar-check-o"></span>
                    Posted 2 months ago
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <div className="atbd_listing_bottom_content">
            <div className="atbd_content_left">
              <div className="atbd_listing_category">
                <Link href={`/categories/${category.slug}`}>
                  <span className={`la la-${category.icon}`}></span>
                  {category.name}
                </Link>
              </div>
            </div>
            <ul className="atbd_content_right">
              <li className="atbd_count">
                <span className="la la-eye"></span>
                {listing.views || 900}+
              </li>
              <li className="atbd_save">
                <span className="la la-heart-o"></span>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </div>
  );
}

