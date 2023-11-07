import Notifications from '../../models/notifications';

export const ReadNotification = async (req, res) => {
  try {
    const { notificationId } = req.query;
    const notification = await Notifications.findById(notificationId);

    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking notification as read' });
  }
}