import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Banner from '@/models/Banner';
import HeroSlider from '@/components/HeroSlider';
import HomeProductSection from '@/components/HomeProductSection';
import Link from 'next/link';

async function getHomeData() {
  try {
    await dbConnect();
    const [banners, categories, newArrivals, topSelling] = await Promise.all([
      Banner.find({ isActive: true }).sort({ order: 1 }).lean(),
      Category.find({ featured: true }).sort({ order: 1 }).lean(),
      Product.find({ isActive: true, isNewArrival: true }).limit(10).lean(),
      Product.find({ isActive: true, isTopSelling: true }).limit(10).lean(),
    ]);

    return {
      banners: JSON.parse(JSON.stringify(banners || [])),
      categories: JSON.parse(JSON.stringify(categories || [])),
      newArrivals: JSON.parse(JSON.stringify(newArrivals || [])),
      topSelling: JSON.parse(JSON.stringify(topSelling || [])),
    };
  } catch (error) {
    console.error('Error fetching home data:', error);
    return { banners: [], categories: [], newArrivals: [], topSelling: [] };
  }
}

export default async function HomePage() {
  const { banners, categories, newArrivals, topSelling } = await getHomeData();

  return (
    <div>
      {/* 1. Full Bleed Hero Slider */}
      <HeroSlider banners={banners} />

      {/* 2. Featured Categories Row */}
      <section className="sf-section" style={{ paddingBottom: '20px' }}>
        <div className="sf-container">
          <div className="product-section-header">
            <div className="product-section-title">
              <h2>Categories</h2>
              <p>Browse all the exclusive categories</p>
            </div>
          </div>

          <div className="sf-category-row">
            {categories.map((cat) => (
              <div key={cat.slug} className="category-item">
                <Link href={`/shop?category=${cat.slug}`}>
                  <div className="category-item-media">
                    <img src={cat.image} alt={cat.name} loading="lazy" />
                  </div>
                  <p className="category-item-name">{cat.name}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. New Arrival Multi-tab Product Section */}
      <HomeProductSection
        title="New Arrival"
        subtitle="Explore all the new products"
        products={newArrivals}
        viewAllLink="/shop?sort=latest"
      />

      {/* Mid Promotional Banners */}
      <section className="sf-section" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
        <div className="sf-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '240px',
                background: '#000000',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80"
                alt="Promo 1"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
                  color: '#ffffff',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#e11d48' }}>
                  Flash Offer
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '8px 0 16px' }}>
                  Mens Collection<br />Up to 30% Off
                </h3>
                <div>
                  <Link
                    href="/shop?category=mens-fashion"
                    className="btn-see-all"
                    style={{ background: '#ffffff', color: '#000000', border: 'none' }}
                  >
                    Shop Mens <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </div>
            </div>

            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                height: '240px',
                background: '#000000',
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=80"
                alt="Promo 2"
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  background: 'linear-gradient(to right, rgba(0,0,0,0.8), transparent)',
                  color: '#ffffff',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#10b981' }}>
                  Special Promo
                </span>
                <h3 style={{ fontSize: '24px', fontWeight: 900, margin: '8px 0 16px' }}>
                  Womens Festive Trends<br />Use Code: SAVE25
                </h3>
                <div>
                  <Link
                    href="/shop?category=womens-fashion"
                    className="btn-see-all"
                    style={{ background: '#ffffff', color: '#000000', border: 'none' }}
                  >
                    Shop Womens <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Selling Multi-tab Product Section */}
      <HomeProductSection
        title="Top Selling"
        subtitle="Explore all the top selling products"
        products={topSelling}
        viewAllLink="/shop?sort=popular"
      />

      {/* 5. Latest Blogs Section */}
      <section className="sf-section" style={{ background: '#f8fafc' }}>
        <div className="sf-container">
          <div className="product-section-header">
            <div className="product-section-title">
              <h2>Latest Blogs</h2>
              <p>Insights, style guides, and fashion tips from our experts</p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                title: 'The Future of Fashion & Streetwear Trends in 2026',
                excerpt:
                  'Discover how minimalist aesthetics, breathable organic fabrics, and versatile accessories are shaping the modern wardrobe.',
                image:
                  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80',
                slug: 'future-of-fashion-2026',
              },
              {
                title: '5 Proven Styling Tips to Upgrade Your Everyday Casual Outfit',
                excerpt:
                  'From pairing textured linen shirts with relaxed fit denim to selecting the right leather accessories, step up your casual look.',
                image:
                  'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80',
                slug: '5-proven-styling-tips',
              },
              {
                title: 'How to Pick Genuine Leather Belts and Wallets That Last for Years',
                excerpt:
                  'A guide to identifying full-grain leather, durable stitching, and RFID-safe bi-fold wallet craftsmanship.',
                image:
                  'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
                slug: 'guide-to-genuine-leather',
              },
            ].map((blog, i) => (
              <article
                key={i}
                style={{
                  background: '#ffffff',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <Link href={`/blog/${blog.slug}`}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    style={{ width: '100%', height: '190px', objectFit: 'cover' }}
                  />
                </Link>
                <div style={{ padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px', lineHeight: 1.4 }}>
                    <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px', lineHeight: 1.5 }}>
                    {blog.excerpt}
                  </p>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="btn-see-all"
                    style={{ padding: '6px 16px', fontSize: '12px' }}
                  >
                    Read More <i className="ri-arrow-right-line"></i>
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="sf-section-cta">
            <Link href="/blog" className="btn-see-all">
              See All Blogs <i className="ri-arrow-right-line"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="sf-section">
        <div className="sf-container">
          <div className="product-section-header" style={{ textAlign: 'center' }}>
            <div className="product-section-title">
              <h2>What Our Customers Say</h2>
              <p>Trusted by thousands of satisfied shoppers across Bangladesh</p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px',
            }}
          >
            {[
              {
                name: 'Tanvir Ahmed',
                role: 'Verified Customer, Dhaka',
                text: 'The linen shirts and leather wallet quality exceeded my expectations. Delivery inside Dhaka took less than 24 hours!',
                rating: 5,
              },
              {
                name: 'Nusrat Jahan',
                role: 'Verified Customer, Chittagong',
                text: 'Loved the floral kurti! Beautiful fabric and perfect fitting according to the size guide. Also used coupon SAVE25 for a great discount.',
                rating: 5,
              },
              {
                name: 'Rahim Chowdhury',
                role: 'Verified Customer, Sylhet',
                text: 'Ordered the classic black cap and casual sneakers. Super comfortable and looks just like the photos. Highly recommended store!',
                rating: 5,
              },
            ].map((review, i) => (
              <div
                key={i}
                style={{
                  background: '#f8fafc',
                  borderRadius: '16px',
                  padding: '28px',
                  border: '1px solid #e2e8f0',
                  position: 'relative',
                }}
              >
                <div style={{ fontSize: '36px', color: '#cbd5e1', lineHeight: 1, marginBottom: '12px' }}>
                  “
                </div>
                <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, marginBottom: '16px' }}>
                  {review.text}
                </p>
                <div style={{ color: '#f59e0b', fontSize: '16px', marginBottom: '12px' }}>
                  {'★'.repeat(review.rating)}
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{review.name}</h4>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{review.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
