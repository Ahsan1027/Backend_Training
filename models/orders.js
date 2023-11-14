import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
  },
  orderId: {
    type: String,
    unique: true,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  products: [{
    product: mongoose.Types.ObjectId,
    quantity: Number,
    price: Number,
    color: String,
    size: String,
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: "Unpaid"
  },
  deliveredStatus: {
    type: Boolean,
    default: false
  },
});

const Orders = mongoose.model('Orders', OrderSchema);
module.exports = Orders;