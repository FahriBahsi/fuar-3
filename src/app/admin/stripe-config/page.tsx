'use client';

import { useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';

export default function StripeConfigPage() {
  const [config, setConfig] = useState({
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  });

  // Check if keys are placeholder values
  const isPlaceholderKey = (key: string) => {
    return key.includes('your-') || key.includes('_test_key_') || key.includes('_test_webhook_') || key === '';
  };

  const hasValidKeys = !isPlaceholderKey(config.publishableKey) && 
                      !isPlaceholderKey(config.secretKey) && 
                      !isPlaceholderKey(config.webhookSecret);

  const handleInputChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Admin', href: '/admin' },
          { label: 'Stripe Configuration' },
        ]}
        title="Stripe Configuration"
      />

      <section className="dashboard-wrapper section-bg p-bottom-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="dashboard_area">
                <div className="dashboard_contents">
                  <div className="atbd_author_module">
                    <div className="atbd_author_module__tittle_area">
                      <div className="atbd_area_title">
                        <h4>
                          <i className="la la-credit-card me-2"></i>
                          Stripe Payment Gateway Configuration
                        </h4>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents">
                      {hasValidKeys ? (
                        <div className="alert alert-success">
                          <i className="la la-check-circle me-2"></i>
                          <strong>✅ Stripe Configured:</strong> Your Stripe keys are properly configured and payment processing should work.
                        </div>
                      ) : (
                        <div className="alert alert-warning">
                          <i className="la la-exclamation-triangle me-2"></i>
                          <strong>⚠️ Stripe Not Configured:</strong> The current Stripe keys are placeholder values. You need to replace them with real Stripe API keys for payment processing to work.
                        </div>
                      )}

                      <div className="row">
                        <div className="col-lg-8">
                          <div className="card">
                            <div className="card-header">
                              <h5>
                                <i className="la la-key me-2"></i>
                                Stripe API Keys
                              </h5>
                            </div>
                            <div className="card-body">
                              <div className="form-group mb-3">
                                <label htmlFor="publishableKey" className="form-label">
                                  Publishable Key
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  id="publishableKey"
                                  value={config.publishableKey}
                                  onChange={(e) => handleInputChange('publishableKey', e.target.value)}
                                  placeholder="pk_test_..."
                                  readOnly
                                />
                                <small className="form-text text-muted">
                                  This key is safe to expose in your frontend code.
                                </small>
                              </div>

                              <div className="form-group mb-3">
                                <label htmlFor="secretKey" className="form-label">
                                  Secret Key
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="secretKey"
                                  value={config.secretKey}
                                  onChange={(e) => handleInputChange('secretKey', e.target.value)}
                                  placeholder="sk_test_..."
                                  readOnly
                                />
                                <small className="form-text text-muted">
                                  Keep this key secret! Never expose it in frontend code.
                                </small>
                              </div>

                              <div className="form-group mb-3">
                                <label htmlFor="webhookSecret" className="form-label">
                                  Webhook Secret
                                </label>
                                <input
                                  type="password"
                                  className="form-control"
                                  id="webhookSecret"
                                  value={config.webhookSecret}
                                  onChange={(e) => handleInputChange('webhookSecret', e.target.value)}
                                  placeholder="whsec_..."
                                  readOnly
                                />
                                <small className="form-text text-muted">
                                  Webhook endpoint secret for verifying Stripe events.
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="card">
                            <div className="card-header">
                              <h5>
                                <i className="la la-cog me-2"></i>
                                Configuration Status
                              </h5>
                            </div>
                            <div className="card-body">
                              <div className="config-status">
                                <div className="status-item mb-3">
                                  <div className="d-flex align-items-center">
                                    <i className={`la ${isPlaceholderKey(config.publishableKey) ? 'la-exclamation-triangle text-warning' : 'la-check-circle text-success'} me-2`}></i>
                                    <span>Publishable Key</span>
                                    {isPlaceholderKey(config.publishableKey) && <small className="text-muted ms-2">(Placeholder)</small>}
                                  </div>
                                </div>
                                
                                <div className="status-item mb-3">
                                  <div className="d-flex align-items-center">
                                    <i className={`la ${isPlaceholderKey(config.secretKey) ? 'la-exclamation-triangle text-warning' : 'la-check-circle text-success'} me-2`}></i>
                                    <span>Secret Key</span>
                                    {isPlaceholderKey(config.secretKey) && <small className="text-muted ms-2">(Placeholder)</small>}
                                  </div>
                                </div>
                                
                                <div className="status-item mb-3">
                                  <div className="d-flex align-items-center">
                                    <i className={`la ${isPlaceholderKey(config.webhookSecret) ? 'la-exclamation-triangle text-warning' : 'la-check-circle text-success'} me-2`}></i>
                                    <span>Webhook Secret</span>
                                    {isPlaceholderKey(config.webhookSecret) && <small className="text-muted ms-2">(Placeholder)</small>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="card mt-4">
                            <div className="card-header">
                              <h5>
                                <i className="la la-link me-2"></i>
                                Webhook Endpoint
                              </h5>
                            </div>
                            <div className="card-body">
                              <div className="webhook-info">
                                <p className="small text-muted mb-2">
                                  Configure this URL in your Stripe Dashboard:
                                </p>
                                <code className="webhook-url">
                                  {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/api/stripe/webhook
                                </code>
                                <div className="mt-3">
                                  <small className="text-muted">
                                    <strong>Events to listen for:</strong>
                                    <ul className="mt-2">
                                      <li>payment_intent.succeeded</li>
                                      <li>payment_intent.payment_failed</li>
                                      <li>payment_intent.canceled</li>
                                    </ul>
                                  </small>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="setup-guide mt-4">
                        <div className="card">
                          <div className="card-header">
                            <h5>
                              <i className="la la-book me-2"></i>
                              Setup Guide
                            </h5>
                          </div>
                          <div className="card-body">
                            <div className="row">
                              <div className="col-md-6">
                                <h6>1. Get Stripe Keys</h6>
                                <ol className="small">
                                  <li>Sign up for a <a href="https://stripe.com" target="_blank" rel="noopener noreferrer">Stripe account</a></li>
                                  <li>Go to Developers → API Keys</li>
                                  <li>Copy your Publishable and Secret keys</li>
                                  <li>Add them to your .env file</li>
                                </ol>
                              </div>
                              <div className="col-md-6">
                                <h6>2. Configure Webhooks</h6>
                                <ol className="small">
                                  <li>Go to Developers → Webhooks</li>
                                  <li>Add endpoint URL (shown above)</li>
                                  <li>Select the required events</li>
                                  <li>Copy the webhook secret to .env</li>
                                </ol>
                              </div>
                            </div>
                          </div>
                        </div>
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
        .webhook-url {
          background-color: #f8f9fa;
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 14px;
          word-break: break-all;
          display: block;
          margin: 8px 0;
        }
        
        .config-status .status-item {
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .config-status .status-item:last-child {
          border-bottom: none;
        }
        
        .setup-guide ol {
          padding-left: 20px;
        }
        
        .setup-guide li {
          margin-bottom: 4px;
        }
      `}</style>
    </>
  );
}
