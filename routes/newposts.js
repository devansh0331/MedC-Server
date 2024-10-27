import express from "express";
import { newPost } from "../controllers/newposts.js";
import { verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

router.get("/posts", newPost);

export default router;
