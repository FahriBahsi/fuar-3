import { Metadata } from 'next';
import Link from 'next/link';
import { getFeaturedListings, getTopCategories, getPopularLocations } from '@/lib/api';
import { formatPrice, assetUrl } from '@/lib/utils';
import HeroSection from '@/components/home/HeroSection';
import WhyDireoSection from '@/components/home/WhyDireoSection';
import TestimonialSection from '@/components/home/TestimonialSection';
import ClientsLogoSection from '@/components/home/ClientsLogoSection';
import SubscribeSection from '@/components/home/SubscribeSection';
import ListingCard from '@/components/listings/ListingCard';

export const metadata: Metadata = {
  title: 'Home - Directory & Listing Template',
  description: 'Find the best businesses, restaurants, and services near you',
};

export default async function HomePage() {
  // Fetch data using Server Components
  const [featuredListings, topCategories, popularLocations] = await Promise.all([
    getFeaturedListings(6),
    getTopCategories(6),
    getPopularLocations(4),
  ]);

  return (
    <>
      {/* Hero Section with Header Inside */}
      <HeroSection topCategories={topCategories} popularLocations={popularLocations} />

      {/* Categories Section */}
      <section className="categories-cards section-padding-two">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>What Kind of Activity do you Want to try?</h2>
                <p>
                  Discover best things to do restaurants, shopping, hotels, cafes and places around
                  the world by categories.
                </p>
              </div>
            </div>
          </div>

          <div className="row">
            {topCategories.map((category) => (
              <div key={category.id} className="col-lg-4 col-sm-6">
                <div className="category-single category--img">
                  <figure className="category--img4">
                    <img src={assetUrl(category.image)} alt={category.name} />
                    <figcaption className="overlay-bg">
                      <Link href={`/listings?category=${category.slug}`} className="cat-box">
                        <div>
                          <div className="icon">
                            <span className={`la la-${category.icon}`}></span>
                          </div>
                          <h4 className="cat-name">{category.name}</h4>
                          <span className="badge badge-pill badge-success">
                            {category.count} Listings
                          </span>
                        </div>
                      </Link>
                    </figcaption>
                  </figure>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="listing-cards section-bg section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Best Listings Around the World</h2>
                <p>Explore the popular listings around the world</p>
              </div>
            </div>

            <div className="listing-cards-wrapper col-lg-12">
              <div className="row">
                {featuredListings.map((listing) => (
                  <div key={listing.id} className="col-lg-4 col-sm-6">
                    <ListingCard listing={listing} variant="grid" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-12 text-center">
              <Link href="/listings" className="btn btn-gradient btn-gradient-two">
                Explore All 200+
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Direo Section */}
      <WhyDireoSection />

      {/* Popular Locations */}
      <section className="places section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title">
                <h2>Destination We Love</h2>
                <p>Explore best listings around the world by city</p>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="cat-places-wrapper">
                {popularLocations.map((location) => (
                  <div key={location.id} className="category-place-single">
                    <figure>
                      <Link href={`/listings?location=${location.slug}`}>
                        <img src={assetUrl(location.image)} alt={location.name} />
                      </Link>
                      <figcaption>
                        <h3>{location.name}</h3>
                        <p>{location.count} Listings</p>
                      </figcaption>
                    </figure>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-lg-12">
              <div className="place-list-wrapper">
                <ul className="list-unstyled">
                  <li><Link href="/listings?location=dubai">Dubai (45)</Link></li>
                  <li><Link href="/listings?location=melbourne">Melbourne (95)</Link></li>
                  <li><Link href="/listings?location=sydney">Sydney (90)</Link></li>
                  <li><Link href="/listings?location=brisbane">Brisbane (73)</Link></li>
                  <li><Link href="/listings?location=perth">Perth (97)</Link></li>
                  <li><Link href="/listings?location=toronto">Toronto (960)</Link></li>
                  <li><Link href="/listings?location=vancouver">Vancouver (46)</Link></li>
                  <li><Link href="/listings?location=montreal">Montreal (46)</Link></li>
                  <li><Link href="/listings?location=calgary">Calgary (16)</Link></li>
                  <li><Link href="/listings?location=edmonton">Edmonton (6)</Link></li>
                  <li><Link href="/listings?location=ottawa">Ottawa (53)</Link></li>
                  <li><Link href="/listings?location=atlantic-canada">Atlantic Canada (83)</Link></li>
                  <li><Link href="/listings?location=berlin">Berlin (71)</Link></li>
                  <li><Link href="/listings?location=munich">Munich (46)</Link></li>
                  <li><Link href="/listings?location=hamburg">Hamburg Area (727)</Link></li>
                  <li><Link href="/listings?location=frankfurt">Frankfurt Area (655)</Link></li>
                  <li><Link href="/listings?location=stuttgart">Stuttgart Area (9)</Link></li>
                  <li><Link href="/listings?location=barcelona">Barcelona (46)</Link></li>
                  <li><Link href="/listings?location=madrid">Madrid (790)</Link></li>
                  <li><Link href="/listings?location=spain">Spain (52)</Link></li>
                  <li><Link href="/listings?location=dublin">Dublin (657)</Link></li>
                  <li><Link href="/listings?location=galway">Galway (12)</Link></li>
                  <li><Link href="/listings?location=limerick">Limerick (6)</Link></li>
                  <li><Link href="/listings?location=tokyo">Tokyo, JP (24)</Link></li>
                  <li><Link href="/listings?location=kanagawa">Kanagawa (276)</Link></li>
                  <li><Link href="/listings?location=osaka">Osaka (146)</Link></li>
                  <li><Link href="/listings?location=kyoto">Kyoto (70)</Link></li>
                  <li><Link href="/listings?location=nagoya">Nagoya (64)</Link></li>
                  <li><Link href="/listings?location=mexico-city">Mexico City (195)</Link></li>
                  <li><Link href="/listings?location=london">London (51)</Link></li>
                  <li><Link href="/listings?location=manchester">Manchester (21)</Link></li>
                  <li><Link href="/listings?location=birmingham">Birmingham (43)</Link></li>
                  <li><Link href="/listings?location=leeds">Leeds (16)</Link></li>
                  <li><Link href="/listings?location=glasgow">Glasgow (52)</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <TestimonialSection />

      {/* Clients Logo Carousel */}
      <ClientsLogoSection />

      {/* Newsletter Subscribe */}
      <SubscribeSection />
    </>
  );
}
