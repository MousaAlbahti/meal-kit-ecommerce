const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, min: 1 } 
    }
  ],
  totalPrice: { type: Number, required: true }, 
  shippingAddress: {
    city: { type: String, required: true },
    street: { type: String, required: true },
    building: { type: String }
  },
  paymentMethod: { type: String, enum: ['Cash', 'Card'], required: true },

  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: "Pending" },

  status: { type: String, enum: ['pending', 'shipped', 'delivered', 'cancelled'], default: "pending" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);