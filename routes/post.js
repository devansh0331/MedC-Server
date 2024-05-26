import express from "express";
import {
  createPost,
  getAllPosts,
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

export default router;
