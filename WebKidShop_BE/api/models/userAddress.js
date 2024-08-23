const mongoose = require("mongoose");

const addressSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  addresses: [{ address: { type: String, required: true } }]
});

module.exports = mongoose.model("Address", addressSchema);
