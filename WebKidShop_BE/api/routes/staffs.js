const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Staff = require("../models/staff");

// Route đăng nhập staff
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email }); // Tìm nhân viên theo email

    if (!staff) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    // Kiểm tra mật khẩu hợp lệ
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    // Nếu đăng nhập thành công, trả về thông tin của nhân viên
    res.json({ message: "Login success", staff });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
