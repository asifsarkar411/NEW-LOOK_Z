import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import AuditLog from '@/models/AuditLog';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await dbConnect();
    const { email, currentPassword, newPassword } = await request.json();

    const admin = await Admin.findOne({ email: email || 'admin@example.com' });
    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Current password does not match' },
        { status: 400 }
      );
    }

    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    await AuditLog.create({
      userEmail: admin.email,
      action: 'PASSWORD_CHANGE',
      entity: 'Security',
      ipAddress: '127.0.0.1',
      details: 'Administrator password changed successfully',
    });

    return NextResponse.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error changing password', error: error.message },
      { status: 500 }
    );
  }
}
