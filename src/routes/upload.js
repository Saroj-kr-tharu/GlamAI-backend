import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import dotenv from "dotenv";

import Image from "../models/image.js";
import { protect } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Multer (local temp storage)
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "backend/uploads");
  },
  filename(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// ============================
// UPLOAD IMAGE (LOGIN REQUIRED)
// ============================
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    // Upload to cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: "uploads",
    });

    // Save to MongoDB with USER ID
    const image = await Image.create({
      filename: req.file.filename,
      path: result.secure_url,
      user: req.user._id, // IMPORTANT
    });

    res.status(201).json({
      message: "Uploaded Successfully",
      image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
});


// ============================
// GET MY UPLOADS
// ============================
router.get("/my", protect, async (req, res) => {
  try {
    const images = await Image.find({ user: req.user._id });

    res.json(images);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
