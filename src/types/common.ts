export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  country: string;
  image: string;
  count: number;
  featured: boolean;
}

export interface Review {
  id: string;
  listingId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface DashboardStats {
  totalListings: number;
  totalViews: number;
  totalReviews: number;
  averageRating: number;
  totalEarnings: number;
  chartData?: {
    labels: string[];
    views: number[];
    bookings: number[];
  };
}

