import dbConnect from '@/lib/mongodb';
import Category from '@/models/Category';
import Link from 'next/link';

export const metadata = {
  title: 'All Categories | NEW LOOK_Z',
  description: 'Explore all fashion, footwear, leather goods, and accessories categories.',
};

export default async function CategoriesPage() {
  await dbConnect();
  const categories = await Category.find({}).sort({ order: 1 }).lean();

  return (
    <div className="sf-section" style={{ paddingTop: '40px' }}>
      <div className="sf-container">
        <div className="product-section-header">
          <div className="product-section-title">
            <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#64748b' }}>
              Explore Everything
            </span>
            <h1 style={{ fontSize: '30px', fontWeight: 900, marginTop: '4px' }}>
              All Product Categories
            </h1>
            <p>Browse through our collection of premium apparel and accessories.</p>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {categories.map((cat) => (
            <div
              key={cat.slug}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img
                  src={cat.image}
                  alt={cat.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '16px',
                  }}
                >
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>
                    {cat.name}
                  </h3>
                </div>
              </div>

              <div style={{ padding: '16px' }}>
                <p
                  style={{
                    fontSize: '12px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: '#64748b',
                    marginBottom: '10px',
                  }}
                >
                  Subcategories
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                  {cat.subcategories?.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/shop?category=${cat.slug}&subcategory=${sub.slug}`}
                      className="subcategory-item"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>

                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="btn-see-all"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  View All {cat.name} <i className="ri-arrow-right-line"></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
