// IMPORTS
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import Job from "./models/Job.js";

// routes import
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import otpRoutes from "./routes/otp.js";
import jobRoutes from "./routes/job.js";
import postRoutes from "./routes/post.js";
import adminRoutes from "./routes/admin.js";
import blogRoutes from "./routes/blog.js";
import fakeJobsData from "./FakeDatabase.js";
import Post from "./models/Post.js";
import fakePostsData from "./FakePosts.js";

// CONFIGURATIONS
dotenv.config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.CLIENT_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ],
  })
);

console.log(process.env.CLIENT_URL);

// ROUTES
app.use("/auth", authRoutes);
app.use("/user", usersRoutes);
app.use("/otp", otpRoutes);
app.use("/job", jobRoutes);
app.use("/post", postRoutes);
app.use("/admin", adminRoutes);
app.use("/blog", blogRoutes);

// console.log(process.env.MONGO_URL);
const PORT = process.env.PORT || 5000;
// MONGOOSE SETUP
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => {
    console.log(`Server Port: ${PORT}`);
    // Job.insertMany(fakeJobsData);
    // Post.insertMany(fakePostsData);
  })
  .catch((error) => console.log(`${error} did not connect`));

// SERVER
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("server is live");
});
