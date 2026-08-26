'use client';

import React, { useState, useEffect } from 'react';

export default function AdminReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.success) {
        setReport(data.report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const exportCSV = () => {
    if (!report) return;
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Metric,Value',
        `Total Sales,৳ ${report.totalSales}`,
        `Total Orders,${report.totalOrders}`,
        `Total Items Sold,${report.totalItemsSold}`,
        `Total Purchase Cost,৳ ${report.totalPurchaseCost}`,
        `Gross Profit,৳ ${report.grossProfit}`,
        `Inventory Stock Valuation,৳ ${report.stockValuation}`,
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `newlookz_financial_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Generating financial reports...</div>;
  }

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
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Financial & Inventory Reports</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Comprehensive performance analytics, profit margins, and stock valuation
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={exportCSV}
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
            <i className="ri-download-2-line"></i> Export CSV Report
          </button>
        </div>
      </div>

      {/* 4 Analytics Stat Cards */}
      <div className="admin-stat-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div>
            <span className="stat-label">Total Revenue (Sales)</span>
            <div className="stat-val">৳ {report?.totalSales?.toLocaleString()}</div>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700 }}>
              ● {report?.totalOrders} completed orders
            </span>
          </div>
          <div className="stat-icon" style={{ background: '#dcfce7', color: '#16a34a' }}>
            <i className="ri-money-dollar-circle-line"></i>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span className="stat-label">Total Purchase Cost</span>
            <div className="stat-val">৳ {report?.totalPurchaseCost?.toLocaleString()}</div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Vendor stock replenishment</span>
          </div>
          <div className="stat-icon" style={{ background: '#fee2e2', color: '#dc2626' }}>
            <i className="ri-shopping-cart-line"></i>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span className="stat-label">Gross Margin / Profit</span>
            <div className="stat-val" style={{ color: report?.grossProfit >= 0 ? '#10b981' : '#ef4444' }}>
              ৳ {report?.grossProfit?.toLocaleString()}
            </div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Sales - Purchase expenses</span>
          </div>
          <div className="stat-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
            <i className="ri-line-chart-line"></i>
          </div>
        </div>

        <div className="stat-card">
          <div>
            <span className="stat-label">Inventory Stock Valuation</span>
            <div className="stat-val">৳ {report?.stockValuation?.toLocaleString()}</div>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Across active catalog products</span>
          </div>
          <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
            <i className="ri-stack-line"></i>
          </div>
        </div>
      </div>

      {/* 2 Column Details: Top Selling Products + Monthly Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '28px' }}>
        {/* Top Selling Products */}
        <div className="admin-table-card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Top Selling Products</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Ranked by revenue contribution</p>
          </div>

          <div style={{ padding: '16px' }}>
            {report?.topSellingProducts?.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>No product sales recorded yet.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {report?.topSellingProducts?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#f8fafc',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <span style={{ fontSize: '14px', fontWeight: 900, color: '#94a3b8', width: '20px' }}>
                      #{idx + 1}
                    </span>
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }}
                      />
                    )}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 700 }}>{item.title}</h4>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>{item.count} units sold</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#000000' }}>
                      ৳ {item.revenue}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Monthly Breakdown overview */}
        <div className="admin-table-card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Revenue vs Purchase Overview</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Monthly breakdown & margin trends</p>
          </div>

          <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {report?.monthlySales?.map((m) => (
                <div key={m.month}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                    <span>{m.month} 2026</span>
                    <span>
                      Sales: <b style={{ color: '#16a34a' }}>৳ {m.sales}</b> | Cost: <b style={{ color: '#dc2626' }}>৳ {m.purchases}</b>
                    </span>
                  </div>
                  <div style={{ height: '8px', borderRadius: '4px', background: '#f1f5f9', overflow: 'hidden', display: 'flex' }}>
                    <div
                      style={{
                        width: `${Math.min(100, (m.sales / (report?.totalSales || 1)) * 100 * 3)}%`,
                        background: '#000000',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
