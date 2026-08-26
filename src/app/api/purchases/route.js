import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import Product from '@/models/Product';
import AuditLog from '@/models/AuditLog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const purchases = await Purchase.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, count: purchases.length, purchases });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch purchases', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const poNumber = `PO-${Math.floor(1000 + Math.random() * 9000)}`;

    const totalCost = body.items.reduce((sum, item) => sum + item.quantity * item.unitCost, 0);
    const paidAmount = Number(body.paidAmount || totalCost);
    const dueAmount = Math.max(0, totalCost - paidAmount);
    const paymentStatus = dueAmount === 0 ? 'paid' : paidAmount > 0 ? 'partial' : 'due';

    const purchase = await Purchase.create({
      ...body,
      poNumber,
      totalCost,
      paidAmount,
      dueAmount,
      paymentStatus,
    });

    // Auto-update product stock levels for each item purchased
    for (const item of body.items) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity },
        });
      }
    }

    // Log audit
    await AuditLog.create({
      userEmail: body.createdBy || 'admin@example.com',
      action: 'CREATE_PURCHASE',
      entity: 'Purchase',
      entityId: purchase.poNumber,
      details: `Created Purchase Order ${purchase.poNumber} for supplier ${purchase.supplierName} (Total: ৳${totalCost})`,
    });

    return NextResponse.json({ success: true, purchase }, { status: 201 });
  } catch (error) {
    console.error('Purchase creation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create purchase order', error: error.message },
      { status: 400 }
    );
  }
}
