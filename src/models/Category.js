import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
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
);

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
