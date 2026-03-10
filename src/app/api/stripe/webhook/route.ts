import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;

      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;

      default:
        // Unhandled event type - log to error but don't fail
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: any) {
  try {
    const { orderId, userId, originalOrderId } = paymentIntent.metadata;

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        orderId: orderId,
        amount: paymentIntent.amount / 100, // Convert from cents
        paymentMethod: 'STRIPE',
        status: 'COMPLETED',
        transactionId: paymentIntent.id,
        gatewayResponse: JSON.stringify(paymentIntent),
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  try {
    const { orderId } = paymentIntent.metadata;

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'FAILED',
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        orderId: orderId,
        amount: paymentIntent.amount / 100,
        paymentMethod: 'STRIPE',
        status: 'FAILED',
        transactionId: paymentIntent.id,
        gatewayResponse: JSON.stringify(paymentIntent),
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: any) {
  try {
    const { orderId } = paymentIntent.metadata;

    // Update order status
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        orderId: orderId,
        amount: paymentIntent.amount / 100,
        paymentMethod: 'STRIPE',
        status: 'CANCELLED',
        transactionId: paymentIntent.id,
        gatewayResponse: JSON.stringify(paymentIntent),
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}