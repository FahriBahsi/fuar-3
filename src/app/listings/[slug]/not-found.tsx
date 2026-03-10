import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function NotFound() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Listings', href: '/listings' },
          { label: 'Not Found' },
        ]}
        title="Listing Not Found"
      />

      <section className="error-page section-padding-strict">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="error-content text-center">
                <i className="la la-exclamation-triangle empty-state-icon-extra-large"></i>
                <h1 className="mt-4">Listing Not Found</h1>
                <p className="lead text-muted">
                  Sorry, the listing you're looking for doesn't exist or has been removed.
                </p>
                <div className="mt-4">
                  <Link href="/listings" className="btn btn-primary mr-2">
                    <i className="la la-list"></i> Browse All Listings
                  </Link>
                  <Link href="/" className="btn btn-outline-primary">
                    <i className="la la-home"></i> Go Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

