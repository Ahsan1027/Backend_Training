import Orders from '../../models/orders';

export const GetOrders = async (req, res) => {
  try {
    const {
      limit,
      skip,
      email,
      orderId
    } = req.query;

    const filters = {};
    if (orderId) {
      filters.orderId = { $regex: orderId, $options: 'i' };
    }

    if (email) {
      filters.email = email;
    }

    const [orders, total] = await Promise.all([
      Orders
        .find(filters)
        .sort({ date: -1 })
        .skip(parseInt(skip) || 0)
        .limit(parseInt(limit) || 5),
      Orders.countDocuments(filters)
    ]);

    if (orders.length === 0) {
      return res.status(404).json({
        message: 'No Orders Found'
      });
    }

    res.status(200).json({
      orders,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error Fetching Orders' });
  }
};
