import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';

export const metadata = {
  title: 'Blog & Style Guides | NEW LOOK_Z',
  description: 'Read the latest trends, styling guides, fabric care, and lifestyle updates from NEW LOOK_Z.',
};

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  await dbConnect();
  const blogs = await Blog.find({ isPublished: true }).sort({ createdAt: -1 }).lean();

  return (
    <div className="sf-section" style={{ paddingTop: '40px' }}>
      <div className="sf-container">
        <div className="product-section-header">
          <div className="product-section-title">
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#e11d48' }}>
              Stories & Guides
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: 900, marginTop: '4px' }}>Latest Blog Posts</h1>
            <p>Style inspirations, fashion tips, and product spotlights.</p>
          </div>
        </div>

        {blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
            No blog posts published yet.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px',
            }}
          >
            {blogs.map((post) => (
              <article
                key={post.slug}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Link href={`/blog/${post.slug}`} style={{ height: '220px', overflow: 'hidden' }}>
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Link>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#e11d48', textTransform: 'uppercase' }}>
                      {post.category}
                    </span>
                    <span>• {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1.4, marginBottom: '10px' }}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, marginBottom: '20px' }}>
                    {post.excerpt}
                  </p>

                  <div style={{ marginTop: 'auto' }}>
                    <Link href={`/blog/${post.slug}`} className="btn-see-all" style={{ padding: '6px 18px', fontSize: '13px' }}>
                      Read Article <i className="ri-arrow-right-line"></i>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
