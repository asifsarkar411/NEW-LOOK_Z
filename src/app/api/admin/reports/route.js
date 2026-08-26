import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Purchase from '@/models/Purchase';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    const [orders, purchases, products] = await Promise.all([
      Order.find({ orderStatus: { $ne: 'cancelled' } }).lean(),
      Purchase.find({}).lean(),
      Product.find({}).lean(),
    ]);

    const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const totalPurchaseCost = purchases.reduce((sum, p) => sum + (p.totalCost || 0), 0);
    const grossProfit = totalSales - totalPurchaseCost;
    const totalItemsSold = orders.reduce(
      (sum, o) => sum + (o.items?.reduce((isum, item) => isum + (item.quantity || 1), 0) || 0),
      0
    );

    // Stock valuation
    const stockValuation = products.reduce(
      (sum, p) => sum + (p.stock || 0) * (p.sellingPrice || 0),
      0
    );

    // Top Selling Products map
    const productSalesMap = {};
    for (const o of orders) {
      for (const item of o.items || []) {
        const title = item.title || 'Product';
        if (!productSalesMap[title]) {
          productSalesMap[title] = { title, image: item.image, count: 0, revenue: 0 };
        }
        productSalesMap[title].count += item.quantity || 1;
        productSalesMap[title].revenue += item.total || (item.price * (item.quantity || 1));
      }
    }

    const topSellingProducts = Object.values(productSalesMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    // Monthly breakdown (sample aggregated)
    const monthlySales = [
      { month: 'Jan', sales: Math.round(totalSales * 0.1), purchases: Math.round(totalPurchaseCost * 0.12) },
      { month: 'Feb', sales: Math.round(totalSales * 0.15), purchases: Math.round(totalPurchaseCost * 0.14) },
      { month: 'Mar', sales: Math.round(totalSales * 0.2), purchases: Math.round(totalPurchaseCost * 0.18) },
      { month: 'Apr', sales: Math.round(totalSales * 0.25), purchases: Math.round(totalPurchaseCost * 0.22) },
      { month: 'May', sales: Math.round(totalSales * 0.3), purchases: Math.round(totalPurchaseCost * 0.24) },
    ];

    return NextResponse.json({
      success: true,
      report: {
        totalSales,
        totalOrders: orders.length,
        totalItemsSold,
        totalPurchaseCost,
        grossProfit,
        stockValuation,
        totalProductsCount: products.length,
        topSellingProducts,
        monthlySales,
      },
    });
  } catch (error) {
    console.error('Reports error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate reports', error: error.message },
      { status: 500 }
    );
  }
}
