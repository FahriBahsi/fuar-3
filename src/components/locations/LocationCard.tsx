import Link from 'next/link';
import { Location } from '@/types/common';
import { assetUrl } from '@/lib/utils';

interface LocationCardProps {
  location: Location;
  variant?: 'default' | 'large' | 'compact' | 'original';
}

export default function LocationCard({ location, variant = 'default' }: LocationCardProps) {
  const { name, slug, city, state, country, image, count } = location;

  // Original template variant - simple text link
  if (variant === 'original') {
    return (
      <div className="col-lg-3 col-md-4 col-sm-6">
        <Link href={`/listings?location=${slug}`} className="atbd_location_grid">
          {name} ({count})
        </Link>
      </div>
    );
  }

  // Compact variant (smaller card)
  if (variant === 'compact') {
    return (
      <div className="col-lg-3 col-md-4 col-sm-6">
        <Link href={`/listings?location=${slug}`}>
          <div className="location-card-compact">
            <div className="location-image-compact">
              <img
                src={assetUrl(image)}
                alt={name}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
              <div className="location-overlay-compact">
                <div className="location-info-compact">
                  <h5 className="location-name">{name}</h5>
                  <p className="location-meta">{city}, {state}</p>
                  <span className="location-count">{count} Listings</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Large variant (hero-style)
  if (variant === 'large') {
    return (
      <div className="col-lg-6">
        <Link href={`/listings?location=${slug}`}>
          <div className="location-card-large">
            <div className="location-image-large">
              <img
                src={assetUrl(image)}
                alt={name}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
              <div className="location-overlay-large">
                <div className="location-content-large">
                  <i className="la la-map-marker" style={{ fontSize: '48px' }}></i>
                  <h3 className="location-title-large">{name}</h3>
                  <p className="location-subtitle">{city}, {state}, {country}</p>
                  <span className="location-badge">{count} Listings</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Default variant
  return (
    <div className="col-lg-3 col-md-6">
      <Link href={`/listings?location=${slug}`}>
        <div className="location-card">
          <div className="location-image">
            <img
              src={assetUrl(image)}
              alt={name}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
            />
            <div className="location-overlay">
              <div className="location-content">
                <div className="location-icon">
                  <i className="la la-map-marker"></i>
                </div>
                <h4 className="location-title">{name}</h4>
                <p className="location-details">{city}, {state}</p>
                <span className="location-count">
                  <i className="la la-list"></i> {count} Listings
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

