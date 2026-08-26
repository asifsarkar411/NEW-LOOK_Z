const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {}

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://smferdousahmmed19_db_user:Z8xB6EbTFuFsr1KU@cluster0.cyxxsxo.mongodb.net/newlook_z?retryWrites=true&w=majority&appName=Cluster0';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB Atlas with Google/Cloudflare DNS...');
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('Connected to MongoDB successfully.');

    // Define schemas inline for standalone script execution
    const Category =
      mongoose.models.Category ||
      mongoose.model(
        'Category',
        new mongoose.Schema(
          {
            name: { type: String, required: true },
            slug: { type: String, required: true, unique: true },
            image: { type: String, default: '' },
            icon: { type: String, default: 'ri-apps-2-line' },
            subcategories: [
              {
                name: { type: String, required: true },
                slug: { type: String, required: true },
              },
            ],
            featured: { type: Boolean, default: true },
            order: { type: Number, default: 0 },
          },
          { timestamps: true }
        )
      );

    const Product =
      mongoose.models.Product ||
      mongoose.model(
        'Product',
        new mongoose.Schema(
          {
            title: { type: String, required: true },
            slug: { type: String, required: true, unique: true },
            description: { type: String, default: '' },
            shortDescription: { type: String, default: '' },
            regularPrice: { type: Number, required: true },
            sellingPrice: { type: Number, required: true },
            discountPercentage: { type: Number, default: 0 },
            images: [{ type: String }],
            primaryImage: { type: String, required: true },
            category: { type: String, required: true },
            categorySlug: { type: String, required: true },
            subcategory: { type: String, default: '' },
            subcategorySlug: { type: String, default: '' },
            stock: { type: Number, default: 50 },
            sku: { type: String, default: '' },
            axes: [
              {
                name: { type: String },
                values: [
                  {
                    label: { type: String },
                    swatch: { type: String, default: null },
                  },
                ],
              },
            ],
            variants: [
              {
                id: { type: String },
                options: { type: Map, of: String },
                stock: { type: Number, default: 10 },
                price: { type: Number },
                sku: { type: String },
              },
            ],
            isFeatured: { type: Boolean, default: false },
            isNewArrival: { type: Boolean, default: true },
            isTopSelling: { type: Boolean, default: false },
            isTrending: { type: Boolean, default: false },
            isTopRated: { type: Boolean, default: false },
            rating: { type: Number, default: 5 },
            reviewCount: { type: Number, default: 0 },
            isActive: { type: Boolean, default: true },
          },
          { timestamps: true }
        )
      );

    const Banner =
      mongoose.models.Banner ||
      mongoose.model(
        'Banner',
        new mongoose.Schema(
          {
            title: { type: String, default: 'Promotional Banner' },
            image: { type: String, required: true },
            mobileImage: { type: String },
            link: { type: String, default: '/shop' },
            type: { type: String, default: 'hero' },
            order: { type: Number, default: 0 },
            isActive: { type: Boolean, default: true },
          },
          { timestamps: true }
        )
      );

    const Coupon =
      mongoose.models.Coupon ||
      mongoose.model(
        'Coupon',
        new mongoose.Schema(
          {
            code: { type: String, required: true, unique: true },
            discountType: { type: String, default: 'percentage' },
            discountValue: { type: Number, required: true },
            minimumSpend: { type: Number, default: 0 },
            maxDiscount: { type: Number, default: null },
            expiryDate: { type: Date },
            usageLimit: { type: Number, default: 1000 },
            usedCount: { type: Number, default: 0 },
            isActive: { type: Boolean, default: true },
          },
          { timestamps: true }
        )
      );

    const Admin =
      mongoose.models.Admin ||
      mongoose.model(
        'Admin',
        new mongoose.Schema(
          {
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            role: { type: String, default: 'superadmin' },
          },
          { timestamps: true }
        )
      );

    const Setting =
      mongoose.models.Setting ||
      mongoose.model(
        'Setting',
        new mongoose.Schema(
          {
            storeName: { type: String, default: 'NEW LOOK_Z' },
            storeTagline: { type: String, default: 'Trending Lifestyle & Fashion Store' },
            phone: { type: String, default: '+8801824416130' },
            email: { type: String, default: 'contact@newlookz.com' },
            address: { type: String, default: 'Mirpur 1, Dhaka, Bangladesh' },
            whatsappNumber: { type: String, default: '8801824416130' },
            topbarMarquee: {
              type: String,
              default: 'Get 25% off on your purchase! Use this coupon code SAVE25 on the Checkout Page',
            },
            deliveryInsideDhaka: { type: Number, default: 60 },
            deliveryOutsideDhaka: { type: Number, default: 120 },
            freeDeliveryThreshold: { type: Number, default: 2500 },
            facebookUrl: { type: String, default: 'https://facebook.com' },
            instagramUrl: { type: String, default: 'https://instagram.com' },
            youtubeUrl: { type: String, default: 'https://youtube.com' },
            logoUrl: { type: String, default: '' },
          },
          { timestamps: true }
        )
      );

    // Clear old data for a fresh clean state
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Banner.deleteMany({});
    await Coupon.deleteMany({});
    await Admin.deleteMany({});
    await Setting.deleteMany({});

    console.log('Cleared existing collections.');

    // 1. Seed Categories
    const categoriesData = [
      {
        name: 'Mens Fashion',
        slug: 'mens-fashion',
        image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80',
        icon: 'ri-t-shirt-line',
        subcategories: [
          { name: 'Shirts', slug: 'shirts' },
          { name: 'Pants', slug: 'pants' },
          { name: 'T-Shirt', slug: 't-shirt' },
          { name: 'Panjabi', slug: 'panjabi' },
          { name: 'Jacket', slug: 'jacket' },
          { name: 'Hoodies', slug: 'hoodies' },
          { name: 'Shoes', slug: 'shoes' },
        ],
        featured: true,
        order: 1,
      },
      {
        name: 'Womens Fashion',
        slug: 'womens-fashion',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
        icon: 'ri-women-line',
        subcategories: [
          { name: 'Tops Long', slug: 'tops-long' },
          { name: 'Ladies Plajo', slug: 'ladies-plajo' },
          { name: 'Borka', slug: 'borka' },
        ],
        featured: true,
        order: 2,
      },
      {
        name: 'Mens Shoes',
        slug: 'mens-shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
        icon: 'ri-footprint-line',
        subcategories: [
          { name: 'Formal Shoes', slug: 'formal-shoes' },
          { name: 'Crocks', slug: 'crocks' },
          { name: 'Casual Shoes', slug: 'casual-shoes' },
        ],
        featured: true,
        order: 3,
      },
      {
        name: 'Kids Fashion',
        slug: 'kids-fashion',
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&auto=format&fit=crop&q=80',
        icon: 'ri-user-smile-line',
        subcategories: [
          { name: 'Kids Shoe', slug: 'kids-shoe' },
          { name: 'Kids Shirt', slug: 'kids-shirt' },
          { name: 'Kids Pant', slug: 'kids-pant' },
        ],
        featured: true,
        order: 4,
      },
      {
        name: 'Belts',
        slug: 'belts',
        image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop&q=80',
        icon: 'ri-handbag-line',
        subcategories: [{ name: 'Leather Belts', slug: 'leather-belts' }],
        featured: true,
        order: 5,
      },
      {
        name: 'Caps',
        slug: 'caps',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=80',
        icon: 'ri-vip-crown-line',
        subcategories: [{ name: 'Leather Cap', slug: 'leather-cap' }],
        featured: true,
        order: 6,
      },
      {
        name: 'Gents Wallet',
        slug: 'gents-wallet',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&auto=format&fit=crop&q=80',
        icon: 'ri-wallet-3-line',
        subcategories: [{ name: 'Leather Wallet', slug: 'leather-wallet' }],
        featured: true,
        order: 7,
      },
      {
        name: 'Face Mask',
        slug: 'face-mask',
        image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=600&auto=format&fit=crop&q=80',
        icon: 'ri-shield-user-line',
        subcategories: [
          { name: '6 Layer Mask', slug: '6-layer-mask' },
          { name: 'Ladies Mask', slug: 'ladies-mask' },
          { name: 'Mens Mask', slug: 'mens-mask' },
        ],
        featured: true,
        order: 8,
      },
    ];

    await Category.insertMany(categoriesData);
    console.log('Categories seeded.');

    // 2. Seed Hero Banners
    const bannersData = [
      {
        title: 'New Season Arrival - Up to 40% Off',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&auto=format&fit=crop&q=80',
        link: '/shop',
        type: 'hero',
        order: 1,
        isActive: true,
      },
      {
        title: 'Premium Mens Formal & Casual Attire',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&auto=format&fit=crop&q=80',
        link: '/shop?category=mens-fashion',
        type: 'hero',
        order: 2,
        isActive: true,
      },
      {
        title: 'Exclusive Ethnic & Summer Collection',
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&auto=format&fit=crop&q=80',
        link: '/shop?category=womens-fashion',
        type: 'hero',
        order: 3,
        isActive: true,
      },
    ];

    await Banner.insertMany(bannersData);
    console.log('Banners seeded.');

    // 3. Seed Products
    const productsData = [
      {
        title: 'Reusable Face Mask - Cotton Black',
        slug: 'cotton-face-mask-black',
        description:
          'Premium 6-layer reusable protective cotton face mask. High breathability, washable, and designed for all-day comfort with elastic earloops.',
        shortDescription: '6-Layer protective washable cotton face mask.',
        regularPrice: 200,
        sellingPrice: 150,
        discountPercentage: 25,
        primaryImage: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=700&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Face Mask',
        categorySlug: 'face-mask',
        subcategory: '6 Layer Mask',
        subcategorySlug: '6-layer-mask',
        stock: 120,
        sku: 'MSK-6L-BLK',
        axes: [
          {
            name: 'Color',
            values: [
              { label: 'Black', swatch: '#000000' },
              { label: 'Navy Blue', swatch: '#1e3a8a' },
            ],
          },
        ],
        variants: [
          { id: 'v1', options: { Color: 'Black' }, stock: 60, price: 150, sku: 'MSK-BLK' },
          { id: 'v2', options: { Color: 'Navy Blue' }, stock: 60, price: 150, sku: 'MSK-BLU' },
        ],
        isFeatured: true,
        isNewArrival: true,
        isTopSelling: false,
        isTrending: true,
        isTopRated: true,
        rating: 5,
        reviewCount: 28,
      },
      {
        title: 'Mens Classic Cap - Black Edition',
        slug: 'mens-classic-cap-black',
        description:
          'Elevate your casual look with this premium textured baseball cap. Crafted from 100% breathable material with adjustable metal buckle at the back.',
        shortDescription: 'Classic black structured baseball cap.',
        regularPrice: 500,
        sellingPrice: 350,
        discountPercentage: 30,
        primaryImage: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=700&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Caps',
        categorySlug: 'caps',
        subcategory: 'Leather Cap',
        subcategorySlug: 'leather-cap',
        stock: 85,
        sku: 'CAP-CLS-BLK',
        axes: [
          {
            name: 'Size',
            values: [
              { label: 'Standard Free Size', swatch: null },
            ],
          },
        ],
        variants: [
          { id: 'v3', options: { Size: 'Standard Free Size' }, stock: 85, price: 350, sku: 'CAP-STD' },
        ],
        isFeatured: true,
        isNewArrival: true,
        isTopSelling: true,
        isTrending: true,
        isTopRated: false,
        rating: 4.8,
        reviewCount: 19,
      },
      {
        title: 'Kids T-Shirt - Cartoon Print Red',
        slug: 'kids-tshirt-cartoon-red',
        description:
          'Super soft 100% combed cotton t-shirt for kids. Features vibrant, skin-safe cartoon graphic prints that withstand countless washes.',
        shortDescription: '100% Combed soft cotton cartoon graphic t-shirt.',
        regularPrice: 600,
        sellingPrice: 450,
        discountPercentage: 25,
        primaryImage: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Kids Fashion',
        categorySlug: 'kids-fashion',
        subcategory: 'Kids Shirt',
        subcategorySlug: 'kids-shirt',
        stock: 45,
        sku: 'KID-TSH-RED',
        axes: [
          {
            name: 'Size',
            values: [
              { label: '2-3 Yrs', swatch: null },
              { label: '4-5 Yrs', swatch: null },
              { label: '6-7 Yrs', swatch: null },
            ],
          },
        ],
        variants: [
          { id: 'v4', options: { Size: '2-3 Yrs' }, stock: 15, price: 450, sku: 'KID-23' },
          { id: 'v5', options: { Size: '4-5 Yrs' }, stock: 15, price: 450, sku: 'KID-45' },
          { id: 'v6', options: { Size: '6-7 Yrs' }, stock: 15, price: 450, sku: 'KID-67' },
        ],
        isFeatured: false,
        isNewArrival: true,
        isTopSelling: true,
        isTrending: false,
        isTopRated: false,
        rating: 4.9,
        reviewCount: 14,
      },
      {
        title: 'Women Casual Kurti - Yellow Floral',
        slug: 'women-casual-kurti-yellow-floral',
        description:
          'Graceful summer floral kurti tailored in breathable premium georgette silk. Features fine neckline embroidery and flowy fit.',
        shortDescription: 'Elegant yellow floral printed casual summer kurti.',
        regularPrice: 1100,
        sellingPrice: 890,
        discountPercentage: 19,
        primaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Womens Fashion',
        categorySlug: 'womens-fashion',
        subcategory: 'Tops Long',
        subcategorySlug: 'tops-long',
        stock: 35,
        sku: 'WMN-KRT-YEL',
        axes: [
          {
            name: 'Size',
            values: [
              { label: '38', swatch: null },
              { label: '40', swatch: null },
              { label: '42', swatch: null },
              { label: '44', swatch: null },
            ],
          },
        ],
        variants: [
          { id: 'v7', options: { Size: '38' }, stock: 10, price: 890, sku: 'KRT-38' },
          { id: 'v8', options: { Size: '40' }, stock: 10, price: 890, sku: 'KRT-40' },
          { id: 'v9', options: { Size: '42' }, stock: 10, price: 890, sku: 'KRT-42' },
          { id: 'v10', options: { Size: '44' }, stock: 5, price: 890, sku: 'KRT-44' },
        ],
        isFeatured: true,
        isNewArrival: true,
        isTopSelling: true,
        isTrending: true,
        isTopRated: true,
        rating: 5,
        reviewCount: 32,
      },
      {
        title: 'Sports Training Jersey - Blue Edition',
        slug: 'sports-training-jersey-blue',
        description:
          'High performance moisture-wicking athletic sports jersey. Quick-dry micro-mesh fabric keeps you cool during intense workouts and casual outings.',
        shortDescription: 'Breathable dry-fit active sports jersey.',
        regularPrice: 650,
        sellingPrice: 500,
        discountPercentage: 23,
        primaryImage: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=700&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Mens Fashion',
        categorySlug: 'mens-fashion',
        subcategory: 'T-Shirt',
        subcategorySlug: 't-shirt',
        stock: 75,
        sku: 'M-JRS-BLU',
        axes: [
          {
            name: 'Size',
            values: [
              { label: 'M', swatch: null },
              { label: 'L', swatch: null },
              { label: 'XL', swatch: null },
              { label: 'XXL', swatch: null },
            ],
          },
        ],
        variants: [
          { id: 'v11', options: { Size: 'M' }, stock: 20, price: 500, sku: 'JRS-M' },
          { id: 'v12', options: { Size: 'L' }, stock: 25, price: 500, sku: 'JRS-L' },
          { id: 'v13', options: { Size: 'XL' }, stock: 20, price: 500, sku: 'JRS-XL' },
          { id: 'v14', options: { Size: 'XXL' }, stock: 10, price: 500, sku: 'JRS-XXL' },
        ],
        isFeatured: true,
        isNewArrival: true,
        isTopSelling: true,
        isTrending: true,
        isTopRated: true,
        rating: 4.8,
        reviewCount: 41,
      },
      {
        title: 'Mens Leather Belt - Formal Black',
        slug: 'mens-leather-belt-black',
        description:
          '100% Genuine full-grain leather formal belt with brushed zinc-alloy automatic ratchet buckle. Durable, scratch-resistant and elegant.',
        shortDescription: 'Genuine leather formal belt with alloy buckle.',
        regularPrice: 850,
        sellingPrice: 690,
        discountPercentage: 19,
        primaryImage: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Belts',
        categorySlug: 'belts',
        subcategory: 'Leather Belts',
        subcategorySlug: 'leather-belts',
        stock: 50,
        sku: 'BLT-LTH-BLK',
        axes: [
          {
            name: 'Size',
            values: [
              { label: '32-36 Inch', swatch: null },
              { label: '38-42 Inch', swatch: null },
            ],
          },
        ],
        variants: [
          { id: 'v15', options: { Size: '32-36 Inch' }, stock: 25, price: 690, sku: 'BLT-3236' },
          { id: 'v16', options: { Size: '38-42 Inch' }, stock: 25, price: 690, sku: 'BLT-3842' },
        ],
        isFeatured: true,
        isNewArrival: false,
        isTopSelling: true,
        isTrending: true,
        isTopRated: true,
        rating: 4.9,
        reviewCount: 55,
      },
      {
        title: 'Genuine Leather Wallet - Brown',
        slug: 'leather-wallet-brown',
        description:
          'Handcrafted bi-fold leather wallet with RFID blocking technology. Features 8 card slots, double currency compartments, and quick ID window.',
        shortDescription: 'Handcrafted RFID blocking genuine leather wallet.',
        regularPrice: 900,
        sellingPrice: 720,
        discountPercentage: 20,
        primaryImage: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1627123424574-724758594e93?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Gents Wallet',
        categorySlug: 'gents-wallet',
        subcategory: 'Leather Wallet',
        subcategorySlug: 'leather-wallet',
        stock: 60,
        sku: 'WLT-LTH-BRN',
        axes: [
          {
            name: 'Color',
            values: [
              { label: 'Vintage Brown', swatch: '#78350f' },
              { label: 'Classic Black', swatch: '#000000' },
            ],
          },
        ],
        variants: [
          { id: 'v17', options: { Color: 'Vintage Brown' }, stock: 35, price: 720, sku: 'WLT-BRN' },
          { id: 'v18', options: { Color: 'Classic Black' }, stock: 25, price: 720, sku: 'WLT-BLK' },
        ],
        isFeatured: true,
        isNewArrival: false,
        isTopSelling: true,
        isTrending: true,
        isTopRated: true,
        rating: 5,
        reviewCount: 68,
      },
      {
        title: 'Mens Casual Sneakers - White',
        slug: 'mens-casual-sneakers-white',
        description:
          'Clean, minimalist low-top sneakers with memory foam insole and vulcanized anti-slip rubber outsole. Perfect for daily streetwear style.',
        shortDescription: 'Minimalist low-top comfortable daily sneakers.',
        regularPrice: 2200,
        sellingPrice: 1800,
        discountPercentage: 18,
        primaryImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Mens Shoes',
        categorySlug: 'mens-shoes',
        subcategory: 'Casual Shoes',
        subcategorySlug: 'casual-shoes',
        stock: 40,
        sku: 'SNK-WHT-01',
        axes: [
          {
            name: 'Size',
            values: [
              { label: '40 (EU)', swatch: null },
              { label: '41 (EU)', swatch: null },
              { label: '42 (EU)', swatch: null },
              { label: '43 (EU)', swatch: null },
              { label: '44 (EU)', swatch: null },
            ],
          },
        ],
        variants: [
          { id: 'v19', options: { Size: '40 (EU)' }, stock: 8, price: 1800, sku: 'SNK-40' },
          { id: 'v20', options: { Size: '41 (EU)' }, stock: 10, price: 1800, sku: 'SNK-41' },
          { id: 'v21', options: { Size: '42 (EU)' }, stock: 12, price: 1800, sku: 'SNK-42' },
          { id: 'v22', options: { Size: '43 (EU)' }, stock: 6, price: 1800, sku: 'SNK-43' },
          { id: 'v23', options: { Size: '44 (EU)' }, stock: 4, price: 1800, sku: 'SNK-44' },
        ],
        isFeatured: true,
        isNewArrival: false,
        isTopSelling: true,
        isTrending: true,
        isTopRated: true,
        rating: 4.9,
        reviewCount: 47,
      },
      {
        title: 'Mens Casual Linen Shirt - Olive Green',
        slug: 'mens-casual-linen-shirt-olive-green',
        description:
          'Breathable lightweight organic linen-cotton blend shirt. Tailored modern slim fit with mandarin collar and mother-of-pearl buttons.',
        shortDescription: 'Organic linen-cotton slim fit casual shirt.',
        regularPrice: 1400,
        sellingPrice: 1150,
        discountPercentage: 18,
        primaryImage: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=700&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Mens Fashion',
        categorySlug: 'mens-fashion',
        subcategory: 'Shirts',
        subcategorySlug: 'shirts',
        stock: 55,
        sku: 'SHT-LIN-OLV',
        axes: [
          {
            name: 'Size',
            values: [
              { label: 'M', swatch: null },
              { label: 'L', swatch: null },
              { label: 'XL', swatch: null },
            ],
          },
        ],
        variants: [
          { id: 'v24', options: { Size: 'M' }, stock: 20, price: 1150, sku: 'SHT-M' },
          { id: 'v25', options: { Size: 'L' }, stock: 20, price: 1150, sku: 'SHT-L' },
          { id: 'v26', options: { Size: 'XL' }, stock: 15, price: 1150, sku: 'SHT-XL' },
        ],
        isFeatured: true,
        isNewArrival: true,
        isTopSelling: false,
        isTrending: true,
        isTopRated: true,
        rating: 4.8,
        reviewCount: 22,
      },
      {
        title: 'Mens Relaxed Fit Jeans - Light Wash',
        slug: 'mens-relaxed-fit-jeans-light-wash',
        description:
          'Comfortable stretch denim jeans with vintage washed whiskers. Features 5 pockets, heavy-duty zipper fly, and reinforced belt loops.',
        shortDescription: 'Premium stretch denim relaxed fit jeans.',
        regularPrice: 2000,
        sellingPrice: 1600,
        discountPercentage: 20,
        primaryImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80',
        images: [
          'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=700&auto=format&fit=crop&q=80',
        ],
        category: 'Mens Fashion',
        categorySlug: 'mens-fashion',
        subcategory: 'Pants',
        subcategorySlug: 'pants',
        stock: 45,
        sku: 'PNT-JNS-LTW',
        axes: [
          {
            name: 'Size',
            values: [
              { label: '30', swatch: null },
              { label: '32', swatch: null },
              { label: '34', swatch: null },
              { label: '36', swatch: null },
            ],
          },
        ],
        variants: [
          { id: 'v27', options: { Size: '30' }, stock: 10, price: 1600, sku: 'JNS-30' },
          { id: 'v28', options: { Size: '32' }, stock: 15, price: 1600, sku: 'JNS-32' },
          { id: 'v29', options: { Size: '34' }, stock: 15, price: 1600, sku: 'JNS-34' },
          { id: 'v30', options: { Size: '36' }, stock: 5, price: 1600, sku: 'JNS-36' },
        ],
        isFeatured: true,
        isNewArrival: true,
        isTopSelling: true,
        isTrending: false,
        isTopRated: false,
        rating: 4.7,
        reviewCount: 18,
      },
    ];

    await Product.insertMany(productsData);
    console.log('Products seeded.');

    // 4. Seed Default Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123456', salt);

    await Admin.create({
      name: 'NEW LOOK_Z Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'superadmin',
    });
    console.log('Admin user seeded (admin@example.com / admin123456).');

    // 5. Seed Default Coupon
    await Coupon.create({
      code: 'SAVE25',
      discountType: 'percentage',
      discountValue: 25,
      minimumSpend: 500,
      maxDiscount: 1000,
      usageLimit: 5000,
      isActive: true,
    });
    console.log('Coupon SAVE25 seeded.');

    // 6. Seed Default Settings
    await Setting.create({
      storeName: 'NEW LOOK_Z',
      storeTagline: 'Trending Lifestyle & Fashion Store',
      phone: '+8801824416130',
      email: 'contact@newlookz.com',
      address: 'Mirpur 1, Dhaka, Bangladesh',
      whatsappNumber: '8801824416130',
      topbarMarquee: 'Get 25% off on your purchase! Use this coupon code SAVE25 on the Checkout Page',
      deliveryInsideDhaka: 60,
      deliveryOutsideDhaka: 120,
      freeDeliveryThreshold: 2500,
    });
    console.log('Settings seeded.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
