import mongoose from 'mongoose';

const PurchaseItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  title: String,
  sku: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  unitCost: {
    type: Number,
    required: true,
    min: 0,
  },
  totalCost: {
    type: Number,
    required: true,
  },
});

const PurchaseSchema = new mongoose.Schema(
  {
    poNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    supplierName: {
      type: String,
      required: [true, 'Please provide supplier name'],
      trim: true,
    },
    supplierPhone: {
      type: String,
      trim: true,
    },
    items: [PurchaseItemSchema],
    totalCost: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },
    dueAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['paid', 'partial', 'due'],
      default: 'paid',
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    note: String,
    createdBy: {
      type: String,
      default: 'Admin',
    },
  },
  { timestamps: true }
);

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
