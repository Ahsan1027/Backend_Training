import mongoose from "mongoose";

import Orders from '../../models/orders';
import Product from '../../models/products';
import Notification from '../../models/notifications';
import User from '../../models/user';
import { CreateCharges } from "../payment/create-charges";

export const AddOrders = async (req, res) => {
  try {
    const {
      date,
      orderId,
      username,
      products,
      email,
      totalAmount,
      cardId,
      customerId,
    } = req.body;

    if (!orderId || !username || !products || !email || !totalAmount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    for (const data of products) {
      const productDataId = mongoose.Types.ObjectId(data?.product?._id);
      const productDetails = await Product.findById(productDataId);

      if (!productDetails) {
        return res.status(404).json({ message: 'Product not found' });
      }

      if (productDetails.stock < data.quantity) {
        return res.status(400).json({ message: 'Not enough stock for the order' });
      }

      productDetails.stock -= data.quantity;
      await productDetails.save();
    }

    const newOrder = new Orders({
      date,
      orderId,
      username,
      products,
      email,
      totalAmount,
    });

    await newOrder.save();

    const adminUsers = await User.find({ role: 'admin' });

    if (!adminUsers || adminUsers.length === 0) {
      return res.status(404).json({ message: 'No admin users found' });
    } 
    const adminEmails = adminUsers.map((adminUser) => adminUser.email);

    for (const adminEmail of adminEmails) {
      const notification = new Notification({
        email: adminEmail,
        orderId,
        isRead: false,
      });

      await notification.save();
    }

    let createCharge = null;
    const result = await CreateCharges(email, cardId, customerId, totalAmount, orderId);

    if (result && result.createCharge) {
      createCharge = result.createCharge;
    }

    res.status(201).json({
      orderId,
      createCharge,
      message: 'New order created',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};