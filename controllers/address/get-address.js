import Address from '../../models/address';

export const GetAddress = async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ message: 'Permission denied.' });
    }

    const { id } = req.query;
    const userAddress = await Address.findOne({ id });

    if (userAddress) {
      return res.status(200).json({ addresses: userAddress.addresses });
    }

    return res.status(404).json({ message: 'User not found' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error when getting addresses', 
      error 
    });
  }
};
