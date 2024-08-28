import express from "express";
import {
  addComment,
  archivePostbyUser,
  createPost,
  deleteComment,
  deletePost,
  deletePostByAdmin,
  getAllArchivedPosts,
  getAllLivePosts,
  getAllPosts,
  getComments,
  getSinglePost,
  getSingleUserPosts,
  likePost,
  restorePost,
  updatePost,
  userArchivedPost,
} from "../controllers/post.js";
import upload from "../middleware/upload.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/create-post", verifyToken, upload.single("filepath"), createPost);
router.post("/create-post-no-file", verifyToken, upload.none(), createPost);
router.get("/all-posts", verifyToken, getAllPosts);
router.get("/single-post/:id", verifyToken, getSinglePost);
router.post("/single-post/like/:id", verifyToken, likePost);
router.post("/single-post/comment/post/:id", verifyToken, addComment);
router.get("/single-post/comment/all/:id", getComments);
router.post("/single-post/comment/delete/:id", deleteComment);
// New Routes
router.get("/get-live-posts", verifyToken, getAllLivePosts);
router.get("/get-archived-posts", verifyToken, getAllArchivedPosts);
router.get("/get-user-posts/:id", verifyToken, getSingleUserPosts);
router.post("/update-post/:id", verifyToken, updatePost);
router.post("/archive-post/:id", verifyToken, deletePostByAdmin);
router.post("/delete-post/:id", verifyToken, deletePost)
router.post("/archive-post-by-user/:id", verifyToken, archivePostbyUser);
router.post("/restore-post-by-user/:id", verifyToken, restorePost);
router.get("/get-user-archived-posts/:id", verifyToken, userArchivedPost);

export default router;
