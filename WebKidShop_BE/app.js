const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const Promotion = require("./api/models/promotion");

const adminRoute = require("./api/routes/admins");
const categoryRoute = require("./api/routes/categories");
const productTypeRoute = require("./api/routes/productTypes");
const brandRoute = require("./api/routes/brands");
const promotionRoute = require("./api/routes/promotion");
const productRoute = require("./api/routes/products");
const usersRoute = require("./api/routes/users");
const addressRoute = require("./api/routes/userAddress");
const cartRoute = require("./api/routes/cartItems");
const orderRoute = require("./api/routes/orders");
const staffRoute = require("./api/routes/staffs");

const app = express();

// Connect Database
connectDB();

app.use(express.json());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//API
app.use(cors());
app.use("/api/admin", adminRoute);
app.use("/api/category", categoryRoute);
app.use("/api/productType", productTypeRoute);
app.use("/api/brand", brandRoute);
app.use("/api/promotion", promotionRoute);
app.use("/api/product", productRoute);
app.use("/api/user", usersRoute);
app.use("/api/address", addressRoute);
app.use("/api/cart", cartRoute);
app.use("/api/checkout", orderRoute);
app.use("/api/staff", staffRoute);

// Hàm để tính toán và cập nhật lại thời gian delay cho lần tiếp theo
function updateInterval() {
  const now = new Date();
  const targetTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    24,
    0
  ); // Thời gian xóa là 24:00
  let delay = targetTime - now;
  if (delay < 0) {
    // Nếu thời gian xóa đã qua, đặt thời gian delay cho ngày hôm sau
    delay += 24 * 60 * 60 * 1000; // Thêm 1 ngày (24 giờ)
  }

  // Cập nhật lại `setInterval` với thời gian delay mới
  clearInterval(interval);
  interval = setInterval(deleteExpiredPromotions, delay);
}

// Xóa khuyến mãi hết hạn tự động
function deleteExpiredPromotions() {
  const currentDate = Date.now();
  Promotion.find({ endDay: { $lt: currentDate } })
    .then((expiredPromotions) => {
      if (expiredPromotions.length > 0) {
        const deletePromotionsPromises = expiredPromotions.map((promotion) =>
          Promotion.findByIdAndRemove(promotion._id)
        );

        Promise.all(deletePromotionsPromises)
          .then(() => {
            console.log("Expired promotions deleted successfully");
            updateInterval(); // Cập nhật thời gian delay sau khi xóa thành công
          })
          .catch((err) =>
            console.error("Unable to delete expired promotions", err)
          );
      } else {
        updateInterval(); // Cập nhật thời gian delay khi không có khuyến mãi hết hạn
      }
    })
    .catch((err) => console.error("Unable to get expired promotions", err));
}

// Bắt đầu chạy `setInterval` ban đầu
let interval = setInterval(deleteExpiredPromotions, 0);

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server running on port ${port}`));
