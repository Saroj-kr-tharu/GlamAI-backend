import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import uploadRoutes from "./routes/upload.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT ;

app.use(cors());
app.use(express.json());

// uploads
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// 
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", message: "Server is running healthy 🚀" });
});

// routes
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);
// connect DB
connectDB();

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
