const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Address = require("../models/userAddress");

// Thêm địa chỉ mới cho người dùng
router.post("/:userId/create", async (req, res) => {
  try {
    const { address } = req.body;
    let user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let addressDoc = await Address.findOne({ user: req.params.userId });
    if (!addressDoc) {
      addressDoc = new Address({
        _id: new mongoose.Types.ObjectId(),
        user: req.params.userId,
        addresses: [{ address }],
      });
    } else {
      addressDoc.addresses.push({ address });
    }
    const savedAddress = await addressDoc.save();
    user.addresses = savedAddress._id;
    await user.save();
    res
      .status(201)
      .json({ message: "Create new address successfully", data: savedAddress });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Lấy toàn bộ địa chỉ người dùng
router.get("/:userId", async (req, res) => {
  try {
    const userAddresses = await Address.find({ user: req.params.userId });
    res.status(200).json({ data: userAddresses });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cập nhật thông tin địa chỉ của người dùng dựa trên ID
router.put("/:userId/:id", async (req, res) => {
  try {
    const { address } = req.body;
    const updatedAddress = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.params.userId },
      { address },
      { new: true }
    );
    if (updatedAddress) {
      res
        .status(200)
        .json({
          message: "Updated address successfully",
          data: updatedAddress,
        });
    } else {
      res.status(404).json({ message: "No address found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Xóa địa chỉ của người dùng dựa trên ID
router.delete("/:userId/:id", async (req, res) => {
  try {
    const deletedAddress = await Address.findOneAndRemove({
      _id: req.params.id,
      user: req.params.userId,
    });
    if (deletedAddress) {
      await User.findByIdAndUpdate(req.params.userId, {
        $pull: { addresses: deletedAddress._id },
      });
      res
        .status(200)
        .json({
          message: "Deleted address successfully",
          data: deletedAddress,
        });
    } else {
      res.status(404).json({ message: "No address found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
