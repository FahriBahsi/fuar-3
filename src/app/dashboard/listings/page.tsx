'use client';

import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function ManageListingsPage() {
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
            { label: 'Dashboard' },
            { label: 'My Listings' },
          ]}
          title="My Listings"
        />
      </section>

      {/* Dashboard Wrapper */}
      <section className="dashboard-wrapper section-bg p-bottom-70 pt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              {/* Page Header */}
              <div className="dashboard-header mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="mb-2">My Listings</h2>
                    <p className="text-muted mb-0">
                      Manage and track your listings
                    </p>
                  </div>
                  <div>
                    <Link href="/add-listing" className="btn btn-primary">
                      <i className="la la-plus"></i> Add New Listing
                    </Link>
                  </div>
                </div>
              </div>

              {/* Listings Content */}
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Your Listings</h5>
                  <p className="card-text">Here you can manage all your listings.</p>
                  
                  {/* Sample listing cards */}
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">Sample Listing 1</h6>
                          <p className="card-text">This is a sample listing description.</p>
                          <span className="badge badge-success">Active</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">Sample Listing 2</h6>
                          <p className="card-text">This is another sample listing description.</p>
                          <span className="badge badge-success">Active</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}