import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { deletePost, deletePostByAdmin } from "../controllers/post.js";
import {
  addAdmin,
  deactivateAccount,
  deactivatedAccounts,
  getAllPosts,
  isAdmin,
} from "../controllers/admin.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get("/is-admin", isAdmin);
router.get("/post/view/all", getAllPosts);
router.post("/post/deletebyadmin/:id", deletePostByAdmin);
router.post("/add/:id", addAdmin);
router.post("/deactivate-account/:id", deactivateAccount);
router.get("/deactivated-accounts", deactivatedAccounts);

export default router;
