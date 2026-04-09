import mongoose from 'mongoose';

const billSchema = mongoose.Schema({
  buyerName: { type: String, required: true },
  phone: { type: String },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Bill = mongoose.model('Bill', billSchema);
export default Bill;
