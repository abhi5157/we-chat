const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = "uploads/avatars";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png) are allowed"));
  },
});

// Get user data route
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
});

// Update profile route
router.put("/users/profile", upload.single("avatar"), async (req, res) => {
  try {
    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      mobile: req.body.phoneNumber,
      country: req.body.country,
    };

    // Handle avatar upload
    if (req.file) {
      updates.avatar = `/uploads/avatars/${req.file.filename}`;
    }

    const user = await User.findOneAndUpdate(
      { email: req.body.email }, // Using email to identify the user
      { $set: updates },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile,
        country: user.country,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res
      .status(500)
      .json({ message: "Error updating profile", error: error.message });
  }
});

module.exports = router;
