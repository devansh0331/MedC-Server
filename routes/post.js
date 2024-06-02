import express from "express";
import {
  addComment,
  createPost,
  deleteComment,
  getAllPosts,
  getComments,
  getSinglePost,
  likePost,
} from "../controllers/post.js";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-post", verifyToken, upload.single("filepath"), createPost);
router.post("/create-post-no-file", verifyToken, upload.none(), createPost);
router.get("/all-posts", verifyToken, getAllPosts);
router.get("/single-post/:id", getSinglePost);
router.post("/single-post/like/:id", verifyToken, likePost);
router.post("/single-post/comment/post/:id", verifyToken, addComment);
router.get("/single-post/comment/all/:id", getComments);
router.post("/single-post/comment/delete/:id", deleteComment);

export default router;
