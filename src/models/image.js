import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },

  path: {
    type: String,
    required: true,
  },

  // CONNECT IMAGE TO USER
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model("Image", imageSchema);

export default Image;
