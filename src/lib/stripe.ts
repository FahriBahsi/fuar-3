import Stripe from 'stripe';

// Lazy initialization of Stripe instance
let stripeInstance: Stripe | null = null;

// Get or create Stripe instance (lazy initialization)
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables');
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2025-10-29.clover',
    });
  }
  return stripeInstance;
}

// Create a recursive proxy for nested property access
function createStripeProxy(): Stripe {
  return new Proxy({} as Stripe, {
    get(_target, prop) {
      const stripe = getStripe();
      const value = stripe[prop as keyof Stripe];
      // If the value is an object, wrap it in a proxy too for nested access
      if (value && typeof value === 'object' && value !== null) {
        return new Proxy(value as any, {
          get(_target, nestedProp) {
            return (value as any)[nestedProp];
          },
        });
      }
      return value;
    },
  });
}

// Export stripe - uses lazy initialization via proxy
// This prevents build-time errors when env vars are not available
export const stripe: Stripe = (() => {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    // If we have a key, try to initialize (will work at runtime)
    if (secretKey) {
      return new Stripe(secretKey, {
        apiVersion: '2025-10-29.clover',
      });
    }
    // During build without key, return proxy that initializes on access
    return createStripeProxy();
  } catch (error) {
    // If initialization fails (e.g., invalid key format), return proxy
    // The actual error will be thrown when Stripe is actually used
    return createStripeProxy();
  }
})();

// Stripe configuration
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
};

// Pricing plans for premium listings
export const pricingPlans = {
  basic: {
    name: 'Basic Listing',
    price: 29,
    currency: 'usd',
    interval: 'month',
    features: [
      'Standard listing visibility',
      'Basic contact information',
      'Up to 5 photos',
      'Email support',
    ],
  },
  premium: {
    name: 'Premium Listing',
    price: 79,
    currency: 'usd',
    interval: 'month',
    features: [
      'Featured listing placement',
      'Enhanced visibility',
      'Up to 20 photos',
      'Video support',
      'Priority support',
      'Analytics dashboard',
    ],
  },
  enterprise: {
    name: 'Enterprise Listing',
    price: 199,
    currency: 'usd',
    interval: 'month',
    features: [
      'Top placement priority',
      'Maximum visibility',
      'Unlimited photos',
      'Video & virtual tours',
      'Dedicated account manager',
      'Advanced analytics',
      'Custom integrations',
    ],
  },
};

// Create Stripe checkout session
export async function createCheckoutSession({
  priceId,
  userId,
  listingId,
  successUrl,
  cancelUrl,
}: {
  priceId: string;
  userId: string;
  listingId?: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: undefined, // Will be set from user data
    metadata: {
      userId,
      listingId: listingId || '',
    },
  });

  return session;
}

// Create Stripe price
export async function createPrice({
  amount,
  currency = 'usd',
  interval = 'month',
  productName,
}: {
  amount: number;
  currency?: string;
  interval?: 'month' | 'year';
  productName: string;
}) {
  // First create a product
  const product = await stripe.products.create({
    name: productName,
  });

  // Then create a price for that product
  const price = await stripe.prices.create({
    unit_amount: amount * 100, // Stripe uses cents
    currency,
    recurring: {
      interval,
    },
    product: product.id,
  });

  return { product, price };
}

// Handle successful payment
export async function handlePaymentSuccess(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  
  if (session.payment_status === 'paid') {
    const { userId, listingId } = session.metadata || {};
    
    // Update user subscription status
    if (userId) {
      // Here you would update your database to mark the user as having an active subscription
      // For example, update the user's subscription status in Prisma
    }
    
    // If this is for a specific listing, update its status
    if (listingId) {
      // Update listing to premium status
    }
    
    return {
      success: true,
      userId,
      listingId,
      session,
    };
  }
  
  return { success: false };
}

// Create customer portal session
export async function createCustomerPortalSession(customerId: string, returnUrl: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });
  
  return session;
}

// Verify webhook signature
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string,
  secret: string
) {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, secret);
    return event;
  } catch (error) {
    throw new Error(`Webhook signature verification failed: ${error}`);
  }
}

// Handle webhook events
export async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handlePaymentSuccess(session.id);
      break;
      
    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      // Handle subscription updates
      break;
      
    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      // Handle subscription cancellation
      break;
      
    case 'invoice.payment_succeeded':
      const invoice = event.data.object as Stripe.Invoice;
      // Handle successful invoice payment
      break;
      
    case 'invoice.payment_failed':
      const failedInvoice = event.data.object as Stripe.Invoice;
      // Handle failed invoice payment
      break;
      
    default:
      // Unhandled event type - log to error but don't fail
      break;
  }
}
