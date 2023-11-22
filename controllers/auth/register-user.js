import SignupEmail from '../../utils/signup-email';
import User from '../../models/user';

export const RegisterUser = async (req, res) => {
  try {
    const { 
      name, 
      mobile, 
      email, 
      password 
    } = req.body;

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
