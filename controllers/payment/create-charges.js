import stripe from 'stripe';

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const CreateCharges = async (
  email,
  cardId,
  customerId,
  totalAmount,
  orderId
) => {
  try {
    const createCharge = await stripeInstance.charges.create({
      receipt_email: email,
      amount: totalAmount * 100,
      currency: 'usd',
      card: cardId,
      customer: customerId,
      metadata: {
        orderId,
      },
    });

    return { createCharge };
  } catch (error) {
    throw new Error(error);
  }
};
