import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    images: [{ type: String }],
    price: { type: Number, required: true },
    salePrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    description: { type: String },
    specs: { type: mongoose.Schema.Types.Mixed },
    brand: { type: String },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);

