import { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ListingCard from '@/components/listings/ListingCard';
import { getFeaturedListings } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Product Cards - Direo',
  description: 'Showcase of different product card styles and variations',
};

export default async function CardsPage() {
  const listings = await getFeaturedListings(6);

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
            { label: 'All Listings' },
          ]}
          title="Post Cards"
        />
      </section>

      {/* Product Cards Grid */}
      <section className="cards-grid section-padding-two border-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Product Card Grid</h2>
                <p>The style of product cards shown as tiles.</p>
              </div>
            </div>

            <div className="listing-cards-wrapper col-lg-12">
              <div className="row">
                {listings.map((listing) => (
                  <div key={listing.id} className="col-lg-4 col-md-6">
                    <ListingCard
                      listing={listing}
                      variant="grid"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

