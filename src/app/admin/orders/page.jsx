'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function AdminOrdersContent() {
  const searchParams = useSearchParams();
  const highlightId = searchParams.get('id');

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders || []);
        if (highlightId) {
          const match = data.orders.find((o) => o.orderNumber === highlightId);
          if (match) setSelectedOrder(match);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus, note = '') => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus, note }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchStatus = filterStatus === 'all' || o.orderStatus === filterStatus;
    const matchSearch =
      !searchTerm ||
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.phone?.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const printInvoice = () => {
    window.print();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Orders Management</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>Manage fulfillment, update shipment status, and print receipts</p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search by Order #, Name, Phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              width: '240px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Filter status tabs */}
      <div className="section-tabs" style={{ marginBottom: '20px' }}>
        {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
          <button
            key={st}
            type="button"
            className={`section-tab-btn ${filterStatus === st ? 'active' : ''}`}
            onClick={() => setFilterStatus(st)}
            style={{ textTransform: 'capitalize' }}
          >
            {st} ({st === 'all' ? orders.length : orders.filter((o) => o.orderStatus === st).length})
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="admin-table-card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading orders...</div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            No orders found matching the filter.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order Number</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Contact</th>
                  <th>Zone / City</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <b style={{ color: '#0f172a' }}>{order.orderNumber}</b>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.customer?.name}</div>
                    </td>
                    <td>{order.customer?.phone}</td>
                    <td>
                      <span style={{ textTransform: 'capitalize', fontSize: '12px' }}>
                        {order.customer?.zone?.replace('_', ' ') || 'Dhaka'}
                      </span>
                    </td>
                    <td>
                      <b>৳ {order.totalAmount}</b>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        className={`status-badge badge-${order.orderStatus}`}
                        style={{ border: 'none', outline: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          padding: '6px 12px',
                          background: '#000000',
                          color: '#ffffff',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Order Details & Invoice Modal */}
      {selectedOrder && (
        <div className="vp-overlay" onClick={() => setSelectedOrder(null)}>
          <div
            className="vp-dialog"
            style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Order Details & Invoice</span>
                <h2 style={{ fontSize: '20px', fontWeight: 900 }}>{selectedOrder.orderNumber}</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={printInvoice}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    fontSize: '12px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <i className="ri-printer-line"></i> Print Receipt
                </button>
                <button
                  type="button"
                  className="nav-action-btn"
                  onClick={() => setSelectedOrder(null)}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>

            {/* Customer Info Box */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                fontSize: '13px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              <div>
                <p style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Recipient</p>
                <p><b>{selectedOrder.customer?.name}</b></p>
                <p>{selectedOrder.customer?.phone}</p>
                {selectedOrder.customer?.email && <p>{selectedOrder.customer?.email}</p>}
              </div>

              <div>
                <p style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 700 }}>Address</p>
                <p>{selectedOrder.customer?.address}</p>
                <p><b>Zone:</b> {selectedOrder.customer?.zone?.replace('_', ' ')}</p>
              </div>
            </div>

            {/* Items Ordered */}
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '10px' }}>Items ({selectedOrder.items?.length})</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {selectedOrder.items?.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #f1f5f9',
                  }}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{ width: '44px', height: '44px', borderRadius: '6px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontSize: '13px', fontWeight: 700 }}>{item.title}</h5>
                    {item.variantLabel && (
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{item.variantLabel}</span>
                    )}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>
                    {item.quantity} × ৳ {item.price} = ৳ {item.total}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginBottom: '20px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Subtotal:</span>
                <span>৳ {selectedOrder.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Delivery Charge:</span>
                <span>৳ {selectedOrder.deliveryCharge}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', color: '#10b981' }}>
                  <span>Coupon Discount ({selectedOrder.couponCode}):</span>
                  <span>- ৳ {selectedOrder.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, fontSize: '16px', borderTop: '1px solid #e2e8f0', paddingTop: '8px', marginTop: '6px' }}>
                <span>Total Amount:</span>
                <span>৳ {selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Status Quick Update in Modal */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                Update Order Status:
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleUpdateStatus(selectedOrder._id, st)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      background: selectedOrder.orderStatus === st ? '#000000' : '#f1f5f9',
                      color: selectedOrder.orderStatus === st ? '#ffffff' : '#334155',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading orders...</div>}>
      <AdminOrdersContent />
    </Suspense>
  );
}
