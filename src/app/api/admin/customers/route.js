import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

    const customerMap = {};

    for (const o of orders) {
      const phone = o.customer?.phone || 'Unknown';
      if (!customerMap[phone]) {
        customerMap[phone] = {
          name: o.customer?.name || 'Guest Customer',
          phone,
          email: o.customer?.email || 'N/A',
          city: o.customer?.city || 'Dhaka',
          address: o.customer?.address || '',
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: o.createdAt,
          orders: [],
        };
      }
      customerMap[phone].totalOrders += 1;
      customerMap[phone].totalSpent += o.totalAmount || 0;
      customerMap[phone].orders.push({
        orderNumber: o.orderNumber,
        amount: o.totalAmount,
        status: o.orderStatus,
        date: o.createdAt,
      });
    }

    const customers = Object.values(customerMap);
    return NextResponse.json({ success: true, count: customers.length, customers });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers', error: error.message },
      { status: 500 }
    );
  }
}
