import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'buyer', 'seller'],
      default: 'buyer',
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);

