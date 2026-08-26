import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Brand from '@/models/Brand';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let brands = await Brand.find({}).sort({ order: 1, name: 1 }).lean();

    if (brands.length === 0) {
      brands = await Brand.create([
        { name: 'NEW LOOK_Z Signature', slug: 'new-look-z-signature', isFeatured: true, description: 'In-house luxury tailoring and lifestyle goods' },
        { name: 'Urban Denim Co.', slug: 'urban-denim-co', isFeatured: true, description: 'Contemporary streetwear and casual denim' },
        { name: 'Heritage Leatherworks', slug: 'heritage-leatherworks', isFeatured: true, description: 'Handcrafted full-grain belts and wallets' },
        { name: 'AeroComfort Footwear', slug: 'aerocomfort-footwear', isFeatured: true, description: 'Ergonomic sneakers and casual shoes' },
      ]);
    }

    return NextResponse.json({ success: true, count: brands.length, brands });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch brands', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const brand = await Brand.create({ ...body, slug });
    return NextResponse.json({ success: true, brand }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create brand', error: error.message },
      { status: 400 }
    );
  }
}
