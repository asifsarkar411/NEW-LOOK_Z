import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Color from '@/models/Color';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let colors = await Color.find({ isActive: true }).sort({ name: 1 }).lean();

    if (colors.length === 0) {
      colors = await Color.create([
        { name: 'Black', code: '#000000', slug: 'black' },
        { name: 'Pure White', code: '#ffffff', slug: 'white' },
        { name: 'Navy Blue', code: '#1e3a8a', slug: 'navy-blue' },
        { name: 'Royal Blue', code: '#2563eb', slug: 'royal-blue' },
        { name: 'Olive Green', code: '#4d7c0f', slug: 'olive-green' },
        { name: 'Emerald Green', code: '#059669', slug: 'emerald-green' },
        { name: 'Charcoal Grey', code: '#374151', slug: 'charcoal-grey' },
        { name: 'Tan Brown', code: '#b45309', slug: 'tan-brown' },
        { name: 'Maroon / Crimson', code: '#991b1b', slug: 'maroon' },
        { name: 'Beige / Cream', code: '#e5e5d8', slug: 'beige' },
        { name: 'Dusty Pink', code: '#f472b6', slug: 'dusty-pink' },
        { name: 'Mustard Yellow', code: '#d97706', slug: 'mustard-yellow' },
      ]);
    }

    return NextResponse.json({ success: true, count: colors.length, colors });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch colors', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const color = await Color.create({ ...body, slug });
    return NextResponse.json({ success: true, color }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create color', error: error.message },
      { status: 400 }
    );
  }
}
