'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';

function CheckoutSuccessForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [orderDetails, setOrderDetails] = useState({
    orderId: '',
    amount: 0,
    status: 'completed',
    paymentMethod: 'Credit Card',
    transactionId: '',
    completedAt: new Date().toISOString(),
  });

  useEffect(() => {
    const orderId = searchParams.get('orderId');
    const amount = parseFloat(searchParams.get('amount') || '0');
    
    if (!orderId || amount === 0) {
      router.push('/checkout');
      return;
    }

    // Generate transaction ID for demo
    const transactionId = `TXN-${Date.now().toString(36).toUpperCase()}`;
    
    setOrderDetails({
      orderId,
      amount,
      status: 'completed',
      paymentMethod: 'Credit Card',
      transactionId,
      completedAt: new Date().toISOString(),
    });
  }, [searchParams, router]);

  const handleDownloadReceipt = () => {
    // In a real app, this would generate and download a PDF receipt
    const receiptData = {
      orderId: orderDetails.orderId,
      amount: orderDetails.amount,
      customer: session?.user?.name || 'Guest User',
      email: session?.user?.email || '',
      transactionId: orderDetails.transactionId,
      date: new Date(orderDetails.completedAt).toLocaleDateString(),
    };
    
    alert('Receipt downloaded! (Demo mode)');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Checkout', href: '/checkout' },
          { label: 'Success' },
        ]}
        title="Payment Successful"
      />

      <section className="checkout-success-wrapper section-padding-strict section-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="success-content text-center">
                {/* Success Icon */}
                <div className="success-icon mb-4">
                  <div className="success-circle">
                    <i className="la la-check"></i>
                  </div>
                </div>

                {/* Success Message */}
                <h1 className="success-title mb-3">Payment Successful!</h1>
                <p className="success-message mb-4">
                  Thank you for your purchase. Your order has been processed successfully and you will receive a confirmation email shortly.
                </p>

                {/* Order Details */}
                <div className="order-summary-card">
                  <div className="card">
                    <div className="card-header bg-success text-white">
                      <h5 className="mb-0">
                        <i className="la la-receipt me-2"></i>
                        Order Confirmation
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="order-detail">
                            <label>Order ID:</label>
                            <span className="order-value">{orderDetails.orderId}</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="order-detail">
                            <label>Transaction ID:</label>
                            <span className="order-value">{orderDetails.transactionId}</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="order-detail">
                            <label>Amount Paid:</label>
                            <span className="order-value text-success">${orderDetails.amount.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="order-detail">
                            <label>Payment Method:</label>
                            <span className="order-value">{orderDetails.paymentMethod}</span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="order-detail">
                            <label>Status:</label>
                            <span className="order-value">
                              <span className="badge badge-success">Completed</span>
                            </span>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="order-detail">
                            <label>Date:</label>
                            <span className="order-value">
                              {new Date(orderDetails.completedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="next-steps mt-4">
                  <h4 className="mb-3">What's Next?</h4>
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <div className="step-card">
                        <div className="step-icon">
                          <i className="la la-envelope"></i>
                        </div>
                        <h6>Email Confirmation</h6>
                        <p className="text-muted small">Check your email for order details and receipt</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="step-card">
                        <div className="step-icon">
                          <i className="la la-dashboard"></i>
                        </div>
                        <h6>Access Dashboard</h6>
                        <p className="text-muted small">Manage your listings and account settings</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="step-card">
                        <div className="step-icon">
                          <i className="la la-headset"></i>
                        </div>
                        <h6>Need Help?</h6>
                        <p className="text-muted small">Contact our support team for assistance</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="success-actions mt-4">
                  <button
                    className="btn btn-outline-primary me-3"
                    onClick={handleDownloadReceipt}
                  >
                    <i className="la la-download me-2"></i>
                    Download Receipt
                  </button>
                  <button
                    className="btn btn-primary me-3"
                    onClick={handleBackToDashboard}
                  >
                    <i className="la la-dashboard me-2"></i>
                    Go to Dashboard
                  </button>
                  <Link href="/" className="btn btn-outline-secondary">
                    <i className="la la-home me-2"></i>
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .success-circle {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 8px 32px rgba(40, 167, 69, 0.3);
        }
        
        .success-circle i {
          font-size: 48px;
          color: white;
        }
        
        .success-title {
          color: #28a745;
          font-weight: 700;
          font-size: 2.5rem;
        }
        
        .success-message {
          font-size: 1.1rem;
          color: #6c757d;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .order-summary-card {
          max-width: 800px;
          margin: 0 auto;
        }
        
        .order-detail {
          margin-bottom: 15px;
        }
        
        .order-detail label {
          display: block;
          font-weight: 600;
          color: #495057;
          margin-bottom: 5px;
        }
        
        .order-value {
          font-size: 1.1rem;
          color: #212529;
        }
        
        .step-card {
          text-align: center;
          padding: 20px;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          height: 100%;
          transition: all 0.3s ease;
        }
        
        .step-card:hover {
          border-color: #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
        }
        
        .step-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
        }
        
        .step-icon i {
          font-size: 24px;
          color: white;
        }
        
        .success-actions {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 15px;
        }
        
        @media (max-width: 768px) {
          .success-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .success-actions .btn {
            width: 100%;
            max-width: 300px;
          }
        }
      `}</style>
    </>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <section className="checkout-success-wrapper section-padding-strict section-bg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center">
                <p className="text-muted">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    }>
      <CheckoutSuccessForm />
    </Suspense>
  );
}
