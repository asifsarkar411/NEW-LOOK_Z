import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import ProductDetailView from '@/components/ProductDetailView';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  await dbConnect();
  const product = await Product.findOne({ slug: params.slug }).lean();
  if (!product) return { title: 'Product Not Found | NEW LOOK_Z' };

  return {
    title: `${product.title} | NEW LOOK_Z`,
    description: product.shortDescription || product.description || 'Shop this product on NEW LOOK_Z',
    openGraph: {
      images: [product.primaryImage],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  await dbConnect();
  const product = await Product.findOne({ slug: params.slug, isActive: true }).lean();

  if (!product) {
    notFound();
  }

  const relatedProducts = await Product.find({
    categorySlug: product.categorySlug,
    _id: { $ne: product._id },
    isActive: true,
  })
    .limit(4)
    .lean();

  return (
    <ProductDetailView
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts || []))}
    />
  );
}
