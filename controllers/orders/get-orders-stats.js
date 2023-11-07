import OrderStats from '../../models/order-stats';

export const GetStats = async (req, res) => {
  try {
    const stats = await OrderStats.find({});
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from dashboard' });
  }
};