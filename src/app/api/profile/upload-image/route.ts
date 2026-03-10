import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';

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

    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'profiles');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist, ignore error
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${(session.user as any).id}-${Date.now()}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Create URL for the saved file
    const imageUrl = `/uploads/profiles/${fileName}`;

    // Get current user to check for existing image
    const currentUser = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: { image: true }
    });

    // Update user's profile image in database
    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: {
        image: imageUrl,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        phone: true,
        website: true,
        location: true,
        facebook: true,
        twitter: true,
        instagram: true,
        linkedin: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Clean up old profile image if it exists
    if (currentUser?.image && currentUser.image.startsWith('/uploads/profiles/')) {
      try {
        const oldImagePath = join(process.cwd(), 'public', currentUser.image);
        await unlink(oldImagePath);
      } catch (error) {
        // Old image might not exist, ignore error
      }
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      imageUrl,
      message: 'Profile image updated successfully'
    });

  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json(
      { error: 'Failed to upload profile image' },
      { status: 500 }
    );
  }
}
