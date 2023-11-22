import User from '../../models/user';

export const ResetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { email } = req.user;
    const token = req.headers['authorization'].split(' ')[1];

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be Atleast 8 Characters' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.token !== token) {
      user.password = password;
      user.token = token;
      await user.save();

      return res.json({ message: 'Password updated successfully' });
    } else {
      return res.status(400).json({ message: 'Link Expired' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
};
