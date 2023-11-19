import Order from '../../models/orders';

export const UpdateOrderStatus = async (req) => {
  try {
    const event = req.body;

    if (event.type == 'charge.succeeded') {
      const orderId = event.data.object.metadata.orderId;
      await Order.updateOne(
        { orderId },
        { $set: { status: 'paid' } }
      );
    } else if (event.type === 'charge.failed') {
      const errorMessage = event.data.object.failure_message;
      console.error(`\n\n Charge failed: ${errorMessage}`);
    }
  } catch (error) {
    throw new Error(error);
  }
};
