'use client';

import React, { useState, useEffect } from 'react';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      const data = await res.json();
      if (data.success) setCustomers(data.customers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) => {
    return (
      !searchTerm ||
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone?.includes(searchTerm) ||
      c.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Customer CRM</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Customer directory, order histories, and lifetime value ({customers.length} customers)
          </p>
        </div>

        <input
          type="text"
          placeholder="Search by name, phone, city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            width: '260px',
            outline: 'none',
          }}
        />
      </div>

      {/* Customers Table */}
      <div className="admin-table-card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading customer records...</div>
        ) : filteredCustomers.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No customers found.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>City / Address</th>
                  <th>Orders Count</th>
                  <th>Total Spent</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((cust, idx) => (
                  <tr key={idx}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: '#000000',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '14px',
                          }}
                        >
                          {cust.name?.[0] || 'C'}
                        </div>
                        <div>
                          <b style={{ color: '#0f172a' }}>{cust.name}</b>
                        </div>
                      </div>
                    </td>
                    <td>{cust.phone}</td>
                    <td>{cust.email || '-'}</td>
                    <td>
                      <span style={{ fontSize: '13px' }}>{cust.city || 'Dhaka'}</span>
                      {cust.address && (
                        <div style={{ fontSize: '11px', color: '#64748b', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {cust.address}
                        </div>
                      )}
                    </td>
                    <td>
                      <span
                        style={{
                          background: '#f1f5f9',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 800,
                        }}
                      >
                        {cust.totalOrders} order(s)
                      </span>
                    </td>
                    <td>
                      <b style={{ color: '#000000' }}>৳ {cust.totalSpent}</b>
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setSelectedCustomer(cust)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: '#000000',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                        }}
                      >
                        Order History
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Order History Modal */}
      {selectedCustomer && (
        <div className="vp-overlay" onClick={() => setSelectedCustomer(null)}>
          <div
            className="vp-dialog"
            style={{ maxWidth: '580px', maxHeight: '85vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Customer Profile</span>
                <h2 style={{ fontSize: '20px', fontWeight: 900 }}>{selectedCustomer.name}</h2>
              </div>
              <button type="button" className="nav-action-btn" onClick={() => setSelectedCustomer(null)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            {/* Info Grid */}
            <div
              style={{
                background: '#f8fafc',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '20px',
                fontSize: '13px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
              }}
            >
              <div>
                <p style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Phone</p>
                <p><b>{selectedCustomer.phone}</b></p>
              </div>
              <div>
                <p style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Lifetime Value</p>
                <p><b>৳ {selectedCustomer.totalSpent}</b> ({selectedCustomer.totalOrders} orders)</p>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <p style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>Delivery Address</p>
                <p>{selectedCustomer.address || 'Address on file'}, {selectedCustomer.city}</p>
              </div>
            </div>

            {/* Orders list */}
            <h4 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '10px' }}>Orders History</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {selectedCustomer.orders?.map((ord, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <p style={{ fontWeight: 800, fontSize: '13px' }}>{ord.orderNumber}</p>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {new Date(ord.date).toLocaleDateString()}
                    </span>
                  </div>
                  <span className={`status-badge badge-${ord.status}`} style={{ textTransform: 'capitalize' }}>
                    {ord.status}
                  </span>
                  <b style={{ fontSize: '14px' }}>৳ {ord.amount}</b>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
