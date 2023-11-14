import mongoose from "mongoose";

const paymentsSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  payments: [
    {
      cardNum: String,
      expiryDate: String,
      title: String
    }
  ]
})

const Payments = new mongoose.model("Payments", paymentsSchema)
module.exports = Payments