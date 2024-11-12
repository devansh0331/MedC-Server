import express from "express";
import {
  addBlog,
  deleteBlog,
  editBlog,
  getAllBlogs,
  getSingleBlog,
  getUserBlogs,
} from "../controllers/blog.js";
import { verifyToken } from "../middleware/verifyToken.js";
// import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/all-blogs", getAllBlogs);
router.get("/user-blogs", verifyToken, getUserBlogs);
router.get("/single-blog/get/:id", getSingleBlog);
router.post("/single-blog/add", verifyToken, addBlog);
router.post("/single-blog/edit/:id", verifyToken, editBlog);
router.post("/single-blog/delete/:id", verifyToken, deleteBlog);

export default router;
