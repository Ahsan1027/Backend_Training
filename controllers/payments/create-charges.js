const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const CreateCharges = async (req, res) => {
  try {
    const {
      email,
      cardId,
      customerId,
      totalAmount
    } = req.body;

    console.log('check all values', email, cardId, customerId, totalAmount);

    const createCharge = await stripe.charges.create({
      receipt_email: email,
      amount: totalAmount * 100,
      currency: "usd",
      card: cardId,
      customer: customerId
    });
    console.log('check createCharge', createCharge);
    res.send(createCharge);
  } catch (error) {
    throw new Error(error);
  }
}