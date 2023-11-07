import Orders from '../../models/orders';

export const DeleteOrders = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Orders.findByIdAndRemove(orderId);

    if (!deletedOrder) {
      return res.status(404).json({
        message: 'Order not Found'
      });
    }

    res.status(200).json({
      message: 'Order Deleted Successfully',
      deletedOrder
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error Deleting Order'
    });
  }
};
