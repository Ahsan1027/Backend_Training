import Address from '../../models/address';

export const AddAddress = async (req, res) => {
  try {
    const { id, addresses } = req.body;
    const userAddress = await Address.findOne({ id });

    if (userAddress) {
      if (addresses) {
        userAddress.addresses = userAddress.addresses.concat(addresses)
      }
      await userAddress.save();
      
      return res.status(200).json({ message: 'Added to an Existing User' });
    }

    const newAddress = new Address({
      id,
      addresses,
    });
    await newAddress.save();

    return res.status(201).json({ message: 'Address Added' });
  } catch (error) {
    res.status(500).json({ message: 'Error when adding Address', error });
  }
};
