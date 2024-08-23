const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");
const Brand = require("../models/brand");
const ProductType = require("../models/productType");

// Route để search sản phẩm
router.get("/search", async (req, res) => {
  try {
    const brandName = req.query.brand;
    const productTypeName = req.query.productType;
    const productName = req.query.name;
    const searchQuery = req.query.search;

    let filter = {};
    if (brandName) {
      const brand = await Brand.findOne({ name: brandName });
      if (brand) {
        filter.brand = brand._id.toString();
      } else {
        return res.status(404).json({ message: "Cannot find brand" });
      }
    }
    if (productTypeName) {
      const productType = await ProductType.findOne({ name: productTypeName });
      if (productType) {
        filter.productType = productType._id.toString();
      } else {
        return res.status(404).json({ message: "Invalid product type" });
      }
    }
    if (productName) {
      filter.name = productName;
    }
    if (searchQuery) {
      filter.name = { $regex: searchQuery, $options: "i" };
    }

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để tạo mới sản phẩm
router.post("/create", async (req, res) => {
  try {
    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      ...req.body,
    });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để lấy danh sách sản phẩm
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để lấy thông tin chi tiết của một sản phẩm dựa trên ID
router.get("/:productId", async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để cập nhật thông tin của một sản phẩm dựa trên ID
router.put("/:productId", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route để xóa một sản phẩm dựa trên ID
router.delete("/:productId", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(
      req.params.productId
    );
    if (!deletedProduct) {
      return res.status(404).json({ message: "Cannot find product" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
