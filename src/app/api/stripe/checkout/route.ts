import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCheckoutSession, pricingPlans } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { plan, listingId } = await request.json();
    
    if (!plan || !pricingPlans[plan as keyof typeof pricingPlans]) {
      return NextResponse.json(
        { error: 'Invalid plan' },
        { status: 400 }
      );
    }

    const selectedPlan = pricingPlans[plan as keyof typeof pricingPlans];
    
    // Create Stripe price if it doesn't exist
    // In production, you'd pre-create these prices in Stripe Dashboard
    const priceId = `price_${plan}_${selectedPlan.price}`; // You'd use actual Stripe price IDs
    
    const checkoutSession = await createCheckoutSession({
      priceId,
      userId: (session.user as any).id,
      listingId,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
