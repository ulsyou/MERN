const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../models/admin");
const Staff = require("../models/staff");
const User = require("../models/user");
const Order = require("../models/order");

// Route thêm tài khoản admin
router.post("/create", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hash mật khẩu trước khi lưu vào database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo mới admin với email và mật khẩu đã được mã hóa
    const admin = new Admin({
      _id: new mongoose.Types.ObjectId(),
      email,
      password: hashedPassword,
    });

    await admin.save();
    res.status(201).json({ message: "Created Admin successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Route đăng nhập admin
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    // Kiểm tra mật khẩu hợp lệ
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password incorrect" });
    }

    return res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Middleware để kiểm tra quyền admin
const isAdmin = async (req, res, next) => {
  next();
};

// CRUD staff
router.get("/staff", isAdmin, async (req, res) => {
  try {
    const staffs = await Staff.find();
    res.json(staffs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/staff/create", isAdmin, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const staff = new Staff({
      _id: new mongoose.Types.ObjectId(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      address: req.body.address,
      email: req.body.email,
      password: hashedPassword,
    });

    await staff.save();
    res.status(201).json({ message: "Staff created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/staff/:id", isAdmin, async (req, res) => {
  try {
    const updatedData = req.body;
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updatedData.password = hashedPassword;
    }
    const staff = await Staff.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });
    res.json({ message: "Updated staff successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/staff/:id", isAdmin, async (req, res) => {
  try {
    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Route lấy danh sách User
router.get("/getUsers", isAdmin, (req, res, next) => {
  User.find()
    .select("_id firstName lastName email phone createdAt")
    .exec()
    .then((users) => {
      res.status(200).json({
        users: users.map((user) => {
          return {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            createdAt: user.createdAt,
          };
        }),
      });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

//Route thống kế doanh thu
router.get("/revenue", async (req, res) => {
  try {
    const result = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $addFields: {
          month: {
            $let: {
              vars: {
                months: [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
              },
              in: { $arrayElemAt: ["$$months", { $month: "$orderDate" }] },
            },
          },
        },
      },
      { $unwind: "$order" },
      {
        $group: {
          _id: "$month",
          revenue: { $sum: { $multiply: ["$order.price", "$order.quantity"] } },
          amount: { $sum: 1 },
        },
      },
    ]);

    // Tạo một mảng chứa tên các tháng
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Tạo một mảng cho tất cả các tháng
    const allMonthsData = months.map((month) => {
      const foundMonth = result.find((data) => data._id === month);
      if (foundMonth) {
        return foundMonth;
      } else {
        return {
          _id: month,
          revenue: 0,
          amount: 0,
        };
      }
    });

    res.json(allMonthsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Cannot get revenue" });
  }
});

module.exports = router;
