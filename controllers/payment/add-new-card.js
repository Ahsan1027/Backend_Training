const PbStripe = require('stripe')(process.env.PUBLISHABLE_KEY);
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const AddNewCard = async (customerId, CVC, cardNum, expMonth, expYear) => {
  try {
    const card_Token = await PbStripe.tokens.create({
      card: {
        cvc: CVC,
        number: cardNum,
        exp_month: expMonth,
        exp_year: expYear,
      },
    });

    const card = await stripe.customers.createSource(customerId, {
      source: `${card_Token.id}`,
    });

    return { cardId: card.id, customerId };
  } catch (error) {
    throw new Error(error);
  }
}