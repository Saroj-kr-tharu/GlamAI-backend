import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import { connectDB } from "./config/db.js";
import uploadRoutes from "./routes/upload.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// STATIC uploads folder (VERY IMPORTANT)
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "backend/uploads"))
);

// routes
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
// connect DB
connectDB();

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
