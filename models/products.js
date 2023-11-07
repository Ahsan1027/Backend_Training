import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  price: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  sold: {
    type: Number,
  },
  rating: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
  images: [{
    type: String
  }],
  isDeleted: {
    type: Boolean,
    default: false,
  },
  sizes: [String],
  colors: [String],
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;