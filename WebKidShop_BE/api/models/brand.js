const mongoose = require("mongoose");
const path = require("path");
const { URL } = require("url");

const brandSchema = mongoose.Schema({
  _id: mongoose.Types.ObjectId,
  logo: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Kiểm tra giá trị của logo có phải là đường dẫn hợp lệ
        return (
          path.isAbsolute(value) ||
          new URL(value).protocol === "http:" ||
          new URL(value).protocol === "https:"
        );
      },
      message: "Link or URL must be valid",
    },
  },
  fileLogo: {
    data: Buffer,
    contentType: String,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

module.exports = mongoose.model("Brand", brandSchema);
