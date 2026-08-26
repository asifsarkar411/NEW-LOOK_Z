import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Coupon from '@/models/Coupon';

export async function POST(request) {
  try {
    await dbConnect();
    const { code, subtotal } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Please enter a coupon code' },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired coupon code' },
        { status: 404 }
      );
    }

    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json(
        { success: false, message: 'This coupon has expired' },
        { status: 400 }
      );
    }

    if (coupon.minimumSpend && subtotal < coupon.minimumSpend) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum spend of ৳ ${coupon.minimumSpend} required to use this coupon`,
        },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return NextResponse.json({
      success: true,
      message: `Coupon "${coupon.code}" applied successfully!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount,
      },
    });
  } catch (error) {
    console.error('Coupon apply error:', error);
    return NextResponse.json(
      { success: false, message: 'Error verifying coupon', error: error.message },
      { status: 500 }
    );
  }
}
