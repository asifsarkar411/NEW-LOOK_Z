import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Please enter an Order ID or Phone number' },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      $or: [
        { orderNumber: { $regex: new RegExp(`^${query}$`, 'i') } },
        { 'customer.phone': { $regex: query } },
      ],
    }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'No order found with provided details' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track order', error: error.message },
      { status: 500 }
    );
  }
}
