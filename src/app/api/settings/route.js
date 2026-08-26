import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Setting from '@/models/Setting';

export async function GET() {
  try {
    await dbConnect();
    let setting = await Setting.findOne({}).lean();
    if (!setting) {
      setting = await Setting.create({});
    }
    return NextResponse.json({ success: true, setting });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings', error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    let setting = await Setting.findOneAndUpdate({}, body, { new: true, upsert: true });
    return NextResponse.json({ success: true, setting });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to update settings', error: error.message },
      { status: 400 }
    );
  }
}
