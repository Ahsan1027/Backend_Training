import bcrypt from 'bcryptjs';

import SendEmail from '../../utils/forgot-password-email';
import SignupEmail from '../../utils/signup-email';
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
      role: 'user',
      isVerififed: false
    });

    await newUser.save();
    const unique = await newUser.generateAuthToken();
    SignupEmail(email, unique);


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

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your account first on your Email !' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }
    const loggedInToken = await user.generateAuthToken();
    const { _id: userId, name: username, role, stripeId } = user;

    res.json({ token: loggedInToken, id: userId, username, email, role, stripeId, message: 'Login Successful' });
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
    SendEmail(email, unique);

    res.json({ message: 'Email sent successfully' });
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

export const UpdateVerificationStatus = async (req, res) => {
  try {
    console.log(req.user);
    const { _id, isVerified } = req.user;

    if (isVerified) {
      return res.status(200).json({ message: 'User already verified' });
    }
    
    await User.updateOne({
      _id
    }, {
      $set: {
        isVerified: true
      }
    });

    res.status(200).json({ message: 'User Verified' });
  } catch (error) {
    res.status(500).json({ message: 'Error Verifying User' });
  }
}