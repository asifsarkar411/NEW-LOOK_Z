import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema(
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
);

export default mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
