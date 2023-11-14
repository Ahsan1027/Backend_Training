const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const GetCustomerCards = async (req, res) => {
  try {
    const { customerId } = req.query;

    if (!customerId) {
      return res.status(500).json({ message: 'No Payment Record Exists' });
    }

    const cards = await stripe.customers.listSources(
      customerId,
      { object: 'card', limit: 3 }
    );

    return res.status(200).send({ cards: cards.data });
  } catch (error) {
    res.status(500).json({ message: 'Error when getting payments', error });
  }
};