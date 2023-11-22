import stripe from 'stripe';

import User from '../../models/user';
import { AddNewCard } from './add-new-card';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const CreateNewCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      CVC,
      cardNum,
      expMonth,
      expYear,
    } = req.body;
    
    const user = await User.findOne({ email });

    let cardId = null;
    let customerId = null;

    if (user) {
      if (user.stripeId) {
        const result = await AddNewCard(user.stripeId, CVC, cardNum, expMonth, expYear);

        if (result && result.cardId) {
          cardId = result.cardId;
          customerId = result.customerId;
        }
      } else {
        const customer = await stripeInstance.customers.create({
          name,
          email,
        });

        await User.updateOne(
          { email },
          {
            $set: { stripeId: customer.id }
          });

        const result = await AddNewCard(customer.id, CVC, cardNum, expMonth, expYear);

        if (result && result.cardId) {
          cardId = result.cardId;
          customerId = result.customerId;
        }
      }
    } else {
      return res.status(400).send({ message: 'User not Found' });
    }

    return res.status(200).send({ 
      cardId, 
      customerId 
    });
  } catch (error) {
    throw new Error(error);
  }
}