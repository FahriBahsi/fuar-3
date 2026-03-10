import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, plans, totalAmount, paymentMethod } = body;

    // Validate required fields
    if (!orderId || !plans || !totalAmount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get user ID from session
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    // Create or get existing order in database
    const order = await prisma.order.upsert({
      where: { orderId },
      update: {
        // If order exists, update with latest details
        items: JSON.stringify(plans),
        totalAmount,
        paymentMethod,
        status: 'PENDING',
      },
      create: {
        orderId,
        userId,
        items: JSON.stringify(plans),
        totalAmount,
        paymentMethod,
        status: 'PENDING',
        createdAt: new Date(),
      },
    });

    // In a real application, you would:
    // 1. Process payment through the selected gateway (Stripe, PayPal, etc.)
    // 2. Update order status based on payment result
    // 3. Send confirmation email
    // 4. Update user subscription/plan

    // For demo purposes, we'll simulate a successful payment
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'COMPLETED',
        paymentId: `PAY-${Date.now()}`,
        completedAt: new Date(),
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        orderId: order.id,
        amount: totalAmount,
        paymentMethod,
        status: 'COMPLETED',
        transactionId: `TXN-${Date.now()}`,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      order: updatedOrder,
      message: 'Order created successfully',
    });

  } catch (error: any) {
    console.error('Checkout error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    // Get user ID from session
    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found in session' },
        { status: 400 }
      );
    }

    if (orderId) {
      // Get specific order
      const order = await prisma.order.findFirst({
        where: {
          orderId,
          userId,
        },
        include: {
          transactions: true,
        },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ order });
    } else {
      // Get user's orders
      const orders = await prisma.order.findMany({
        where: {
          userId,
        },
        include: {
          transactions: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return NextResponse.json({ orders });
    }

  } catch (error: any) {
    console.error('Get orders error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
