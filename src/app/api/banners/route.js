import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Banner from '@/models/Banner';

export async function GET() {
  try {
    await dbConnect();
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 }).lean();
    return NextResponse.json({ success: true, count: banners.length, banners });
  } catch (error) {
    console.error('Error fetching banners:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch banners', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const banner = await Banner.create(body);
    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error) {
    console.error('Error creating banner:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create banner', error: error.message },
      { status: 400 }
    );
  }
}
