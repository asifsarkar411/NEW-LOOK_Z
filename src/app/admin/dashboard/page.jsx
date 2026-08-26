'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [data, setData] = useState({
    stats: {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      pendingOrders: 0,
      lowStockProducts: 0,
    },
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats');
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      if (res.ok) {
        fetchStats();
      }
    } catch (e) {
      console.error('Update status error:', e);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
        Loading dashboard metrics...
      </div>
    );
  }

  const { stats, recentOrders } = data;

  return (
    <div>
      {/* 4 Stat Cards */}
      <div className="admin-stat-grid">
        <div className="stat-card">
          <div>
            <span className="stat-label">Total Revenue</span>
            <div className="stat-val">৳ {stats.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <i className="ri-money-dollar-circle-line"></i>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span className="stat-label">Total Orders</span>
            <div className="stat-val">{stats.totalOrders}</div>
          </div>
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <i className="ri-shopping-bag-3-line"></i>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span className="stat-label">Pending Orders</span>
            <div className="stat-val" style={{ color: '#d97706' }}>
              {stats.pendingOrders}
            </div>
          </div>
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <i className="ri-time-line"></i>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span className="stat-label">Active Products</span>
            <div className="stat-val">{stats.totalProducts}</div>
          </div>
          <div className="stat-icon" style={{ background: '#f1f5f9', color: '#0f172a' }}>
            <i className="ri-shirt-line"></i>
          </div>
        </div>
      </div>

      {/* Quick Action bar & Low stock alert */}
      {stats.lowStockProducts > 0 && (
        <div
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            background: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#b45309',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '32px',
            fontSize: '14px',
            fontWeight: 600,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="ri-alert-line" style={{ fontSize: '20px' }}></i>
            <span>
              <b>Attention:</b> {stats.lowStockProducts} product(s) have low inventory stock (&lt;10 items).
            </span>
          </div>
          <Link
            href="/admin/products"
            style={{
              background: '#b45309',
              color: '#ffffff',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '12px',
            }}
          >
            Manage Stock
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="admin-table-card">
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Recent Customer Orders</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Latest orders placed on storefront</p>
          </div>
          <Link
            href="/admin/orders"
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#0f172a',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            View All Orders <i className="ri-arrow-right-line"></i>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
            No orders placed yet. Test by ordering on the storefront!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <span style={{ fontWeight: 800, color: '#0f172a' }}>
                        {order.orderNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{order.customer?.name}</div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {order.customer?.city || 'Dhaka'}
                      </span>
                    </td>
                    <td>{order.customer?.phone}</td>
                    <td>{order.items?.length || 0} item(s)</td>
                    <td>
                      <b style={{ color: '#000000' }}>৳ {order.totalAmount}</b>
                    </td>
                    <td>
                      <span style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 700 }}>
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
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
                      <Link
                        href={`/admin/orders?id=${order.orderNumber}`}
                        style={{
                          padding: '6px 12px',
                          background: '#f1f5f9',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
