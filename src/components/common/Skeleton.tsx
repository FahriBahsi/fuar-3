import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  style?: React.CSSProperties;
}

/**
 * Skeleton Loading Component
 * Shows placeholder while content is loading
 */
export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  style,
}: SkeletonProps) {
  const baseStyles = {
    backgroundColor: '#e0e0e0',
    backgroundImage: 'linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-loading 1.5s ease-in-out infinite',
  };

  const variantStyles = {
    text: {
      borderRadius: '4px',
      height: height || '1em',
      width: width || '100%',
    },
    circular: {
      borderRadius: '50%',
      width: width || '40px',
      height: height || '40px',
    },
    rectangular: {
      borderRadius: '8px',
      width: width || '100%',
      height: height || '100px',
    },
  };

  const finalStyles = {
    ...baseStyles,
    ...variantStyles[variant],
    ...style,
  };

  return (
    <>
      <style jsx>{`
        @keyframes skeleton-loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
      <div
        className={`skeleton ${className}`}
        style={finalStyles}
      />
    </>
  );
}

/**
 * Listing Card Skeleton
 */
export function ListingCardSkeleton() {
  return (
    <div className="atbd_single_listing">
      <div className="atbd_listing_thumbnail_area">
        <Skeleton variant="rectangular" height="250px" />
      </div>
      <div className="atbd_listing_info" style={{ padding: '1.5rem' }}>
        <Skeleton variant="text" width="60%" height="24px" style={{ marginBottom: '0.5rem' }} />
        <Skeleton variant="text" width="40%" height="16px" style={{ marginBottom: '1rem' }} />
        <Skeleton variant="text" width="100%" height="16px" style={{ marginBottom: '0.5rem' }} />
        <Skeleton variant="text" width="80%" height="16px" />
      </div>
    </div>
  );
}

/**
 * Blog Card Skeleton
 */
export function BlogCardSkeleton() {
  return (
    <div className="blog-card" style={{ padding: '1rem' }}>
      <Skeleton variant="rectangular" height="200px" style={{ marginBottom: '1rem' }} />
      <Skeleton variant="text" width="70%" height="20px" style={{ marginBottom: '0.5rem' }} />
      <Skeleton variant="text" width="100%" height="16px" style={{ marginBottom: '0.5rem' }} />
      <Skeleton variant="text" width="90%" height="16px" style={{ marginBottom: '1rem' }} />
      <Skeleton variant="text" width="30%" height="16px" />
    </div>
  );
}

/**
 * Category Card Skeleton
 */
export function CategoryCardSkeleton() {
  return (
    <div className="category-single">
      <Skeleton variant="rectangular" height="180px" style={{ marginBottom: '0.5rem' }} />
      <Skeleton variant="text" width="60%" height="18px" style={{ margin: '0.5rem auto' }} />
    </div>
  );
}

/**
 * Table Row Skeleton
 */
export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}>
          <Skeleton variant="text" width="80%" />
        </td>
      ))}
    </tr>
  );
}

