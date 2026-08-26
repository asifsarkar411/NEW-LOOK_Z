import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, count: coupons.length, coupons });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch coupons', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    body.code = body.code.toUpperCase().trim();
    const coupon = await Coupon.create(body);
    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create coupon', error: error.message },
      { status: 400 }
    );
  }
}
