import bcrypt from 'bcryptjs';
import User from '../../models/user';

export const LoginUser = async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first on your Email !' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const loggedInToken = await user.generateAuthToken();
    const {
      _id: userId,
      name: username,
      role,
      stripeId
    } = user;

    res.json({
      token: loggedInToken,
      id: userId,
      username,
      email,
      role,
      stripeId,
      message: 'Login Successful'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};