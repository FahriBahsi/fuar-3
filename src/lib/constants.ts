export const SITE_CONFIG = {
  name: 'Direo',
  description: 'Directory & Listing Template',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  author: 'Direo Team',
  links: {
    facebook: 'https://facebook.com',
    twitter: 'https://twitter.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
  },
};

export const NAVIGATION_ITEMS = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Listings',
    href: '/listings',
    submenu: [
      { label: 'All Listings', href: '/listings' },
      { label: 'List View', href: '/listings/list' },
      { label: 'Add Listing', href: '/add-listing' },
    ],
  },
  {
    label: 'Categories',
    href: '/categories',
  },
  {
    label: 'Locations',
    href: '/locations',
  },
  {
    label: 'Blog',
    href: '/blog',
    submenu: [
      { label: 'Blog Right Sidebar', href: '/blog/right-sidebar' },
      { label: 'Blog Grid Layout', href: '/blog/grid' },
      { label: 'Blog Details', href: '/blog/details' },
    ],
  },
  {
    label: 'Pages',
    href: '#',
    submenu: [
      { label: 'Author Profile', href: '/author-profile' },
      { label: 'Author Dashboard', href: '/dashboard-listings' },
      { label: 'Pricing Plans', href: '/pricing-plans' },
      { label: 'Checkout', href: '/checkout' },
      { label: 'Invoice', href: '/invoice' },
      { label: 'FAQ', href: '/faq' },
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Products Cards', href: '/cards' },
      { label: 'Header Styles', href: '/headers' },
    ],
  },
];

export const PRICE_RANGES = [
  { min: 0, max: 50, label: 'Under $50' },
  { min: 50, max: 100, label: '$50 - $100' },
  { min: 100, max: 200, label: '$100 - $200' },
  { min: 200, max: 500, label: '$200 - $500' },
  { min: 500, max: Infinity, label: '$500+' },
];

export const RATINGS = [5, 4, 3, 2, 1];

export const PER_PAGE_OPTIONS = [12, 24, 36, 48];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
];

