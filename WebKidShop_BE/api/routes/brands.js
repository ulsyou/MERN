const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

const Brand = require("../models/brand");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldName + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

router.get("/", (req, res) => {
  Brand.find()
    .then((brand) => res.json(brand))
    .catch((err) => {
      res.status(404).json({ NoBrandsFound: "No Brands found" });
    });
});

router.get("/:id", (req, res) => {
  Brand.findById(req.params.id)
    .then((brand) => res.json(brand))
    .catch((err) => {
      res.status(404).json({ NoBrandsFound: "No brands found" });
    });
});

router.post("/create", upload.single("image"), (req, res) => {
  const brand = new Brand({
    _id: new mongoose.Types.ObjectId(), // Sử dụng new trước mongoose.Types.ObjectId()
    logo: req.body.logo,
    name: req.body.name,
    description: req.body.description,
  });
  return brand
    .save()
    .then((brand) => res.json({ msg: "Brand added successfully" }))
    .catch((err) => {
      res.status(404).json({ error: "Unable to add this brand" });
    });
});

router.put("/update/:id", (req, res) => {
  Brand.findByIdAndUpdate(req.params.id, req.body)
    .then((brand) => res.json({ msg: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Unable to update the Database" })
    );
});

router.delete("/delete/:id", (req, res) => {
  Brand.findByIdAndRemove(req.params.id, req.body)
    .then((brand) => res.json({ mgs: "Brand entry deleted successfully" }))
    .catch((err) => res.status(404).json({ error: "No such a brand" }));
});

module.exports = router;
