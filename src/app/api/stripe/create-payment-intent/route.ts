import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
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

    // If payment method is not Stripe, handle other payment methods
    if (paymentMethod !== 'stripe') {
      return NextResponse.json(
        { error: 'This endpoint is only for Stripe payments' },
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
        paymentMethod: 'STRIPE',
        status: 'PENDING',
      },
      create: {
        orderId,
        userId,
        items: JSON.stringify(plans),
        totalAmount,
        paymentMethod: 'STRIPE',
        status: 'PENDING',
        createdAt: new Date(),
      },
    });

    // Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        userId: userId,
        originalOrderId: orderId,
      },
      description: `Payment for order ${orderId}`,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Update order with payment intent ID
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentId: paymentIntent.id,
      },
    });

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      paymentIntentId: paymentIntent.id,
    });

  } catch (error) {
    console.error('Stripe payment intent error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create payment intent',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
