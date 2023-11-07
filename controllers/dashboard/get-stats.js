import dashboard from '../../models/dashboard-stats';

export const GetStats = async (req, res) => {
  try {
    const stats = await dashboard.find({});
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data from dashboard' });
  }
};