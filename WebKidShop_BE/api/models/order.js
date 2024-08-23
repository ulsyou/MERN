const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  order: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      name: String,
      brand: String,
      size: String,
      price: Number,
      quantity: {type: Number, default: 1 }
    },
  ],
  address: { type: mongoose.Schema.Types.String, ref: "userAddress" },
  note: String ,
  status: { type: String, enum: ["Pending", "Confirmed", "Reject", "Delivered"] },
  paymentType:  { type: String, enum: ["COD", "Paypal"] },
  orderDate: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Order", orderSchema);
