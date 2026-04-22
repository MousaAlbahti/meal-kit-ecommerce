const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  slug: { type: String, required: true, unique: true }, 
  description: { type: String, required: true }, 
  price: { type: Number, required: true }, 
  stock: { type: Number, required: true, default: 0 }, 
  
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  
  imageUrl: { type: String, required: true }, 
  
  isActive: { type: Boolean, default: true }, 
  
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);