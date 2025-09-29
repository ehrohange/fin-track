import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js"
import authRoutes from "./routes/auth.routes.js"
import financeRoutes from "./routes/finance.routes.js"
import feedbackRoutes from "./routes/feedback.routes.js"


dotenv.config();

const app = express();

const PORT = 3000;

app.use(
    cors({
      origin: "http://localhost:5173", // Allow requests from this origin
    })
  );

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/feedback', feedbackRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server running on Port", PORT);
  });
});
