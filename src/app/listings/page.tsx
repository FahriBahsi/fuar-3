import { Metadata } from 'next';
import { Suspense } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ListingCard from '@/components/listings/ListingCard';
import ListingFilters from '@/components/listings/ListingFilters';
import Pagination from '@/components/common/Pagination';
import Loading from '@/components/common/Loading';
import { getListings, getCategories } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Listings - Grid View',
  description: 'Browse all available listings in grid view',
};

interface SearchParams {
  category?: string;
  location?: string;
  price_min?: string;
  price_max?: string;
  rating?: string;
  featured?: string;
  verified?: string;
  page?: string;
  search?: string;
  features?: string;
  tags?: string;
  open_now?: string;
  offering_deal?: string;
}

interface PageProps {
  searchParams: SearchParams;
}

export default async function ListingsGridPage({ searchParams }: PageProps) {
  // Await searchParams as required by Next.js 15
  const params = await searchParams;
  
  // Parse search params
  const page = parseInt(params.page || '1');
  const filters = {
    category: params.category,
    location: params.location,
    priceMin: params.price_min ? parseInt(params.price_min) : undefined,
    priceMax: params.price_max ? parseInt(params.price_max) : undefined,
    rating: params.rating ? parseFloat(params.rating) : undefined,
    featured: params.featured === 'true',
    verified: params.verified === 'true',
    search: params.search,
    features: params.features,
    tags: params.tags,
    openNow: params.open_now === 'true',
    offeringDeal: params.offering_deal === 'true',
    page,
    perPage: 6,
  };

  // Fetch data
  const [listingsData, categories] = await Promise.all([
    getListings(filters),
    getCategories(),
  ]);

  const hasFilters = Object.values(params).some(val => val !== undefined);

  return (
    <>
      {/* Breadcrumb with Header */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Listings' },
        ]}
        title="All Listing"
      />

      {/* Listings Section */}
      <section className="all-listing-wrapper section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="atbd_generic_header">
                <div className="atbd_generic_header_title">
                  <h4>All Items</h4>
                  <p>Total Listing Found: {listingsData.total}</p>
                </div>
                <div className="atbd_listing_action_btn btn-toolbar" role="toolbar">
                  {/* Views dropdown */}
                  <div className="view-mode">
                    <Link href="/listings" className="action-btn active">
                      <span className="la la-th-large"></span>
                    </Link>
                    <Link href="/listings/list" className="action-btn">
                      <span className="la la-list"></span>
                    </Link>
                  </div>
                  {/* Orderby dropdown */}
                  <div className="dropdown">
                    <a
                      className="action-btn dropdown-toggle"
                      href="#"
                      role="button"
                      id="dropdownMenuLink2"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      Sort by <span className="caret"></span>
                    </a>

                    <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                      <a className="dropdown-item" href="#">
                        A to Z ( title )
                      </a>
                      <a className="dropdown-item" href="#">
                        Z to A ( title )
                      </a>
                      <a className="dropdown-item active" href="#">
                        Latest listings
                      </a>
                      <a className="dropdown-item" href="#">
                        Oldest listings
                      </a>
                      <a className="dropdown-item" href="#">
                        Popular listings
                      </a>
                      <a className="dropdown-item" href="#">
                        Price ( low to high )
                      </a>
                      <a className="dropdown-item" href="#">
                        Price ( high to low )
                      </a>
                      <a className="dropdown-item" href="#">
                        Random listings
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12 listing-items">
            <div className="row">
              {/* Sidebar with Filters */}
              <div className="col-lg-4 order-lg-0 order-1 mt-5 mt-lg-0">
                <div className="listings-sidebar">
                  <Suspense fallback={<Loading />}>
                    <ListingFilters categories={categories} />
                  </Suspense>
                </div>
              </div>

              {/* Listings Grid */}
              <div className="col-lg-8 order-lg-1 order-0">
                {listingsData.listings.length > 0 ? (
                  <>
                    <div className="row">
                      {listingsData.listings.map((listing) => (
                        <div key={listing.id} className="col-lg-6 col-sm-6">
                          <ListingCard listing={listing} variant="grid" />
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="row">
                      <div className="col-lg-12">
                        <Suspense fallback={<Loading />}>
                          <Pagination
                            currentPage={listingsData.page}
                            totalPages={listingsData.totalPages}
                            baseUrl="/listings"
                          />
                        </Suspense>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="no-results text-center py-5">
                    <i className="la la-search no-results-icon"></i>
                    <h3 className="mt-3">No Listings Found</h3>
                    <p className="text-muted">
                      Try adjusting your filters or search criteria
                    </p>
                    <Link href="/listings" className="btn btn-primary mt-3">
                      Clear Filters
                    </Link>
                  </div>
                )}
              </div>
            </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

