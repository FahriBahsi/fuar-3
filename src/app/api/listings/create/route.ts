import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      shortDescription,
      tagline,
      price,
      priceType,
      categoryId,
      locationId,
      address,
      latitude,
      longitude,
      phone,
      email,
      website,
      socialFields,
      faqItems,
      businessHours,
      customFields,
      images,
      videoUrl,
      tags,
      amenities,
      metaTitle,
      metaDescription,
      currency,
      status = 'pending'
    } = body;

    // Validate required fields
    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: 'Title, description, and category are required' },
        { status: 400 }
      );
    }

    // Find category by slug if categoryId is a slug
    let category;
    if (categoryId) {
      category = await prisma.category.findFirst({
        where: {
          OR: [
            { id: categoryId },
            { slug: categoryId }
          ]
        }
      });
      
      if (!category) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
    }

    // Find location by slug if locationId is a slug
    let location;
    if (locationId) {
      location = await prisma.location.findFirst({
        where: {
          OR: [
            { id: locationId },
            { slug: locationId }
          ]
        }
      });
      
      if (!location) {
        return NextResponse.json(
          { error: 'Invalid location' },
          { status: 400 }
        );
      }
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

    // Ensure category was found
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 400 }
      );
    }

    // Create the listing
    const listing = await prisma.listing.create({
      data: {
        title,
        slug,
        description,
        shortDescription: shortDescription || description.substring(0, 200),
        price: price ? parseFloat(price.toString()) : null,
        priceType: priceType === 'hourly' ? 'PAID' : (priceType === 'free' ? 'FREE' : (priceType === 'contact' ? 'CONTACT' : 'FREE')),
        categoryId: category.id,
        locationId: location?.id,
        address,
        latitude: latitude ? parseFloat(latitude.toString()) : null,
        longitude: longitude ? parseFloat(longitude.toString()) : null,
        phone,
        email,
        website,
        status: status === 'published' ? 'PUBLISHED' : 'DRAFT',
        userId: (session.user as any).id,
        hours: businessHours ? businessHours : null,
        images: images ? images.map((img: any) => img.url || img.name) : [],
        tags: tags || [],
        facebook: socialFields?.find((s: any) => s.platform === 'facebook')?.url,
        twitter: socialFields?.find((s: any) => s.platform === 'twitter')?.url,
        instagram: socialFields?.find((s: any) => s.platform === 'instagram')?.url,
        linkedin: socialFields?.find((s: any) => s.platform === 'linkedin')?.url,
        amenities: amenities || [],
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || shortDescription,
        currency: currency || 'USD',
      },
      include: {
        category: true,
        locationRef: true,
        user: true,
      },
    });

    return NextResponse.json({
      success: true,
      listing,
      message: 'Listing created successfully'
    });

  } catch (error) {
    console.error('Error creating listing:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    return NextResponse.json(
      { 
        error: 'Failed to create listing',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
