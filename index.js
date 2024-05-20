// IMPORTS
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
// routes import
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import otpRoutes from "./routes/otp.js";
import jobRoutes from "./routes/job.js";

// CONFIGURATIONS
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    // origin: process.env.CLIENT_URL,
    // origin: true,
    origin: "http://localhost:5173",
  })
);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/otp", otpRoutes);
app.use("/job", jobRoutes);

const PORT = process.env.PORT || 5000;
// MONGOOSE SETUP
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log(`Server Port: ${PORT}`);

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
