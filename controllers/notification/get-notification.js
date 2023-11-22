import Notifications from '../../models/notifications';

export const GetNotification = async (req, res) => {
  try {
    const { email } = req.params;

    const notifications = await Notifications.find({
      email,
      isRead: false
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching notifications' });
  }
}