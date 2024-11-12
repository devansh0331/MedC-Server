import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { verifyAdmin } from "../middleware/verifyAdmin.js";
import { deletePost, deletePostByAdmin } from "../controllers/post.js";
import {
  activateAccount,
  addAdmin,
  deactivateAccount,
  deactivatedAccounts,
  getAllAdmins,
  getAllPosts,
  isAdmin,
  isUserAdmin,
} from "../controllers/admin.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin);

router.get("/is-admin", isAdmin);
router.get("/post/view/all", getAllPosts);
router.post("/post/deletebyadmin/:id", deletePostByAdmin);
router.post("/add/:id", addAdmin);
router.post("/deactivate-account/:id", deactivateAccount);
router.post("/activate-account/:id", activateAccount);
router.get("/deactivated-accounts", deactivatedAccounts);
router.post("/is-user-admin/:id", isUserAdmin);
router.get("/get-all-admins", getAllAdmins);

export default router;
