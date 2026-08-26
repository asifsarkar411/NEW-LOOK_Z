import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Role from '@/models/Role';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    let roles = await Role.find({}).sort({ createdAt: 1 }).lean();

    if (roles.length === 0) {
      // Seed initial default roles
      roles = await Role.create([
        {
          name: 'Super Admin',
          slug: 'super-admin',
          description: 'Full unrestricted access to all store modules and settings',
          permissions: [
            'orders:read',
            'orders:write',
            'orders:delete',
            'products:read',
            'products:write',
            'products:delete',
            'purchases:read',
            'purchases:write',
            'customers:read',
            'blogs:read',
            'blogs:write',
            'reports:read',
            'settings:write',
            'users:manage',
            'security:manage',
          ],
          isSystemRole: true,
        },
        {
          name: 'Store Manager',
          slug: 'store-manager',
          description: 'Manage products, inventory, orders, customer details and sales reports',
          permissions: [
            'orders:read',
            'orders:write',
            'products:read',
            'products:write',
            'purchases:read',
            'purchases:write',
            'customers:read',
            'blogs:read',
            'blogs:write',
            'reports:read',
          ],
          isSystemRole: true,
        },
        {
          name: 'Order Fulfillment Officer',
          slug: 'fulfillment-officer',
          description: 'Process and ship customer orders',
          permissions: ['orders:read', 'orders:write', 'customers:read'],
          isSystemRole: false,
        },
      ]);
    }

    return NextResponse.json({ success: true, count: roles.length, roles });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch roles', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const role = await Role.create({
      ...body,
      slug,
    });

    return NextResponse.json({ success: true, role }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create role', error: error.message },
      { status: 400 }
    );
  }
}
