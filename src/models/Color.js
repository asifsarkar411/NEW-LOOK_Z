import mongoose from 'mongoose';

const ColorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide color name'],
      trim: true,
      unique: true,
    },
    code: {
      type: String,
      required: [true, 'Please provide HEX color code'],
      trim: true,
      default: '#000000',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Color || mongoose.model('Color', ColorSchema);
