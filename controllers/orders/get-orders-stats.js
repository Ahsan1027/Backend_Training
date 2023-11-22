import OrderStats from '../../models/order-stats';

export const GetStats = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Permission denied.' });
    }
    
    const stats = await OrderStats.find({});
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from dashboard' });
  }
};