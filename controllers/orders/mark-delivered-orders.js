import mongoose from "mongoose";
import Orders from '../../models/orders';
import Product from '../../models/products';
import Notification from '../../models/notifications';

export const OrdersDelivered = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Orders.findOne({ orderId });

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
      });
    }

    order.deliveredStatus = true;
    await order.save();

    const orderEmail = order.email;
    for (const data of order.products) {
      const objectId = mongoose.Types.ObjectId(data.product);
      const productDetails = await Product.findById(objectId);

      if (productDetails) {
        const { quantity } = data;
        productDetails.sold += quantity;
        await productDetails.save();
      }
    }

    const notification = new Notification({
      email: orderEmail,
      orderId,
      isRead: false,
    });
    await notification.save();

    res.json({
      message: 'Delivery status updated successfully',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error updating delivery status',
    });
  }
};
