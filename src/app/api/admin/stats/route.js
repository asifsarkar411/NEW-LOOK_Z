import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function GET() {
  try {
    await dbConnect();

    const [totalOrders, totalProducts, totalCategories, orders] = await Promise.all([
      Order.countDocuments({}),
      Product.countDocuments({}),
      Category.countDocuments({}),
      Order.find({}).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    const totalRevenue = (
      await Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ])
    )[0]?.total || 0;

    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const lowStockProducts = await Product.countDocuments({ stock: { $lte: 10 } });

    return NextResponse.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalCategories,
        pendingOrders,
        lowStockProducts,
      },
      recentOrders: orders,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats', error: error.message },
      { status: 500 }
    );
  }
}
