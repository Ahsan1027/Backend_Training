import mongoose from 'mongoose';

const orderStatSchema = mongoose.Schema({
  totalOrders: {
    type: Object,
  },
  totalQuantity: {
    type: Object,
  },
  totalAmount: {
    type: Object,
  },
});

const OrderStats = mongoose.model('OrderStats', orderStatSchema);
export default OrderStats;
