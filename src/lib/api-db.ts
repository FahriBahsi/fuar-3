import { prisma } from '@/lib/prisma';
import { ListingStatus, UserRole } from '@prisma/client';

// Types
export interface ListingFilters {
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  featured?: boolean;
  verified?: boolean;
  search?: string;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Listings API
export async function getListings(
  filters: ListingFilters = {},
  pagination: PaginationOptions = {}
) {
  const {
    category,
    location,
    priceMin,
    priceMax,
    rating,
    featured,
    verified,
    search,
  } = filters;

  const page = pagination.page || 1;
  const limit = pagination.limit || 12;
  const skip = (page - 1) * limit;

  // Build where clause
  const where: any = {
    status: ListingStatus.PUBLISHED,
  };

  if (category) {
    where.category = { slug: category };
  }

  if (location) {
    where.OR = [
      { location: { contains: location, mode: 'insensitive' } },
      { locationRef: { slug: location } },
    ];
  }

  if (priceMin !== undefined || priceMax !== undefined) {
    where.price = {};
    if (priceMin !== undefined) where.price.gte = priceMin;
    if (priceMax !== undefined) where.price.lte = priceMax;
  }

  if (rating) {
    where.reviews = {
      some: {
        status: 'APPROVED',
        rating: { gte: rating },
      },
    };
  }

  if (featured !== undefined) {
    where.featured = featured;
  }

  if (verified !== undefined) {
    where.verified = verified;
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { has: search } },
    ];
  }

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        category: true,
        locationRef: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        reviews: {
          where: { status: 'APPROVED' },
          select: { rating: true },
        },
        _count: {
          select: {
            reviews: {
              where: { status: 'APPROVED' },
            },
            favorites: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { publishedAt: 'desc' },
      ],
      skip,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  // Calculate average ratings
  const listingsWithRatings = listings.map(listing => {
    const reviews = listing.reviews;
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return {
      ...listing,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    };
  });

  const totalPages = Math.ceil(total / limit);

  return {
    data: listingsWithRatings,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getListingBySlug(slug: string) {
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      category: true,
      locationRef: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
          phone: true,
          website: true,
          location: true,
          role: true,
        },
      },
      reviews: {
        where: { status: 'APPROVED' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      _count: {
        select: {
          reviews: {
            where: { status: 'APPROVED' },
          },
          favorites: true,
        },
      },
    },
  });

  if (!listing) {
    return null;
  }

  // Calculate average rating
  const reviews = listing.reviews;
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Increment view count
  await prisma.listing.update({
    where: { id: listing.id },
    data: { views: { increment: 1 } },
  });

  return {
    ...listing,
    averageRating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length,
  };
}

export async function getFeaturedListings(limit: number = 6) {
  const listings = await prisma.listing.findMany({
    where: {
      status: ListingStatus.PUBLISHED,
      featured: true,
    },
    include: {
      category: true,
      locationRef: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      reviews: {
        where: { status: 'APPROVED' },
        select: { rating: true },
      },
      _count: {
        select: {
          reviews: {
            where: { status: 'APPROVED' },
          },
          favorites: true,
        },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { views: 'desc' },
    ],
    take: limit,
  });

  return listings.map(listing => {
    const reviews = listing.reviews;
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return {
      ...listing,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    };
  });
}

// Categories API
export async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          listings: {
            where: { status: ListingStatus.PUBLISHED },
          },
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    include: {
      _count: {
        select: {
          listings: {
            where: { status: ListingStatus.PUBLISHED },
          },
        },
      },
    },
  });
}

// Locations API
export async function getLocations() {
  return prisma.location.findMany({
    where: { isActive: true },
    include: {
      _count: {
        select: {
          listings: {
            where: { status: ListingStatus.PUBLISHED },
          },
        },
      },
    },
  });
}

// User API
export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      phone: true,
      website: true,
      location: true,
      role: true,
      createdAt: true,
    },
  });
}

export async function getUserListings(userId: string) {
  return prisma.listing.findMany({
    where: { userId },
    include: {
      category: true,
      locationRef: true,
      reviews: {
        where: { status: 'APPROVED' },
        select: { rating: true },
      },
      _count: {
        select: {
          reviews: {
            where: { status: 'APPROVED' },
          },
          favorites: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Reviews API
export async function createReview(data: {
  listingId: string;
  userId: string;
  rating: number;
  title?: string;
  comment?: string;
}) {
  return prisma.review.create({
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
}

export async function getReviewsByListing(listingId: string) {
  return prisma.review.findMany({
    where: {
      listingId,
      status: 'APPROVED',
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// Blog API
export async function getBlogPosts(pagination: PaginationOptions = {}) {
  const page = pagination.page || 1;
  const limit = pagination.limit || 6;
  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        category: true,
      },
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.blogPost.count({
      where: { status: 'PUBLISHED' },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    data: posts,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export async function getBlogPostBySlug(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          bio: true,
        },
      },
      category: true,
    },
  });
}

export async function getBlogCategories() {
  return prisma.blogCategory.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: { status: 'PUBLISHED' },
          },
        },
      },
    },
  });
}

// Statistics API
export async function getDashboardStats(userId: string) {
  const [
    totalListings,
    publishedListings,
    totalViews,
    totalFavorites,
    totalReviews,
    recentListings,
  ] = await Promise.all([
    prisma.listing.count({
      where: { userId },
    }),
    prisma.listing.count({
      where: {
        userId,
        status: ListingStatus.PUBLISHED,
      },
    }),
    prisma.listing.aggregate({
      where: { userId },
      _sum: { views: true },
    }),
    prisma.favorite.count({
      where: {
        listing: { userId },
      },
    }),
    prisma.review.count({
      where: {
        listing: { userId },
        status: 'APPROVED',
      },
    }),
    prisma.listing.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        category: true,
        _count: {
          select: {
            reviews: true,
            favorites: true,
          },
        },
      },
    }),
  ]);

  return {
    totalListings,
    publishedListings,
    totalViews: totalViews._sum.views || 0,
    totalFavorites,
    totalReviews,
    recentListings,
  };
}

// Admin API
export async function getAdminStats() {
  const [
    totalUsers,
    totalListings,
    totalCategories,
    totalLocations,
    pendingListings,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.listing.count(),
    prisma.category.count(),
    prisma.location.count(),
    prisma.listing.count({
      where: { status: ListingStatus.PENDING },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    totalUsers,
    totalListings,
    totalCategories,
    totalLocations,
    pendingListings,
    recentUsers,
  };
}
