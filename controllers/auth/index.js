import bcrypt from 'bcryptjs';

import sendEmail from '../../middlewares/nodemailer';
import User from '../../models/user';

export const RegisterUser = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const newUser = new User({
      name,
      mobile,
      email,
      password,
      role: 'user'
    });
    await newUser.save();
    res.status(201).json({ message: 'User Registered Successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error Registering User', error });
  }
};

export const LoginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const loggedInToken = await user.generateAuthToken();
    const { _id: userId, name: username, role } = user;
    res.json({ token: loggedInToken, id: userId, username, email, role, message: 'Login Successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

export const ForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const unique = await user.generateAuthToken();
    sendEmail(email, unique);
    res.json({ message: 'Email sent to reset password' });
  } catch (error) {
    res.status(500).json({ message: 'Error checking email', error });
  }
};

export const ResetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { email } = req.user;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.password = password;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password', error });
  }
};