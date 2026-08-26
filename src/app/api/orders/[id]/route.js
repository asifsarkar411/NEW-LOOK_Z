import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    const order = await Order.findOne({
      $or: [{ orderNumber: id }, { _id: id }],
    }).lean();

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error fetching order', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await request.json();

    const order = await Order.findOne({
      $or: [{ orderNumber: id }, { _id: id }],
    });

    if (!order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    if (body.orderStatus && body.orderStatus !== order.orderStatus) {
      order.orderStatus = body.orderStatus;
      order.timeline.push({
        status: body.orderStatus,
        note: body.note || `Status updated to ${body.orderStatus}`,
        timestamp: new Date(),
      });
    }

    if (body.paymentStatus) {
      order.paymentStatus = body.paymentStatus;
    }

    if (body.customer) {
      order.customer = { ...order.customer, ...body.customer };
    }

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error updating order', error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = params;

    await Order.findOneAndDelete({
      $or: [{ orderNumber: id }, { _id: id }],
    });

    return NextResponse.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error deleting order', error: error.message },
      { status: 500 }
    );
  }
}
