import { Metadata } from 'next';
import Link from 'next/link';
import { getUserListings } from '@/lib/api';
import { assetUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Reviews - Dashboard',
  description: 'View and manage reviews for your listings',
};

export default async function ReviewsPage() {
  const userId = 'user-123';
  const listings = await getUserListings(userId, { limit: 3 });

  // Mock reviews data
  const reviews = [
    {
      id: '1',
      listing: listings[0],
      reviewer: {
        name: 'Sarah Williams',
        avatar: '/images/review-author-thumb.jpg',
      },
      rating: 5,
      comment: 'Absolutely amazing experience! The coworking space is modern, clean, and has everything you need. Highly recommend!',
      date: '2024-01-20',
      helpful: 12,
    },
    {
      id: '2',
      listing: listings[1],
      reviewer: {
        name: 'Michael Brown',
        avatar: '/images/review-author-thumb2.jpg',
      },
      rating: 4,
      comment: 'Great food and excellent service. The atmosphere is wonderful. Will definitely come back!',
      date: '2024-01-18',
      helpful: 8,
    },
    {
      id: '3',
      listing: listings[0],
      reviewer: {
        name: 'Jennifer Davis',
        avatar: '/images/review-author-thumb3.jpg',
      },
      rating: 5,
      comment: 'Perfect location and great amenities. The staff is very friendly and helpful.',
      date: '2024-01-15',
      helpful: 15,
    },
  ];

  const totalReviews = 45;
  const averageRating = 4.8;
  const ratingBreakdown = [
    { stars: 5, count: 32, percentage: 71 },
    { stars: 4, count: 10, percentage: 22 },
    { stars: 3, count: 2, percentage: 4 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 0, percentage: 0 },
  ];

  return (
    <div className="dashboard-content">
      {/* Page Header */}
      <div className="dashboard-header mb-4">
        <h2 className="mb-2">Reviews</h2>
        <p className="text-muted mb-0">
          Manage reviews for your {listings.length} listings
        </p>
      </div>

      {/* Overview Stats */}
      <div className="row mb-4">
        <div className="col-lg-4">
          <div className="dashboard-card text-center">
            <div className="card-body">
              <div className="rating-overview">
                <h1 className="display-3 mb-0">{averageRating}</h1>
                <div className="stars mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`la la-star ${
                        star <= averageRating ? 'text-warning' : 'text-muted'
                      }`}
                    ></i>
                  ))}
                </div>
                <p className="text-muted">
                  Based on {totalReviews} reviews
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="dashboard-card">
            <div className="card-header">
              <h5>Rating Breakdown</h5>
            </div>
            <div className="card-body">
              {ratingBreakdown.map((item) => (
                <div key={item.stars} className="rating-bar-item mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="rating-label">
                      {item.stars} <i className="la la-star text-warning"></i>
                    </span>
                    <span className="rating-count text-muted">
                      {item.count} reviews
                    </span>
                  </div>
                  <div className="progress" style={{ height: '8px' }}>
                    <div
                      className="progress-bar bg-warning"
                      role="progressbar"
                      style={{ width: `${item.percentage}%` }}
                      aria-valuenow={item.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="row">
        <div className="col-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Recent Reviews</h5>
              <div>
                <select className="form-control form-control-sm">
                  <option value="all">All Listings</option>
                  {listings.map((listing) => (
                    <option key={listing.id} value={listing.id}>
                      {listing.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="card-body">
              {reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <div className="d-flex align-items-center">
                      <img
                        src={assetUrl(review.reviewer.avatar)}
                        alt={review.reviewer.name}
                        className="rounded-circle mr-3"
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-0">{review.reviewer.name}</h6>
                        <div className="review-rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <i
                              key={star}
                              className={`la la-star ${
                                star <= review.rating ? 'text-warning' : 'text-muted'
                              }`}
                            ></i>
                          ))}
                          <small className="text-muted ml-2">{review.date}</small>
                        </div>
                      </div>
                    </div>
                    <div className="review-listing">
                      <small className="text-muted">
                        For:{' '}
                        <Link href={`/listings/${review.listing.slug}`}>
                          {review.listing.title}
                        </Link>
                      </small>
                    </div>
                  </div>
                  <div className="review-content">
                    <p>{review.comment}</p>
                  </div>
                  <div className="review-footer">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="review-helpful">
                        <button className="btn btn-sm btn-outline-secondary">
                          <i className="la la-thumbs-up"></i> Helpful ({review.helpful})
                        </button>
                      </div>
                      <div className="review-actions">
                        <button className="btn btn-sm btn-outline-primary">
                          <i className="la la-reply"></i> Reply
                        </button>
                        <button className="btn btn-sm btn-outline-secondary ml-2">
                          <i className="la la-flag"></i> Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

