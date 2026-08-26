'use client';

import React, { useState, useEffect } from 'react';

const allPermissionCategories = [
  {
    category: 'Orders Management',
    permissions: [
      { key: 'orders:read', label: 'View Orders list & details' },
      { key: 'orders:write', label: 'Update Order statuses & dispatch' },
      { key: 'orders:delete', label: 'Cancel or delete orders' },
    ],
  },
  {
    category: 'Products & Inventory',
    permissions: [
      { key: 'products:read', label: 'View Catalog & Inventory' },
      { key: 'products:write', label: 'Add & Edit Products / Variants' },
      { key: 'products:delete', label: 'Delete Products' },
    ],
  },
  {
    category: 'Vendor Purchases',
    permissions: [
      { key: 'purchases:read', label: 'View Stock Inward Purchases' },
      { key: 'purchases:write', label: 'Create Purchase Orders & Replenish' },
    ],
  },
  {
    category: 'Customers & CRM',
    permissions: [
      { key: 'customers:read', label: 'View Customer profiles & history' },
      { key: 'customers:write', label: 'Edit Customer details' },
    ],
  },
  {
    category: 'Marketing & CMS',
    permissions: [
      { key: 'blogs:read', label: 'View Blogs & Guides' },
      { key: 'blogs:write', label: 'Publish & Edit Articles' },
      { key: 'coupons:manage', label: 'Create & Manage Coupons' },
      { key: 'banners:manage', label: 'Update Hero Banners & Marquee' },
    ],
  },
  {
    category: 'Reports & System Settings',
    permissions: [
      { key: 'reports:read', label: 'Access Financial & Sales Reports' },
      { key: 'settings:write', label: 'Modify Store Info & Shipping Rates' },
      { key: 'users:manage', label: 'Manage Staff Users & Passwords' },
      { key: 'security:manage', label: 'Access Security Audit Logs' },
    ],
  },
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState([
    'orders:read',
    'orders:write',
    'products:read',
  ]);

  const fetchRoles = async () => {
    try {
      const res = await fetch('/api/admin/roles');
      const data = await res.json();
      if (data.success) setRoles(data.roles || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const togglePermission = (key) => {
    if (selectedPermissions.includes(key)) {
      setSelectedPermissions(selectedPermissions.filter((k) => k !== key));
    } else {
      setSelectedPermissions([...selectedPermissions, key]);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;

    try {
      const res = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newRoleName.trim(),
          description: newRoleDesc.trim(),
          permissions: selectedPermissions,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setNewRoleName('');
        setNewRoleDesc('');
        fetchRoles();
      } else {
        alert(data.message || 'Error creating role');
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
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Roles & Permissions (RBAC)</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Define granular access permissions across all store modules
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
          <i className="ri-shield-keyhole-line"></i> Create New Role
        </button>
      </div>

      {/* Roles Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
        {roles.map((role) => (
          <div
            key={role._id || role.slug}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>{role.name}</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>{role.description || 'Custom staff role'}</span>
              </div>
              {role.isSystemRole && (
                <span style={{ fontSize: '11px', background: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  System
                </span>
              )}
            </div>

            <div style={{ margin: '16px 0', borderTop: '1px solid #f1f5f9', paddingTop: '14px', flex: 1 }}>
              <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: '#64748b', marginBottom: '8px' }}>
                Assigned Permissions ({role.permissions?.length || 0})
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {role.permissions?.map((p) => (
                  <span
                    key={p}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      fontWeight: 600,
                    }}
                  >
                    ✓ {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Role Modal */}
      {modalOpen && (
        <div className="vp-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="vp-dialog"
            style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900 }}>Create New Role</h2>
              <button type="button" className="nav-action-btn" onClick={() => setModalOpen(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleCreateRole} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Role Name <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Content Writer, Warehouse Staff"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
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
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Briefly describe what this role can do"
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
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

              {/* Permissions Checklist matrix */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>
                  Select Module Permissions
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {allPermissionCategories.map((cat) => (
                    <div key={cat.category} style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '8px', color: '#0f172a' }}>
                        {cat.category}
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                        {cat.permissions.map((perm) => (
                          <label
                            key={perm.key}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            <input
                              type="checkbox"
                              checked={selectedPermissions.includes(perm.key)}
                              onChange={() => togglePermission(perm.key)}
                            />
                            <span>{perm.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="btn-checkout"
                style={{ width: '100%', padding: '12px', borderRadius: '8px', fontSize: '14px', marginTop: '10px' }}
              >
                Save Role
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
