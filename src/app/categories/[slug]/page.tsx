import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import ListingCard from '@/components/listings/ListingCard';
import Pagination from '@/components/common/Pagination';
import Loading from '@/components/common/Loading';
import { getCategoryBySlug, getListings } from '@/lib/api';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    page?: string;
    location?: string;
    price_min?: string;
    price_max?: string;
    rating?: string;
  }>;
}

// Generate metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = await getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.name} - Browse Listings`,
    description: category.description,
  };
}

export default async function CategoryDetailsPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const category = await getCategoryBySlug(resolvedParams.slug);

  if (!category) {
    notFound();
  }

  // Parse search params
  const page = parseInt(resolvedSearchParams.page || '1');
  const filters = {
    category: category.slug,
    location: resolvedSearchParams.location,
    priceMin: resolvedSearchParams.price_min ? parseInt(resolvedSearchParams.price_min) : undefined,
    priceMax: resolvedSearchParams.price_max ? parseInt(resolvedSearchParams.price_max) : undefined,
    rating: resolvedSearchParams.rating ? parseFloat(resolvedSearchParams.rating) : undefined,
    page,
    perPage: 12,
  };

  // Fetch listings for this category
  const listingsData = await getListings(filters);

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Categories', href: '/categories' },
          { label: category.name },
        ]}
        title={category.name}
      />

      {/* Category Info Section */}
      <section className="category-info-section py-4 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="category-info">
                <div className="d-flex align-items-center mb-3">
                  <div className="category-icon-large mr-3">
                    <i className={`la la-${category.icon} category-icon`}></i>
                  </div>
                  <div>
                    <h2 className="mb-2">{category.name}</h2>
                    <p className="text-muted mb-0">{category.description}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 text-lg-right">
              <div className="category-stats">
                <h3 className="mb-0">{category.count}</h3>
                <p className="text-muted">Listings Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Listings Section */}
      <section className="category-listings-wrapper section-padding-strict">
        <div className="container">
          {/* Header with view toggle and sort */}
          

          {/* Listings Grid */}
          {listingsData.listings.length > 0 ? (
            <>
              <div className="row">
                {listingsData.listings.map((listing) => (
                  <div key={listing.id} className="col-lg-4 col-md-6 col-sm-6">
                    <ListingCard listing={listing} variant="grid" />
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {listingsData.totalPages > 1 && (
                <div className="row mt-5">
                  <div className="col-12">
                    <Pagination
                      currentPage={listingsData.page}
                      totalPages={listingsData.totalPages}
                      baseUrl={`/categories/${category.slug}`}
                    />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="no-results text-center py-5">
              <i className="la la-inbox no-results-icon"></i>
              <h3 className="mt-3">No Listings Yet</h3>
              <p className="text-muted">
                There are no listings in this category yet. Check back soon!
              </p>
              <Link href="/categories" className="btn btn-primary mt-3">
                <i className="la la-arrow-left"></i> Browse Other Categories
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Related Categories Section */}
      <section className="related-categories bg-light py-5">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h3 className="section-title mb-4">Explore More Categories</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="d-flex flex-wrap">
                <Link href="/categories/restaurants" className="btn btn-outline-primary m-2">
                  <i className="la la-cutlery"></i> Restaurants
                </Link>
                <Link href="/categories/hotels" className="btn btn-outline-primary m-2">
                  <i className="la la-bed"></i> Hotels
                </Link>
                <Link href="/categories/shopping" className="btn btn-outline-primary m-2">
                  <i className="la la-shopping-bag"></i> Shopping
                </Link>
                <Link href="/categories/services" className="btn btn-outline-primary m-2">
                  <i className="la la-briefcase"></i> Services
                </Link>
                <Link href="/categories" className="btn btn-outline-secondary m-2">
                  <i className="la la-th"></i> View All
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

