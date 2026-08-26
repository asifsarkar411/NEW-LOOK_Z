'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function AdminPurchasesContent() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');

  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [note, setNote] = useState('');
  const [items, setItems] = useState([
    { productId: '', title: '', sku: '', quantity: 10, unitCost: 500, totalCost: 5000 },
  ]);

  const fetchData = async () => {
    try {
      const [purRes, prodRes] = await Promise.all([
        fetch('/api/purchases'),
        fetch('/api/products?limit=100'),
      ]);
      const [purData, prodData] = await Promise.all([purRes.json(), prodRes.json()]);

      if (purData.success) setPurchases(purData.purchases || []);
      if (prodData.success) setProducts(prodData.products || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (actionParam === 'new') {
      setModalOpen(true);
    }
  }, [actionParam]);

  const handleProductSelect = (index, prodId) => {
    const prod = products.find((p) => p._id === prodId);
    if (!prod) return;

    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      productId: prod._id,
      title: prod.title,
      sku: prod.sku || '',
      totalCost: newItems[index].quantity * newItems[index].unitCost,
    };
    setItems(newItems);
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === 'quantity' || field === 'unitCost') {
      newItems[index].totalCost = Number(newItems[index].quantity || 0) * Number(newItems[index].unitCost || 0);
    }
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { productId: '', title: '', sku: '', quantity: 10, unitCost: 500, totalCost: 5000 }]);
  };

  const removeItemRow = (index) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const totalCalculated = items.reduce((sum, item) => sum + (item.totalCost || 0), 0);

  const handleSubmitPurchase = async (e) => {
    e.preventDefault();
    if (!supplierName.trim() || items.length === 0) return;

    try {
      const res = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierName: supplierName.trim(),
          supplierPhone: supplierPhone.trim(),
          items,
          paidAmount: Number(paidAmount) || totalCalculated,
          note: note.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setSupplierName('');
        setSupplierPhone('');
        setPaidAmount('');
        setNote('');
        fetchData();
      } else {
        alert(data.message || 'Error creating purchase order');
      }
    } catch (e) {
      console.error(e);
    }
  };

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
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Purchases & Stock Inward</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Record vendor inventory purchases and replenish product stock
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            padding: '10px 18px',
            background: '#000000',
            color: '#ffffff',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <i className="ri-add-line"></i> New Purchase Order
        </button>
      </div>

      {/* Purchases Table */}
      <div className="admin-table-card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading purchases...</div>
        ) : purchases.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
            No purchase records found. Record your first supplier purchase!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>PO #</th>
                  <th>Date</th>
                  <th>Supplier</th>
                  <th>Phone</th>
                  <th>Items Received</th>
                  <th>Total Cost</th>
                  <th>Paid</th>
                  <th>Due</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <b style={{ color: '#0f172a' }}>{p.poNumber}</b>
                    </td>
                    <td>{new Date(p.purchaseDate || p.createdAt).toLocaleDateString()}</td>
                    <td>
                      <b>{p.supplierName}</b>
                    </td>
                    <td>{p.supplierPhone || '-'}</td>
                    <td>
                      {p.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)} items ({p.items?.length} sku)
                    </td>
                    <td>
                      <b>৳ {p.totalCost}</b>
                    </td>
                    <td>৳ {p.paidAmount || p.totalCost}</td>
                    <td>
                      <span style={{ color: p.dueAmount > 0 ? '#dc2626' : '#64748b' }}>
                        ৳ {p.dueAmount || 0}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: p.paymentStatus === 'paid' ? '#d1fae5' : '#fef3c7',
                          color: p.paymentStatus === 'paid' ? '#065f46' : '#d97706',
                          textTransform: 'uppercase',
                        }}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Purchase Modal */}
      {modalOpen && (
        <div className="vp-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="vp-dialog"
            style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900 }}>Create Purchase Order</h2>
              <button type="button" className="nav-action-btn" onClick={() => setModalOpen(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleSubmitPurchase} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Supplier Name <span style={{ color: '#e11d48' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BD Textile Mills"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Supplier Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="018xxxxxxxx"
                    value={supplierPhone}
                    onChange={(e) => setSupplierPhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Items Line rows */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700 }}>Items / Products Received</label>
                  <button
                    type="button"
                    onClick={addItemRow}
                    style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb' }}
                  >
                    + Add Another Item
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2fr 1fr 1fr auto',
                        gap: '8px',
                        alignItems: 'center',
                        background: '#f8fafc',
                        padding: '10px',
                        borderRadius: '8px',
                      }}
                    >
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductSelect(idx, e.target.value)}
                        style={{
                          padding: '8px',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          fontSize: '13px',
                        }}
                      >
                        <option value="">-- Select Product --</option>
                        {products.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.title} ({p.sku || 'No SKU'})
                          </option>
                        ))}
                      </select>

                      <input
                        type="number"
                        placeholder="Qty"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />

                      <input
                        type="number"
                        placeholder="Unit Cost"
                        value={item.unitCost}
                        onChange={(e) => handleItemChange(idx, 'unitCost', e.target.value)}
                        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                      />

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(idx)}
                          style={{ color: '#ef4444', fontSize: '18px', padding: '4px' }}
                        >
                          <i className="ri-delete-bin-line"></i>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Total & Paid Amount */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: '#f1f5f9',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '15px',
                }}
              >
                <span>Total Purchase Cost:</span>
                <span>৳ {totalCalculated}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Paid Amount (৳)
                  </label>
                  <input
                    type="number"
                    placeholder={`e.g. ${totalCalculated}`}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Note / Remarks
                  </label>
                  <input
                    type="text"
                    placeholder="Batch, Invoice #, etc."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-checkout"
                style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '14px', marginTop: '10px' }}
              >
                Save Purchase & Inward Stock
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminPurchasesPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading purchases...</div>}>
      <AdminPurchasesContent />
    </Suspense>
  );
}
