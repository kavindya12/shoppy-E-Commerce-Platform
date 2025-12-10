import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ['pending', 'paid', 'shipped', 'completed', 'cancelled'],
      default: 'pending',
    },
    shippingAddress: { type: String, required: true },
    paymentDetails: { type: mongoose.Schema.Types.Mixed },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);

