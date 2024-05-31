import express from "express";

import { register, login, resetPassword, logout } from "../controllers/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", register);
// router.post("/login", verifyToken, login);
router.post("/signin", login);
router.get("/is-user", verifyToken, async (req, res) => {
  try {
    res.status(200).json(true);
  } catch (error) {
    res.status(400).json(false);
  }
});
router.get("/logout", logout);

router.post("/reset-password", resetPassword);

export default router;
