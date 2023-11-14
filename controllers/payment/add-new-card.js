import stripe from 'stripe';

const PbStripe = stripe(process.env.PUBLISHABLE_KEY);
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const AddNewCard = async (customerId, CVC, cardNum, expMonth, expYear) => {
  try {
    const cardToken = await PbStripe.tokens.create({
      card: {
        cvc: CVC,
        number: cardNum,
        exp_month: expMonth,
        exp_year: expYear,
      },
    });

    const card = await stripeInstance.customers.createSource(customerId, {
      source: `${cardToken.id}`,
    });

    return { cardId: card.id, customerId };
  } catch (error) {
    throw new Error(error);
  }
};