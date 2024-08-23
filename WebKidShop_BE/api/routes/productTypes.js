const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const ProductType = require("../models/productType");

//Route lấy toàn bộ loại sản phẩm
router.get("/", (req, res) => {
  ProductType.find()
    .then((productType) => res.json(productType))
    .catch((err) =>
      res.status(404).json({ NoProductTypesFound: "No ProductTypes found" })
    );
});

//Route lấy sản phẩm theo ID
router.get("/:id", (req, res) => {
  ProductType.findById(req.params.id)
    .then((productType) => res.json(productType))
    .catch((err) =>
      res.status(404).json({ NoProductTypesFound: "No ProductTypes found" })
    );
});

//Route tạo mới loại sản phẩm
router.post("/create", (req, res) => {
  const productType = new ProductType({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
  });
  return productType
    .save()
    .then((productType) => res.json({ msg: "ProductType added successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to add this productType" })
    );
});

//Route cập nhật thông tin loại sản phẩm
router.put("/:id", (req, res) => {
  ProductType.findByIdAndUpdate(req.params.id, req.body)
    .then((productType) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

//Route xóa loại sản phẩm
router.delete("/:id", (req, res) => {
  ProductType.findByIdAndRemove(req.params.id, req.body)
    .then((productType) =>
      res.json({ mgs: "ProductType entry deleted successfully" })
    )
    .catch((err) => res.status(404).json({ error: "No such a productType" }));
});

module.exports = router;
