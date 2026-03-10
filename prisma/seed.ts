import { PrismaClient, UserRole, ListingStatus, PriceType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'restaurants' },
      update: {},
      create: {
        name: 'Restaurants',
        slug: 'restaurants',
        description: 'Food and dining establishments',
        icon: 'la-cutlery',
        color: '#667eea',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'hotels' },
      update: {},
      create: {
        name: 'Hotels',
        slug: 'hotels',
        description: 'Accommodation and lodging',
        icon: 'la-bed',
        color: '#28a745',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'shopping' },
      update: {},
      create: {
        name: 'Shopping',
        slug: 'shopping',
        description: 'Retail and shopping centers',
        icon: 'la-shopping-cart',
        color: '#ffc107',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'services' },
      update: {},
      create: {
        name: 'Services',
        slug: 'services',
        description: 'Professional and business services',
        icon: 'la-briefcase',
        color: '#dc3545',
        sortOrder: 4,
      },
    }),
  ]);

  // Create locations
  const locations = await Promise.all([
    prisma.location.upsert({
      where: { slug: 'new-york' },
      update: {},
      create: {
        name: 'New York',
        slug: 'new-york',
        description: 'The Big Apple',
        latitude: 40.7128,
        longitude: -74.0060,
      },
    }),
    prisma.location.upsert({
      where: { slug: 'los-angeles' },
      update: {},
      create: {
        name: 'Los Angeles',
        slug: 'los-angeles',
        description: 'City of Angels',
        latitude: 34.0522,
        longitude: -118.2437,
      },
    }),
    prisma.location.upsert({
      where: { slug: 'chicago' },
      update: {},
      create: {
        name: 'Chicago',
        slug: 'chicago',
        description: 'The Windy City',
        latitude: 41.8781,
        longitude: -87.6298,
      },
    }),
    prisma.location.upsert({
      where: { slug: 'miami' },
      update: {},
      create: {
        name: 'Miami',
        slug: 'miami',
        description: 'Magic City',
        latitude: 25.7617,
        longitude: -80.1918,
      },
    }),
  ]);

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@direo.com' },
    update: { password: hashedPassword },
    create: {
      email: 'admin@direo.com',
      name: 'Admin User',
      role: UserRole.ADMIN,
      bio: 'System administrator',
      password: hashedPassword,
    },
  });

  // Create sample users
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: { password: hashedPassword },
      create: {
        email: 'john@example.com',
        name: 'John Smith',
        bio: 'Restaurant owner and food enthusiast',
        phone: '+1-555-0123',
        website: 'https://johnsmith.com',
        location: 'New York, NY',
        password: hashedPassword,
        role: UserRole.USER,
      },
    }),
    prisma.user.upsert({
      where: { email: 'sarah@example.com' },
      update: { password: hashedPassword },
      create: {
        email: 'sarah@example.com',
        name: 'Sarah Johnson',
        bio: 'Hotel manager with 10 years experience',
        phone: '+1-555-0456',
        location: 'Los Angeles, CA',
        role: UserRole.VENDOR,
        password: hashedPassword,
      },
    }),
  ]);

  // Create sample listings
  const listings = await Promise.all([
    prisma.listing.upsert({
      where: { slug: 'modern-coworking-space-downtown' },
      update: {},
      create: {
        title: 'Modern Coworking Space Downtown',
        slug: 'modern-coworking-space-downtown',
        description: 'A premium coworking space in the heart of downtown, featuring modern amenities, high-speed internet, and a collaborative environment perfect for entrepreneurs and remote workers.',
        shortDescription: 'Premium coworking space with modern amenities',
        price: 299.00,
        priceType: PriceType.PAID,
        currency: 'USD',
        email: 'info@coworkdowntown.com',
        phone: '+1-555-0123',
        website: 'https://coworkdowntown.com',
        address: '123 Business Ave, Downtown, NY 10001',
        latitude: 40.7589,
        longitude: -73.9851,
        location: 'New York, NY',
        images: [
          '/images/listings/coworking-1.jpg',
          '/images/listings/coworking-2.jpg',
          '/images/listings/coworking-3.jpg',
        ],
        status: ListingStatus.PUBLISHED,
        featured: true,
        verified: true,
        tags: ['coworking', 'office', 'business', 'downtown'],
        amenities: ['WiFi', 'Coffee', 'Parking', 'Meeting Rooms', 'Printing'],
        views: 1250,
        clicks: 89,
        publishedAt: new Date(),
        categoryId: categories[3].id, // Services
        locationId: locations[0].id, // New York
        userId: users[0].id,
      },
    }),
    prisma.listing.upsert({
      where: { slug: 'bella-vista-restaurant' },
      update: {},
      create: {
        title: 'Bella Vista Restaurant',
        slug: 'bella-vista-restaurant',
        description: 'Authentic Italian cuisine in a romantic setting. Our chef brings traditional recipes from Tuscany to create an unforgettable dining experience.',
        shortDescription: 'Authentic Italian cuisine in romantic setting',
        price: 0,
        priceType: PriceType.FREE,
        email: 'reservations@bellavista.com',
        phone: '+1-555-0456',
        website: 'https://bellavista.com',
        address: '456 Restaurant Row, Little Italy, NY 10013',
        latitude: 40.7186,
        longitude: -73.9961,
        location: 'New York, NY',
        images: [
          '/images/listings/restaurant-1.jpg',
          '/images/listings/restaurant-2.jpg',
          '/images/listings/restaurant-3.jpg',
        ],
        status: ListingStatus.PUBLISHED,
        featured: true,
        verified: true,
        tags: ['italian', 'restaurant', 'fine-dining', 'romantic'],
        amenities: ['Outdoor Seating', 'Wine Bar', 'Private Dining', 'Valet Parking'],
        views: 2100,
        clicks: 156,
        publishedAt: new Date(),
        categoryId: categories[0].id, // Restaurants
        locationId: locations[0].id, // New York
        userId: users[1].id,
      },
    }),
    prisma.listing.upsert({
      where: { slug: 'grand-plaza-hotel' },
      update: {},
      create: {
        title: 'Grand Plaza Hotel',
        slug: 'grand-plaza-hotel',
        description: 'Luxury hotel with stunning city views, world-class amenities, and exceptional service. Perfect for business travelers and vacationers alike.',
        shortDescription: 'Luxury hotel with stunning city views',
        price: 399.00,
        priceType: PriceType.PAID,
        currency: 'USD',
        email: 'reservations@grandplaza.com',
        phone: '+1-555-0789',
        website: 'https://grandplaza.com',
        address: '789 Hotel Boulevard, Downtown, LA 90015',
        latitude: 34.0522,
        longitude: -118.2437,
        location: 'Los Angeles, CA',
        images: [
          '/images/listings/hotel-1.jpg',
          '/images/listings/hotel-2.jpg',
          '/images/listings/hotel-3.jpg',
        ],
        status: ListingStatus.PUBLISHED,
        featured: true,
        verified: true,
        tags: ['hotel', 'luxury', 'business', 'spa'],
        amenities: ['Pool', 'Spa', 'Restaurant', 'Fitness Center', 'Concierge'],
        views: 1850,
        clicks: 134,
        publishedAt: new Date(),
        categoryId: categories[1].id, // Hotels
        locationId: locations[1].id, // Los Angeles
        userId: users[1].id,
      },
    }),
  ]);

  // Create blog categories
  const blogCategories = await Promise.all([
    prisma.blogCategory.upsert({
      where: { slug: 'business' },
      update: {},
      create: {
        name: 'Business',
        slug: 'business',
        description: 'Business tips and insights',
        color: '#667eea',
      },
    }),
    prisma.blogCategory.upsert({
      where: { slug: 'lifestyle' },
      update: {},
      create: {
        name: 'Lifestyle',
        slug: 'lifestyle',
        description: 'Lifestyle and culture',
        color: '#28a745',
      },
    }),
  ]);

  // Create sample blog posts
  await Promise.all([
    prisma.blogPost.upsert({
      where: { slug: 'how-to-start-successful-restaurant' },
      update: {},
      create: {
        title: 'How to Start a Successful Restaurant Business',
        slug: 'how-to-start-successful-restaurant',
        excerpt: 'Learn the essential steps to launching a thriving restaurant business from concept to grand opening.',
        content: `Starting a restaurant is one of the most challenging yet rewarding business ventures. Here's your comprehensive guide...

## 1. Market Research
Before you even think about recipes, you need to understand your market. Research local demographics, competition, and dining trends.

## 2. Business Plan
Create a detailed business plan including financial projections, target market analysis, and operational strategies.

## 3. Location Selection
Choose a location that's accessible, visible, and fits your target demographic. Consider foot traffic, parking, and nearby competition.

## 4. Menu Development
Design a menu that reflects your concept while being profitable and manageable for your kitchen staff.

## 5. Funding
Secure adequate funding through investors, loans, or personal savings to cover startup costs and initial operating expenses.

Starting a restaurant requires passion, planning, and perseverance. With the right approach, you can build a successful dining establishment that serves your community for years to come.`,
        featuredImage: '/images/blog/restaurant-startup.jpg',
        status: 'PUBLISHED',
        publishedAt: new Date(),
        tags: ['restaurant', 'business', 'startup', 'entrepreneurship'],
        metaTitle: 'How to Start a Successful Restaurant Business - Complete Guide',
        metaDescription: 'Learn the essential steps to launching a thriving restaurant business from concept to grand opening.',
        authorId: adminUser.id,
        categoryId: blogCategories[0].id,
      },
    }),
  ]);

  console.log('✅ Database seeding completed!');
  console.log(`📊 Created:`);
  console.log(`   - ${categories.length} categories`);
  console.log(`   - ${locations.length} locations`);
  console.log(`   - ${users.length + 1} users (including admin)`);
  console.log(`   - ${listings.length} listings`);
  console.log(`   - ${blogCategories.length} blog categories`);
  console.log(`   - 1 blog post`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
