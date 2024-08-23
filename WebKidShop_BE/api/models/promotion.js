const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  startDay: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value < this.endDay;
      },
      message: "startDay must be before endDay",
    },
  },
  endDay: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > this.startDay && value > Date.now();
      },
      message: "endDay must be after startDay and in the future",
    },
  },
  discount: {
    type: Number,
    required: true,
  },
});
module.exports = mongoose.model("Promotion", promotionSchema);
