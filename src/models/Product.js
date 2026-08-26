import mongoose from 'mongoose';

const VariantSchema = new mongoose.Schema({
  id: { type: String },
  options: { type: Map, of: String }, // e.g. { "Size": "M", "Color": "Black" }
  stock: { type: Number, default: 10 },
  price: { type: Number },
  sku: { type: String },
});

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
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
        name: { type: String }, // "Size" or "Color"
        values: [
          {
            label: { type: String },
            swatch: { type: String, default: null }, // e.g. "#f97316"
          },
        ],
      },
    ],
    variants: [VariantSchema],
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
);

ProductSchema.pre('save', function (next) {
  if (this.regularPrice && this.sellingPrice && this.regularPrice > this.sellingPrice) {
    this.discountPercentage = Math.round(
      ((this.regularPrice - this.sellingPrice) / this.regularPrice) * 100
    );
  }
  next();
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
