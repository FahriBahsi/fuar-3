import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/auth';
import { unlink } from 'fs/promises';
import { join } from 'path';

export async function PUT(request: NextRequest) {
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
      name,
      bio,
      phone,
      website,
      location,
      facebook,
      twitter,
      instagram,
      linkedin,
      currentPassword,
      newPassword,
      confirmPassword,
      email
    } = body;

    // Get current user data
    const currentUser = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Update basic profile information
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (phone !== undefined) updateData.phone = phone;
    if (website !== undefined) updateData.website = website;
    if (location !== undefined) updateData.location = location;
    if (facebook !== undefined) updateData.facebook = facebook;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (instagram !== undefined) updateData.instagram = instagram;
    if (linkedin !== undefined) updateData.linkedin = linkedin;

    // Handle email update
    if (email && email !== currentUser.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email is already taken' },
          { status: 400 }
        );
      }
      
      updateData.email = email;
      updateData.emailVerified = null; // Reset email verification
    }

    // Handle password update
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required to change password' },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { error: 'New password and confirm password do not match' },
          { status: 400 }
        );
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }

      // Verify current password
      if (currentUser.password) {
        const isCurrentPasswordValid = await verifyPassword(
          currentPassword,
          currentUser.password
        );
        
        if (!isCurrentPasswordValid) {
          return NextResponse.json(
            { error: 'Current password is incorrect' },
            { status: 400 }
          );
        }
      }

      // Hash new password
      updateData.password = await hashPassword(newPassword);
    }

    // Check if we're removing the image and delete the file
    if (updateData.image === null) {
      const currentUser = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
        select: { image: true }
      });
      
      if (currentUser?.image && currentUser.image.startsWith('/uploads/profiles/')) {
        try {
          const oldImagePath = join(process.cwd(), 'public', currentUser.image);
          await unlink(oldImagePath);
        } catch (error) {
          // Old image might not exist, ignore error
        }
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: updateData,
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

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}

// GET endpoint to fetch current user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
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

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}
