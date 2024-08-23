const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Category = require("../models/category");

//Route lấy toàn bộ category
router.get("/", (req, res) => {
  Category.find()
    .then((category) => res.json(category))
    .catch((err) =>
      res.status(404).json({ NoCategoriesFound: "No categories found" })
    );
});

//Route lấy category theo ID
router.get("/:id", (req, res) => {
  Category.findById(req.params.id)
    .then((category) => res.json(category))
    .catch((err) =>
      res.status(404).json({ NoCategoriesFound: "No categories found" })
    );
});

//Route tạo mới category
router.post("/create", (req, res) => {
  const category = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    description: req.body.description,
  });
  return category
    .save()
    .then((category) => res.json({ msg: "Category added successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to add this category" })
    );
});

//route cập nhập category
router.put("/:id", (req, res) => {
  Category.findByIdAndUpdate(req.params.id, req.body)
    .then((category) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

//route xóa category
router.delete("/:id", (req, res) => {
  Category.findByIdAndRemove(req.params.id, req.body)
    .then((category) =>
      res.json({ mgs: "Category entry deleted successfully" })
    )
    .catch((err) => res.status(404).json({ error: "No such a category" }));
});

module.exports = router;
