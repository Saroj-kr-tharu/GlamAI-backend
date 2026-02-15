import express from "express";
import multer from "multer";
import path from "path";
import Image from "../models/image.js";

const router = express.Router();

//  Correct absolute upload path
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "backend/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to only allow JPG and PNG images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG and PNG images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// POST image
router.post("/", (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      // Handle multer errors (file type, size, etc.)
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: "File is too large. Maximum size is 10MB." });
      }
      return res.status(400).json({ message: err.message || "File upload error" });
    }
    next();
  });
}, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const image = new Image({
      filename: req.file.filename,
      path: `backend/uploads/${req.file.filename}`,
    });

    await image.save();

    res.status(201).json({
      message: "Image uploaded & saved in images collection",
      image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

export default router;
