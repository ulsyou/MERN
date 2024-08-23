const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const User = require("../models/user");

//Route đăng kí tài khoản cho người dùng
router.post("/signup", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        return res.status(500).json({
          message: "Email Already Exists",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: "Something went wrong",
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              email: req.body.email,
              password: hash,
              phone: req.body.phone,
              createdAt: new Date().toISOString(),
            });

            user
              .save()
              .then((doc) => {
                res.status(201).json({
                  message: "Account Created Successfully",
                });
              })
              .catch((er) => {
                res.status(500).json({
                  error: er,
                });
              });
          }
        });
      }
    });
});

//Route đăng nhập
router.post("/login", (req, res, next) => {
  User.findOne({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Login Failed",
            });
          } else {
            if (result) {
              res.status(200).json({
                message: "Login successfully",
                user: user,
              });
            } else {
              res.status(401).json({
                message: "Incorrect password",
              });
            }
          }
        });
      } else {
        res.status(500).json({
          message: "Email doesn't not exists",
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
});

//Route cập nhật thông tin người dùng
router.put("/:userId", (req, res, next) => {
  const id = req.params.userId;
  const updateOps = {};

  User.findById(id)
    .exec()
    .then(async (user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      for (const key of Object.keys(req.body)) {
        if (key !== "username" && key !== "password") {
          updateOps[key] = req.body[key];
        }
      }

      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        updateOps.password = hashedPassword;
      }

      // Update user in database
      User.updateOne({ _id: id }, { $set: updateOps })
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "User updated",
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
});

module.exports = router;
