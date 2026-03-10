'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Breadcrumb from '@/components/common/Breadcrumb';
import { apiUrl } from '@/lib/utils';

interface Order {
  id: string;
  orderId: string;
  items: string;
  totalAmount: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/login');
      return;
    }

    fetchOrders();
  }, [session, status, router]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(apiUrl('/api/checkout/create-order'), {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: 'warning',
      PROCESSING: 'info',
      COMPLETED: 'success',
      FAILED: 'danger',
      CANCELLED: 'secondary',
      REFUNDED: 'info',
    };
    
    return `badge badge-${statusMap[status as keyof typeof statusMap] || 'secondary'}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Orders' },
          ]}
          title="Order History"
        />
        <section className="dashboard-wrapper section-bg p-bottom-70">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading orders...</span>
              </div>
              <p className="mt-3">Loading your orders...</p>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Orders' },
        ]}
        title="Order History"
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
                          <i className="la la-shopping-cart me-2"></i>
                          Order History
                        </h4>
                      </div>
                    </div>
                    <div className="atbdb_content_module_contents">
                      {error && (
                        <div className="alert alert-danger" role="alert">
                          <i className="la la-exclamation-triangle me-2"></i>
                          {error}
                        </div>
                      )}

                      {orders.length > 0 ? (
                        <div className="orders-list">
                          {orders.map((order) => {
                            const items = JSON.parse(order.items);
                            return (
                              <div key={order.id} className="order-card mb-4">
                                <div className="card">
                                  <div className="card-header d-flex justify-content-between align-items-center">
                                    <div>
                                      <h6 className="mb-1">
                                        <i className="la la-receipt me-2"></i>
                                        Order #{order.orderId}
                                      </h6>
                                      <small className="text-muted">
                                        Placed on {formatDate(order.createdAt)}
                                      </small>
                                    </div>
                                    <div className="text-end">
                                      <span className={`badge ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                      </span>
                                      <div className="order-total mt-1">
                                        <strong>${order.totalAmount.toFixed(2)}</strong>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="card-body">
                                    <div className="row">
                                      <div className="col-md-6">
                                        <h6>Items Ordered:</h6>
                                        <ul className="list-unstyled">
                                          {items.map((item: any, index: number) => (
                                            <li key={index} className="mb-2">
                                              <div className="d-flex justify-content-between">
                                                <span>
                                                  <i className="la la-check-circle text-success me-2"></i>
                                                  {item.name}
                                                </span>
                                                <span className="text-muted">${item.price.toFixed(2)}</span>
                                              </div>
                                              <small className="text-muted d-block">
                                                {item.description}
                                              </small>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                      <div className="col-md-6">
                                        <h6>Order Details:</h6>
                                        <div className="order-details">
                                          <div className="detail-item">
                                            <span className="label">Payment Method:</span>
                                            <span className="value">{order.paymentMethod}</span>
                                          </div>
                                          {order.completedAt && (
                                            <div className="detail-item">
                                              <span className="label">Completed:</span>
                                              <span className="value">{formatDate(order.completedAt)}</span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="order-actions mt-3">
                                      <button
                                        className="btn btn-outline-primary btn-sm me-2"
                                        onClick={() => {
                                          // In a real app, this would download the invoice
                                          alert('Invoice downloaded! (Demo mode)');
                                        }}
                                      >
                                        <i className="la la-download me-1"></i>
                                        Download Invoice
                                      </button>
                                      {order.status === 'COMPLETED' && (
                                        <Link
                                          href={`/checkout/success?orderId=${order.orderId}&amount=${order.totalAmount}`}
                                          className="btn btn-outline-success btn-sm"
                                        >
                                          <i className="la la-eye me-1"></i>
                                          View Details
                                        </Link>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-5">
                          <i className="la la-shopping-cart icon-size-lg"></i>
                          <h5 className="mt-3 text-muted">No Orders Yet</h5>
                          <p className="text-muted">
                            You haven't made any purchases yet. <Link href="/pricing">Browse our plans</Link> to get started.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .order-card {
          transition: all 0.3s ease;
        }
        
        .order-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        .order-details .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          padding: 5px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .order-details .label {
          font-weight: 600;
          color: #495057;
        }
        
        .order-details .value {
          color: #6c757d;
        }
        
        .order-total {
          font-size: 1.2rem;
          color: #28a745;
        }
        
        .orders-list {
          max-height: 600px;
          overflow-y: auto;
        }
      `}</style>
    </>
  );
}
