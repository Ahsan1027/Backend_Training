import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  email: {
    type: String
  },
  orderId: {
    type: String,
    // ref: 'orders',
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

const Notifications = mongoose.model('Notification', notificationSchema);
module.exports = Notifications;