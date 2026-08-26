import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import AuditLog from '@/models/AuditLog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const users = await Admin.find({}).select('-password').sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, users });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch users', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { name, email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const existing = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Admin.create({
      name: name || 'Staff User',
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role || 'manager',
    });

    await AuditLog.create({
      userEmail: 'admin@example.com',
      action: 'CREATE_USER',
      entity: 'Admin',
      entityId: user.email,
      details: `Created new staff user ${user.name} (${user.email}) with role ${user.role}`,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create user', error: error.message },
      { status: 500 }
    );
  }
}
