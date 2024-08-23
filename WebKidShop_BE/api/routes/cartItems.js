const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const CartItem = require("../models/cartItem");

// Route để lấy thông tin giỏ hàng của người dùng
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;

  try {
    // Tìm kiếm giỏ hàng dựa trên ID người dùng
    const cart = await CartItem.findOne({ user: userId })
      .populate("user", "_id username") // Lấy thông tin người dùng
      .populate("cartDetails.product", "_id name price"); // Lấy thông tin sản phẩm trong giỏ hàng

    if (cart) {
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: "Cannot found user" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

//Route để thêm sản phẩm vào giỏ hàng của user
router.post("/add/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { productId, quantity } = req.body;

  try {
    // Tìm kiếm giỏ hàng dựa trên ID người dùng
    let cart = await CartItem.findOne({ user: userId });

    if (cart) {
      // Nếu giỏ hàng đã tồn tại, cập nhật thông tin sản phẩm trong giỏ hàng
      const cartDetails = cart.cartDetails;
      const existingProduct = cartDetails.find(
        (item) => item.product.toString() === productId
      );

      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng sản phẩm theo quantity
        existingProduct.quantity += quantity;
      } else {
        // Nếu sản phẩm chưa tồn tại trong giỏ hàng, thêm sản phẩm mới vào với số lượng là quantity
        cartDetails.push({ product: productId, quantity: quantity });
      }

      await cart.save();
      res.status(201).json(cart);
    } else {
      // Nếu giỏ hàng chưa tồn tại, tạo giỏ hàng mới cho người dùng và thêm sản phẩm với số lượng là quantity
      const newCart = new CartItem({
        _id: new mongoose.Types.ObjectId(),
        user: userId,
        cartDetails: [{ product: productId, quantity: quantity }],
      });

      await newCart.save();
      res.status(200).json(newCart);
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Route để cập nhật số lượng sản phẩm trong giỏ hàng của người dùng
router.put("/update/:userId", async (req, res) => {
  const userId = req.params.userId;
  const cartItems = req.body.cartItems;

  try {
    // Tìm kiếm giỏ hàng dựa trên ID người dùng
    const cart = await CartItem.findOne({ user: userId });

    if (cart) {
      const cartDetails = cart.cartDetails;

      // Lặp qua từng sản phẩm trong mảng và cập nhật số lượng sản phẩm
      cartItems.forEach((item) => {
        const existingProduct = cartDetails.find(
          (product) => product.product.toString() === item.productId
        );
        if (existingProduct) {
          existingProduct.quantity = item.quantity;
        }
      });

      await cart.save();
      res.status(201).json(cart);
    } else {
      res.status(404).json({ message: "Cannot found user" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

// Route để xóa sản phẩm khỏi giỏ hàng của người dùng
router.delete("/delete/:userId/:productId", async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  try {
    // Tìm kiếm giỏ hàng dựa trên ID người dùng
    const cart = await CartItem.findOne({ user: userId });

    if (cart) {
      // Nếu giỏ hàng tồn tại, xóa sản phẩm trong giỏ hàng dựa trên ID sản phẩm
      cart.cartDetails = cart.cartDetails.filter(
        (item) => item.product.toString() !== productId
      );
      await cart.save();
      res.status(201).json(cart);
    } else {
      res.status(404).json({ message: "Cannot found user" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

module.exports = router;
