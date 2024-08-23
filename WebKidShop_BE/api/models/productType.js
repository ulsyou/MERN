const mongoose = require("mongoose");

const productTypeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  description: { type: String },
});

module.exports = mongoose.model("ProductType", productTypeSchema);
