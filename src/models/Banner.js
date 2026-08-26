import mongoose from 'mongoose';

const BannerSchema = new mongoose.Schema(
  {
    title: { type: String, default: 'Promotional Banner' },
    image: { type: String, required: true },
    mobileImage: { type: String },
    link: { type: String, default: '/shop' },
    type: { type: String, enum: ['hero', 'promo', 'middle'], default: 'hero' },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);
