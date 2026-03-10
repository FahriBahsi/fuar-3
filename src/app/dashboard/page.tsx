import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { getUserStats, getUserListings } from '@/lib/api';
import Link from 'next/link';
import { formatPrice, formatDate, assetUrl } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Dashboard - Manage Your Listings',
  description: 'View your stats, manage listings, and track performance',
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !(session.user as any).id) {
    redirect('/auth/login');
  }

  // Use the authenticated user's ID
  const userId = (session.user as any).id;

  const [stats, recentListings] = await Promise.all([
    getUserStats(userId),
    getUserListings(userId, { limit: 5 }),
  ]);

  return (
    <div className="dashboard-content">
      {/* Dashboard Header */}
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-2">
              Welcome back, {session.user?.name || 'User'}! 👋
            </h2>
            <p className="text-muted mb-0">
              Here's what's happening with your listings and account.
            </p>
          </div>
          <div>
            <Link href="/add-listing" className="btn btn-primary">
              <i className="la la-plus"></i> Add New Listing
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Charts and Quick Actions */}
      <div className="row mt-4">
        <div className="col-lg-8">
          <DashboardCharts data={stats.chartData!} />
        </div>
        <div className="col-lg-4">
          <div className="dashboard-card">
            <div className="card-header">
              <h5>Quick Actions</h5>
            </div>
            <div className="card-body">
              <ul className="quick-actions-list">
                <li>
                  <Link href="/add-listing" className="quick-action-item">
                    <i className="la la-plus-circle text-primary"></i>
                    <div className="action-content">
                      <h6>Add New Listing</h6>
                      <p className="text-muted">Create a new business listing</p>
                    </div>
                    <i className="la la-angle-right"></i>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/messages" className="quick-action-item">
                    <i className="la la-envelope text-info"></i>
                    <div className="action-content">
                      <h6>Messages</h6>
                      <p className="text-muted">3 unread messages</p>
                    </div>
                    <span className="badge badge-info">3</span>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/reviews" className="quick-action-item">
                    <i className="la la-star text-warning"></i>
                    <div className="action-content">
                      <h6>Reviews</h6>
                      <p className="text-muted">Check your ratings</p>
                    </div>
                    <i className="la la-angle-right"></i>
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/profile" className="quick-action-item">
                    <i className="la la-user text-success"></i>
                    <div className="action-content">
                      <h6>Edit Profile</h6>
                      <p className="text-muted">Update your information</p>
                    </div>
                    <i className="la la-angle-right"></i>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Listings Table */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="dashboard-card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Recent Listings</h5>
              <Link href="/dashboard/listings" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover dashboard-table">
                  <thead>
                    <tr>
                      <th>Listing</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Views</th>
                      <th>Rating</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentListings.map((listing) => (
                      <tr key={listing.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={assetUrl(listing.image)}
                              alt={listing.title}
                              className="rounded mr-3"
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                            <div>
                              <h6 className="mb-0">{listing.title}</h6>
                              <small className="text-muted">
                                {listing.location.city}, {listing.location.state}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-light">
                            <i className={`la la-${listing.category.icon}`}></i>{' '}
                            {listing.category.name}
                          </span>
                        </td>
                        <td>
                          <span className="badge badge-success">
                            <i className="la la-check"></i> Active
                          </span>
                        </td>
                        <td>
                          <i className="la la-eye text-info"></i> 234
                        </td>
                        <td>
                          <span className="rating">
                            <i className="la la-star text-warning"></i>
                            {listing.rating}
                          </span>
                        </td>
                        <td>
                          <small className="text-muted">
                            {formatDate(listing.createdAt)}
                          </small>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Link
                              href={`/listings/${listing.slug}`}
                              className="btn btn-sm btn-outline-primary"
                              title="View"
                            >
                              <i className="la la-eye"></i>
                            </Link>
                            <button
                              className="btn btn-sm btn-outline-secondary ml-1"
                              title="Edit"
                            >
                              <i className="la la-edit"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger ml-1"
                              title="Delete"
                            >
                              <i className="la la-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="dashboard-card">
            <div className="card-header">
              <h5>Recent Activity</h5>
            </div>
            <div className="card-body">
              <ul className="activity-list">
                <li className="activity-item">
                  <div className="activity-icon bg-primary">
                    <i className="la la-plus"></i>
                  </div>
                  <div className="activity-content">
                    <p><strong>New listing created</strong></p>
                    <small className="text-muted">Modern Coworking Space - 2 hours ago</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="activity-icon bg-success">
                    <i className="la la-star"></i>
                  </div>
                  <div className="activity-content">
                    <p><strong>New 5-star review</strong></p>
                    <small className="text-muted">Italian Restaurant - 5 hours ago</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="activity-icon bg-info">
                    <i className="la la-bookmark"></i>
                  </div>
                  <div className="activity-content">
                    <p><strong>New booking received</strong></p>
                    <small className="text-muted">Grand Plaza Hotel - Yesterday</small>
                  </div>
                </li>
                <li className="activity-item">
                  <div className="activity-icon bg-warning">
                    <i className="la la-envelope"></i>
                  </div>
                  <div className="activity-content">
                    <p><strong>New message</strong></p>
                    <small className="text-muted">From: Sarah Johnson - 2 days ago</small>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="dashboard-card">
            <div className="card-header">
              <h5>Top Performing Listings</h5>
            </div>
            <div className="card-body">
              <ul className="top-listings-list">
                {recentListings.slice(0, 3).map((listing, index) => (
                  <li key={listing.id} className="top-listing-item">
                    <div className="rank-badge">#{index + 1}</div>
                    <div className="listing-mini">
                      <img
                        src={assetUrl(listing.image)}
                        alt={listing.title}
                        className="rounded"
                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="listing-mini-info">
                      <h6>{listing.title}</h6>
                      <div className="mini-stats">
                        <span className="mr-3">
                          <i className="la la-eye text-info"></i> 456 views
                        </span>
                        <span>
                          <i className="la la-star text-warning"></i> {listing.rating}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/listings/${listing.slug}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      View
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

