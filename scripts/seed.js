import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

import Category from '../src/models/Category.js';
import Product from '../src/models/Product.js';
import Banner from '../src/models/Banner.js';
import Coupon from '../src/models/Coupon.js';
import Admin from '../src/models/Admin.js';
import Setting from '../src/models/Setting.js';
import Blog from '../src/models/Blog.js';
import Purchase from '../src/models/Purchase.js';
import Role from '../src/models/Role.js';
import AuditLog from '../src/models/AuditLog.js';

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://smferdousahmmed19_db_user:Z8xB6EbTFuFsr1KU@cluster0.cyxxsxo.mongodb.net/newlook_z?retryWrites=true&w=majority&appName=Cluster0';

async function seed() {
  console.log('Connecting to MongoDB Atlas at:', MONGODB_URI);
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 8000,
  });
  console.log('Connected successfully!');

  // Seed Blogs if none
  const existingBlogs = await Blog.countDocuments();
  if (existingBlogs === 0) {
    await Blog.create([
      {
        slug: 'future-of-fashion-2026',
        title: 'The Future of Fashion & Streetwear Trends in 2026',
        category: 'Trends',
        author: 'NEW LOOK_Z Editorial',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
        excerpt: 'Discover how minimalist aesthetics, breathable organic fabrics, and versatile accessories are shaping the modern wardrobe for dynamic lifestyle lovers.',
        content: `Fashion in 2026 is experiencing an exhilarating evolution towards functional elegance, breathable sustainable fabrics, and minimalist street aesthetics. Consumers in Bangladesh and worldwide are increasingly looking for clothing that balances effortless style with everyday performance.\n\n1. The Resurgence of Breathable Linens & Cottons\nAs temperatures soar during summer and monsoon seasons, lightweight linen-cotton blends and combed cotton t-shirts have become absolute wardrobe staples.\n\n2. High-Impact Minimalist Accessories\nA curated accessory choice can transform even the simplest jeans-and-tee combination into a deliberate fashion statement. Full-grain leather belts with automatic buckles and RFID-shielded slim bi-fold wallets provide subtle sophistication.`,
        isPublished: true,
      },
      {
        slug: '5-proven-styling-tips',
        title: '5 Proven Styling Tips to Upgrade Your Everyday Casual Outfit',
        category: 'Guides',
        author: 'NEW LOOK_Z Editorial',
        image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80',
        excerpt: 'From pairing textured linen shirts with relaxed fit denim to selecting the right leather accessories, step up your casual look with ease.',
        content: `Looking stylish every day does not require an endless wardrobe. With a few thoughtful styling principles, you can transform basic essentials into striking outfits.\n\n1. Master the Fit: Clothes that fit your body structure immediately look more premium.\n2. Choose Cohesive Color Palettes: Earth tones, classic navy, charcoal, and crisp white work together seamlessly.\n3. Layer Smartly: Lightweight overshirts add dimension without feeling bulky.\n4. Invest in Leather: A high-grade leather belt or wallet elevates the whole ensemble.`,
        isPublished: true,
      },
      {
        slug: 'guide-to-genuine-leather',
        title: 'How to Pick Genuine Leather Belts and Wallets That Last for Years',
        category: 'Craftsmanship',
        author: 'Leather Craftsmen',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
        excerpt: 'A comprehensive guide to identifying full-grain leather, durable zinc-alloy buckles, and RFID-safe bi-fold wallet craftsmanship.',
        content: `Genuine leather goods age like fine wine, developing a rich patina over years of use. Here is how to verify genuine craftsmanship:\n\n- Look for natural grain textures rather than synthetic repetitive stamps.\n- Test suppleness and flexibility.\n- Check edge finishing and durable nylon stitch count.`,
        isPublished: true,
      },
    ]);
    console.log('Seeded Blogs!');
  }

  // Seed Roles if none
  const existingRoles = await Role.countDocuments();
  if (existingRoles === 0) {
    await Role.create([
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
    ]);
    console.log('Seeded Roles!');
  }

  // Seed sample Purchases if none
  const existingPurchases = await Purchase.countDocuments();
  if (existingPurchases === 0) {
    await Purchase.create([
      {
        poNumber: 'PO-1001',
        supplierName: 'Dhaka Garments & Fabrics Ltd',
        supplierPhone: '01711223344',
        items: [
          { title: 'Mens Casual Linen Shirt', quantity: 50, unitCost: 750, totalCost: 37500 },
          { title: 'Premium Cotton Polo T-Shirt', quantity: 100, unitCost: 450, totalCost: 45000 },
        ],
        totalCost: 82500,
        paidAmount: 82500,
        dueAmount: 0,
        paymentStatus: 'paid',
        note: 'Summer Collection initial stock purchase',
      },
      {
        poNumber: 'PO-1002',
        supplierName: 'Bengal Leather Exports',
        supplierPhone: '01855667788',
        items: [
          { title: 'Genuine Leather Auto Buckle Belt', quantity: 40, unitCost: 550, totalCost: 22000 },
          { title: 'Full Grain Leather Slim Wallet', quantity: 60, unitCost: 400, totalCost: 24000 },
        ],
        totalCost: 46000,
        paidAmount: 30000,
        dueAmount: 16000,
        paymentStatus: 'partial',
        note: 'Leather goods batch order',
      },
    ]);
    console.log('Seeded Purchases!');
  }

  console.log('All extensions seeded successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
