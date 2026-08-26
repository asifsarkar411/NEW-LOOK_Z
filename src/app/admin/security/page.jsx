'use client';

import React, { useState, useEffect } from 'react';

export default function AdminSecurityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/security/logs');
      const data = await res.json();
      if (data.success) setLogs(data.logs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const res = await fetch('/api/admin/security/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (data.success) {
        setMsg('Password changed successfully!');
        setError('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        fetchLogs();
      } else {
        setError(data.message || 'Failed to update password');
        setMsg('');
      }
    } catch (err) {
      setError('Error changing password');
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Security & Audit Logs</h1>
        <p style={{ fontSize: '13px', color: '#64748b' }}>
          Manage administrator security, credentials, and track system activities
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px' }}>
        {/* Security Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Change Password Card */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px' }}>
              Change Admin Password
            </h3>

            {msg && (
              <div style={{ padding: '10px', background: '#d1fae5', color: '#065f46', borderRadius: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                ✓ {msg}
              </div>
            )}
            {error && (
              <div style={{ padding: '10px', background: '#fee2e2', color: '#dc2626', borderRadius: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '4px' }}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-checkout"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '13px', marginTop: '6px' }}
              >
                Update Password
              </button>
            </form>
          </div>

          {/* Two Factor Authentication */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: 800 }}>Two-Factor Authentication</h4>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Require OTP confirmation during login</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#000000' }}
              />
            </div>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="admin-table-card">
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Activity & Security Audit Trail</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Real-time log of administrative events</p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>IP Address</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        {new Date(log.createdAt || Date.now()).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          background: '#f1f5f9',
                          color: '#0f172a',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td>{log.userEmail}</td>
                    <td>
                      <code>{log.ipAddress || '127.0.0.1'}</code>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: '#475569' }}>
                        {log.details || `${log.action} on ${log.entity}`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
