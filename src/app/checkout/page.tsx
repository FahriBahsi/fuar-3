'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Breadcrumb from '@/components/common/Breadcrumb';
import StripePaymentForm from '@/components/payment/StripePaymentForm';
import { apiUrl } from '@/lib/utils';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  selected: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  
  // Plans state
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: 'basic',
      name: 'Basic Plan',
      description: 'Perfect for individuals and small businesses to get started.',
      price: 45.00,
      selected: true,
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      description: 'Advanced features for growing businesses and professionals.',
      price: 105.00,
      selected: true,
    },
  ]);

  // Payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Make payment directly to our bank account. Use ORDER ID as reference.',
      icon: 'la la-university',
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Pay securely with your PayPal account.',
      icon: 'la la-paypal',
    },
    {
      id: 'stripe',
      name: 'Credit/Debit Card',
      description: 'Pay securely with your credit or debit card using Stripe.',
      icon: 'la la-credit-card',
    },
  ];

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('bank');
  const [totalAmount, setTotalAmount] = useState(0);
  const [stripeClientSecret, setStripeClientSecret] = useState<string>('');
  const [stripeOrderId, setStripeOrderId] = useState<string>('');
  const [showStripeForm, setShowStripeForm] = useState(false);
  const [stripeConfigured, setStripeConfigured] = useState(false);

  // Calculate total amount
  useEffect(() => {
    const total = plans
      .filter(plan => plan.selected)
      .reduce((sum, plan) => sum + plan.price, 0);
    setTotalAmount(total);
  }, [plans]);

  // Generate order ID
  useEffect(() => {
    const generateOrderId = () => {
      const timestamp = Date.now().toString(36);
      const random = Math.random().toString(36).substr(2, 5);
      return `ORD-${timestamp}-${random}`.toUpperCase();
    };
    setOrderId(generateOrderId());
  }, []);

  // Check Stripe configuration
  useEffect(() => {
    const checkStripeConfig = async () => {
      try {
        // Try to create a test payment intent to check if Stripe is configured
        const response = await fetch(apiUrl('/api/stripe/create-payment-intent'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            orderId: 'test-config-check',
            plans: [{ id: 'test', name: 'Test', price: 1 }],
            totalAmount: 1,
            paymentMethod: 'stripe',
          }),
        });
        
        if (response.ok) {
          setStripeConfigured(true);
        } else {
          setStripeConfigured(false);
        }
      } catch (error: any) {
        setStripeConfigured(false);
      }
    };

    checkStripeConfig();
  }, []);

  // Handle plan selection
  const handlePlanToggle = (planId: string) => {
    setPlans(prev => prev.map(plan => 
      plan.id === planId ? { ...plan, selected: !plan.selected } : plan
    ));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  // Handle checkout submission
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      router.push('/auth/login?redirect=/checkout');
      return;
    }

    if (totalAmount === 0) {
      alert('Please select at least one plan.');
      return;
    }

    setIsProcessing(true);

    try {
      const selectedPlans = plans.filter(plan => plan.selected);
      
      // Handle different payment methods
      if (selectedPaymentMethod === 'stripe') {
        // Create Stripe payment intent
        const response = await fetch(apiUrl('/api/stripe/create-payment-intent'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            orderId,
            plans: selectedPlans,
            totalAmount,
            paymentMethod: selectedPaymentMethod,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          // If Stripe is not configured, fall back to regular order creation
          if (result.error && result.error.includes('Invalid API Key')) {
            alert('Stripe is not configured. Using demo payment processing instead.');
            setStripeConfigured(false);
            // Fall through to regular order creation
          } else {
            throw new Error(result.error || 'Failed to create payment intent');
          }
        } else {
          // Set Stripe client secret and show form
          setStripeClientSecret(result.clientSecret);
          setStripeOrderId(result.orderId);
          setShowStripeForm(true);
          return; // Exit required for Stripe flow
        }
        
      } else {
        // Handle other payment methods (PayPal, Bank Transfer)
        const response = await fetch(apiUrl('/api/checkout/create-order'), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            orderId,
            plans: selectedPlans,
            totalAmount,
            paymentMethod: selectedPaymentMethod,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to create order');
        }

        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Redirect to success page with order details
        router.push(`/checkout/success?orderId=${orderId}&amount=${totalAmount}`);
      }
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle successful Stripe payment
  const handleStripeSuccess = (orderId: string, amount: number) => {
    router.push(`/checkout/success?orderId=${orderId}&amount=${amount}`);
  };

  // Handle Stripe payment error
  const handleStripeError = (error: string) => {
    alert(`Payment failed: ${error}`);
    setShowStripeForm(false);
    setStripeClientSecret('');
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Checkout' },
        ]}
        title="Checkout"
      />

      <section className="checkout-wrapper section-padding-strict section-bg">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="checkout-form">
                <form onSubmit={handleCheckout}>
                  {/* Order Summary */}
                  <div className="checkout-table table-responsive mb-4">
                    <table id="directorist-checkout-table" className="table table-bordered">
                      <thead>
                        <tr>
                          <th colSpan={2}>Selected Plans</th>
                          <th><strong>Price</strong></th>
                        </tr>
                      </thead>
                      <tbody>
                        {plans?.map((plan) => (
                          <tr key={plan.id}>
                            <td>
                              <div className="custom-control custom-checkbox checkbox-outline checkbox-outline-primary custom-control-inline">
                                <input
                                  type="checkbox"
                                  className="custom-control-input"
                                  id={`plan_${plan.id}`}
                                  checked={plan.selected}
                                  onChange={() => handlePlanToggle(plan.id)}
                                />
                                <label className="custom-control-label" htmlFor={`plan_${plan.id}`}></label>
                              </div>
                            </td>
                            <td>
                              <h4>{plan.name}</h4>
                              <p className="text-muted">{plan.description}</p>
                            </td>
                            <td>
                              <strong>${plan.price.toFixed(2)}</strong>
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-light">
                          <td colSpan={2} className="text-right vertical-middle">
                            <strong>Total Amount</strong>
                          </td>
                          <td className="vertical-middle">
                            <div id="atbdp_checkout_total_amount" className="h4 text-primary">
                              ${totalAmount.toFixed(2)}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Payment Methods */}
                  <div className="atbd_content_module" id="directorist_payment_gateways">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <i className="la la-credit-card me-2"></i>
                          Choose Payment Method
                        </h4>
                      </div>
                    </div>

                    <div className="atbdb_content_module_contents">
                      {!stripeConfigured && selectedPaymentMethod === 'stripe' && (
                        <div className="alert alert-warning mb-3">
                          <i className="la la-exclamation-triangle me-2"></i>
                          <strong>Stripe Not Configured:</strong> Stripe payment gateway is not properly configured. 
                          <a href="/admin/stripe-config" className="alert-link ms-1">Configure Stripe</a> or choose another payment method.
                        </div>
                      )}
                      
                      <div className="row">
                        {paymentMethods?.map((method) => (
                          <div key={method.id} className="col-md-4 mb-3">
                            <div className={`payment-method-card ${selectedPaymentMethod === method.id ? 'selected' : ''} ${method.id === 'stripe' && !stripeConfigured ? 'disabled' : ''}`}>
                              <div className="custom-control custom-radio">
                                <input
                                  type="radio"
                                  id={`payment_${method.id}`}
                                  name="payment_gateway"
                                  className="custom-control-input"
                                  checked={selectedPaymentMethod === method.id}
                                  onChange={() => handlePaymentMethodChange(method.id)}
                                  disabled={method.id === 'stripe' && !stripeConfigured}
                                />
                                <label className="custom-control-label" htmlFor={`payment_${method.id}`}>
                                  <div className="payment-method-content">
                                    <i className={`${method.icon} payment-icon`}></i>
                                    <h6>{method.name}</h6>
                                    <p className="text-muted small">{method.description}</p>
                                    {method.id === 'stripe' && !stripeConfigured && (
                                      <small className="text-warning">
                                        <i className="la la-exclamation-triangle me-1"></i>
                                        Not configured
                                      </small>
                                    )}
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Information */}
                  <div className="atbd_content_module mt-4">
                    <div className="atbd_content_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <i className="la la-info-circle me-2"></i>
                          Order Information
                        </h4>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Order ID</label>
                            <input
                              type="text"
                              className="form-control"
                              value={orderId}
                              readOnly
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label className="form-label">Customer</label>
                            <input
                              type="text"
                              className="form-control"
                              value={session?.user?.name || 'Guest User'}
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stripe Payment Form */}
                  {showStripeForm && stripeClientSecret && (
                    <div className="atbd_content_module mt-4">
                      <div className="atbd_content_module__tittle_area">
                        <div className="atbd_area_title">
                          <h4>
                            <i className="la la-credit-card me-2"></i>
                            Complete Your Payment
                          </h4>
                        </div>
                      </div>
                      <div className="atbdb_content_module_contents">
                        <StripePaymentForm
                          clientSecret={stripeClientSecret}
                          orderId={stripeOrderId}
                          totalAmount={totalAmount}
                          onSuccess={handleStripeSuccess}
                          onError={handleStripeError}
                        />
                        <div className="text-center mt-3">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              setShowStripeForm(false);
                              setStripeClientSecret('');
                            }}
                          >
                            <i className="la la-arrow-left me-1"></i>
                            Back to Payment Options
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!showStripeForm && (
                    <div className="text-end mt-4">
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-3"
                        onClick={() => router.back()}
                      >
                        <i className="la la-arrow-left me-1"></i>
                        Back to Pricing
                      </button> &nbsp; &nbsp;
                      <button
                        type="submit"
                        id="atbdp_checkout_submit_btn"
                        className="btn btn-primary"
                        disabled={isProcessing || totalAmount === 0}
                      >
                        {isProcessing ? (
                          <>
                            <i className="la la-spinner la-spin me-2"></i>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <i className="la la-credit-card me-2"></i>
                            Pay ${totalAmount.toFixed(2)}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="col-lg-4">
              <div className="checkout-summary">
                <div className="atbd_content_module">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <i className="la la-shopping-cart me-2"></i>
                        Order Summary
                      </h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    <div className="order-summary-content">
                      {plans?.filter(plan => plan.selected)?.map((plan) => (
                        <div key={plan.id} className="order-item mb-3">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6 className="mb-1">{plan.name}</h6>
                              <small className="text-muted">{plan.description}</small>
                            </div>
                            <div className="text-end">
                              <strong>${plan.price.toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      <hr />
                      
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Total:</h5>
                        <h4 className="mb-0 text-primary">${totalAmount.toFixed(2)}</h4>
                      </div>
                      
                      <div className="mt-3">
                        <div className="order-details">
                          <small className="text-muted d-block">
                            <i className="la la-tag me-1"></i>
                            Order ID: {orderId}
                          </small>
                          <small className="text-muted d-block">
                            <i className="la la-clock me-1"></i>
                            Payment Method: {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Notice */}
                <div className="atbd_content_module mt-4">
                  <div className="atbd_content_module__tittle_area">
                    <div className="atbd_area_title">
                      <h4>
                        <i className="la la-shield me-2"></i>
                        Secure Payment
                      </h4>
                    </div>
                  </div>
                  <div className="atbdb_content_module_contents">
                    <div className="security-notice">
                      <p className="text-muted small">
                        <i className="la la-lock me-2"></i>
                        Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                      </p>
                      <div className="security-badges">
                        <span className="badge badge-success me-2">SSL Secured</span>
                        <span className="badge badge-primary me-2">PCI Compliant</span>
                        <span className="badge badge-info">256-bit Encryption</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .payment-method-card {
          border: 2px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .payment-method-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }
        
        .payment-method-card.selected {
          border-color: #667eea;
          background-color: rgba(102, 126, 234, 0.05);
        }
        
        .payment-method-card.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          border-color: #e9ecef;
          background-color: #f8f9fa;
        }
        
        .payment-method-card.disabled:hover {
          border-color: #e9ecef;
          box-shadow: none;
        }
        
        .payment-icon {
          font-size: 24px;
          color: #667eea;
          margin-bottom: 10px;
        }
        
        .payment-method-content {
          text-align: center;
        }
        
        .order-item {
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
        }
        
        .security-badges {
          margin-top: 15px;
        }
        
        /* Stripe Payment Form Styles */
        .stripe-payment-form {
          max-width: 500px;
          margin: 0 auto;
        }
        
        .payment-element-container {
          border: 1px solid #e1e5e9;
          border-radius: 12px;
          padding: 20px;
          background-color: #fafbfc;
        }
        
        .stripe-security-notice {
          text-align: center;
          padding: 15px;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
        }
        
        .alert {
          border-radius: 8px;
          padding: 12px 16px;
          margin-bottom: 16px;
        }
        
        .alert-success {
          background-color: #d1edff;
          border: 1px solid #74c0fc;
          color: #0c5460;
        }
        
        .alert-danger {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }
      `}</style>
    </>
  );
}