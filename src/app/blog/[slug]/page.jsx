import React from 'react';
import Link from 'next/link';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  await dbConnect();
  const blog = await Blog.findOne({ slug: params.slug }).lean();
  if (!blog) return { title: 'Article Not Found | NEW LOOK_Z' };

  return {
    title: `${blog.title} | NEW LOOK_Z Blog`,
    description: blog.excerpt || blog.title,
    openGraph: {
      images: [blog.image],
    },
  };
}

export default async function BlogPostDetail({ params }) {
  await dbConnect();
  const blog = await Blog.findOneAndUpdate(
    { slug: params.slug },
    { $inc: { views: 1 } },
    { new: true }
  ).lean();

  if (!blog) {
    notFound();
  }

  return (
    <div className="sf-section" style={{ paddingTop: '40px' }}>
      <div className="sf-container" style={{ maxWidth: '800px' }}>
        <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
          <Link href="/">Home</Link> &nbsp;/&nbsp; <Link href="/blog">Blog</Link> &nbsp;/&nbsp;{' '}
          <span style={{ color: '#000000', fontWeight: 600 }}>{blog.title}</span>
        </div>

        <span
          style={{
            fontSize: '12px',
            fontWeight: 800,
            color: '#e11d48',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}
        >
          {blog.category || 'Fashion & Style'}
        </span>

        <h1 style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.3, margin: '8px 0 16px' }}>
          {blog.title}
        </h1>

        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#64748b', marginBottom: '28px' }}>
          <span>By <b>{blog.author || 'NEW LOOK_Z Editorial'}</b></span>
          <span>• {new Date(blog.createdAt).toLocaleDateString()}</span>
          <span>• {blog.views || 1} views</span>
        </div>

        {blog.image && (
          <div style={{ borderRadius: '16px', overflow: 'hidden', height: '380px', marginBottom: '32px' }}>
            <img
              src={blog.image}
              alt={blog.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        <div style={{ fontSize: '16px', color: '#334155', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
          {blog.content}

          <div style={{ marginTop: '40px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
            <Link href="/shop" className="btn-see-all">
              Explore Our Collection <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
