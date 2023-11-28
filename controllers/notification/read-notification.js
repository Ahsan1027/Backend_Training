import Notifications from '../../models/notifications';

export const ReadNotification = async (req, res) => {
  try {
    const { notificationId } = req.query;

    const result = await Notifications.updateOne(
      { _id: notificationId },
      { $set: { isRead: true } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Error marking notification as read' });
  }
}
