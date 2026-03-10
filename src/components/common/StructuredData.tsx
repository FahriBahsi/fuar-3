import React from 'react';
import type { Listing } from '@/types/listing';

interface ListingStructuredDataProps {
  listing: Listing;
}

/**
 * Structured Data (JSON-LD) for Listing
 * Helps search engines understand the content
 */
export function ListingStructuredData({ listing }: ListingStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: listing.title,
    description: listing.description,
    image: listing.images?.length ? listing.images : [listing.image],
    address: {
      '@type': 'PostalAddress',
      streetAddress: listing.location.address,
      addressLocality: listing.location.city,
      addressRegion: listing.location.state,
      postalCode: listing.location.zip,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: listing.location.lat,
      longitude: listing.location.lng,
    },
    telephone: listing.contact?.phone,
    email: listing.contact?.email,
    url: listing.contact?.website,
    priceRange: typeof listing.price === 'number' ? `$${listing.price}` : listing.price,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: listing.rating,
      reviewCount: listing.reviews,
      bestRating: 5,
      worstRating: 1,
    },
    openingHoursSpecification: listing.hours
      ? Object.entries(listing.hours)
          .filter(([_, value]) => value !== 'closed')
          .map(([day, hours]) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: day.charAt(0).toUpperCase() + day.slice(1),
            opens: typeof hours === 'object' ? hours.open : undefined,
            closes: typeof hours === 'object' ? hours.close : undefined,
          }))
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{ name: string; url: string }>;
}

/**
 * Breadcrumb Structured Data
 */
export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Organization Structured Data (for homepage)
 */
export function OrganizationStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Direo',
    description: 'Directory & Listing Platform',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/images/Logo.png`,
    sameAs: [
      'https://facebook.com/direo',
      'https://twitter.com/direo',
      'https://instagram.com/direo',
      'https://linkedin.com/company/direo',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'support@direo.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Website Search Box Structured Data
 */
export function SearchBoxStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/listings?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

