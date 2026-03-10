'use client';

import { useState } from 'react';
import Link from 'next/link';

interface AdminStats {
  totalUsers: number;
  totalListings: number;
  totalCategories: number;
  totalLocations: number;
  pendingListings: number;
  recentUsers: Array<{
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date;
  }>;
}

interface AdminDashboardProps {
  stats: AdminStats;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'la-dashboard' },
    { id: 'users', label: 'Users', icon: 'la-users' },
    { id: 'listings', label: 'Listings', icon: 'la-list' },
    { id: 'categories', label: 'Categories', icon: 'la-tags' },
    { id: 'locations', label: 'Locations', icon: 'la-map-marker' },
    { id: 'settings', label: 'Settings', icon: 'la-cog' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1 className="admin-title">
                <i className="la la-shield-alt"></i>
                Admin Dashboard
              </h1>
              <p className="admin-subtitle">Manage your directory platform</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          {/* Sidebar */}
          <div className="col-lg-3">
            <div className="admin-sidebar">
              <nav className="admin-nav">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`admin-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <i className={tab.icon}></i>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-lg-9">
            <div className="admin-content">
              {activeTab === 'overview' && (
                <div className="admin-overview">
                  {/* Stats Cards */}
                  <div className="row">
                    <div className="col-lg-3 col-md-6 mb-4">
                      <div className="admin-stat-card">
                        <div className="stat-icon">
                          <i className="la la-users"></i>
                        </div>
                        <div className="stat-content">
                          <h3>{stats.totalUsers}</h3>
                          <p>Total Users</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                      <div className="admin-stat-card">
                        <div className="stat-icon">
                          <i className="la la-list"></i>
                        </div>
                        <div className="stat-content">
                          <h3>{stats.totalListings}</h3>
                          <p>Total Listings</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                      <div className="admin-stat-card">
                        <div className="stat-icon">
                          <i className="la la-tags"></i>
                        </div>
                        <div className="stat-content">
                          <h3>{stats.totalCategories}</h3>
                          <p>Categories</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 col-md-6 mb-4">
                      <div className="admin-stat-card">
                        <div className="stat-icon">
                          <i className="la la-map-marker"></i>
                        </div>
                        <div className="stat-content">
                          <h3>{stats.totalLocations}</h3>
                          <p>Locations</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pending Items */}
                  <div className="row">
                    <div className="col-12">
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h4>Pending Approvals</h4>
                        </div>
                        <div className="admin-card-body">
                          <div className="alert alert-warning">
                            <i className="la la-exclamation-triangle"></i>
                            {stats.pendingListings} listings are waiting for approval
                          </div>
                          <Link href="/admin/listings?status=pending" className="btn btn-warning">
                            Review Pending Listings
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Users */}
                  <div className="row">
                    <div className="col-12">
                      <div className="admin-card">
                        <div className="admin-card-header">
                          <h4>Recent Users</h4>
                        </div>
                        <div className="admin-card-body">
                          <div className="table-responsive">
                            <table className="table table-striped">
                              <thead>
                                <tr>
                                  <th>Name</th>
                                  <th>Email</th>
                                  <th>Role</th>
                                  <th>Joined</th>
                                </tr>
                              </thead>
                              <tbody>
                                {stats.recentUsers.map((user) => (
                                  <tr key={user.id}>
                                    <td>{user.name || 'N/A'}</td>
                                    <td>{user.email}</td>
                                    <td>
                                      <span className={`badge badge-${user.role === 'ADMIN' ? 'danger' : 'primary'}`}>
                                        {user.role}
                                      </span>
                                    </td>
                                    <td>
                                      {new Date(user.createdAt).toLocaleDateString()}
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
                </div>
              )}

              {activeTab === 'users' && (
                <div className="admin-users">
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h4>User Management</h4>
                      <Link href="/admin/users/new" className="btn btn-primary">
                        <i className="la la-plus"></i> Add User
                      </Link>
                    </div>
                    <div className="admin-card-body">
                      <p>User management features will be implemented here.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'listings' && (
                <div className="admin-listings">
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h4>Listing Management</h4>
                      <div className="btn-group">
                        <Link href="/admin/listings?status=all" className="btn btn-outline-primary">
                          All Listings
                        </Link>
                        <Link href="/admin/listings?status=pending" className="btn btn-outline-warning">
                          Pending ({stats.pendingListings})
                        </Link>
                      </div>
                    </div>
                    <div className="admin-card-body">
                      <p>Listing management features will be implemented here.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="admin-categories">
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h4>Category Management</h4>
                      <Link href="/admin/categories/new" className="btn btn-primary">
                        <i className="la la-plus"></i> Add Category
                      </Link>
                    </div>
                    <div className="admin-card-body">
                      <p>Category management features will be implemented here.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'locations' && (
                <div className="admin-locations">
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h4>Location Management</h4>
                      <Link href="/admin/locations/new" className="btn btn-primary">
                        <i className="la la-plus"></i> Add Location
                      </Link>
                    </div>
                    <div className="admin-card-body">
                      <p>Location management features will be implemented here.</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="admin-settings">
                  <div className="admin-card">
                    <div className="admin-card-header">
                      <h4>System Settings</h4>
                    </div>
                    <div className="admin-card-body">
                      <p>System settings and configuration will be implemented here.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
