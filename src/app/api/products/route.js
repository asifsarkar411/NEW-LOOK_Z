import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || 'latest';
    const tag = searchParams.get('tag'); // 'new-arrival', 'top-selling', 'featured'
    const limit = parseInt(searchParams.get('limit') || '50', 10);

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
    if (tag === 'new-arrival') {
      query.isNewArrival = true;
    } else if (tag === 'top-selling') {
      query.isTopSelling = true;
    } else if (tag === 'featured') {
      query.isFeatured = true;
    } else if (tag === 'trending') {
      query.isTrending = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { sellingPrice: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { sellingPrice: -1 };
    } else if (sort === 'popular') {
      sortOption = { reviewCount: -1, rating: -1 };
    }

    const products = await Product.find(query).sort(sortOption).limit(limit).lean();

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    if (!body.slug && body.title) {
      body.slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);
    }

    if (body.regularPrice && body.sellingPrice && body.regularPrice > body.sellingPrice) {
      body.discountPercentage = Math.round(
        ((body.regularPrice - body.sellingPrice) / body.regularPrice) * 100
      );
    }

    const product = await Product.create(body);

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product', error: error.message },
      { status: 400 }
    );
  }
}
