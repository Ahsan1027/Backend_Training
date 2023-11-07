import User from '../../models/user';

const stripeKey = process.env.STRIPE_SECRET_KEY;
const PbStripe = require('stripe')(process.env.PUBLISHABLE_KEY);
const stripe = require("stripe")(stripeKey);

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

    console.log('in addnewcard', CVC, expMonth, expYear, user.stripeId);

    if (user) {
      if (user.stripeId) {
        await AddNewCard(req, res, user.stripeId, CVC, cardNum, expMonth, expYear);
        return;
      } else {
        const customer = await stripe.customers.create({
          name,
          email,
        });
        user.stripeId = customer.id;
        await user.save();

        await AddNewCard(req, res, customer.id, CVC, cardNum, expMonth, expYear);

        return;
      }
    } else {
      return res.status(400).send({ message: 'User not Found' });
    }
  } catch (error) {
    throw new Error(error);
  }
}

export const AddNewCard = async (req, res, customer_Id, CVC, cardNum, expMonth, expYear) => {

  console.log('in addnewcard', customer_Id, CVC, expMonth, expYear);

  try {
    const card_Token = await PbStripe.tokens.create({
      card: {
        cvc: CVC,
        number: cardNum,
        exp_month: expMonth,
        exp_year: expYear,
      },
    });

    const card = await stripe.customers.createSource(customer_Id, {
      source: `${card_Token.id}`,
    });

    console.log('check cardId', card.id);

    return res.status(200).send({ card: card.id, customer_Id });
  } catch (error) {
    throw new Error(error);
  }
}