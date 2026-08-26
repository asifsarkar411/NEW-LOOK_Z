'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

function AdminBlogsContent() {
  const searchParams = useSearchParams();
  const actionParam = searchParams.get('action');

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  const [form, setForm] = useState({
    title: '',
    category: 'Fashion & Style',
    author: 'NEW LOOK_Z Editorial',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    excerpt: '',
    content: '',
    isPublished: true,
  });

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      if (data.success) setBlogs(data.blogs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  useEffect(() => {
    if (actionParam === 'new') {
      openAddModal();
    }
  }, [actionParam]);

  const openAddModal = () => {
    setEditingBlog(null);
    setForm({
      title: '',
      category: 'Fashion & Style',
      author: 'NEW LOOK_Z Editorial',
      image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
      excerpt: '',
      content: '',
      isPublished: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (blog) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      category: blog.category || 'Fashion & Style',
      author: blog.author || 'NEW LOOK_Z Editorial',
      image: blog.image,
      excerpt: blog.excerpt || '',
      content: blog.content || '',
      isPublished: blog.isPublished !== false,
    });
    setModalOpen(true);
  };

  const handleSaveBlog = async (e) => {
    e.preventDefault();
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog.slug}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        fetchBlogs();
      } else {
        alert(data.message || 'Failed to save blog');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBlog = async (slug) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/blogs/${slug}`, { method: 'DELETE' });
      if (res.ok) fetchBlogs();
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
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Blog CMS & Style Guides</h1>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Publish lifestyle blogs, style guides, and fashion stories ({blogs.length} posts)
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
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
          <i className="ri-add-line"></i> Write New Article
        </button>
      </div>

      {/* Blogs Table */}
      <div className="admin-table-card">
        {loading ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading articles...</div>
        ) : blogs.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No blog articles published yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Article</th>
                  <th>Category</th>
                  <th>Author</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((b) => (
                  <tr key={b._id || b.slug}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <img
                          src={b.image}
                          alt={b.title}
                          style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                        />
                        <b style={{ color: '#0f172a', maxWidth: '280px' }}>{b.title}</b>
                      </div>
                    </td>
                    <td>{b.category}</td>
                    <td>{b.author}</td>
                    <td>{b.views || 0} views</td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${b.isPublished ? 'badge-delivered' : 'badge-cancelled'}`}>
                        {b.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          type="button"
                          onClick={() => openEditModal(b)}
                          style={{ padding: '6px 10px', borderRadius: '6px', background: '#f1f5f9', fontSize: '12px', fontWeight: 700 }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlog(b.slug)}
                          style={{ padding: '6px 10px', borderRadius: '6px', background: '#fee2e2', color: '#dc2626', fontSize: '12px', fontWeight: 700 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Blog Modal */}
      {modalOpen && (
        <div className="vp-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="vp-dialog"
            style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 900 }}>
                {editingBlog ? 'Edit Article' : 'Write New Article'}
              </h2>
              <button type="button" className="nav-action-btn" onClick={() => setModalOpen(false)}>
                <i className="ri-close-line"></i>
              </button>
            </div>

            <form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Article Title <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Summer Outfits to Try This Season"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
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
                    Author
                  </label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
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

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Featured Image URL
                </label>
                <input
                  type="url"
                  required
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
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
                  Short Excerpt / Summary
                </label>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                ></textarea>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
                  Article Body Content <span style={{ color: '#e11d48' }}>*</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Write the full content..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                ></textarea>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 700 }}>
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                />
                Publish immediately to storefront
              </label>

              <button
                type="submit"
                className="btn-checkout"
                style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '14px', marginTop: '10px' }}
              >
                {editingBlog ? 'Update Article' : 'Publish Article'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminBlogsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '60px', textAlign: 'center' }}>Loading blogs...</div>}>
      <AdminBlogsContent />
    </Suspense>
  );
}
