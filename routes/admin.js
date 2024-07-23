import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { deletePost } from "../controllers/post.js";
import { addAdmin, getAllPosts } from "../controllers/admin.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get("/post/view/all", getAllPosts);
router.post("/post/delete/:id", deletePost);
router.post("/add/:id", addAdmin);

export default router;
