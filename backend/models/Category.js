const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true },

  description: { type: String, required: true },

  imageUrl: { type: String },

  createdAt: { type: Date, default: Date.now },

  slug: { type: String, required: true, unique: true },
  
   isActive: { type: Boolean, default: true },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
module.exports = mongoose.model("Category", categorySchema);
