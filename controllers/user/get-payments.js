import Payments from '../../models/user-payments';

export const AddPayment = async (req, res) => {
  try {
    const { id, payments } = req.body;
    const userPayment = await Payments.findOne({ id });

    if (userPayment) {
      if (payments) {
        userPayment.payments = userPayment.payments.concat(payments)
      }
      await userPayment.save();

      return res.status(200).json({ message: 'Added to an Existing User' });
    }

    const newPayment = new Payments({
      id,
      payments,
    });
    await newPayment.save();

    return res.status(201).json({ message: 'Payment Added' });
  } catch (error) {
    return res.status(500).json({ message: 'Error when adding Payment', error });
  }
};
