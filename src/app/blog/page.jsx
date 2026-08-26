import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Blog & Style Guides | NEW LOOK_Z',
  description: 'Read the latest trends, styling guides, fabric care, and lifestyle updates from NEW LOOK_Z.',
};

const blogs = [
  {
    slug: 'future-of-fashion-2026',
    title: 'The Future of Fashion & Streetwear Trends in 2026',
    date: 'August 2026',
    category: 'Trends',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Discover how minimalist aesthetics, breathable organic fabrics, and versatile accessories are shaping the modern wardrobe for dynamic lifestyle lovers.',
  },
  {
    slug: '5-proven-styling-tips',
    title: '5 Proven Styling Tips to Upgrade Your Everyday Casual Outfit',
    date: 'August 2026',
    category: 'Guides',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
    excerpt: 'From pairing textured linen shirts with relaxed fit denim to selecting the right leather accessories, step up your casual look with ease.',
  },
  {
    slug: 'guide-to-genuine-leather',
    title: 'How to Pick Genuine Leather Belts and Wallets That Last for Years',
    date: 'July 2026',
    category: 'Craftsmanship',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    excerpt: 'A comprehensive guide to identifying full-grain leather, durable zinc-alloy buckles, and RFID-safe bi-fold wallet craftsmanship.',
  },
  {
    slug: 'essential-summer-accessories',
    title: 'Top Essential Accessories Every Wardrobe Needs This Season',
    date: 'July 2026',
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&auto=format&fit=crop&q=80',
    excerpt: 'Caps, protective breathable masks, belts, and minimalist wallets make the difference between an ordinary outfit and a standout impression.',
  },
];

export default function BlogPage() {
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
                  <span>• {post.date}</span>
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
      </div>
    </div>
  );
}
