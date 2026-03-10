import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Breadcrumb from '@/components/common/Breadcrumb';
import ListingCard from '@/components/listings/ListingCard';
import Pagination from '@/components/common/Pagination';
import { prisma } from '@/lib/prisma';
import { userImageUrl, assetUrl } from '@/lib/utils';
import type { Listing } from '@/types/listing';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface AuthorProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio: string | null;
  phone: string | null;
  website: string | null;
  location: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  createdAt: Date;
  listings: {
    id: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    featured: boolean;
    createdAt: Date;
    category: {
      name: string;
      icon: string;
    };
    location: {
      city: string;
      state: string;
    };
  }[];
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const author = await prisma.user.findUnique({
    where: { id: resolvedParams.slug },
    select: {
      name: true,
      email: true,
      bio: true,
      listings: {
        select: { title: true },
      },
    },
  });

  if (!author) {
    return {
      title: 'Author Not Found',
    };
  }

  return {
    title: `${author.name || 'Author'} Profile | Direo`,
    description: author.bio || `View listings by ${author.name}`,
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const resolvedParams = await params;
  const author = await prisma.user.findUnique({
    where: { id: resolvedParams.slug },
    include: {
      listings: {
        take: 12,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          price: true,
          images: true,
          featured: true,
          createdAt: true,
          category: {
            select: {
              name: true,
              icon: true,
            },
          },
          locationRef: {
            select: {
              name: true,
              slug: true,
            },
          },
          reviews: {
            select: {
              rating: true,
            },
          },
          _count: {
            select: {
              reviews: true,
            },
          },
        },
      },
    },
  });

  if (!author) {
    notFound();
  }

  const authorListings: Listing[] = author.listings.map((listing) => {
    // Calculate average rating from reviews
    const avgRating = listing.reviews.length > 0
      ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length
      : 4.5; // Default rating if no reviews
    
    return {
      id: listing.id,
      title: listing.title,
      slug: listing.slug,
      description: listing.description,
      category: {
        id: '',
        name: listing.category.name,
        slug: '',
        icon: listing.category.icon || '',
      },
      location: {
        address: '',
        city: listing.locationRef?.name || '',
        state: '',
        zip: '',
        lat: 0,
        lng: 0,
      },
      price: listing.price || 0,
      priceType: 'daily',
      rating: Math.round(avgRating * 10) / 10, // Round to 1 decimal place
      reviews: listing._count.reviews,
      image: listing.images[0] || '',
      images: listing.images,
      featured: listing.featured,
      popular: false,
      new: false,
      verified: false,
      status: 'open',
      author: {
        id: author.id,
        name: author.name || 'Unknown',
        avatar: author.image || '',
        verified: false,
      },
      amenities: [],
      hours: {},
      contact: {},
      views: 0,
      createdAt: listing.createdAt.toISOString(),
      updatedAt: listing.createdAt.toISOString(),
    };
  });

  return (
    <>
      {/* Header with Breadcrumb */}
      <section className="header-breadcrumb bgimage overlay overlay--dark">
        <div className="bg_image_holder">
          <img src={assetUrl("/images/breadcrumb1.jpg")} alt="" />
        </div>
        
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Author Profile' },
          ]}
          title={`${author.name || 'Author'} Profile`}
        />
      </section>

      {/* Author Info Area */}
      <section className="author-info-area section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="atbd_auhor_profile_area">
                <div className="atbd_author_avatar">
                  <img 
                    src={userImageUrl(author.image) || assetUrl("/images/author-profile.jpg")} 
                    alt={author.name || "Author Image"} 
                  />
                  <div className="atbd_auth_nd">
                    <h2>{author.name || "Unknown Author"}</h2>
                    <p>
                      Joined in {new Date(author.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="atbd_author_meta">
                  <div className="atbd_listing_meta">
                    <span className="atbd_meta atbd_listing_rating">
                      4.5 <i className="la la-star"></i>
                    </span>
                    <p className="meta-info"><span>0</span> Reviews</p>
                  </div>
                  <p className="meta-info"><span>{authorListings.length}</span> Listings</p>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-md-7 m-bottom-30">
              <div className="atbd_author_module">
                <div className="atbd_content_module">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4><span className="la la-user"></span> About Seller</h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    <p>
                      {author.bio || 
                        "Welcome to my profile! I'm passionate about creating amazing listings and helping people discover great places. With years of experience in the industry, I strive to provide accurate and helpful information about local businesses and services."
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-5 m-bottom-30">
              <div className="widget atbd_widget widget-card">
                <div className="atbd_widget_title">
                  <h4><span className="la la-phone"></span> Contact Info</h4>
                </div>
                <div className="widget-body atbd_author_info_widget">
                  <div className="atbd_widget_contact_info">
                    <ul>
                      {author.location && (
                        <li>
                          <span className="la la-map-marker"></span>
                          <span className="atbd_info">{author.location}</span>
                        </li>
                      )}
                      {author.phone && (
                        <li>
                          <span className="la la-phone"></span>
                          <span className="atbd_info">{author.phone}</span>
                        </li>
                      )}
                      {author.email && (
                        <li>
                          <span className="la la-envelope"></span>
                          <span className="atbd_info">{author.email}</span>
                        </li>
                      )}
                      {author.website && (
                        <li>
                          <span className="la la-globe"></span>
                          <a 
                            href={author.website} 
                            className="atbd_info"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {author.website}
                          </a>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="atbd_social_wrap">
                    {author.facebook && (
                      <p>
                        <a href={author.facebook} target="_blank" rel="noopener noreferrer">
                          <span className="fab fa-facebook-f"></span>
                        </a>
                      </p>
                    )}
                    {author.twitter && (
                      <p>
                        <a href={author.twitter} target="_blank" rel="noopener noreferrer">
                          <span className="fab fa-twitter"></span>
                        </a>
                      </p>
                    )}
                    {author.instagram && (
                      <p>
                        <a href={author.instagram} target="_blank" rel="noopener noreferrer">
                          <span className="fab fa-instagram"></span>
                        </a>
                      </p>
                    )}
                    {author.linkedin && (
                      <p>
                        <a href={author.linkedin} target="_blank" rel="noopener noreferrer">
                          <span className="fab fa-linkedin-in"></span>
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="atbd_author_listings_area m-bottom-30">
                <h1>
                  {author.name || 'Author'} Listings
                </h1>
              </div>

              {authorListings.length > 0 ? (
                <div className="row">
                  {authorListings.map((listing) => (
                    <div key={listing.id} className="col-lg-4 col-sm-6">
                      <ListingCard
                        listing={listing}
                        variant="grid"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="col-12">
                  <div className="text-center py-5">
                    <i className="la la-list empty-state-icon"></i>
                    <h3 className="mt-3">No Listings Found</h3>
                    <p className="text-muted">
                      This author hasn't created any listings yet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
