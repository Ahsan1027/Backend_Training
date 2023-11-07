import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  id: {
    type: mongoose.Types.ObjectId,
    required: true
  },
  addresses: [
    {
      name: String,
      mobile: String,
      address: String,
    }
  ],
})

const Address = new mongoose.model("Address", addressSchema)
module.exports = Address