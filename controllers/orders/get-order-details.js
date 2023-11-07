import Orders from '../../models/orders';

export const GetOrderDetail = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (orderId.trim() === '') {
      return res.status(400).json({ message: 'Invalid orderId' });
    }

    const orderDetails = await Orders.aggregate([{
        $match: {
          orderId
        }
      }, {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'productDetails',
        }
      }
    ]);

    if (orderDetails.length === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const order = orderDetails[0];
    
    return res.json({ productDetails: order.productDetails });
  } catch (error) {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};