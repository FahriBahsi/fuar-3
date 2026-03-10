import Link from 'next/link';
import { Category } from '@/types/category';
import { assetUrl } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  variant?: 'default' | 'large' | 'simple' | 'original';
}

export default function CategoryCard({ category, variant = 'default' }: CategoryCardProps) {
  const { name, slug, description, icon, image, count } = category;

  // Original template variant with image overlay
  if (variant === 'original') {
    return (
      <div className="col-lg-4 col-sm-6">
        <div className="category-single category--img">
          <figure className="category--img4">
            <img src={assetUrl(image)} alt={name} />
            <figcaption className="overlay-bg">
              <Link href={`/categories/${slug}`} className="cat-box">
                <div>
                  <div className="icon">
                    <span className={`la la-${icon}`}></span>
                  </div>
                  <h4 className="cat-name">{name}</h4>
                  <span className="badge badge-pill badge-success">{count} Listings</span>
                </div>
              </Link>
            </figcaption>
          </figure>
        </div>
      </div>
    );
  }

  // Simple icon-only variant
  if (variant === 'simple') {
    return (
      <div className="col-lg-2 col-md-3 col-sm-4 col-6">
        <Link href={`/categories/${slug}`}>
          <div className="category-card-simple text-center">
            <div className="category-icon">
              <i className={`la la-${icon}`}></i>
            </div>
            <h6 className="category-name">{name}</h6>
            <span className="category-count">{count} Listings</span>
          </div>
        </Link>
      </div>
    );
  }

  // Large variant with background image
  if (variant === 'large') {
    return (
      <div className="col-lg-3 col-md-6">
        <Link href={`/categories/${slug}`}>
          <div className="category-card-large">
            <div className="category-image">
              <img
                src={assetUrl(image)}
                alt={name}
                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              />
              <div className="category-overlay">
                <div className="category-content">
                  <div className="category-icon-large">
                    <i className={`la la-${icon}`}></i>
                  </div>
                  <h4 className="category-title">{name}</h4>
                  <p className="category-count">{count} Listings</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // Default variant with image and details
  return (
    <div className="col-lg-3 col-md-6">
      <div className="category-card">
        <Link href={`/categories/${slug}`}>
          <div className="category-card-inner">
            <div className="category-thumbnail">
              <img
                src={assetUrl(image)}
                alt={name}
                style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
              />
            </div>
            <div className="category-details">
              <div className="category-icon-wrapper">
                <i className={`la la-${icon}`}></i>
              </div>
              <h5 className="category-title">{name}</h5>
              <p className="category-description">{description}</p>
              <span className="category-count">
                <i className="la la-list"></i> {count} Listings
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

