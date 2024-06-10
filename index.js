// IMPORTS
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import Cookies from "js-cookie";

// routes import
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import otpRoutes from "./routes/otp.js";
import jobRoutes from "./routes/job.js";
import postRoutes from "./routes/post.js";

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
app.use(cookieParser({ secure: true }));
app.use(
  cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    //
    // secure: true,
    // cookieParser: true,

    // origin: "http://localhost:5173",
  })
);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/otp", otpRoutes);
app.use("/job", jobRoutes);
app.use("/post", postRoutes);

//
export var ExpressCookies = Cookies.withConverter({
  write: function (value) {
    // Prepend j: prefix if it is JSON object
    try {
      var tmp = JSON.parse(value);
      if (typeof tmp !== "object") {
        throw new Error();
      }
      value = "j:" + JSON.stringify(tmp);
    } catch (e) {}

    return Cookies.converter.write(value);
  },
  read: function (value) {
    value = Cookies.converter.read(value);

    // Check if the value contains j: prefix otherwise return as is
    return value.slice(0, 2) === "j:" ? value.slice(2) : value;
  },
});

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

app.get("/", (req, res) => {
  res.send("server is live");
});
