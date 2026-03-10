import { Listing, ListingsResponse, ListingFilters } from '@/types/listing';
import { Category } from '@/types/category';
import { Location } from '@/types/common';
import listingsData from '@/data/listings.json';
import categoriesData from '@/data/categories.json';
import locationsData from '@/data/locations.json';

// Simulate API delay for realistic behavior
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to parse price string to number
function parsePrice(price: string | number): number {
  if (typeof price === 'number') return price;
  if (typeof price !== 'string') return 0;
  
  // Handle formats like "$55.00"
  const numericString = price.replace(/[^0-9.]/g, '');
  const numValue = parseFloat(numericString);
  
  // Handle formats like "$$$$" (count $ signs as price indicator)
  if (isNaN(numValue) && price.includes('$')) {
    const dollarCount = (price.match(/\$/g) || []).length;
    return dollarCount * 50; // Approximate: $ = 50, $$ = 100, etc.
  }
  
  return isNaN(numValue) ? 0 : numValue;
}

/**
 * Get all listings with optional filters
 */
export async function getListings(filters: ListingFilters = {}): Promise<ListingsResponse> {
  await delay(100);

  let { listings } = listingsData;
  
  // Apply category filter
  if (filters.category) {
    listings = listings.filter(l => l.category.slug === filters.category);
  }
  
  // Apply location filter
  if (filters.location) {
    listings = listings.filter(l => 
      l.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
      l.location.state.toLowerCase().includes(filters.location!.toLowerCase())
    );
  }
  
  // Apply search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    listings = listings.filter(l => 
      l.title.toLowerCase().includes(searchLower) ||
      l.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply price range filters
  if (filters.priceMin !== undefined) {
    listings = listings.filter(l => {
      const listingPrice = parsePrice(l.price);
      return listingPrice >= filters.priceMin!;
    });
  }
  
  if (filters.priceMax !== undefined) {
    listings = listings.filter(l => {
      const listingPrice = parsePrice(l.price);
      return listingPrice <= filters.priceMax!;
    });
  }
  
  // Apply rating filter
  if (filters.rating !== undefined) {
    const ratingFilter = filters.rating;
    // For rating 5, show ratings >= 4.5 (including 5.0)
    if (ratingFilter === 5) {
      listings = listings.filter(l => l.rating >= 4.5);
    } 
    // For rating 0, show ratings < 1.0
    else if (ratingFilter === 0) {
      listings = listings.filter(l => l.rating < 1);
    }
    // For other ratings, filter by range (e.g., 3 = 3.0-4.0, 4 = 4.0-4.5)
    else {
      const minRating = ratingFilter;
      const maxRating = ratingFilter + 1;
      listings = listings.filter(l => 
        l.rating >= minRating && l.rating < maxRating
      );
    }
  }
  
  // Apply featured filter
  if (filters.featured) {
    listings = listings.filter(l => l.featured);
  }
  
  // Apply verified filter
  if (filters.verified) {
    listings = listings.filter(l => l.verified);
  }
  
  // Apply open now filter
  if (filters.openNow) {
    listings = listings.filter(l => l.status === 'open');
  }
  
  // Apply offering deal filter
  if (filters.offeringDeal) {
    listings = listings.filter(l => l.popular); // Assuming popular means offering deal
  }
  
  // Apply features filter
  if (filters.features) {
    const requestedFeatures = filters.features.split(',').map(f => f.toLowerCase());
    listings = listings.filter(l => {
      const listingAmenities = l.amenities.map((a: string) => a.toLowerCase());
      // Map feature IDs to actual amenity names
      const featureMap: Record<string, string> = {
        'wifi': 'wifi',
        'parking': 'parking',
        'wheelchair': 'wheelchair access',
        'cards': 'accepts cards',
        'bike': 'bike parking',
        'electronics': 'electronics',
        'accessories': 'accessories',
        'clothing': 'clothing',
        'travel': 'travel booking',
        'support': 'tech support',
      };
      
      // Check if listing has all requested features
      return requestedFeatures.every(featureId => {
        const featureName = featureMap[featureId] || featureId;
        return listingAmenities.some(amenity => amenity.includes(featureName));
      });
    });
  }
  
  // Apply tags filter (search in title, description, and category)
  if (filters.tags) {
    const requestedTags = filters.tags.split(',').map(t => t.toLowerCase());
    listings = listings.filter(l => {
      const searchableText = `${l.title} ${l.description} ${l.category.name}`.toLowerCase();
      // Check if any requested tag matches
      return requestedTags.some(tag => searchableText.includes(tag));
    });
  }

  // Calculate pagination
  const page = filters.page || 1;
  const perPage = filters.perPage || 12;
  const total = listings.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const end = start + perPage;
  
  return {
    listings: listings.slice(start, end) as Listing[],
    total,
    page,
    perPage,
    totalPages,
  };
}

/**
 * Get single listing by slug
 */
export async function getListingBySlug(slug: string): Promise<Listing | null> {
  await delay(100);
  
  const listing = listingsData.listings.find(l => l.slug === slug);
  return listing ? (listing as Listing) : null;
}

/**
 * Get featured listings
 */
export async function getFeaturedListings(limit: number = 6): Promise<Listing[]> {
  await delay(100);
  
  // Return all listings for homepage display (not just featured ones)
  return listingsData.listings.slice(0, limit) as Listing[];
}

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  await delay(50);
  return categoriesData.categories as Category[];
}

/**
 * Get top/featured categories
 */
export async function getTopCategories(limit: number = 8): Promise<Category[]> {
  await delay(50);
  
  const categories = categoriesData.categories.filter(c => c.featured);
  return categories.slice(0, limit) as Category[];
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  await delay(50);
  
  const category = categoriesData.categories.find(c => c.slug === slug);
  return category ? (category as Category) : null;
}

/**
 * Get popular locations
 */
export async function getPopularLocations(limit: number = 4): Promise<Location[]> {
  await delay(50);
  return locationsData.locations.slice(0, limit) as Location[];
}

/**
 * Get all locations
 */
export async function getAllLocations(): Promise<Location[]> {
  await delay(50);
  return locationsData.locations as Location[];
}

/**
 * Get user dashboard statistics
 */
export async function getUserStats(userId: string) {
  await delay(100);
  
  // Mock user stats
  return {
    totalListings: 12,
    totalViews: 3456,
    totalReviews: 45,
    averageRating: 4.7,
    totalEarnings: 8920,
    chartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      views: [320, 450, 380, 520, 490, 680],
      bookings: [12, 18, 15, 22, 20, 28],
    },
  };
}

/**
 * Get user's listings
 */
export async function getUserListings(
  userId: string, 
  options: { limit?: number } = {}
): Promise<Listing[]> {
  await delay(100);
  
  // In a real app, filter by userId
  const userListings = listingsData.listings.slice(0, options.limit || 10);
  return userListings as Listing[];
}

/**
 * Search listings
 */
export async function searchListings(query: string): Promise<Listing[]> {
  await delay(150);
  
  if (!query || query.trim() === '') {
    return [];
  }
  
  const searchLower = query.toLowerCase();
  const results = listingsData.listings.filter(l => 
    l.title.toLowerCase().includes(searchLower) ||
    l.description.toLowerCase().includes(searchLower) ||
    l.category.name.toLowerCase().includes(searchLower) ||
    l.location.city.toLowerCase().includes(searchLower)
  );
  
  return results.slice(0, 10) as Listing[];
}

