import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const term = searchParams.get('q')?.trim();

    if (!term || term.length < 2) {
      return NextResponse.json({ success: true, products: [] });
    }

    const products = await Product.find({
      isActive: true,
      $or: [
        { title: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
        { subcategory: { $regex: term, $options: 'i' } },
      ],
    })
      .select('title slug primaryImage sellingPrice regularPrice category')
      .limit(6)
      .lean();

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Search suggestion error', error: error.message },
      { status: 500 }
    );
  }
}
