import express from "express";
import {
  commentPost,
  createPost,
  deleteComment,
  getAllPosts,
  getComments,
  getSinglePost,
  likePost,
} from "../controllers/post.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/create-post", upload.single("filepath"), createPost);
router.post("/create-post-no-file", upload.none(), createPost);
router.get("/all-posts", getAllPosts);
router.get("/single-post/:id", getSinglePost);
router.post("/single-post/like/:id", likePost);
router.post("/single-post/comment/post/:id", commentPost);
router.get("/single-post/comment/all/:id", getComments);
router.post("/single-post/comment/delete/:id", deleteComment);

export default router;
