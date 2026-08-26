import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { slug } = params;

    const product = await Product.findOne({ slug }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    // Also find related products from same category
    const relatedProducts = await Product.find({
      categorySlug: product.categorySlug,
      _id: { $ne: product._id },
      isActive: true,
    })
      .limit(4)
      .lean();

    return NextResponse.json({ success: true, product, relatedProducts });
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { slug } = params;
    const body = await request.json();

    if (body.regularPrice && body.sellingPrice && body.regularPrice > body.sellingPrice) {
      body.discountPercentage = Math.round(
        ((body.regularPrice - body.sellingPrice) / body.regularPrice) * 100
      );
    }

    const updated = await Product.findOneAndUpdate(
      { $or: [{ slug }, { _id: slug }] },
      body,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product: updated });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product', error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { slug } = params;

    const deleted = await Product.findOneAndDelete({
      $or: [{ slug }, { _id: slug }],
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product', error: error.message },
      { status: 500 }
    );
  }
}
