import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';

export const metadata: Metadata = {
  title: 'Pricing Plans - Choose Your Plan',
  description: 'Flexible pricing plans for businesses of all sizes',
};

export default function PricingPage() {
  const plans = [
    {
      name: 'Basic',
      price: 0,
      period: 'Free Forever',
      description: 'Perfect for getting started',
      features: [
        { included: true, text: '1 Listing' },
        { included: true, text: 'Basic Support' },
        { included: true, text: 'Standard Visibility' },
        { included: false, text: 'Featured Badge' },
        { included: false, text: 'Analytics' },
        { included: false, text: 'Priority Support' },
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline-primary',
      popular: false,
    },
    {
      name: 'Professional',
      price: 29,
      period: 'per month',
      description: 'For growing businesses',
      features: [
        { included: true, text: '5 Listings' },
        { included: true, text: 'Priority Support' },
        { included: true, text: 'Enhanced Visibility' },
        { included: true, text: 'Featured Badge' },
        { included: true, text: 'Basic Analytics' },
        { included: false, text: 'Advanced Analytics' },
      ],
      buttonText: 'Start Free Trial',
      buttonVariant: 'primary',
      popular: true,
    },
    {
      name: 'Business',
      price: 79,
      period: 'per month',
      description: 'For established businesses',
      features: [
        { included: true, text: 'Unlimited Listings' },
        { included: true, text: '24/7 Premium Support' },
        { included: true, text: 'Maximum Visibility' },
        { included: true, text: 'Featured Badge' },
        { included: true, text: 'Advanced Analytics' },
        { included: true, text: 'API Access' },
      ],
      buttonText: 'Contact Sales',
      buttonVariant: 'outline-primary',
      popular: false,
    },
  ];

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Pricing' },
        ]}
        title="Pricing Plans"
      />

      {/* Pricing Section */}
      <section className="pricing-wrapper section-padding-strict">
        <div className="container">
          {/* Section Header */}
          <div className="row mb-5">
            <div className="col-lg-8 offset-lg-2 text-center">
              <h2 className="mb-3">Choose Your Perfect Plan</h2>
              <p className="lead text-muted">
                Flexible pricing options for businesses of all sizes. Start free and upgrade
                as you grow.
              </p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="row">
            {plans.map((plan) => (
              <div key={plan.name} className="col-lg-4 mb-4">
                <div className={`pricing-card ${plan.popular ? 'popular' : ''}`}>
                  {plan.popular && (
                    <div className="popular-badge">
                      <span>Most Popular</span>
                    </div>
                  )}
                  
                  <div className="pricing-header text-center">
                    <h3 className="plan-name">{plan.name}</h3>
                    <div className="plan-price">
                      <span className="currency">$</span>
                      <span className="amount">{plan.price}</span>
                      {plan.price > 0 && <span className="period">/{plan.period}</span>}
                    </div>
                    {plan.price === 0 && (
                      <p className="plan-period">{plan.period}</p>
                    )}
                    <p className="plan-description text-muted">{plan.description}</p>
                  </div>

                  <div className="pricing-body">
                    <ul className="features-list">
                      {plan.features.map((feature, index) => (
                        <li key={index} className={feature.included ? '' : 'disabled'}>
                          <i
                            className={`la ${
                              feature.included ? 'la-check text-success' : 'la-times text-muted'
                            }`}
                          ></i>
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pricing-footer text-center">
                    <Link
                      href={plan.price === 0 ? '/auth/register' : '/checkout'}
                      className={`btn btn-${plan.buttonVariant} btn-block`}
                    >
                      {plan.buttonText}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="row mt-5 pt-5 border-top">
            <div className="col-12 mb-4">
              <h3 className="text-center">Frequently Asked Questions</h3>
            </div>
            <div className="col-lg-6">
              <div className="faq-item mb-4">
                <h6>Can I change my plan later?</h6>
                <p className="text-muted">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect
                  immediately.
                </p>
              </div>
              <div className="faq-item mb-4">
                <h6>Is there a free trial?</h6>
                <p className="text-muted">
                  Yes, all paid plans come with a 14-day free trial. No credit card required.
                </p>
              </div>
              <div className="faq-item mb-4">
                <h6>What payment methods do you accept?</h6>
                <p className="text-muted">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans.
                </p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="faq-item mb-4">
                <h6>Can I cancel anytime?</h6>
                <p className="text-muted">
                  Absolutely! Cancel your subscription anytime with no cancellation fees.
                </p>
              </div>
              <div className="faq-item mb-4">
                <h6>Do you offer discounts for annual plans?</h6>
                <p className="text-muted">
                  Yes, save 20% when you pay annually. Contact us for enterprise pricing.
                </p>
              </div>
              <div className="faq-item mb-4">
                <h6>Is customer support included?</h6>
                <p className="text-muted">
                  All plans include email support. Premium plans get priority 24/7 support.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="row mt-5">
            <div className="col-12">
              <div className="text-center p-5" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
              }}>
                <h3 className="text-white mb-3">Need a Custom Plan?</h3>
                <p className="text-white mb-4">
                  Contact our sales team for enterprise solutions and custom pricing
                </p>
                <Link href="/contact" className="btn btn-light btn-lg">
                  <i className="la la-envelope"></i> Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

