export interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    id: string;
    name: string;
    slug: string;
    icon: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
    lat: number;
    lng: number;
  };
  price: number | string; // Support both numbers and $$$$ format
  priceType: 'hourly' | 'daily' | 'monthly' | 'yearly';
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  featured: boolean;
  popular: boolean;
  new: boolean;
  verified: boolean;
  status: 'open' | 'closed';
  author: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  amenities: string[];
  hours: {
    [key: string]: { open: string; close: string } | 'closed';
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  views?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListingsResponse {
  listings: Listing[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface ListingFilters {
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  featured?: boolean;
  verified?: boolean;
  page?: number;
  perPage?: number;
  search?: string;
  features?: string; // Comma-separated feature IDs
  tags?: string; // Comma-separated tag IDs
  openNow?: boolean;
  offeringDeal?: boolean;
}

