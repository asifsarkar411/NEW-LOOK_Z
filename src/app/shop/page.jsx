import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import ShopCatalog from '@/components/ShopCatalog';

export const metadata = {
  title: 'Shop All Products | NEW LOOK_Z',
  description: 'Browse our complete catalog of trendy fashion, footwear, caps, belts, and accessories.',
};

export default async function ShopPage({ searchParams }) {
  await dbConnect();

  const category = searchParams.category;
  const subcategory = searchParams.subcategory;
  const search = searchParams.search;
  const sort = searchParams.sort || 'latest';

  const query = { isActive: true };

  if (category) {
    query.categorySlug = category;
  }
  if (subcategory) {
    query.subcategorySlug = subcategory;
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
      { subcategory: { $regex: search, $options: 'i' } },
    ];
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') {
    sortOption = { sellingPrice: 1 };
  } else if (sort === 'price_desc') {
    sortOption = { sellingPrice: -1 };
  } else if (sort === 'popular') {
    sortOption = { reviewCount: -1, rating: -1 };
  }

  const [products, categories] = await Promise.all([
    Product.find(query).sort(sortOption).lean(),
    Category.find({}).sort({ order: 1 }).lean(),
  ]);

  return (
    <ShopCatalog
      initialProducts={JSON.parse(JSON.stringify(products))}
      categories={JSON.parse(JSON.stringify(categories))}
      currentCategory={category}
      currentSubcategory={subcategory}
      currentSearch={search}
      currentSort={sort}
    />
  );
}
