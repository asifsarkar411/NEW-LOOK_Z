import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    const query = {};
    if (status && status !== 'all') {
      query.orderStatus = status;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(limit).lean();

    return NextResponse.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `NLZ-${randomDigits}`;

    const newOrder = {
      orderNumber,
      customer: {
        name: body.customer?.name || body.name,
        phone: body.customer?.phone || body.phone,
        email: body.customer?.email || body.email || '',
        address: body.customer?.address || body.address,
        city: body.customer?.city || body.city || 'Dhaka',
        zone: body.customer?.zone || body.zone || 'inside_dhaka',
        note: body.customer?.note || body.note || '',
      },
      items: body.items || [],
      subtotal: body.subtotal || 0,
      deliveryCharge: body.deliveryCharge || 60,
      discount: body.discount || 0,
      couponCode: body.couponCode || '',
      totalAmount: body.totalAmount || 0,
      paymentMethod: body.paymentMethod || 'cod',
      paymentStatus: body.paymentMethod === 'cod' ? 'pending' : 'pending',
      transactionId: body.transactionId || '',
      orderStatus: 'pending',
      timeline: [
        {
          status: 'pending',
          note: 'Order placed successfully by customer',
          timestamp: new Date(),
        },
      ],
    };

    const order = await Order.create(newOrder);

    if (body.couponCode) {
      await Coupon.updateOne(
        { code: body.couponCode.toUpperCase() },
        { $inc: { usedCount: 1 } }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Order created successfully',
        order,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create order', error: error.message },
      { status: 400 }
    );
  }
}
